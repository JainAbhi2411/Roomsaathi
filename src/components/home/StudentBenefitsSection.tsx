import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Gift, BadgePercent, CreditCard, Zap, Headphones } from 'lucide-react';

const benefits = [
  {
    icon: Gift,
    title: 'Welcome Kit',
    description: 'Get a complimentary welcome kit with essentials on your move-in day. We make your first day special!',
    image: 'https://miaoda-site-img.s3cdn.medo.dev/images/84dacac9-0fa6-4a05-850e-b8fbf21eefb2.jpg',
    color: 'bg-accent/10 text-accent',
  },
  {
    icon: BadgePercent,
    title: 'Zero Brokerage',
    description: 'Book directly with property owners without any brokerage fees. Save money and get the best deals.',
    image: 'https://miaoda-site-img.s3cdn.medo.dev/images/b808fa0d-96b2-4e41-a45b-a7b467e46bd6.jpg',
    color: 'bg-primary/10 text-primary',
  },
  {
    icon: CreditCard,
    title: 'Flexible Payments',
    description: 'Pay rent in easy installments with our flexible payment plans. No financial stress, just comfort.',
    image: 'https://miaoda-site-img.s3cdn.medo.dev/images/3ccf85a2-5b55-40d5-b88d-fde524bc33ec.jpg',
    color: 'bg-accent/10 text-accent',
  },
  {
    icon: Zap,
    title: 'Quick Move-in',
    description: 'Move in within 24 hours of booking confirmation. Fast, hassle-free process to get you settled quickly.',
    image: 'https://miaoda-site-img.s3cdn.medo.dev/images/d15b6402-f597-4a08-a58a-f60e9a08d88e.jpg',
    color: 'bg-primary/10 text-primary',
  },
  {
    icon: Headphones,
    title: 'Dedicated Support',
    description: '24/7 customer support team ready to help with any queries or issues. Your comfort is our priority.',
    image: 'https://miaoda-site-img.s3cdn.medo.dev/images/abd5fe80-1ffb-4ee9-8dd2-954754b34022.jpg',
    color: 'bg-accent/10 text-accent',
  },
];

export default function StudentBenefitsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % benefits.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const currentBenefit = benefits[currentIndex];

  return (
    <section className="py-16 xl:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl xl:text-4xl font-bold mb-4">
            What <span className="gradient-text">RoomSaathi Students</span> Get
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Exclusive benefits designed to make your booking experience smooth and rewarding
          </p>
        </motion.div>

        <div className="grid xl:grid-cols-2 gap-12 items-center">
          {/* Left Side - Auto-sliding Benefits */}
          <div className="space-y-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl ${currentBenefit.color}`}>
                  <currentBenefit.icon className="h-8 w-8" />
                </div>

                <div>
                  <h3 className="text-2xl xl:text-3xl font-bold mb-4">{currentBenefit.title}</h3>
                  <p className="text-lg text-muted-foreground">{currentBenefit.description}</p>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Progress Indicators */}
            <div className="flex gap-2 pt-4">
              {benefits.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className="relative h-1 flex-1 bg-muted rounded-full overflow-hidden"
                >
                  <motion.div
                    className="absolute inset-0 bg-primary"
                    initial={{ width: '0%' }}
                    animate={{
                      width: index === currentIndex ? '100%' : index < currentIndex ? '100%' : '0%',
                    }}
                    transition={{
                      duration: index === currentIndex ? 4 : 0.3,
                      ease: 'linear',
                    }}
                  />
                </button>
              ))}
            </div>

            {/* Benefit List */}
            <div className="grid grid-cols-2 @md:grid-cols-3 gap-3 pt-4">
              {benefits.map((benefit, index) => (
                <motion.button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    index === currentIndex
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <benefit.icon className={`h-6 w-6 mx-auto mb-2 ${
                    index === currentIndex ? 'text-primary' : 'text-muted-foreground'
                  }`} />
                  <p className={`text-xs font-medium ${
                    index === currentIndex ? 'text-foreground' : 'text-muted-foreground'
                  }`}>
                    {benefit.title}
                  </p>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Right Side - Image */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.5 }}
                className="relative rounded-3xl overflow-hidden shadow-hover"
              >
                <img
                  src={currentBenefit.image}
                  alt={currentBenefit.title}
                  className="w-full h-[500px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent" />
                
                {/* Floating Badge */}
                <div className="absolute bottom-8 left-8 right-8">
                  <div className="bg-background/90 backdrop-blur-sm rounded-2xl p-6 shadow-card">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-xl ${currentBenefit.color}`}>
                        <currentBenefit.icon className="h-6 w-6" />
                      </div>
                      <div>
                        <h4 className="font-bold text-lg">{currentBenefit.title}</h4>
                        <p className="text-sm text-muted-foreground">Exclusive for RoomSaathi bookings</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
