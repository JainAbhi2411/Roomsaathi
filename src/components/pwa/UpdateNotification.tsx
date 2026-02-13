import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RefreshCw, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const UpdateNotification: React.FC = () => {
  const [showUpdate, setShowUpdate] = useState(false);
  const [offlineReady, setOfflineReady] = useState(false);
  const [needRefresh, setNeedRefresh] = useState(false);

  useEffect(() => {
    // Register service worker manually with error handling
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js', { scope: '/' })
        .then((registration) => {
          console.log('SW Registered:', registration);
          
          // Check for updates every hour
          setInterval(() => {
            registration.update();
          }, 60 * 60 * 1000);

          // Listen for updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // New service worker available
                  setNeedRefresh(true);
                  setShowUpdate(true);
                }
                if (newWorker.state === 'activated' && !navigator.serviceWorker.controller) {
                  // First time installation
                  setOfflineReady(true);
                }
              });
            }
          });
        })
        .catch((error) => {
          console.log('SW registration error:', error);
        });

      // Check if already controlled by a service worker
      if (navigator.serviceWorker.controller) {
        setOfflineReady(true);
        // Auto-hide after 5 seconds
        setTimeout(() => setOfflineReady(false), 5000);
      }
    }
  }, []);

  const handleUpdate = () => {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      // Send message to service worker to skip waiting
      navigator.serviceWorker.controller.postMessage({ type: 'SKIP_WAITING' });
      
      // Reload the page after a short delay
      setTimeout(() => {
        window.location.reload();
      }, 500);
    }
    setShowUpdate(false);
  };

  const handleDismiss = () => {
    setShowUpdate(false);
    setNeedRefresh(false);
  };

  const handleOfflineReady = () => {
    setOfflineReady(false);
  };

  return (
    <>
      {/* Update Available Notification */}
      <AnimatePresence>
        {showUpdate && needRefresh && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.3 }}
            className="fixed top-4 left-4 right-4 z-50 md:left-auto md:right-4 md:w-96"
          >
            <Card className="border-primary bg-primary/5 shadow-lg">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
                      <RefreshCw className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Update Available</CardTitle>
                      <CardDescription className="text-sm">
                        A new version of RoomSaathi is ready
                      </CardDescription>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={handleDismiss}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 pb-4">
                <p className="text-sm text-muted-foreground">
                  We've made improvements to enhance your experience. Update now to get the latest features and bug fixes.
                </p>
                <div className="flex gap-2">
                  <Button
                    onClick={handleUpdate}
                    className="flex-1"
                    size="sm"
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Update Now
                  </Button>
                  <Button
                    onClick={handleDismiss}
                    variant="outline"
                    size="sm"
                  >
                    Later
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Offline Ready Notification */}
      <AnimatePresence>
        {offlineReady && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:w-96"
          >
            <Card className="border-green-500 bg-green-50 dark:bg-green-950 shadow-lg">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg text-green-700 dark:text-green-300">
                      App Ready to Work Offline
                    </CardTitle>
                    <CardDescription className="text-sm text-green-600 dark:text-green-400">
                      You can now use RoomSaathi without internet
                    </CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={handleOfflineReady}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
