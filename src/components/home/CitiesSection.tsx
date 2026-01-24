import { motion } from 'motion/react';
import { MapPin, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router';

const cities = [
  {
    name: 'Sikar',
    description: 'Growing city with affordable living',
    properties: '120+',
    image: 'https://miaoda-site-img.s3cdn.medo.dev/images/983f2156-fbda-4194-9f6c-2136c224baa0.jpg',
    localities: ['Fatehpur', 'Piprali Road', 'Station Road', 'Devipura'],
  },
  {
    name: 'Jaipur',
    description: 'The Pink City with modern amenities',
    properties: '250+',
    image: 'https://miaoda-site-img.s3cdn.medo.dev/images/e3e6654c-ba50-408e-8659-6738d1e8dfa8.jpg',
    localities: ['Malviya Nagar', 'Vaishali Nagar', 'C-Scheme', 'Bani Park'],
  },
  {
    name: 'Kota',
    description: 'Education hub with student-friendly options',
    properties: '180+',
    image: 'https://miaoda-site-img.s3cdn.medo.dev/images/f1d3aa4c-fbdf-4249-80af-a8d65faffd5f.jpg',
    localities: ['Jawahar Nagar', 'Dadabari', 'Talwandi', 'Vigyan Nagar'],
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

        <div className="grid grid-cols-1 @md:grid-cols-2 xl:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {cities.map((city, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
            >
              <Card className="overflow-hidden hover:shadow-hover transition-all duration-300 group h-full flex flex-col">
                <div className="relative h-56 overflow-hidden flex-shrink-0">
                  <img
                    src={city.image}
                    alt={city.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/50 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-2xl font-bold text-white mb-1">{city.name}</h3>
                    <p className="text-sm text-white/90">{city.description}</p>
                  </div>
                </div>
                <CardContent className="p-6 flex-1 flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-primary">
                      <MapPin className="h-4 w-4" />
                      <span className="font-semibold">{city.properties} Properties</span>
                    </div>
                  </div>
                  <div className="mb-6 flex-1">
                    <p className="text-sm text-muted-foreground mb-2">Popular Localities:</p>
                    <div className="flex flex-wrap gap-2">
                      {city.localities.map((locality, idx) => (
                        <span
                          key={idx}
                          className="text-xs bg-secondary text-secondary-foreground px-3 py-1.5 rounded-full"
                        >
                          {locality}
                        </span>
                      ))}
                    </div>
                  </div>
                  <Button asChild variant="outline" className="w-full group hover:bg-primary hover:text-primary-foreground transition-all">
                    <Link to={`/browse?city=${encodeURIComponent(city.name)}`}>
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
