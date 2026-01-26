import React, { createContext, useContext, useState, useCallback } from 'react';

export interface ChatMessage {
  id: string;
  type: 'bot' | 'user';
  content: string;
  timestamp: Date;
  options?: ChatOption[];
}

export interface ChatOption {
  label: string;
  value: string;
  action?: () => void;
}

export interface ChatbotState {
  step: 'welcome' | 'accommodation_type' | 'city' | 'budget' | 'amenities' | 'results' | 'feedback' | 'complete';
  selectedType?: string;
  selectedCity?: string;
  selectedBudget?: { min: number; max: number };
  selectedAmenities?: string[];
  userName?: string;
  userEmail?: string;
}

interface ChatbotContextType {
  messages: ChatMessage[];
  isOpen: boolean;
  state: ChatbotState;
  addMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  updateState: (updates: Partial<ChatbotState>) => void;
  resetChat: () => void;
  toggleChat: () => void;
  openChat: () => void;
  closeChat: () => void;
}

const ChatbotContext = createContext<ChatbotContextType | undefined>(undefined);

export const useChatbot = () => {
  const context = useContext(ChatbotContext);
  if (!context) {
    throw new Error('useChatbot must be used within ChatbotProvider');
  }
  return context;
};

export const ChatbotProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [state, setState] = useState<ChatbotState>({
    step: 'welcome',
  });

  const addMessage = useCallback((message: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    const newMessage: ChatMessage = {
      ...message,
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, newMessage]);
  }, []);

  const updateState = useCallback((updates: Partial<ChatbotState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  const resetChat = useCallback(() => {
    setMessages([]);
    setState({ step: 'welcome' });
  }, []);

  const toggleChat = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  const openChat = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeChat = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <ChatbotContext.Provider
      value={{
        messages,
        isOpen,
        state,
        addMessage,
        updateState,
        resetChat,
        toggleChat,
        openChat,
        closeChat,
      }}
    >
      {children}
    </ChatbotContext.Provider>
  );
};
