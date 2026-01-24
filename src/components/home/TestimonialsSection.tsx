import { motion } from 'motion/react';
import { Card, CardContent } from '@/components/ui/card';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRef } from 'react';

const testimonials = [
  {
    name: 'Priya Sharma',
    role: 'Software Engineer',
    city: 'Jaipur',
    image: 'https://miaoda-site-img.s3cdn.medo.dev/images/0a9d2279-c756-4e3d-a5d6-99722fba636e.jpg',
    rating: 5,
    text: 'RoomSaathi made my property search so easy! I found a perfect PG near my office within days. The verification process gave me confidence in my choice.',
  },
  {
    name: 'Rahul Verma',
    role: 'Student',
    city: 'Kota',
    image: 'https://miaoda-site-img.s3cdn.medo.dev/images/20008a1f-8610-41df-b9d4-f3ca269d6c4d.jpg',
    rating: 5,
    text: 'As a student preparing for competitive exams, finding a good hostel was crucial. RoomSaathi helped me find an affordable and comfortable place near my coaching center.',
  },
  {
    name: 'Anjali Patel',
    role: 'Business Owner',
    city: 'Sikar',
    image: 'https://miaoda-site-img.s3cdn.medo.dev/images/2da644a2-a049-4317-9229-8f67c0ce68cf.jpg',
    rating: 5,
    text: 'Excellent service! The team was very helpful and responsive. I found a spacious apartment for my family at a great price. Highly recommended!',
  },
  {
    name: 'Vikram Singh',
    role: 'College Student',
    city: 'Jaipur',
    image: 'https://miaoda-site-img.s3cdn.medo.dev/images/20008a1f-8610-41df-b9d4-f3ca269d6c4d.jpg',
    rating: 5,
    text: 'The platform is user-friendly and has a great selection of properties. I found my ideal room within my budget. The owner was also very cooperative!',
  },
  {
    name: 'Neha Gupta',
    role: 'Working Professional',
    city: 'Kota',
    image: 'https://miaoda-site-img.s3cdn.medo.dev/images/0a9d2279-c756-4e3d-a5d6-99722fba636e.jpg',
    rating: 5,
    text: 'I was relocating to Kota for work and needed a place urgently. RoomSaathi helped me find a comfortable flat with all amenities. Great experience!',
  },
  {
    name: 'Amit Kumar',
    role: 'Graduate Student',
    city: 'Sikar',
    image: 'https://miaoda-site-img.s3cdn.medo.dev/images/20008a1f-8610-41df-b9d4-f3ca269d6c4d.jpg',
    rating: 5,
    text: 'Transparent pricing and verified properties made my decision easy. The support team was always available to answer my questions. Highly satisfied!',
  },
];

export default function TestimonialsSection() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400;
      const newScrollPosition = direction === 'left'
        ? scrollContainerRef.current.scrollLeft - scrollAmount
        : scrollContainerRef.current.scrollLeft + scrollAmount;
      
      scrollContainerRef.current.scrollTo({
        left: newScrollPosition,
        behavior: 'smooth'
      });
    }
  };

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
            What Our <span className="gradient-text">Customers Say</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Don't just take our word for it - hear from our satisfied customers
          </p>
        </motion.div>

        <div className="relative group">
          {/* Scroll Buttons */}
          <Button
            variant="outline"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full shadow-lg bg-background/95 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden xl:flex"
            onClick={() => scroll('left')}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full shadow-lg bg-background/95 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden xl:flex"
            onClick={() => scroll('right')}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>

          {/* Scrollable Container */}
          <div
            ref={scrollContainerRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex-shrink-0 w-[90%] @md:w-[45%] xl:w-[calc(33.333%-1rem)] snap-start"
              >
                <Card className="h-full hover:shadow-hover transition-shadow duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="relative w-16 h-16 rounded-full overflow-hidden bg-muted flex-shrink-0">
                        <img
                          src={testimonial.image}
                          alt={testimonial.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="font-semibold">{testimonial.name}</h4>
                        <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                        <p className="text-xs text-muted-foreground">{testimonial.city}</p>
                      </div>
                    </div>
                    <div className="flex gap-1 mb-3">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                      ))}
                    </div>
                    <p className="text-muted-foreground italic">"{testimonial.text}"</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Scroll Indicator */}
          <div className="flex justify-center gap-2 mt-6 xl:hidden">
            {testimonials.map((_, index) => (
              <div
                key={index}
                className="h-2 w-2 rounded-full bg-muted transition-colors"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
