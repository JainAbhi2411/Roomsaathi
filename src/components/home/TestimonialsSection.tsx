import { motion } from 'motion/react';
import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';

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
];

export default function TestimonialsSection() {
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

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
            >
              <Card className="h-full hover:shadow-hover transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="relative w-16 h-16 rounded-full overflow-hidden bg-muted">
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
      </div>
    </section>
  );
}
