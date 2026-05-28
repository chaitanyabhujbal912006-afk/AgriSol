import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Bot, 
  User, 
  Mic,
  Paperclip,
  MoreVertical,
  Lightbulb,
  Calendar,
  BookOpen,
  Globe,
  Loader2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface ChatbotProps {
  onNavigate: (page: string, data?: any) => void;
  navigationData?: any;
  userRole: 'farmer' | 'admin';
}

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  suggestions?: string[];
}

const quickSuggestions = [
  "Which crop is best for Kharif season in Maharashtra?",
  "How to treat tomato blight disease?",
  "What is the ideal pH for rice cultivation?",
  "When should I apply fertilizer to wheat?",
  "How to set up drip irrigation?",
  "What are the symptoms of nitrogen deficiency?"
];

const languages = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'हिंदी' },
  { code: 'ta', name: 'தமிழ்' },
  { code: 'te', name: 'తెలుగు' }
];

export function Chatbot({ onNavigate, navigationData, userRole }: ChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm your virtual farming advisor. I can help you with crop recommendations, disease management, soil health, and farming best practices. How can I assist you today?",
      sender: 'bot',
      timestamp: new Date(),
      suggestions: [
        "Crop recommendations",
        "Disease diagnosis",
        "Soil management",
        "Weather advice"
      ]
    }
  ]);
  const [inputMessage, setInputMessage] = useState(navigationData?.query || '');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (navigationData?.query) {
      handleSendMessage();
    }
  }, [navigationData]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const generateBotResponse = (userMessage: string): { content: string; suggestions?: string[] } => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('crop') && message.includes('recommend')) {
      return {
        content: "Based on your location and soil conditions, I recommend considering these crops:\n\n🌾 **Rice** - Ideal for Kharif season with high water availability\n🌽 **Maize** - Good alternative with moderate water needs\n🍅 **Tomato** - High value crop with good market demand\n\nWould you like detailed information about any of these crops?",
        suggestions: ["Rice cultivation guide", "Maize farming tips", "Tomato disease management", "Soil preparation"]
      };
    }
    
    if (message.includes('disease') || message.includes('blight')) {
      return {
        content: "I can help you identify and treat crop diseases. For tomato blight specifically:\n\n🔍 **Symptoms**: Dark spots on leaves, white fuzzy growth\n💊 **Treatment**: Apply Mancozeb fungicide (2g/L)\n🛡️ **Prevention**: Ensure good air circulation, avoid overhead watering\n\nWould you like me to add this treatment to your calendar?",
        suggestions: ["Add to calendar", "More disease info", "Prevention tips", "Organic treatments"]
      };
    }
    
    if (message.includes('soil') || message.includes('ph')) {
      return {
        content: "Soil health is crucial for crop success! Here's what I can tell you:\n\n🌱 **Ideal pH for rice**: 6.0-7.0\n🧪 **Testing**: I recommend testing every 6 months\n🔋 **Nutrients**: NPK ratio should be 4:2:1 for most crops\n\nWould you like me to guide you through a soil test?",
        suggestions: ["Start soil test", "Fertilizer calculator", "pH adjustment", "Nutrient deficiency"]
      };
    }
    
    if (message.includes('fertilizer') || message.includes('nutrient')) {
      return {
        content: "For wheat fertilizer application:\n\n📅 **Timing**: \n- Basal dose: At sowing\n- First top dressing: 20-25 days after sowing\n- Second top dressing: 40-45 days after sowing\n\n💊 **Dosage**: 120kg N, 60kg P₂O₅, 40kg K₂O per hectare\n\nShall I create a fertilizer schedule for your fields?",
        suggestions: ["Create schedule", "Organic alternatives", "Cost calculator", "Application methods"]
      };
    }
    
    if (message.includes('irrigation') || message.includes('water')) {
      return {
        content: "Drip irrigation is excellent for water conservation! Here's how to get started:\n\n💧 **Benefits**: 30-50% water savings, better yield\n🔧 **Setup**: Main line → Sub-main → Laterals → Drippers\n💰 **Cost**: ₹45,000-60,000 per acre\n🏛️ **Subsidy**: Up to 55% government subsidy available\n\nWould you like detailed setup instructions?",
        suggestions: ["Setup guide", "Subsidy info", "Maintenance tips", "Cost breakdown"]
      };
    }
    
    return {
      content: "I understand you're asking about farming practices. I can help with:\n\n🌾 Crop recommendations and planning\n🐛 Disease and pest management\n🌱 Soil health and fertilizers\n💧 Irrigation and water management\n📊 Market prices and trends\n📹 Tutorial videos\n\nWhat specific topic would you like to explore?",
      suggestions: ["Crop planning", "Disease help", "Soil testing", "Market prices"]
    };
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI processing time
    setTimeout(() => {
      const response = generateBotResponse(inputMessage);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response.content,
        sender: 'bot',
        timestamp: new Date(),
        suggestions: response.suggestions
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputMessage(suggestion);
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'Add to calendar':
        onNavigate('growth-calendar');
        break;
      case 'Start soil test':
        onNavigate('soil-prediction');
        break;
      case 'Create schedule':
        onNavigate('growth-calendar');
        break;
      default:
        setInputMessage(action);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
            Virtual Farming Adviser
          </h1>
          <p className="text-muted-foreground mt-1">
            Get instant expert advice on crops, diseases, soil management, and farming practices
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
            <SelectTrigger className="w-32">
              <Globe className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {languages.map(lang => (
                <SelectItem key={lang.code} value={lang.code}>{lang.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Quick Suggestions Sidebar */}
        <Card className="glass-card border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5" />
              Quick Questions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {quickSuggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="w-full text-left p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors text-sm"
              >
                {suggestion}
              </button>
            ))}
            
            <div className="pt-4 border-t border-border">
              <h4 className="font-medium mb-3">Quick Actions</h4>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => onNavigate('plant-explorer')}
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  Browse Plant Database
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => onNavigate('video-hub')}
                >
                  <div className="w-4 h-4 bg-red-500 rounded mr-2" />
                  Watch Tutorials
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => onNavigate('growth-calendar')}
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Plan Activities
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Chat Interface */}
        <div className="lg:col-span-3">
          <Card className="glass-card border-0 h-[600px] flex flex-col">
            <CardHeader className="border-b border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-green rounded-full flex items-center justify-center">
                    <Bot className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">FarmerAI Assistant</CardTitle>
                    <p className="text-sm text-green-600">Online • Ready to help</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>

            {/* Messages */}
            <CardContent className="flex-1 p-0">
              <ScrollArea className="h-full p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`flex gap-3 max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          message.sender === 'user' 
                            ? 'bg-blue-500' 
                            : 'bg-primary-green'
                        }`}>
                          {message.sender === 'user' ? (
                            <User className="w-4 h-4 text-white" />
                          ) : (
                            <Bot className="w-4 h-4 text-white" />
                          )}
                        </div>
                        
                        <div className={`space-y-2 ${message.sender === 'user' ? 'text-right' : ''}`}>
                          <div className={`inline-block p-3 rounded-lg ${
                            message.sender === 'user'
                              ? 'bg-blue-500 text-white'
                              : 'bg-muted border border-border'
                          }`}>
                            <p className="whitespace-pre-wrap">{message.content}</p>
                          </div>
                          
                          <p className="text-xs text-muted-foreground">
                            {message.timestamp.toLocaleTimeString()}
                          </p>
                          
                          {message.suggestions && (
                            <div className="flex flex-wrap gap-2 mt-2">
                              {message.suggestions.map((suggestion, index) => (
                                <button
                                  key={index}
                                  onClick={() => handleQuickAction(suggestion)}
                                  className="px-3 py-1 text-xs bg-primary-green/10 text-primary-green rounded-full border border-primary-green/20 hover:bg-primary-green/20 transition-colors"
                                >
                                  {suggestion}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="flex gap-3 max-w-[80%]">
                        <div className="w-8 h-8 bg-primary-green rounded-full flex items-center justify-center">
                          <Bot className="w-4 h-4 text-white" />
                        </div>
                        <div className="bg-muted border border-border p-3 rounded-lg">
                          <div className="flex items-center gap-1">
                            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce delay-100" />
                            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce delay-200" />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div ref={messagesEndRef} />
              </ScrollArea>
            </CardContent>

            {/* Input */}
            <div className="border-t border-border p-4">
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="sm">
                  <Paperclip className="w-4 h-4" />
                </Button>
                
                <div className="flex-1 relative">
                  <Input
                    ref={inputRef}
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Ask me anything about farming..."
                    className="pr-12"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleSendMessage();
                      }
                    }}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1/2 transform -translate-y-1/2"
                  >
                    <Mic className="w-4 h-4" />
                  </Button>
                </div>
                
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isTyping}
                  className="clay-button bg-primary-green hover:bg-primary-green/90 text-white"
                >
                  {isTyping ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </div>
              
              <p className="text-xs text-muted-foreground mt-2 text-center">
                FarmerAI can make mistakes. Please verify important information.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}