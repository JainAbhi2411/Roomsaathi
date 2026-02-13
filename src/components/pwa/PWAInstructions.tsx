import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Smartphone, Download, Zap, Wifi, Bell, Home } from 'lucide-react';
import { motion } from 'motion/react';

export const PWAInstructions: React.FC = () => {
  const [isStandalone, setIsStandalone] = useState(false);
  const [platform, setPlatform] = useState<'ios' | 'android' | 'desktop'>('desktop');

  useEffect(() => {
    // Check if app is installed
    const standalone = window.matchMedia('(display-mode: standalone)').matches;
    setIsStandalone(standalone);

    // Detect platform
    const userAgent = navigator.userAgent.toLowerCase();
    if (/iphone|ipad|ipod/.test(userAgent)) {
      setPlatform('ios');
    } else if (/android/.test(userAgent)) {
      setPlatform('android');
    } else {
      setPlatform('desktop');
    }
  }, []);

  if (isStandalone) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900"
        >
          <Smartphone className="h-10 w-10 text-green-600 dark:text-green-400" />
        </motion.div>
        <h2 className="mb-2 text-2xl font-bold text-foreground">App Installed! 🎉</h2>
        <p className="text-muted-foreground">
          You're using the RoomSaathi app. Enjoy the enhanced experience!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="text-center">
        <h2 className="mb-2 text-2xl font-bold text-foreground">Install RoomSaathi App</h2>
        <p className="text-muted-foreground">
          Get the best experience with our mobile app
        </p>
      </div>

      {/* Benefits */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="flex items-start gap-3 rounded-lg border bg-card p-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <Zap className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Faster Loading</h3>
            <p className="text-sm text-muted-foreground">
              Lightning-fast performance with cached content
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 rounded-lg border bg-card p-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <Wifi className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Works Offline</h3>
            <p className="text-sm text-muted-foreground">
              Browse properties even without internet
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 rounded-lg border bg-card p-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <Bell className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Instant Updates</h3>
            <p className="text-sm text-muted-foreground">
              Get notified about new properties instantly
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 rounded-lg border bg-card p-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <Home className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Home Screen Access</h3>
            <p className="text-sm text-muted-foreground">
              Quick access from your device's home screen
            </p>
          </div>
        </div>
      </div>

      {/* Installation Instructions */}
      <div className="rounded-lg border bg-muted/50 p-6">
        <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground">
          <Download className="h-5 w-5" />
          How to Install
        </h3>

        {platform === 'ios' && (
          <ol className="space-y-3 text-sm text-muted-foreground">
            <li className="flex gap-2">
              <span className="font-semibold text-foreground">1.</span>
              <span>Tap the Share button (square with arrow) in Safari</span>
            </li>
            <li className="flex gap-2">
              <span className="font-semibold text-foreground">2.</span>
              <span>Scroll down and tap "Add to Home Screen"</span>
            </li>
            <li className="flex gap-2">
              <span className="font-semibold text-foreground">3.</span>
              <span>Tap "Add" in the top right corner</span>
            </li>
            <li className="flex gap-2">
              <span className="font-semibold text-foreground">4.</span>
              <span>The RoomSaathi app icon will appear on your home screen</span>
            </li>
          </ol>
        )}

        {platform === 'android' && (
          <ol className="space-y-3 text-sm text-muted-foreground">
            <li className="flex gap-2">
              <span className="font-semibold text-foreground">1.</span>
              <span>Tap the menu button (three dots) in Chrome</span>
            </li>
            <li className="flex gap-2">
              <span className="font-semibold text-foreground">2.</span>
              <span>Tap "Install app" or "Add to Home screen"</span>
            </li>
            <li className="flex gap-2">
              <span className="font-semibold text-foreground">3.</span>
              <span>Tap "Install" in the popup</span>
            </li>
            <li className="flex gap-2">
              <span className="font-semibold text-foreground">4.</span>
              <span>The RoomSaathi app will be installed on your device</span>
            </li>
          </ol>
        )}

        {platform === 'desktop' && (
          <ol className="space-y-3 text-sm text-muted-foreground">
            <li className="flex gap-2">
              <span className="font-semibold text-foreground">1.</span>
              <span>Look for the install icon in your browser's address bar</span>
            </li>
            <li className="flex gap-2">
              <span className="font-semibold text-foreground">2.</span>
              <span>Click the install button when prompted</span>
            </li>
            <li className="flex gap-2">
              <span className="font-semibold text-foreground">3.</span>
              <span>The app will be installed on your computer</span>
            </li>
            <li className="flex gap-2">
              <span className="font-semibold text-foreground">4.</span>
              <span>Access it from your applications or taskbar</span>
            </li>
          </ol>
        )}
      </div>

      <div className="rounded-lg bg-primary/10 p-4 text-center">
        <p className="text-sm text-primary">
          💡 <strong>Tip:</strong> Once installed, you can use RoomSaathi just like a native app!
        </p>
      </div>
    </div>
  );
};
