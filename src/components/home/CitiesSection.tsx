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
    <section className="py-12 xl:py-20 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 xl:mb-12"
        >
          <h2 className="text-2xl xl:text-4xl font-bold mb-3 xl:mb-4">
            Cities We <span className="gradient-text">Serve</span>
          </h2>
          <p className="text-sm xl:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
            Explore quality accommodations across major cities in Rajasthan
          </p>
        </motion.div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 xl:gap-6 max-w-6xl mx-auto">
          {cities.map((city, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
            >
              <Card className="overflow-hidden hover:shadow-hover transition-all duration-300 group h-full flex flex-col">
                <div className="relative h-40 xl:h-48 overflow-hidden flex-shrink-0">
                  <img
                    src={city.image}
                    alt={city.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/50 to-transparent" />
                  <div className="absolute bottom-3 xl:bottom-4 left-3 xl:left-4 right-3 xl:right-4">
                    <h3 className="text-xl xl:text-2xl font-bold text-white mb-0.5 xl:mb-1">{city.name}</h3>
                    <p className="text-xs xl:text-sm text-white/90">{city.description}</p>
                  </div>
                </div>
                <CardContent className="p-4 xl:p-5 flex-1 flex flex-col">
                  <div className="flex items-center justify-between mb-3 xl:mb-4">
                    <div className="flex items-center gap-1.5 xl:gap-2 text-accent font-semibold">
                      <MapPin className="h-3.5 w-3.5 xl:h-4 xl:w-4" />
                      <span className="text-sm xl:text-base">{city.properties} Properties</span>
                    </div>
                  </div>
                  <div className="mb-4 xl:mb-5 flex-1">
                    <p className="text-xs xl:text-sm text-muted-foreground mb-2">Popular Localities:</p>
                    <div className="flex flex-wrap gap-1.5 xl:gap-2">
                      {city.localities.map((locality, idx) => (
                        <span
                          key={idx}
                          className="text-xs bg-secondary text-secondary-foreground px-2.5 xl:px-3 py-1 xl:py-1.5 rounded-full"
                        >
                          {locality}
                        </span>
                      ))}
                    </div>
                  </div>
                  <Button asChild variant="outline" size="sm" className="w-full group hover:bg-primary hover:text-primary-foreground transition-all">
                    <Link to={`/browse?city=${encodeURIComponent(city.name)}`}>
                      <span className="text-xs xl:text-sm">Explore {city.name}</span>
                      <ArrowRight className="ml-1.5 xl:ml-2 h-3.5 w-3.5 xl:h-4 xl:w-4 transition-transform group-hover:translate-x-1" />
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
