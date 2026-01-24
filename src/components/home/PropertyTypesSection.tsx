import { motion } from 'motion/react';
import { Building2, Home, Hotel, DoorOpen, Bed, Calendar } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router';

const propertyTypes = [
  {
    icon: Bed,
    title: 'PG',
    description: 'Paying Guest accommodations with meals and amenities',
    count: '150+',
    color: 'bg-orange-500/10 text-orange-500',
  },
  {
    icon: Building2,
    title: 'Apartments',
    description: 'Spacious apartments for families and professionals',
    count: '120+',
    color: 'bg-blue-500/10 text-blue-500',
  },
  {
    icon: Home,
    title: 'Flats',
    description: 'Independent flats with modern facilities',
    count: '100+',
    color: 'bg-green-500/10 text-green-500',
  },
  {
    icon: DoorOpen,
    title: 'Rooms',
    description: 'Single and shared rooms for students',
    count: '80+',
    color: 'bg-purple-500/10 text-purple-500',
  },
  {
    icon: Hotel,
    title: 'Hostels',
    description: 'Budget-friendly hostel accommodations',
    count: '60+',
    color: 'bg-pink-500/10 text-pink-500',
  },
  {
    icon: Calendar,
    title: 'Short Term Stays',
    description: 'Flexible short-term rental options',
    count: '40+',
    color: 'bg-yellow-500/10 text-yellow-500',
  },
];

export default function PropertyTypesSection() {
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
            Property <span className="gradient-text">Types</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose from a wide range of accommodation options that suit your lifestyle
          </p>
        </motion.div>

        <div className="grid grid-cols-1 @md:grid-cols-2 xl:grid-cols-3 gap-6">
          {propertyTypes.map((type, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Link to={`/browse?type=${encodeURIComponent(type.title)}`}>
                <Card className="h-full hover:shadow-hover transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                  <CardContent className="p-6">
                    <div className={`inline-flex items-center justify-center w-14 h-14 rounded-lg ${type.color} mb-4`}>
                      <type.icon className="h-7 w-7" />
                    </div>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-semibold">{type.title}</h3>
                      <span className="text-sm font-bold text-primary">{type.count}</span>
                    </div>
                    <p className="text-muted-foreground">{type.description}</p>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
