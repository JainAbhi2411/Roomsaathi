import { motion } from 'motion/react';
import { Shield, Clock, ThumbsUp, Users, Headphones, BadgeCheck } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const features = [
  {
    icon: BadgeCheck,
    title: 'Verified Properties',
    description: 'All properties are personally verified by our team for authenticity and quality',
  },
  {
    icon: Shield,
    title: 'Safe & Secure',
    description: 'Your safety is our priority with secure payment options and verified owners',
  },
  {
    icon: Clock,
    title: '24/7 Support',
    description: 'Round-the-clock customer support to assist you with any queries or concerns',
  },
  {
    icon: ThumbsUp,
    title: 'Best Prices',
    description: 'Competitive pricing with no hidden charges or booking fees',
  },
  {
    icon: Users,
    title: 'Trusted Community',
    description: 'Join thousands of satisfied tenants who found their perfect home with us',
  },
  {
    icon: Headphones,
    title: 'Personalized Service',
    description: 'Dedicated assistance to help you find accommodation that matches your needs',
  },
];

export default function WhyChooseUsSection() {
  return (
    <section className="py-16 xl:py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl xl:text-4xl font-bold mb-4">
            Why Choose <span className="gradient-text">RoomSaathi</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We're committed to making your property search experience seamless and trustworthy
          </p>
        </motion.div>

        <div className="grid grid-cols-1 @md:grid-cols-2 xl:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-hover transition-shadow duration-300 border-l-4 border-l-primary">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10">
                        <feature.icon className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                      <p className="text-muted-foreground text-sm">{feature.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
