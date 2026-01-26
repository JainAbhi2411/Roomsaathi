import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import type { ChatMessage as ChatMessageType } from '@/contexts/ChatbotContext';

interface ChatMessageProps {
  message: ChatMessageType;
  onOptionClick?: (value: string, action?: () => void) => void;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, onOptionClick }) => {
  const isBot = message.type === 'bot';

  return (
    <div className={cn('flex gap-3 mb-4 animate-in fade-in slide-in-from-bottom-2 duration-300', isBot ? 'justify-start' : 'justify-end')}>
      {isBot && (
        <div className="shrink-0 w-8 h-8 rounded-full overflow-hidden bg-primary/10 flex items-center justify-center">
          <img
            src="https://miaoda-site-img.s3cdn.medo.dev/images/f1b35a1f-efdb-43d9-8f84-9316f44fc4af.jpg"
            alt="RoomSaathi Assistant"
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div className={cn('flex flex-col gap-2 max-w-[80%]', !isBot && 'items-end')}>
        <div
          className={cn(
            'rounded-2xl px-4 py-2.5 text-sm',
            isBot ? 'bg-card text-card-foreground border border-border' : 'bg-primary text-primary-foreground'
          )}
        >
          <p className="whitespace-pre-wrap">{message.content}</p>
        </div>
        {message.options && message.options.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-1">
            {message.options.map((option, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => onOptionClick?.(option.value, option.action)}
                className="text-xs hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                {option.label}
              </Button>
            ))}
          </div>
        )}
      </div>
      {!isBot && (
        <div className="shrink-0 w-8 h-8 rounded-full bg-accent flex items-center justify-center">
          <span className="text-sm font-medium">👤</span>
        </div>
      )}
    </div>
  );
};
