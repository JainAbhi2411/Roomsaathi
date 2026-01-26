import { useState } from 'react';
import { MessageSquare } from 'lucide-react';
import { FeedbackModal } from './FeedbackModal';

export function HangingNoteFeedback() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <>
      {/* Hanging Note (Desktop) */}
      <div className="fixed top-20 right-8 z-40 hidden lg:block">
        {/* String */}
        <div className="flex justify-center">
          <div className="w-0.5 h-10 bg-gradient-to-b from-border to-muted-foreground/40 origin-top animate-swing" />
        </div>

        {/* Note */}
        <div
          className="relative cursor-pointer animate-swing-note"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={() => setIsModalOpen(true)}
        >
          {/* Note Paper */}
          <div
            className={`
              relative w-20 h-20 
              bg-yellow-200/70 dark:bg-yellow-900/30
              backdrop-blur-md
              shadow-md hover:shadow-lg transition-all duration-300
              border border-yellow-300/60 dark:border-yellow-700/40
              ${isHovered ? 'scale-105 rotate-1' : 'rotate-[0.5deg]'}
            `}
          >
            {/* Fold corner effect */}
            <div
              className="
                absolute top-0 right-0 w-0 h-0
                border-l-[14px] border-l-transparent
                border-t-[14px] border-t-yellow-300/70
                dark:border-t-yellow-700/50
              "
            />

            {/* Content */}
            <div className="flex flex-col items-center justify-center h-full p-2 text-center">
              <MessageSquare className="w-3 h-3 text-yellow-700/80 dark:text-yellow-300 mb-1" />
              <p className="text-[9px] font-semibold text-yellow-900/90 dark:text-yellow-100 leading-tight">
                Share
                <br />
                Feedback
              </p>
              <p className="text-[9px] text-yellow-700/70 dark:text-yellow-300/70 mt-0.5">
                Tap here
              </p>
            </div>

            {/* Pin effect */}
            <div
              className="
                absolute -top-1.5 left-1/2 -translate-x-1/2
                w-3 h-3 bg-red-500/90 rounded-full
                shadow-sm border border-red-600/80
              "
            />
          </div>

          {/* Shadow */}
          <div
            className="
              absolute -bottom-1.5 left-1/2 -translate-x-1/2
              w-16 h-2 bg-black/10 dark:bg-black/20
              blur-sm rounded-full
            "
          />
        </div>
      </div>

      {/* Mobile Floating Button */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="
          fixed bottom-20 right-4 z-40 lg:hidden
          w-12 h-12
          bg-yellow-500/90 dark:bg-yellow-600/80
          backdrop-blur-md
          rounded-full shadow-md hover:shadow-lg
          transition-all duration-300
          flex items-center justify-center
          hover:scale-110 active:scale-95
        "
        aria-label="Open feedback"
      >
        <MessageSquare className="w-5 h-5 text-white" />
      </button>

      {/* Feedback Modal */}
      <FeedbackModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      {/* CSS Animations */}
      <style>{`
        @keyframes swing {
          0%, 100% { transform: rotate(-2deg); }
          50% { transform: rotate(2deg); }
        }

        @keyframes swing-note {
          0%, 100% { transform: rotate(-1deg); }
          50% { transform: rotate(1deg); }
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
