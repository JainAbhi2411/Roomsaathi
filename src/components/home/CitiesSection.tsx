import { motion } from 'motion/react';
import { MapPin, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router';

const cities = [
  {
    name: 'Jaipur',
    description: 'The Pink City with modern amenities',
    properties: '250+',
    image: 'https://miaoda-site-img.s3cdn.medo.dev/images/ac0635ad-0f80-4831-b596-59cf035af57d.jpg',
    localities: ['Malviya Nagar', 'Vaishali Nagar', 'C-Scheme', 'Bani Park'],
  },
  {
    name: 'Kota',
    description: 'Education hub with student-friendly options',
    properties: '180+',
    image: 'https://miaoda-site-img.s3cdn.medo.dev/images/d21486f9-febe-410a-84dd-ef8fddfaece7.jpg',
    localities: ['Jawahar Nagar', 'Dadabari', 'Talwandi', 'Vigyan Nagar'],
  },
  {
    name: 'Sikar',
    description: 'Growing city with affordable living',
    properties: '120+',
    image: 'https://miaoda-site-img.s3cdn.medo.dev/images/4265282c-0f5b-4e76-bf53-b30dfa8d3fa6.jpg',
    localities: ['Fatehpur', 'Piprali Road', 'Station Road', 'Devipura'],
  },
];

export default function CitiesSection() {
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
            Cities We <span className="gradient-text">Serve</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore quality accommodations across major cities in Rajasthan
          </p>
        </motion.div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {cities.map((city, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
            >
              <Card className="overflow-hidden hover:shadow-hover transition-all duration-300 group">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={city.image}
                    alt={city.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-2xl font-bold text-white mb-1">{city.name}</h3>
                    <p className="text-sm text-white/90">{city.description}</p>
                  </div>
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-primary">
                      <MapPin className="h-4 w-4" />
                      <span className="font-semibold">{city.properties} Properties</span>
                    </div>
                  </div>
                  <div className="mb-4">
                    <p className="text-sm text-muted-foreground mb-2">Popular Localities:</p>
                    <div className="flex flex-wrap gap-2">
                      {city.localities.map((locality, idx) => (
                        <span
                          key={idx}
                          className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded"
                        >
                          {locality}
                        </span>
                      ))}
                    </div>
                  </div>
                  <Button asChild variant="outline" className="w-full group">
                    <Link to={`/?city=${encodeURIComponent(city.name)}`}>
                      Explore {city.name}
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
