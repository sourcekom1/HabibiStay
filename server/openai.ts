import OpenAI from "openai";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY environment variable is required");
}

const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY 
});

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const MODEL = "gpt-4o";

export async function generateChatResponse(
  userMessage: string,
  context?: {
    previousMessages?: Array<{ role: string; content: string }>;
    userType?: string;
    properties?: any[];
  }
): Promise<{
  message: string;
  messageType: string;
  metadata?: any;
}> {
  try {
    const systemPrompt = `You are Sara, HabibiStay's AI assistant. You help users with:
- Booking luxury stays in Riyadh
- Property management for hosts
- Investment opportunities
- Local recommendations and concierge services

You should be helpful, professional, and knowledgeable about Riyadh's hospitality market.
Always respond in a warm, welcoming tone that reflects Saudi hospitality.

Context: HabibiStay offers premium short-term rentals, property management, and real estate investment opportunities in Riyadh.

${context?.userType === 'host' ? 'This user is a property host/owner.' : ''}
${context?.userType === 'investor' ? 'This user is interested in investment opportunities.' : ''}
${context?.properties ? `Available properties: ${JSON.stringify(context.properties.slice(0, 3))}` : ''}
`;

    const messages = [
      { role: "system" as const, content: systemPrompt },
      ...(context?.previousMessages || []).slice(-5).map(msg => ({
        role: msg.role as "user" | "assistant",
        content: msg.content
      })),
      { role: "user" as const, content: userMessage }
    ];

    const response = await openai.chat.completions.create({
      model: MODEL,
      messages,
      max_tokens: 800,
      temperature: 0.7,
    });

    const botMessage = response.choices[0].message.content || "I apologize, but I couldn't process your request. Please try again.";

    // Determine message type based on content
    let messageType = "text";
    let metadata = {};

    if (botMessage.toLowerCase().includes("property") || botMessage.toLowerCase().includes("stay")) {
      messageType = "property_suggestion";
      if (context?.properties) {
        metadata = { suggestedProperties: context.properties.slice(0, 3) };
      }
    }

    if (botMessage.toLowerCase().includes("book") || botMessage.toLowerCase().includes("reservation")) {
      messageType = "booking_action";
    }

    return {
      message: botMessage,
      messageType,
      metadata
    };
  } catch (error) {
    console.error("OpenAI API error:", error);
    return {
      message: "I'm experiencing some technical difficulties. Please try again in a moment or contact our support team.",
      messageType: "error"
    };
  }
}

export async function analyzeUserIntent(message: string): Promise<{
  intent: string;
  entities: any;
  confidence: number;
}> {
  try {
    const response = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: "system",
          content: `Analyze the user's message and extract intent and entities. 
          Possible intents: booking, property_inquiry, investment, support, general
          Return JSON format: { "intent": "booking", "entities": {"location": "Riyadh", "dates": "next week"}, "confidence": 0.9 }`
        },
        { role: "user", content: message }
      ],
      response_format: { type: "json_object" },
      max_tokens: 200,
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    return {
      intent: result.intent || "general",
      entities: result.entities || {},
      confidence: Math.min(1, Math.max(0, result.confidence || 0.5))
    };
  } catch (error) {
    console.error("Intent analysis error:", error);
    return {
      intent: "general",
      entities: {},
      confidence: 0.5
    };
  }
}