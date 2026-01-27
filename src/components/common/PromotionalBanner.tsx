import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ShieldCheck, TrendingUp, Star } from 'lucide-react';

const promotions = [
  {
    icon: Sparkles,
    text: '0% Brokerage',
    subtext: 'Save More on Every Booking',
    color: 'text-accent',
    bgColor: 'bg-accent/10',
    highlight: 'Zero Commission',
  },
  {
    icon: ShieldCheck,
    text: 'Verified Stays',
    subtext: 'Every Property is Verified by RoomSaathi',
    color: 'text-primary-foreground',
    bgColor: 'bg-primary-foreground/10',
    highlight: '100% Verified',
  },
  {
    icon: TrendingUp,
    text: '100% Accurate Data',
    subtext: 'Real Photos, Real Prices, Real Reviews',
    color: 'text-accent',
    bgColor: 'bg-accent/10',
    highlight: 'Trusted Info',
  },
];

export default function PromotionalBanner() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % promotions.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const currentPromo = promotions[currentIndex];
  const Icon = currentPromo.icon;

  return (
    <div className="bg-gradient-to-r from-primary via-primary/90 to-primary overflow-hidden relative">
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,.2)_50%,transparent_75%,transparent_100%)] bg-[length:250%_250%] animate-[shimmer_3s_linear_infinite]" />
      </div>

      {/* Floating stars decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 50 - 25],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              delay: i * 0.3,
              ease: 'easeInOut',
            }}
            style={{
              left: `${10 + i * 15}%`,
              top: '50%',
            }}
          >
            <Star className="w-3 h-3 xl:w-4 xl:h-4 text-accent fill-accent" />
          </motion.div>
        ))}
      </div>

      <div className="container mx-auto px-4 py-3 xl:py-4 relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-center gap-3 xl:gap-4"
          >
            {/* Icon with pulse effect */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className={`${currentPromo.bgColor} p-2 rounded-full relative`}
            >
              <motion.div
                className="absolute inset-0 rounded-full bg-primary-foreground/20"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 0, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: 'easeInOut',
                }}
              />
              <Icon className={`w-5 h-5 xl:w-6 xl:h-6 ${currentPromo.color} relative z-10`} />
            </motion.div>

            {/* Text Content */}
            <div className="flex flex-col xl:flex-row xl:items-center xl:gap-2 text-center xl:text-left">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="flex items-center gap-2 justify-center xl:justify-start"
              >
                <h3 className="text-base xl:text-xl font-bold text-primary-foreground">
                  {currentPromo.text}
                </h3>
                <span className="hidden xl:inline-block px-2 py-0.5 bg-accent text-accent-foreground text-xs font-semibold rounded-full">
                  {currentPromo.highlight}
                </span>
              </motion.div>
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="text-xs xl:text-sm text-primary-foreground/90 hidden xl:block"
              >
                • {currentPromo.subtext}
              </motion.p>
            </div>

            {/* Progress Indicators */}
            <div className="hidden xl:flex items-center gap-2 ml-auto">
              {promotions.map((_, index) => (
                <motion.div
                  key={index}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? 'w-8 bg-accent'
                      : 'w-1.5 bg-primary-foreground/40'
                  }`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                />
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Mobile subtext - shown below main text */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`subtext-${currentIndex}`}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="xl:hidden pb-2"
        >
          <p className="text-xs text-center text-primary-foreground/90 px-4">
            {currentPromo.subtext}
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
