import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mic, Send, Volume2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from '@/db/supabase';
import { toast } from 'sonner';
import type { ChatMessage, Property, PropertyRecommendation } from '@/types';

export default function ChatPage() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<PropertyRecommendation[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    initializeConversation();
    loadProperties();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const initializeConversation = async () => {
    try {
      const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const { data, error } = await supabase
        .from('chat_conversations')
        .insert([{ session_id: sessionId }] as any)
        .select()
        .single();

      if (error) throw error;
      if (!data) throw new Error('No data returned');
      const conversationData = data as any;
      setConversationId(conversationData.id);

      // Add initial greeting
      const greeting: ChatMessage = {
        id: 'greeting',
        conversation_id: conversationData.id,
        role: 'model',
        content: "Hello! I'm here to help you find the perfect place to live with zero regret. What type of accommodation are you looking for?",
        created_at: new Date().toISOString(),
      };
      setMessages([greeting]);
    } catch (error) {
      console.error('Error initializing conversation:', error);
      toast.error('Failed to start conversation');
    }
  };

  const loadProperties = async () => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProperties(data || []);
    } catch (error) {
      console.error('Error loading properties:', error);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await transcribeAudio(audioBlob);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      toast.info('Recording... Tap again to stop');
    } catch (error) {
      console.error('Error starting recording:', error);
      toast.error('Failed to access microphone');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const transcribeAudio = async (audioBlob: Blob) => {
    try {
      setIsProcessing(true);
      const formData = new FormData();
      formData.append('file', audioBlob, 'audio.webm');

      const { data, error } = await supabase.functions.invoke('transcribe-audio', {
        body: formData,
      });

      if (error) throw error;

      const transcribedText = data.text;
      if (transcribedText) {
        await sendMessage(transcribedText);
      }
    } catch (error) {
      console.error('Error transcribing audio:', error);
      toast.error('Failed to transcribe audio');
    } finally {
      setIsProcessing(false);
    }
  };

  const sendMessage = async (text: string) => {
    if (!text.trim() || !conversationId) return;

    try {
      setIsProcessing(true);

      // Add user message to UI
      const userMessage: ChatMessage = {
        id: `user_${Date.now()}`,
        conversation_id: conversationId,
        role: 'user',
        content: text,
        created_at: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, userMessage]);

      // Save user message to database
      await supabase.from('chat_messages').insert([{
        conversation_id: conversationId,
        role: 'user',
        content: text,
      }] as any);

      // Prepare messages for AI
      const conversationHistory = messages.map((msg) => ({
        role: msg.role,
        parts: [{ text: msg.content }],
      }));
      conversationHistory.push({
        role: 'user',
        parts: [{ text }],
      });

      // Call chat assistant
      const { data, error } = await supabase.functions.invoke('chat-assistant', {
        body: {
          messages: conversationHistory,
          properties: properties,
        },
      });

      if (error) throw error;

      // Parse streaming response
      let assistantResponse = '';
      const reader = data.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const jsonData = JSON.parse(line.slice(6));
              if (jsonData.candidates?.[0]?.content?.parts?.[0]?.text) {
                assistantResponse += jsonData.candidates[0].content.parts[0].text;
              }
            } catch (e) {
              // Skip invalid JSON
            }
          }
        }
      }

      // Add assistant message
      const assistantMessage: ChatMessage = {
        id: `model_${Date.now()}`,
        conversation_id: conversationId,
        role: 'model',
        content: assistantResponse,
        created_at: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, assistantMessage]);

      // Save assistant message to database
      await supabase.from('chat_messages').insert([{
        conversation_id: conversationId,
        role: 'model',
        content: assistantResponse,
      }] as any);

      // Parse recommendations if present
      parseRecommendations(assistantResponse);
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    } finally {
      setIsProcessing(false);
      setInputText('');
    }
  };

  const parseRecommendations = (response: string) => {
    // Simple parsing logic - look for property IDs and scores in the response
    // This is a basic implementation; you might want to enhance it
    const propertyMatches = response.match(/property[:\s]+([a-f0-9-]+)[,\s]+score[:\s]+(0\.\d+)/gi);
    if (propertyMatches) {
      // Extract and save recommendations
      // Implementation depends on your specific format
    }
  };

  const handleTextSubmit = () => {
    if (inputText.trim()) {
      sendMessage(inputText);
    }
  };

  const handlePropertyClick = (propertyId: string) => {
    navigate(`/mobile/property/${propertyId}`);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-card border-b border-border p-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate('/mobile')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="font-semibold">AI Assistant</h1>
            <p className="text-xs text-muted-foreground">Find your perfect home</p>
          </div>
          {isProcessing && <Loader2 className="w-5 h-5 animate-spin text-primary" />}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-32">
        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <Card
                className={`max-w-[80%] ${
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-card'
                }`}
              >
                <CardContent className="p-3">
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-semibold text-sm">Recommended Properties</h3>
            {recommendations.map((rec) => (
              <Card
                key={rec.id}
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => handlePropertyClick(rec.property_id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold">{rec.property?.name}</h4>
                    <Badge variant="secondary">
                      {Math.round(rec.score * 100)}% Match
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{rec.reasoning}</p>
                  <Button size="sm" variant="outline" className="w-full">
                    View Details
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4">
        <div className="flex gap-2">
          <Textarea
            placeholder="Type your message..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleTextSubmit();
              }
            }}
            className="min-h-[44px] max-h-32 resize-none"
            rows={1}
          />
          <div className="flex gap-2">
            <Button
              size="icon"
              variant={isRecording ? 'destructive' : 'default'}
              onClick={isRecording ? stopRecording : startRecording}
              disabled={isProcessing}
            >
              <Mic className={`w-5 h-5 ${isRecording ? 'animate-pulse' : ''}`} />
            </Button>
            <Button
              size="icon"
              onClick={handleTextSubmit}
              disabled={!inputText.trim() || isProcessing}
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
