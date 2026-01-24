import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Wifi, Utensils, BookOpen, Dumbbell, Shield } from 'lucide-react';

const benefits = [
  {
    icon: Wifi,
    title: 'High-Speed WiFi',
    description: 'Stay connected with unlimited high-speed internet access for your studies and entertainment.',
    image: 'https://miaoda-site-img.s3cdn.medo.dev/images/054c9b31-1676-4198-bdf1-961f463a7b39.jpg',
    color: 'bg-blue-500/10 text-blue-500',
  },
  {
    icon: Utensils,
    title: 'Nutritious Meals',
    description: 'Enjoy healthy, home-cooked meals prepared with care to keep you energized throughout the day.',
    image: 'https://miaoda-site-img.s3cdn.medo.dev/images/c0e3eb6c-89f5-4573-8b95-dd3b6033e333.jpg',
    color: 'bg-orange-500/10 text-orange-500',
  },
  {
    icon: BookOpen,
    title: 'Study Spaces',
    description: 'Dedicated quiet study areas and libraries to help you focus on your academic goals.',
    image: 'https://miaoda-site-img.s3cdn.medo.dev/images/51ae0e95-efd5-4397-8988-1348923bf016.jpg',
    color: 'bg-purple-500/10 text-purple-500',
  },
  {
    icon: Dumbbell,
    title: 'Fitness Facilities',
    description: 'Access to gym and recreational facilities to maintain a healthy and active lifestyle.',
    image: 'https://miaoda-site-img.s3cdn.medo.dev/images/2bacfa61-91a5-4d31-8e40-f813c9d6d3fc.jpg',
    color: 'bg-green-500/10 text-green-500',
  },
  {
    icon: Shield,
    title: '24/7 Security',
    description: 'Round-the-clock security and CCTV surveillance ensuring your safety at all times.',
    image: 'https://miaoda-site-img.s3cdn.medo.dev/images/03e66807-d250-466f-b574-b8d630140b65.jpg',
    color: 'bg-red-500/10 text-red-500',
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
            Experience premium amenities and services designed specifically for student life
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
                        <p className="text-sm text-muted-foreground">Available at all properties</p>
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
