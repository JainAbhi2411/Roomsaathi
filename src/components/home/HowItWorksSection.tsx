import { motion } from 'motion/react';
import { Search, CheckCircle2, Home, ThumbsUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const steps = [
  {
    icon: Search,
    title: 'Search Properties',
    description: 'Browse through our extensive collection of verified properties across multiple cities',
    color: 'text-primary',
    bgColor: 'bg-primary',
  },
  {
    icon: CheckCircle2,
    title: 'Compare & Select',
    description: 'Compare amenities, prices, and locations to find the perfect match for your needs',
    color: 'text-accent',
    bgColor: 'bg-accent',
  },
  {
    icon: Home,
    title: 'Visit & Verify',
    description: 'Schedule a visit to inspect the property and meet the owner in person',
    color: 'text-primary',
    bgColor: 'bg-primary',
  },
  {
    icon: ThumbsUp,
    title: 'Move In',
    description: 'Complete the formalities and move into your new home hassle-free',
    color: 'text-accent',
    bgColor: 'bg-accent',
  },
];

export default function HowItWorksSection() {
  return (
    <section className="py-12 xl:py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 xl:mb-12"
        >
          <h2 className="text-2xl xl:text-4xl font-bold mb-3 xl:mb-4">
            How It <span className="gradient-text">Works</span>
          </h2>
          <p className="text-sm xl:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
            Finding your perfect accommodation is just four simple steps away
          </p>
        </motion.div>

        <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 xl:gap-6 max-w-6xl mx-auto">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex"
            >
              <Card className="relative h-full hover:shadow-hover transition-shadow duration-300 w-full">
                <CardContent className="p-3 xl:p-5 text-center flex flex-col h-full">
                  <div className={`absolute -top-2 xl:-top-3 left-1/2 -translate-x-1/2 ${step.bgColor} ${step.bgColor === 'bg-accent' ? 'text-accent-foreground' : 'text-primary-foreground'} rounded-full w-6 h-6 xl:w-8 xl:h-8 flex items-center justify-center font-bold text-xs xl:text-sm shadow-md`}>
                    {index + 1}
                  </div>
                  <div className="mb-2 xl:mb-3 mt-2 xl:mt-3">
                    <div className={`inline-flex items-center justify-center w-10 h-10 xl:w-14 xl:h-14 rounded-full ${step.bgColor}/10`}>
                      <step.icon className={`h-5 w-5 xl:h-7 xl:w-7 ${step.color}`} />
                    </div>
                  </div>
                  <h3 className="text-sm xl:text-lg font-semibold mb-1.5 xl:mb-2 leading-tight">{step.title}</h3>
                  <p className="text-xs xl:text-sm text-muted-foreground leading-snug flex-1">{step.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
