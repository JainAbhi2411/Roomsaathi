import { useEffect, useRef, useState } from 'react';
import { useChatbot } from '@/contexts/ChatbotContext';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { Button } from '@/components/ui/button';
import { X, MessageCircle, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { getProperties } from '@/db/api';
import { submitChatbotFeedback } from '@/db/api';
import { useToast } from '@/hooks/use-toast';

export const ChatbotWidget: React.FC = () => {
  const { messages, isOpen, state, addMessage, updateState, resetChat, toggleChat, closeChat } = useChatbot();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize chat with welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setTimeout(() => {
        addMessage({
          type: 'bot',
          content: "Hi! 👋 I'm your RoomSaathi assistant. I'm here to help you find the perfect accommodation.\n\nWhat type of accommodation are you looking for?",
          options: [
            { label: '🏠 PG', value: 'PG' },
            { label: '🏢 Flat', value: 'Flat' },
            { label: '🏘️ Apartment', value: 'Apartment' },
            { label: '🚪 Room', value: 'Room' },
            { label: '🏨 Hostel', value: 'Hostel' },
            { label: '⏱️ Short Term Stay', value: 'Short Term Stay' },
          ],
        });
      }, 500);
    }
  }, [isOpen, messages.length, addMessage]);

  const handleAccommodationType = (type: string) => {
    addMessage({ type: 'user', content: type });
    updateState({ selectedType: type, step: 'city' });

    setTimeout(() => {
      addMessage({
        type: 'bot',
        content: `Great! You're looking for a ${type}. 🎯\n\nWhich city are you interested in?`,
        options: [
          { label: '📍 Sikar', value: 'Sikar' },
          { label: '📍 Jaipur', value: 'Jaipur' },
          { label: '📍 Kota', value: 'Kota' },
        ],
      });
    }, 800);
  };

  const handleCity = (city: string) => {
    addMessage({ type: 'user', content: city });
    updateState({ selectedCity: city, step: 'budget' });

    setTimeout(() => {
      addMessage({
        type: 'bot',
        content: `Perfect! Looking in ${city}. 🌆\n\nWhat's your budget range per month?`,
        options: [
          { label: '💰 Under ₹5,000', value: '0-5000' },
          { label: '💰 ₹5,000 - ₹10,000', value: '5000-10000' },
          { label: '💰 ₹10,000 - ₹15,000', value: '10000-15000' },
          { label: '💰 ₹15,000 - ₹20,000', value: '15000-20000' },
          { label: '💰 Above ₹20,000', value: '20000-999999' },
        ],
      });
    }, 800);
  };

  const handleBudget = (budgetRange: string) => {
    const [min, max] = budgetRange.split('-').map(Number);
    const budgetLabel = min === 0 ? `Under ₹${max.toLocaleString()}` : max === 999999 ? `Above ₹${min.toLocaleString()}` : `₹${min.toLocaleString()} - ₹${max.toLocaleString()}`;
    
    addMessage({ type: 'user', content: budgetLabel });
    updateState({ selectedBudget: { min, max }, step: 'amenities' });

    setTimeout(() => {
      addMessage({
        type: 'bot',
        content: `Got it! Budget: ${budgetLabel} ✅\n\nAny specific amenities you're looking for?`,
        options: [
          { label: '🌐 WiFi', value: 'WiFi' },
          { label: '❄️ AC', value: 'AC' },
          { label: '🍽️ Food Included', value: 'Food' },
          { label: '🅿️ Parking', value: 'Parking' },
          { label: '🏋️ Gym', value: 'Gym' },
          { label: '⏭️ Skip', value: 'skip' },
        ],
      });
    }, 800);
  };

  const handleAmenities = async (amenity: string) => {
    if (amenity === 'skip') {
      addMessage({ type: 'user', content: 'No specific amenities' });
      updateState({ step: 'results' });
      await searchProperties([]);
    } else {
      const currentAmenities = state.selectedAmenities || [];
      const newAmenities = [...currentAmenities, amenity];
      updateState({ selectedAmenities: newAmenities });
      
      addMessage({ type: 'user', content: amenity });
      
      setTimeout(() => {
        addMessage({
          type: 'bot',
          content: `Added ${amenity}! ✨\n\nWould you like to add more amenities or see the results?`,
          options: [
            { label: '🔍 Show Results', value: 'show_results' },
            { label: '➕ Add More', value: 'add_more' },
          ],
        });
      }, 800);
    }
  };

  const searchProperties = async (amenities: string[]) => {
    setIsProcessing(true);
    
    setTimeout(async () => {
      addMessage({
        type: 'bot',
        content: '🔍 Searching for properties that match your preferences...',
      });

      try {
        const filters = {
          type: state.selectedType,
          city: state.selectedCity,
          price_min: state.selectedBudget?.min,
          price_max: state.selectedBudget?.max,
        };

        const properties = await getProperties(filters);
        
        setTimeout(() => {
          if (properties.length > 0) {
            addMessage({
              type: 'bot',
              content: `Great news! 🎉 I found ${properties.length} ${properties.length === 1 ? 'property' : 'properties'} that match your criteria.\n\nWould you like to view them?`,
              options: [
                { 
                  label: '👀 View Properties', 
                  value: 'view_properties',
                  action: () => {
                    const searchParams = new URLSearchParams({
                      ...(state.selectedType && { type: state.selectedType }),
                      ...(state.selectedCity && { city: state.selectedCity }),
                      ...(state.selectedBudget?.min && { price_min: state.selectedBudget.min.toString() }),
                      ...(state.selectedBudget?.max && { price_max: state.selectedBudget.max.toString() }),
                    });
                    navigate(`/browse?${searchParams.toString()}`);
                    closeChat();
                  }
                },
                { label: '🔄 Start Over', value: 'restart' },
                { label: '💬 Need Help', value: 'feedback' },
              ],
            });
          } else {
            addMessage({
              type: 'bot',
              content: `I couldn't find any properties matching your exact criteria. 😔\n\nWould you like to:`,
              options: [
                { 
                  label: '🔍 Browse All Properties', 
                  value: 'browse_all',
                  action: () => {
                    navigate('/browse');
                    closeChat();
                  }
                },
                { label: '🔄 Try Different Filters', value: 'restart' },
                { label: '💬 Contact Support', value: 'feedback' },
              ],
            });
          }
          setIsProcessing(false);
        }, 1500);
      } catch (error) {
        console.error('Error searching properties:', error);
        addMessage({
          type: 'bot',
          content: 'Oops! Something went wrong. 😓 Please try again or contact our support team.',
          options: [
            { label: '🔄 Try Again', value: 'restart' },
            { label: '💬 Contact Support', value: 'feedback' },
          ],
        });
        setIsProcessing(false);
      }
    }, 500);
  };

  const handleFeedbackFlow = () => {
    updateState({ step: 'feedback' });
    addMessage({
      type: 'bot',
      content: "I'd love to help you! 💙\n\nPlease share your name so I can assist you better:",
    });
  };

  const handleUserInput = async (message: string) => {
    addMessage({ type: 'user', content: message });

    if (state.step === 'feedback') {
      if (!state.userName) {
        updateState({ userName: message });
        setTimeout(() => {
          addMessage({
            type: 'bot',
            content: `Nice to meet you, ${message}! 😊\n\nWhat's your email address?`,
          });
        }, 800);
      } else if (!state.userEmail) {
        updateState({ userEmail: message });
        setTimeout(() => {
          addMessage({
            type: 'bot',
            content: `Thanks! 📧\n\nNow, please tell me what you're looking for or what problem you're facing:`,
          });
        }, 800);
      } else {
        // Submit feedback
        try {
          await submitChatbotFeedback({
            name: state.userName!,
            email: state.userEmail!,
            looking_for: state.selectedType || 'Not specified',
            problem: message,
          });

          setTimeout(() => {
            addMessage({
              type: 'bot',
              content: `Thank you so much! 🙏 Your message has been received. Our team will get back to you shortly.\n\nIs there anything else I can help you with?`,
              options: [
                { label: '🔍 Search Again', value: 'restart' },
                { label: '👋 Close Chat', value: 'close' },
              ],
            });
            updateState({ step: 'complete' });
          }, 800);

          toast({
            title: 'Message Sent!',
            description: 'Our team will contact you soon.',
          });
        } catch (error) {
          console.error('Error submitting feedback:', error);
          addMessage({
            type: 'bot',
            content: 'Sorry, there was an error sending your message. Please try again or contact us directly.',
          });
        }
      }
    }
  };

  const handleOptionClick = (value: string, action?: () => void) => {
    if (action) {
      action();
      return;
    }

    switch (value) {
      case 'restart':
        resetChat();
        break;
      case 'close':
        closeChat();
        break;
      case 'feedback':
        handleFeedbackFlow();
        break;
      case 'show_results':
        searchProperties(state.selectedAmenities || []);
        break;
      case 'add_more':
        addMessage({
          type: 'bot',
          content: 'Sure! Select more amenities:',
          options: [
            { label: '🌐 WiFi', value: 'WiFi' },
            { label: '❄️ AC', value: 'AC' },
            { label: '🍽️ Food Included', value: 'Food' },
            { label: '🅿️ Parking', value: 'Parking' },
            { label: '🏋️ Gym', value: 'Gym' },
            { label: '✅ Done', value: 'show_results' },
          ],
        });
        break;
      default:
        // Handle step-based navigation
        if (state.step === 'welcome') {
          handleAccommodationType(value);
        } else if (state.step === 'accommodation_type') {
          handleAccommodationType(value);
        } else if (state.step === 'city') {
          handleCity(value);
        } else if (state.step === 'budget') {
          handleBudget(value);
        } else if (state.step === 'amenities') {
          handleAmenities(value);
        }
        break;
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <Button
        onClick={toggleChat}
        className={cn(
          'fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50 transition-all duration-300',
          'hover:scale-110 hover:shadow-xl',
          isOpen && 'scale-0 opacity-0'
        )}
        size="icon"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>

      {/* Chat Window */}
      <div
        className={cn(
          'fixed bottom-6 right-6 w-[380px] max-w-[calc(100vw-3rem)] h-[600px] max-h-[calc(100vh-3rem)] bg-background border border-border rounded-2xl shadow-2xl z-50 flex flex-col transition-all duration-300',
          isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-primary text-primary-foreground rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-primary-foreground/10 flex items-center justify-center">
              <img
                src="https://miaoda-site-img.s3cdn.medo.dev/images/f1b35a1f-efdb-43d9-8f84-9316f44fc4af.jpg"
                alt="RoomSaathi Assistant"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 className="font-semibold text-sm">RoomSaathi Assistant</h3>
              <p className="text-xs opacity-90">Online • Ready to help</p>
            </div>
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={resetChat}
              className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/10"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={closeChat}
              className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/10"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 bg-muted/30">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} onOptionClick={handleOptionClick} />
          ))}
          {isProcessing && (
            <div className="flex gap-3 mb-4">
              <div className="shrink-0 w-8 h-8 rounded-full overflow-hidden bg-primary/10 flex items-center justify-center">
                <img
                  src="https://miaoda-site-img.s3cdn.medo.dev/images/f1b35a1f-efdb-43d9-8f84-9316f44fc4af.jpg"
                  alt="RoomSaathi Assistant"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="bg-card text-card-foreground border border-border rounded-2xl px-4 py-2.5">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        {state.step === 'feedback' && state.userName && state.userEmail && (
          <ChatInput onSend={handleUserInput} placeholder="Describe your issue..." disabled={isProcessing} />
        )}
        {state.step === 'feedback' && (!state.userName || !state.userEmail) && (
          <ChatInput onSend={handleUserInput} placeholder="Type your response..." disabled={isProcessing} />
        )}
      </div>
    </>
  );
};
