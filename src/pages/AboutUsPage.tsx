import React from 'react';
import { motion } from 'motion/react';
import Header from '@/components/layouts/Header';
import Footer from '@/components/layouts/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Target, Eye, Heart, Users, Award, TrendingUp } from 'lucide-react';

const values = [
  {
    icon: Heart,
    title: 'Student-First Approach',
    description: 'Every decision we make prioritizes the needs and comfort of students seeking accommodation.',
  },
  {
    icon: Award,
    title: 'Quality & Trust',
    description: 'We verify every property and maintain the highest standards to ensure safe, quality living spaces.',
  },
  {
    icon: Users,
    title: 'Community Building',
    description: 'We foster connections between students, property owners, and local communities.',
  },
  {
    icon: TrendingUp,
    title: 'Continuous Innovation',
    description: 'We constantly evolve our platform to provide better tools and experiences for everyone.',
  },
];

const stats = [
  { number: '10,000+', label: 'Happy Students' },
  { number: '500+', label: 'Property Owners' },
  { number: '1,000+', label: 'Properties Listed' },
  { number: '3', label: 'Cities Covered' },
];

export default function AboutUsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-16 xl:py-24 bg-gradient-to-b from-primary/5 to-background">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-3xl mx-auto mb-12"
            >
              <div className="inline-block px-4 py-2 bg-primary/10 rounded-full mb-4">
                <span className="text-primary font-semibold text-sm">About RoomSaathi</span>
              </div>
              <h1 className="text-4xl xl:text-5xl font-bold mb-6">
                Your Trusted <span className="gradient-text">Companion</span> in Finding Home
              </h1>
              <p className="text-lg xl:text-xl text-muted-foreground">
                We're on a mission to make student accommodation search simple, transparent, and stress-free across India
              </p>
            </motion.div>

            {/* Hero Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative rounded-3xl overflow-hidden shadow-hover max-w-5xl mx-auto"
            >
              <img
                src="https://miaoda-site-img.s3cdn.medo.dev/images/990c6d2e-0f96-40b9-8096-76ea3037113e.jpg"
                alt="RoomSaathi Team"
                className="w-full h-[400px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent" />
            </motion.div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 @md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-3xl xl:text-4xl font-bold text-primary mb-2">
                    {stat.number}
                  </div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-16 xl:py-24">
          <div className="container mx-auto px-4">
            <div className="grid xl:grid-cols-2 gap-12 max-w-6xl mx-auto">
              {/* Mission */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <Card className="h-full border-primary/20">
                  <CardContent className="p-8">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 text-primary mb-6">
                      <Target className="h-7 w-7" />
                    </div>
                    <h2 className="text-2xl xl:text-3xl font-bold mb-4">Our Mission</h2>
                    <p className="text-muted-foreground text-lg leading-relaxed">
                      To revolutionize the student accommodation experience by connecting students with verified, 
                      affordable, and comfortable living spaces while empowering property owners with modern 
                      management tools. We strive to make the search for a perfect home away from home as 
                      seamless and stress-free as possible.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Vision */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <Card className="h-full border-primary/20">
                  <CardContent className="p-8">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 text-primary mb-6">
                      <Eye className="h-7 w-7" />
                    </div>
                    <h2 className="text-2xl xl:text-3xl font-bold mb-4">Our Vision</h2>
                    <p className="text-muted-foreground text-lg leading-relaxed">
                      To become India's most trusted and comprehensive student accommodation platform, 
                      expanding to every major educational hub across the country. We envision a future where 
                      every student can find their ideal home with just a few clicks, and every property owner 
                      can efficiently manage their rentals with cutting-edge technology.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Values Section */}
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
                Our Core <span className="gradient-text">Values</span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                The principles that guide everything we do at RoomSaathi
              </p>
            </motion.div>

            <div className="grid grid-cols-1 @md:grid-cols-2 xl:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {values.map((value, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-hover transition-all duration-300 hover:-translate-y-1">
                    <CardContent className="p-6 text-center">
                      <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary mb-4">
                        <value.icon className="h-6 w-6" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">{value.title}</h3>
                      <p className="text-sm text-muted-foreground">{value.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Company Image Section */}
        <section className="py-16 xl:py-24">
          <div className="container mx-auto px-4">
            <div className="grid xl:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-3xl xl:text-4xl font-bold mb-6">
                  Building the Future of <span className="gradient-text">Student Living</span>
                </h2>
                <p className="text-lg text-muted-foreground mb-6">
                  Founded with a vision to solve the accommodation challenges faced by students across India, 
                  RoomSaathi has grown from a simple idea to a comprehensive platform serving thousands of 
                  students and property owners.
                </p>
                <p className="text-lg text-muted-foreground mb-6">
                  Our team combines expertise in real estate, technology, and student welfare to create 
                  solutions that truly make a difference. We understand the unique needs of students and 
                  property owners because we've been there ourselves.
                </p>
                <p className="text-lg text-muted-foreground">
                  Today, we're proud to operate in Sikar, Jaipur, and Kota, with plans to expand to more 
                  cities soon. Every day, we work towards making student accommodation search simpler, 
                  safer, and more accessible for everyone.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="relative"
              >
                <div className="rounded-3xl overflow-hidden shadow-hover">
                  <img
                    src="https://miaoda-site-img.s3cdn.medo.dev/images/af889c87-0fb1-4b5f-9228-3d928274a389.jpg"
                    alt="Company Mission"
                    className="w-full h-[500px] object-cover"
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
