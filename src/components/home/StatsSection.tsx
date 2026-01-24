import { motion } from 'motion/react';
import { Building2, Users, MapPin, CheckCircle2 } from 'lucide-react';

const stats = [
  {
    icon: Building2,
    value: '500+',
    label: 'Properties Listed',
    color: 'text-orange-500',
  },
  {
    icon: Users,
    value: '1000+',
    label: 'Happy Tenants',
    color: 'text-blue-500',
  },
  {
    icon: MapPin,
    value: '3',
    label: 'Cities Covered',
    color: 'text-green-500',
  },
  {
    icon: CheckCircle2,
    value: '100%',
    label: 'Verified Properties',
    color: 'text-purple-500',
  },
];

export default function StatsSection() {
  return (
    <section className="py-16 xl:py-24 bg-gradient-to-br from-primary/5 via-secondary/10 to-primary/5">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl xl:text-4xl font-bold mb-4">
            Our <span className="gradient-text">Impact</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Numbers that speak for our commitment to excellence
          </p>
        </motion.div>

        <div className="grid grid-cols-2 xl:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-background shadow-card mb-4">
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
              >
                <div className="text-4xl xl:text-5xl font-bold gradient-text mb-2">
                  {stat.value}
                </div>
                <div className="text-muted-foreground font-medium">{stat.label}</div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
