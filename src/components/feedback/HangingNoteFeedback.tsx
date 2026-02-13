import { useState } from 'react';
import { MessageSquare } from 'lucide-react';
import { FeedbackModal } from './FeedbackModal';

export function HangingNoteFeedback() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <>
      {/* Hanging Note - All Devices */}
      <div className="fixed top-20 right-4 md:right-8 z-40">
        {/* String */}
        <div className="flex justify-center">
          <div className="w-0.5 h-8 md:h-12 bg-gradient-to-b from-border to-muted-foreground/50 origin-top animate-swing" />
        </div>
        
        {/* Note */}
        <div
          className="relative cursor-pointer animate-swing-note"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={() => setIsModalOpen(true)}
        >
          {/* Note Paper */}
          <div className={`
            relative w-28 h-28 md:w-32 md:h-32 bg-gradient-to-br from-yellow-100 to-yellow-200 
            dark:from-yellow-900/40 dark:to-yellow-800/40
            shadow-lg hover:shadow-xl transition-all duration-300
            border border-yellow-300 dark:border-yellow-700
            ${isHovered ? 'scale-110 rotate-2' : 'rotate-1'}
          `}>
            {/* Fold corner effect */}
            <div className="absolute top-0 right-0 w-0 h-0 border-l-[16px] md:border-l-[20px] border-l-transparent border-t-[16px] md:border-t-[20px] border-t-yellow-300 dark:border-t-yellow-700" />
            
            {/* Content */}
            <div className="flex flex-col items-center justify-center h-full p-2 md:p-3 text-center">
              <MessageSquare className="w-6 h-6 md:w-8 md:h-8 text-yellow-700 dark:text-yellow-300 mb-1 md:mb-2" />
              <p className="text-[10px] md:text-xs font-semibold text-yellow-900 dark:text-yellow-100 leading-tight">
                Share Your
                <br />
                Feedback
              </p>
              <p className="text-[8px] md:text-[10px] text-yellow-700 dark:text-yellow-300 mt-1">
                Click here
              </p>
            </div>

            {/* Pin effect */}
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-3 md:w-4 md:h-4 bg-red-500 rounded-full shadow-md border-2 border-red-600" />
          </div>

          {/* Shadow */}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-20 md:w-24 h-3 bg-black/10 dark:bg-black/30 blur-md rounded-full" />
        </div>
      </div>

      {/* Feedback Modal */}
      <FeedbackModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />

      {/* CSS Animations */}
      <style>{`
        @keyframes swing {
          0%, 100% {
            transform: rotate(-2deg);
          }
          50% {
            transform: rotate(2deg);
          }
        }

        @keyframes swing-note {
          0%, 100% {
            transform: rotate(-1deg);
          }
          50% {
            transform: rotate(1deg);
          }
        }

        .animate-swing {
          animation: swing 3s ease-in-out infinite;
          transform-origin: top center;
        }

        .animate-swing-note {
          animation: swing-note 3s ease-in-out infinite;
          transform-origin: top center;
        }
      `}</style>
    </>
  );
}