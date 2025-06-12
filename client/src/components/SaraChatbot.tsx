import { useState, useRef, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { MessageCircle, X, Send, Bot, User, Sparkles, Mic, MicOff, Maximize2, Minimize2 } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";

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
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [message, setMessage] = useState("");
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random()}`);
  const [isListening, setIsListening] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  useEffect(() => {
    setIsVisible(true);
    // Detect mobile screen size
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Auto open fullscreen on mobile when chat opens
  useEffect(() => {
    if (isOpen && isMobile) {
      setIsFullScreen(true);
    }
  }, [isOpen, isMobile]);

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
    if (!isOpen && isMobile) {
      setIsFullScreen(true);
    }
  };

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  const chatContainerClass = isFullScreen ? 
    "fixed inset-0 z-50 bg-black/20 backdrop-blur-sm" : 
    "fixed bottom-6 right-6 z-40";

  const chatWindowClass = isFullScreen ?
    "w-full h-full bg-gradient-to-br from-white/95 to-blue-50/95 backdrop-blur-xl border-0 shadow-none" :
    "w-96 h-[500px] bg-gradient-to-br from-white/90 to-blue-50/90 backdrop-blur-xl border border-white/20 shadow-2xl";

  return (
    <div className={chatContainerClass}>
      {/* Floating Chat Button */}
      <Button
        onClick={toggleChat}
        className={`${isOpen ? "hidden" : "flex"} fixed bottom-6 right-6 z-40 
          bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 
          text-white rounded-full w-16 h-16 items-center justify-center 
          shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 
          transform hover:scale-110 animate-pulse`}
      >
        <MessageCircle className="h-6 w-6" />
      </Button>

      {/* Chat Window */}
      {isOpen && (
        <Card className={`${chatWindowClass} ${isFullScreen ? '' : 'absolute bottom-0 right-0'} 
          flex flex-col transition-all duration-500 ease-out animate-in slide-in-from-bottom-4`}>
          {/* Enhanced Glass Morphism Header */}
          <CardHeader className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 text-white p-4 rounded-t-lg relative overflow-hidden">
            {/* Animated background effects */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-blue-400/20 animate-pulse"></div>
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-slide-right"></div>
            
            <div className="relative flex flex-row justify-between items-center space-y-0">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm ring-2 ring-white/30 animate-pulse">
                  <Bot className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-bold text-lg">Sara</h4>
                  <p className="text-xs opacity-90 flex items-center">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                    {user ? `Hi ${user.firstName || 'there'}!` : 'Your AI Travel Assistant'}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {!isMobile && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleFullScreen}
                    className="text-white hover:bg-white/20 transition-all duration-200 hover:scale-110"
                  >
                    {isFullScreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20 transition-all duration-200 hover:scale-110"
                >
                  <Sparkles className="h-4 w-4 animate-spin" />
                </Button>
                <Button
                  onClick={toggleChat}
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20 transition-all duration-200 hover:scale-110"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>

          {/* Enhanced Chat Messages with Glass Morphism */}
          <CardContent className="flex-1 p-4 overflow-y-auto space-y-4 bg-gradient-to-b from-transparent to-white/10">
            {messages.map((msg: ChatMessage, index: number) => (
              <div
                key={index}
                className={`flex ${msg.isFromBot ? "items-start" : "justify-end"} animate-in slide-in-from-bottom-2`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {msg.isFromBot ? (
                  <div className="flex items-start space-x-3 max-w-[85%]">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg ring-2 ring-blue-200">
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                    <div className="bg-gradient-to-r from-white/90 to-blue-50/90 backdrop-blur-md rounded-2xl p-4 shadow-lg border border-white/20">
                      <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-line">{msg.message}</p>
                      {msg.messageType === "property_suggestion" && (
                        <div className="mt-3 space-y-2">
                          <div className="grid grid-cols-2 gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-xs h-8 bg-white/60 backdrop-blur-sm border-blue-200 hover:bg-blue-50 transition-all duration-200 hover:scale-105"
                              onClick={() => handleQuickAction("Show me property details")}
                            >
                              🏡 View Details
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-xs h-8 bg-white/60 backdrop-blur-sm border-green-200 hover:bg-green-50 transition-all duration-200 hover:scale-105"
                              onClick={() => handleQuickAction("Book this property")}
                            >
                              📅 Book Now
                            </Button>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-xs h-8 bg-white/60 backdrop-blur-sm border-purple-200 hover:bg-purple-50 transition-all duration-200 hover:scale-105"
                              onClick={() => handleQuickAction("See more properties")}
                            >
                              🔍 More Options
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-xs h-8 bg-white/60 backdrop-blur-sm border-orange-200 hover:bg-orange-50 transition-all duration-200 hover:scale-105"
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
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl p-4 max-w-[85%] shadow-lg">
                    <p className="text-sm leading-relaxed">{msg.message}</p>
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
