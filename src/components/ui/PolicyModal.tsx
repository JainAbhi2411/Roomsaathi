import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, FileText } from 'lucide-react';
import { Button } from './button';
import { ScrollArea } from './scroll-area';
import type { PolicyContent } from '@/data/policies';

interface PolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  policy: PolicyContent | null;
}

export default function PolicyModal({ isOpen, onClose, policy }: PolicyModalProps) {
  // Prevent body scroll when modal is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!policy) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal Banner */}
          <motion.div
            initial={{ y: '-100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '-100%', opacity: 0 }}
            transition={{
              type: 'spring',
              damping: 25,
              stiffness: 300,
              duration: 0.5
            }}
            className="fixed top-0 left-0 right-0 bottom-0 z-50 flex items-start justify-center pt-4 px-4 overflow-hidden"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-4xl bg-card border border-border rounded-2xl shadow-2xl overflow-hidden"
              style={{ maxHeight: 'calc(100vh - 2rem)' }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header with gradient */}
              <div className="relative bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 border-b border-border">
                <div className="absolute inset-0 bg-grid-pattern opacity-5" />
                <div className="relative px-6 py-6 flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <motion.div
                      initial={{ rotate: -180, scale: 0 }}
                      animate={{ rotate: 0, scale: 1 }}
                      transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                      className="p-3 bg-primary/10 rounded-xl"
                    >
                      <FileText className="h-6 w-6 text-primary" />
                    </motion.div>
                    <div className="flex-1">
                      <motion.h2
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="text-2xl font-bold text-foreground mb-1"
                      >
                        {policy.title}
                      </motion.h2>
                      <motion.p
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.15 }}
                        className="text-sm text-muted-foreground"
                      >
                        Last Updated: {policy.lastUpdated}
                      </motion.p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onClose}
                    className="shrink-0 hover:bg-destructive/10 hover:text-destructive rounded-full"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              {/* Content */}
              <ScrollArea className="h-[calc(100vh-12rem)] px-6 py-6">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                  className="prose prose-sm max-w-none dark:prose-invert"
                >
                  {policy.content.split('\n').map((line, index) => {
                    // Handle markdown-style headers
                    if (line.startsWith('# ')) {
                      return (
                        <h1 key={index} className="text-3xl font-bold text-foreground mt-8 mb-4 first:mt-0">
                          {line.replace('# ', '')}
                        </h1>
                      );
                    }
                    if (line.startsWith('## ')) {
                      return (
                        <h2 key={index} className="text-2xl font-semibold text-foreground mt-6 mb-3">
                          {line.replace('## ', '')}
                        </h2>
                      );
                    }
                    if (line.startsWith('### ')) {
                      return (
                        <h3 key={index} className="text-xl font-semibold text-foreground mt-4 mb-2">
                          {line.replace('### ', '')}
                        </h3>
                      );
                    }
                    // Handle list items
                    if (line.startsWith('- ')) {
                      return (
                        <li key={index} className="text-muted-foreground ml-4 mb-1">
                          {line.replace('- ', '')}
                        </li>
                      );
                    }
                    // Handle bold text
                    if (line.startsWith('**') && line.endsWith('**')) {
                      return (
                        <p key={index} className="font-semibold text-foreground mt-3 mb-2">
                          {line.replace(/\*\*/g, '')}
                        </p>
                      );
                    }
                    // Handle empty lines
                    if (line.trim() === '') {
                      return <div key={index} className="h-2" />;
                    }
                    // Regular paragraphs
                    return (
                      <p key={index} className="text-muted-foreground leading-relaxed mb-3">
                        {line}
                      </p>
                    );
                  })}
                </motion.div>
              </ScrollArea>

              {/* Footer */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="px-6 py-4 border-t border-border bg-muted/30 flex justify-end"
              >
                <Button onClick={onClose} className="min-w-24">
                  Close
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
