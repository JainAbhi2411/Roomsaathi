import { motion } from 'motion/react';
import { CheckCircle2, Users, Shield, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router';

export default function StudentInfoSection() {
  return (
    <section className="py-16 xl:py-24">
      <div className="container mx-auto px-4">
        <div className="grid xl:grid-cols-2 gap-12 items-center">
          {/* Left Side - Info Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-block px-4 py-2 bg-primary/10 rounded-full mb-4">
              <span className="text-primary font-semibold text-sm">For Students</span>
            </div>
            <h2 className="text-3xl xl:text-4xl font-bold mb-6">
              Your Perfect <span className="gradient-text">Student Accommodation</span> Awaits
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              RoomSaathi understands the unique needs of students. We connect you with verified, 
              affordable, and comfortable accommodations near your college or coaching institute.
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Verified Properties</h3>
                  <p className="text-sm text-muted-foreground">
                    Every property is personally verified by our team for quality and safety
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Student Community</h3>
                  <p className="text-sm text-muted-foreground">
                    Connect with fellow students and build lasting friendships
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <Shield className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Safe & Secure</h3>
                  <p className="text-sm text-muted-foreground">
                    24/7 security and support to ensure your peace of mind
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <Heart className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Affordable Living</h3>
                  <p className="text-sm text-muted-foreground">
                    Budget-friendly options without compromising on comfort
                  </p>
                </div>
              </div>
            </div>

            <Button asChild size="lg">
              <Link to="/browse">
                Explore Properties
              </Link>
            </Button>
          </motion.div>

          {/* Right Side - Student Images Grid */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="grid grid-cols-2 gap-4">
              {/* Large Image */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="col-span-2 rounded-2xl overflow-hidden shadow-card"
              >
                <img
                  src="https://miaoda-site-img.s3cdn.medo.dev/images/03e66807-d250-466f-b574-b8d630140b65.jpg"
                  alt="Happy college students"
                  className="w-full h-64 object-cover hover:scale-105 transition-transform duration-500"
                />
              </motion.div>

              {/* Small Images */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="rounded-2xl overflow-hidden shadow-card"
              >
                <img
                  src="https://miaoda-site-img.s3cdn.medo.dev/images/c0e3eb6c-89f5-4573-8b95-dd3b6033e333.jpg"
                  alt="Students studying together"
                  className="w-full h-48 object-cover hover:scale-105 transition-transform duration-500"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="rounded-2xl overflow-hidden shadow-card"
              >
                <img
                  src="https://miaoda-site-img.s3cdn.medo.dev/images/51ae0e95-efd5-4397-8988-1348923bf016.jpg"
                  alt="Students in library"
                  className="w-full h-48 object-cover hover:scale-105 transition-transform duration-500"
                />
              </motion.div>
            </div>

            {/* Floating Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="absolute -bottom-6 -left-6 bg-primary text-primary-foreground px-6 py-4 rounded-2xl shadow-hover"
            >
              <div className="text-3xl font-bold">10,000+</div>
              <div className="text-sm">Happy Students</div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
