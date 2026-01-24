import { motion } from 'motion/react';
import { Search, CheckCircle2, Home, ThumbsUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const steps = [
  {
    icon: Search,
    title: 'Search Properties',
    description: 'Browse through our extensive collection of verified properties across multiple cities',
    color: 'text-primary',
  },
  {
    icon: CheckCircle2,
    title: 'Compare & Select',
    description: 'Compare amenities, prices, and locations to find the perfect match for your needs',
    color: 'text-primary',
  },
  {
    icon: Home,
    title: 'Visit & Verify',
    description: 'Schedule a visit to inspect the property and meet the owner in person',
    color: 'text-primary',
  },
  {
    icon: ThumbsUp,
    title: 'Move In',
    description: 'Complete the formalities and move into your new home hassle-free',
    color: 'text-primary',
  },
];

export default function HowItWorksSection() {
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
            How It <span className="gradient-text">Works</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Finding your perfect accommodation is just four simple steps away
          </p>
        </motion.div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="relative h-full hover:shadow-hover transition-shadow duration-300">
                <CardContent className="p-6 text-center">
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
                    {index + 1}
                  </div>
                  <div className="mb-4 mt-2">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
                      <step.icon className={`h-8 w-8 ${step.color}`} />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
