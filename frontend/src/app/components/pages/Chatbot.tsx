import React, { useState } from 'react';
import { 
  Send, 
  MessageCircle, 
  Bot,
  User,
  Mic,
  Paperclip,
  Globe,
  Lightbulb,
  Calendar,
  BookOpen
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback } from '../ui/avatar';

interface ChatbotProps {
  onNavigate: (page: string, data?: any) => void;
  navigationData?: any;
  userRole: 'farmer' | 'admin';
}

const suggestedQuestions = [
  "Which crop is best for Kharif season in Tamil Nadu?",
  "How to treat leaf blight in tomatoes?",
  "What's the ideal NPK ratio for wheat?",
  "When should I harvest my rice crop?",
  "How to improve soil fertility naturally?",
  "What are the signs of nutrient deficiency?"
];

const mockMessages = [
  {
    id: 1,
    type: 'bot',
    content: "Hello! I'm your Virtual Farming Adviser. I can help you with crop recommendations, disease management, soil health, and general farming questions. How can I assist you today?",
    timestamp: new Date().toISOString()
  }
];

export function Chatbot({ onNavigate, navigationData }: ChatbotProps) {
  const [messages, setMessages] = useState(mockMessages);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [language, setLanguage] = useState('English');

  const handleSendMessage = async (message: string = inputMessage) => {
    if (!message.trim()) return;

    // Add user message
    const userMessage = {
      id: Date.now(),
      type: 'user' as const,
      content: message,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      const token = localStorage.getItem('agrisol_token');
      const res = await fetch('http://localhost:5000/api/v1/chatbot/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ message })
      });
      const data = await res.json();
      const replyText = data.success && data.reply ? data.reply : generateResponse(message);
      const aiMessage = {
        id: Date.now() + 1,
        type: 'bot' as const,
        content: replyText,
        timestamp: data.timestamp || new Date().toISOString()
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch {
      // Backend offline – use local response
      const botResponse = generateResponse(message);
      const aiMessage = {
        id: Date.now() + 1,
        type: 'bot' as const,
        content: botResponse,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, aiMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const generateResponse = (query: string) => {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('wheat') || lowerQuery.includes('crop recommendation')) {
      return "Based on your query about wheat cultivation, here are my recommendations:\n\n🌾 **Best Varieties**: HD-2967, PBW-343, WH-147\n📅 **Sowing Time**: November-December\n🌡️ **Temperature**: 15-25°C optimal\n💧 **Water**: 450-650mm total requirement\n🧪 **Soil**: Well-drained loamy soil, pH 6.0-7.5\n\nWould you like specific information about fertilizer application or pest management for wheat?";
    }
    
    if (lowerQuery.includes('tomato') || lowerQuery.includes('blight')) {
      return "For tomato late blight management:\n\n🔍 **Symptoms**: Dark brown lesions, white fungal growth\n🛡️ **Prevention**: \n• Use resistant varieties\n• Avoid overhead irrigation\n• Ensure good air circulation\n• Remove infected plants\n\n💊 **Treatment**:\n• Copper-based fungicides\n• Mancozeb sprays\n• Bordeaux mixture\n\nShall I help you plan a spray schedule or suggest resistant varieties?";
    }
    
    if (lowerQuery.includes('soil') || lowerQuery.includes('fertility')) {
      return "Here are natural methods to improve soil fertility:\n\n🌱 **Organic Matter**:\n• Add compost regularly\n• Use farmyard manure\n• Green manuring with legumes\n\n🔄 **Crop Rotation**:\n• Include nitrogen-fixing crops\n• Rotate with different plant families\n\n🪱 **Biological Methods**:\n• Encourage earthworm activity\n• Use beneficial microorganisms\n• Avoid excessive tillage\n\nWould you like a soil testing recommendation or composting guide?";
    }
    
    if (lowerQuery.includes('npk') || lowerQuery.includes('fertilizer')) {
      return "NPK requirements vary by crop. Here are general guidelines:\n\n🌾 **Wheat**: 120:60:40 kg/ha\n🍚 **Rice**: 120:60:40 kg/ha  \n🍅 **Tomato**: 150:75:75 kg/ha\n🌽 **Maize**: 120:60:40 kg/ha\n\n📋 **Application Schedule**:\n• Basal: 50% N + 100% P + 100% K\n• Top dressing: Remaining N in splits\n\nDo you need specific recommendations for your crop and soil type?";
    }
    
    return "Thank you for your question! While I'm still learning, I can help you with:\n\n• 🌾 Crop recommendations\n• 🧪 Soil management\n• 🐛 Pest & disease control\n• 🌤️ Weather-based advice\n• 📅 Farming calendar planning\n\nCould you please provide more specific details about your farming situation? For complex queries, I recommend consulting with our expert team or checking our video tutorial library.";
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
            Virtual Farming Adviser
          </h1>
          <p className="text-muted-foreground mt-1">
            Get instant answers to your farming questions with AI-powered assistance
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Globe className="w-4 h-4 mr-2" />
            {language}
          </Button>
          <Badge className="bg-green-100 text-green-800">
            Online
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Suggested Questions */}
        <Card className="glass-card border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5" />
              Quick Questions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {suggestedQuestions.map((question, index) => (
              <button
                key={index}
                onClick={() => handleSendMessage(question)}
                className="w-full text-left p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors text-sm"
              >
                {question}
              </button>
            ))}
            
            <div className="mt-6 space-y-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={() => onNavigate('video-hub')}
              >
                <BookOpen className="w-4 h-4 mr-2" />
                Video Tutorials
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={() => onNavigate('growth-calendar')}
              >
                <Calendar className="w-4 h-4 mr-2" />
                Plan Activity
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Chat Interface */}
        <Card className="lg:col-span-3 glass-card border-0 flex flex-col h-[600px]">
          <CardHeader className="border-b border-border">
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10">
                <AvatarFallback className="bg-primary-green text-white">
                  <Bot className="w-5 h-5" />
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-lg">FarmerAI Assistant</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Always ready to help with your farming questions
                </p>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="flex-1 p-0 flex flex-col">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.type === 'bot' && (
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-primary-green text-white">
                        <Bot className="w-4 h-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  
                  <div className={`max-w-xs lg:max-w-md xl:max-w-lg px-4 py-2 rounded-lg whitespace-pre-wrap ${
                    message.type === 'user' 
                      ? 'bg-primary-green text-white' 
                      : 'bg-muted'
                  }`}>
                    {message.content}
                  </div>
                  
                  {message.type === 'user' && (
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-blue-500 text-white">
                        <User className="w-4 h-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
              
              {isTyping && (
                <div className="flex gap-3">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-primary-green text-white">
                      <Bot className="w-4 h-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-muted px-4 py-2 rounded-lg">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Input */}
            <div className="border-t border-border p-4">
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask your farming question..."
                    className="pr-20 bg-input-background"
                  />
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-1">
                    <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                      <Paperclip className="w-3 h-3" />
                    </Button>
                    <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                      <Mic className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
                <Button 
                  onClick={() => handleSendMessage()}
                  disabled={!inputMessage.trim() || isTyping}
                  className="clay-button bg-primary-green hover:bg-primary-green/90 text-white"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}