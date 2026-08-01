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
  BookOpen,
  Sparkles,
  Volume2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback } from '../ui/avatar';

interface ChatbotProps {
  onNavigate: (page: string, data?: any) => void;
  navigationData?: any;
  userRole?: 'farmer' | 'admin';
}

const suggestedQuestions = [
  "Which crop is best for Kharif season in alluvial soil?",
  "How to treat early blight in tomatoes?",
  "What is the ideal NPK ratio for durum wheat?",
  "When should I schedule secondary irrigation for rice?"
];

const promptCategories = [
  { label: '🧪 Soil Chemistry', query: 'What is ideal pH for wheat?' },
  { label: '🌿 Disease Diagnosis', query: 'How to treat tomato early blight?' },
  { label: '💧 Irrigation Guide', query: 'How much water does rice require?' },
  { label: '🌾 Fertilizer Plan', query: 'What is ideal NPK ratio for rice?' }
];

const mockMessages = [
  {
    id: 1,
    type: 'bot',
    content: "Hello! I am your AI Agronomic Adviser. Ask me anything regarding soil diagnostics, crop suitability, pest management, or irrigation schedules.",
    timestamp: new Date().toISOString()
  }
];

export function Chatbot({ onNavigate, navigationData }: ChatbotProps) {
  const [messages, setMessages] = useState(mockMessages);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const toggleVoiceListen = () => {
    setIsListening(!isListening);
    if (!isListening) {
      setTimeout(() => {
        setInputMessage("What is the optimal NPK ratio for paddy rice?");
        setIsListening(false);
      }, 2500);
    }
  };

  const handleSendMessage = async (message: string = inputMessage) => {
    if (!message.trim()) return;

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
    if (lowerQuery.includes('ph') || lowerQuery.includes('soil')) {
      return 'Soil pH between 6.0 and 7.0 is ideal for maximum nutrient absorption in cereal crops.';
    }
    if (lowerQuery.includes('blight') || lowerQuery.includes('disease') || lowerQuery.includes('tomato')) {
      return 'Tomato Early Blight causes dark concentric rings on bottom leaves. Apply copper-based fungicides immediately.';
    }
    return 'For optimal crop performance, maintain balanced NPK ratios and drip irrigation. Check our Soil & Crop tools for detailed plans.';
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