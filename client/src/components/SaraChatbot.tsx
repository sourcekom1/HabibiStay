import { useState, useRef, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { MessageCircle, X, Send, Bot, User, Sparkles, Mic, MicOff } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface ChatMessage {
  id: string;
  message: string;
  isFromBot: boolean;
  messageType?: string;
  metadata?: any;
  createdAt: string;
}

export default function SaraChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random()}`);
  const [isListening, setIsListening] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const { data: messages = [], refetch } = useQuery<ChatMessage[]>({
    queryKey: [`/api/chat/${sessionId}`],
    enabled: isOpen,
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (messageData: { 
      message: string; 
      sessionId: string; 
      isFromBot: boolean;
      messageType?: string;
      metadata?: any;
    }) => {
      const response = await apiRequest("POST", "/api/chat", messageData);
      return response.json();
    },
    onSuccess: () => {
      refetch();
      setMessage("");
    },
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch featured properties for initial display
  const { data: featuredProperties = [] } = useQuery({
    queryKey: ['/api/properties', 'featured'],
    queryFn: () => fetch('/api/properties?featured=true&limit=2').then(res => res.json()),
    enabled: isOpen
  });

  // Initialize with welcome message and featured properties if no messages exist
  useEffect(() => {
    if (isOpen && messages.length === 0 && featuredProperties.length > 0) {
      const welcomeMessage = `Hi! I'm Sara, your travel assistant. 🏡 I've found some amazing featured properties for you:

**${featuredProperties[0]?.title}**
📍 ${featuredProperties[0]?.location}
💰 $${featuredProperties[0]?.price}/night
⭐ ${featuredProperties[0]?.rating}/5 (${featuredProperties[0]?.reviews} reviews)

**${featuredProperties[1]?.title}**
📍 ${featuredProperties[1]?.location}  
💰 $${featuredProperties[1]?.price}/night
⭐ ${featuredProperties[1]?.rating}/5 (${featuredProperties[1]?.reviews} reviews)

How can I help you find the perfect stay today?`;

      sendMessageMutation.mutate({
        message: welcomeMessage,
        sessionId,
        isFromBot: true,
        messageType: "property_suggestion",
        metadata: { suggestedProperties: featuredProperties.slice(0, 2) }
      });
    }
  }, [isOpen, messages.length, featuredProperties]);

  const handleSendMessage = () => {
    if (!message.trim()) return;

    sendMessageMutation.mutate({
      message: message.trim(),
      sessionId,
      isFromBot: false,
    });
  };

  const handleQuickAction = (action: string) => {
    sendMessageMutation.mutate({
      message: action,
      sessionId,
      isFromBot: false,
    });
  };

  const startListening = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';
      
      recognition.onstart = () => {
        setIsListening(true);
      };
      
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setMessage(transcript);
        setIsListening(false);
      };
      
      recognition.onerror = () => {
        setIsListening(false);
      };
      
      recognition.onend = () => {
        setIsListening(false);
      };
      
      recognition.start();
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {/* Chat Button */}
      <Button
        onClick={toggleChat}
        className={`bg-brand-blue text-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg hover:bg-brand-blue-dark transition-colors ${
          isOpen ? "hidden" : "flex"
        }`}
      >
        <MessageCircle className="h-6 w-6" />
      </Button>

      {/* Chat Window */}
      {isOpen && (
        <Card className="absolute bottom-0 right-0 w-80 h-96 flex flex-col shadow-2xl animate-slide-up">
          {/* Chat Header */}
          <CardHeader className="bg-brand-blue text-white p-4 rounded-t-lg flex flex-row justify-between items-center space-y-0">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <Bot className="h-4 w-4" />
              </div>
              <div>
                <h4 className="font-medium">Sara</h4>
                <p className="text-xs opacity-90">Your travel assistant</p>
              </div>
            </div>
            <Button
              onClick={toggleChat}
              variant="ghost"
              size="sm"
              className="text-white hover:text-gray-200 hover:bg-transparent"
            >
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>

          {/* Chat Messages */}
          <CardContent className="flex-1 p-4 overflow-y-auto space-y-3">
            {messages.map((msg: ChatMessage, index: number) => (
              <div
                key={index}
                className={`flex ${msg.isFromBot ? "items-start" : "justify-end"}`}
              >
                {msg.isFromBot ? (
                  <div className="flex items-start space-x-2">
                    <div className="w-6 h-6 bg-brand-blue rounded-full flex items-center justify-center flex-shrink-0">
                      <Bot className="h-3 w-3 text-white" />
                    </div>
                    <div className="bg-gray-100 rounded-lg p-3 max-w-xs">
                      <p className="text-sm">{msg.message}</p>
                      {msg.messageType === "property_suggestion" && (
                        <div className="mt-2 space-y-1">
                          <div className="grid grid-cols-2 gap-1">
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-xs"
                              onClick={() => handleQuickAction("Show me property details")}
                            >
                              🏡 View Details
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-xs"
                              onClick={() => handleQuickAction("Book this property")}
                            >
                              📅 Book Now
                            </Button>
                          </div>
                          <div className="grid grid-cols-2 gap-1">
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-xs"
                              onClick={() => handleQuickAction("See more properties")}
                            >
                              🔍 More Options
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-xs"
                              onClick={() => handleQuickAction("Check availability")}
                            >
                              ✅ Availability
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="bg-brand-blue text-white rounded-lg p-3 max-w-xs">
                    <p className="text-sm">{msg.message}</p>
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </CardContent>

          {/* Quick Action Buttons */}
          <div className="p-4 border-t border-gray-200">
            <div className="mb-3">
              <p className="text-xs text-gray-500 mb-2">Quick actions:</p>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs h-8"
                  onClick={() => handleQuickAction("I want to search for properties")}
                >
                  🏠 Search Properties
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs h-8"
                  onClick={() => handleQuickAction("Help me with booking")}
                >
                  📅 Book Stay
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs h-8"
                  onClick={() => handleQuickAction("I need help logging in")}
                >
                  🔑 Login Help
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs h-8"
                  onClick={() => handleQuickAction("Show me customer support")}
                >
                  💬 Support
                </Button>
              </div>
            </div>

            {/* Chat Input */}
            <div className="flex space-x-2 mb-2">
              <Input
                type="text"
                placeholder="Type your message or use voice..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                className="flex-1 text-sm"
              />
              <Button
                onClick={startListening}
                disabled={isListening}
                size="sm"
                variant="outline"
                className={isListening ? "bg-red-100" : ""}
              >
                {isListening ? (
                  <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse" />
                ) : (
                  <Mic className="h-4 w-4" />
                )}
              </Button>
              <Button
                onClick={handleSendMessage}
                disabled={sendMessageMutation.isPending || !message.trim()}
                size="sm"
                className="bg-brand-blue hover:bg-brand-blue-dark"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex space-x-2">
              <Button
                size="sm"
                variant="outline"
                className="text-xs"
                onClick={() => handleQuickAction("I'm looking for a beachfront property")}
              >
                Beach property
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="text-xs"
                onClick={() => handleQuickAction("Check availability and prices")}
              >
                Check prices
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="text-xs"
                onClick={() => handleQuickAction("Help me book a property")}
              >
                Book now
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
