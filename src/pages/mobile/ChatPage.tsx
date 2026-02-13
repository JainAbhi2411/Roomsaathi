import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Send, Bot, User as UserIcon, Loader2, Home, Search, Heart, 
  User, Sparkles, MapPin, IndianRupee, Star, TrendingUp, RefreshCw, CheckCircle2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/db/supabase';
import { useToast } from '@/hooks/use-toast';
import type { Property } from '@/types';

interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: Date;
  propertyRecommendations?: PropertyRecommendation[];
}

interface PropertyRecommendation {
  propertyId: string;
  score: number;
  reasons: string[];
  matchedCriteria: string[];
}

export default function ChatPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [recommendedProperties, setRecommendedProperties] = useState<Property[]>([]);
  const [propertyScores, setPropertyScores] = useState<Map<string, number>>(new Map());
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    initializeChat();
  }, [user]);

  const initializeChat = async () => {
    try {
      // Create or get existing session
      const { data: session, error: sessionError } = await supabase
        .from('chat_sessions')
        .insert([{
          user_session_id: user?.id || null,
          title: 'New Chat',
        }] as any)
        .select()
        .single();

      if (sessionError) throw sessionError;

      if (session && (session as any).id) {
        setSessionId((session as any).id);
      }

      // Add welcome message
      const welcomeMessage: Message = {
        id: '1',
        role: 'model',
        content: `Hello! 👋 I'm your RoomSaathi AI Assistant. I'm here to help you find the perfect accommodation in Sikar, Jaipur, or Kota.

I can help you with:
✨ Finding properties based on your budget and preferences
🏠 Comparing different property types (PG, Flat, Apartment, Hostel)
📊 Analyzing and scoring properties based on your requirements
💡 Answering questions about amenities, locations, and more

Tell me what you're looking for, and I'll provide personalized recommendations with scores!`,
        timestamp: new Date(),
      };

      setMessages([welcomeMessage]);
    } catch (error) {
      console.error('Error initializing chat:', error);
      toast({
        title: 'Error',
        description: 'Failed to initialize chat',
        variant: 'destructive',
      });
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !sessionId) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      // Prepare conversation history
      const conversationHistory = messages.map(msg => ({
        role: msg.role,
        content: msg.content,
      }));

      // Call AI chatbot edge function
      const { data, error } = await supabase.functions.invoke('ai-chatbot', {
        body: {
          message: inputMessage,
          sessionId,
          conversationHistory,
        },
      });

      if (error) throw error;

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: data.response,
        timestamp: new Date(),
        propertyRecommendations: data.propertyRecommendations || [],
      };

      setMessages((prev) => [...prev, botMessage]);

      // Load recommended properties if any
      if (data.propertyRecommendations && data.propertyRecommendations.length > 0) {
        await loadRecommendedProperties(data.propertyRecommendations);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: 'I apologize, but I encountered an error processing your request. Please try again or rephrase your question.',
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, errorMessage]);
      
      toast({
        title: 'Error',
        description: 'Failed to get response from AI',
        variant: 'destructive',
      });
    } finally {
      setIsTyping(false);
    }
  };

  const loadRecommendedProperties = async (recommendations: PropertyRecommendation[]) => {
    try {
      const propertyIds = recommendations.map(r => r.propertyId);
      
      const { data: properties, error } = await supabase
        .from('properties')
        .select('*')
        .in('id', propertyIds);

      if (error) throw error;

      if (properties) {
        setRecommendedProperties(properties);
        
        // Create score map
        const scoreMap = new Map<string, number>();
        recommendations.forEach(rec => {
          scoreMap.set(rec.propertyId, rec.score);
        });
        setPropertyScores(scoreMap);
      }
    } catch (error) {
      console.error('Error loading recommended properties:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickQuestions = [
    'Show me PG options in Jaipur under ₹8000',
    'I need a 2BHK flat in Sikar',
    'What are the best hostels in Kota?',
    'Show verified properties with WiFi and parking',
  ];

  const handleQuickQuestion = (question: string) => {
    setInputMessage(question);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-orange-600';
  };

  const getScoreBadgeVariant = (score: number): "default" | "secondary" | "destructive" | "outline" => {
    if (score >= 80) return 'default';
    if (score >= 60) return 'secondary';
    return 'outline';
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="flex items-center gap-3 p-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="shrink-0"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2 flex-1">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <div>
              <h1 className="text-base font-semibold">RoomSaathi AI</h1>
              <p className="text-xs text-muted-foreground">
                {isTyping ? 'Typing...' : 'Online'}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => initializeChat()}
            className="shrink-0"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Quick Questions (show only at start) */}
        {messages.length === 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2"
          >
            <p className="text-xs text-muted-foreground text-center mb-3">
              Quick questions to get started:
            </p>
            <div className="grid grid-cols-1 gap-2">
              {quickQuestions.map((question, index) => (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => handleQuickQuestion(question)}
                  className="text-left p-3 rounded-lg bg-card border hover:border-primary transition-colors text-sm"
                >
                  {question}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.role === 'model' && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shrink-0">
                  <Bot className="h-4 w-4 text-white" />
                </div>
              )}
              
              <div className={`max-w-[80%] ${message.role === 'user' ? 'order-first' : ''}`}>
                <Card className={message.role === 'user' ? 'bg-primary text-primary-foreground' : ''}>
                  <CardContent className="p-3">
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    <p className="text-xs opacity-70 mt-2">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </CardContent>
                </Card>

                {/* Property Recommendations */}
                {message.propertyRecommendations && message.propertyRecommendations.length > 0 && (
                  <div className="mt-3 space-y-2">
                    <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      Recommended Properties
                    </p>
                    {recommendedProperties
                      .filter(p => message.propertyRecommendations?.some(r => r.propertyId === p.id))
                      .map((property) => {
                        const score = propertyScores.get(property.id) || 0;
                        return (
                          <Card
                            key={property.id}
                            className="cursor-pointer hover:shadow-md transition-shadow"
                            onClick={() => navigate(`/mobile/property/${property.id}`)}
                          >
                            <CardContent className="p-3">
                              <div className="flex gap-3">
                                {/* Property Image */}
                                <div className="w-20 h-20 rounded-lg overflow-hidden bg-muted shrink-0">
                                  {property.images?.[0] ? (
                                    <img
                                      src={property.images[0]}
                                      alt={property.name}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                      <Home className="h-6 w-6 text-muted-foreground" />
                                    </div>
                                  )}
                                </div>

                                {/* Property Info */}
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-start justify-between gap-2 mb-1">
                                    <h3 className="font-semibold text-sm line-clamp-1">
                                      {property.name}
                                    </h3>
                                    <Badge 
                                      variant={getScoreBadgeVariant(score)}
                                      className="shrink-0"
                                    >
                                      <Star className="h-3 w-3 mr-1" />
                                      {score}
                                    </Badge>
                                  </div>
                                  
                                  <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                                    <MapPin className="h-3 w-3 shrink-0" />
                                    <span className="line-clamp-1">
                                      {property.locality}, {property.city}
                                    </span>
                                  </div>

                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-1">
                                      <IndianRupee className="h-3 w-3" />
                                      <span className="font-bold text-sm">
                                        {property.price_from.toLocaleString()}
                                      </span>
                                      <span className="text-xs text-muted-foreground">/mo</span>
                                    </div>
                                    
                                    {property.verified && (
                                      <Badge variant="secondary" className="text-xs">
                                        <CheckCircle2 className="h-3 w-3 mr-1" />
                                        Verified
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                  </div>
                )}
              </div>

              {message.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                  <UserIcon className="h-4 w-4" />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing Indicator */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-3"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shrink-0">
              <Bot className="h-4 w-4 text-white" />
            </div>
            <Card>
              <CardContent className="p-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t bg-background p-4">
        <div className="flex gap-2">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything about properties..."
            className="flex-1"
            disabled={isTyping}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isTyping}
            size="icon"
            className="shrink-0"
          >
            {isTyping ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="border-t bg-background">
        <div className="flex items-center justify-around p-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/mobile/home')}
            className="flex-col h-auto py-2"
          >
            <Home className="h-5 w-5" />
            <span className="text-xs mt-1">Home</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/mobile/search')}
            className="flex-col h-auto py-2"
          >
            <Search className="h-5 w-5" />
            <span className="text-xs mt-1">Search</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/mobile/favorites')}
            className="flex-col h-auto py-2"
          >
            <Heart className="h-5 w-5" />
            <span className="text-xs mt-1">Favorites</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/mobile/profile')}
            className="flex-col h-auto py-2"
          >
            <User className="h-5 w-5" />
            <span className="text-xs mt-1">Profile</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
