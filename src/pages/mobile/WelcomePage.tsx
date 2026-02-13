import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Home, MessageCircle, Sparkles } from 'lucide-react';

export default function WelcomePage() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    // Mark that user has seen welcome screen
    localStorage.setItem('roomsaathi_welcome_seen', 'true');
    navigate('/mobile');
  };

  const handleSkip = () => {
    // Mark that user has seen welcome screen
    localStorage.setItem('roomsaathi_welcome_seen', 'true');
    navigate('/mobile');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex flex-col items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full space-y-8 text-center"
      >
        {/* Logo */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex justify-center"
        >
          <div className="relative">
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' }}
              className="w-24 h-24 bg-primary rounded-2xl flex items-center justify-center shadow-lg"
            >
              <Home className="w-12 h-12 text-primary-foreground" />
            </motion.div>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' }}
              className="absolute -top-2 -right-2 w-8 h-8 bg-accent rounded-full flex items-center justify-center"
            >
              <Sparkles className="w-4 h-4 text-accent-foreground" />
            </motion.div>
          </div>
        </motion.div>

        {/* Brand Name */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold text-foreground mb-2">RoomSaathi</h1>
          <div className="h-1 w-24 bg-gradient-to-r from-primary to-accent mx-auto rounded-full" />
        </motion.div>

        {/* Vision Statement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="space-y-4"
        >
          <p className="text-xl font-semibold text-foreground">
            We don't just show homes
          </p>
          <p className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            We help you choose the right place to live with zero regret
          </p>
          <p className="text-muted-foreground text-sm">
            Your perfect accommodation in Sikar, Jaipur, and Kota is just a conversation away
          </p>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="grid grid-cols-1 gap-4 pt-4"
        >
          <div className="flex items-center gap-3 p-4 bg-card rounded-lg border border-border">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-primary" />
            </div>
            <div className="text-left">
              <p className="font-semibold text-sm">Voice-Enabled Search</p>
              <p className="text-xs text-muted-foreground">Talk to our AI assistant</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-card rounded-lg border border-border">
            <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-accent-foreground" />
            </div>
            <div className="text-left">
              <p className="font-semibold text-sm">Smart Recommendations</p>
              <p className="text-xs text-muted-foreground">Properties matched to your needs</p>
            </div>
          </div>
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="pt-4"
        >
          <Button
            onClick={handleGetStarted}
            size="lg"
            className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground font-semibold shadow-lg"
          >
            Get Started
          </Button>
        </motion.div>

        {/* Skip Link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.5 }}
        >
          <button
            onClick={handleSkip}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Skip Introduction →
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}
