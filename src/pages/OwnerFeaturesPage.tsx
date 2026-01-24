import React from 'react';
import { motion } from 'motion/react';
import Header from '@/components/layouts/Header';
import Footer from '@/components/layouts/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Smartphone, BarChart3, Zap, Shield, Clock, TrendingUp, CheckCircle2, Users } from 'lucide-react';
import { Link } from 'react-router';

const features = [
  {
    icon: Smartphone,
    title: 'Quick Listing in App',
    description: 'List your property in minutes with our intuitive mobile app. Upload photos, add details, and go live instantly.',
    benefits: [
      'Easy photo upload with auto-optimization',
      'Pre-filled templates for faster listing',
      'Real-time preview before publishing',
      'Instant notifications on inquiries',
    ],
    image: 'https://miaoda-site-img.s3cdn.medo.dev/images/1a49f9b3-b677-40e8-be27-e9ef957d0732.jpg',
    color: 'bg-blue-500/10 text-blue-500',
  },
  {
    icon: BarChart3,
    title: 'Management Software',
    description: 'Comprehensive dashboard to manage all your properties, bookings, and payments in one place.',
    benefits: [
      'Track bookings and occupancy rates',
      'Automated payment reminders',
      'Tenant management system',
      'Revenue analytics and reports',
    ],
    image: 'https://miaoda-site-img.s3cdn.medo.dev/images/f0e098ff-0007-44d3-8e76-a131283558af.jpg',
    color: 'bg-purple-500/10 text-purple-500',
  },
];

const benefits = [
  {
    icon: Zap,
    title: 'Instant Visibility',
    description: 'Get your property in front of thousands of students actively searching for accommodation.',
  },
  {
    icon: Shield,
    title: 'Verified Badge',
    description: 'Earn trust with our verification badge and attract more quality tenants.',
  },
  {
    icon: Clock,
    title: 'Save Time',
    description: 'Automate routine tasks and focus on what matters - growing your business.',
  },
  {
    icon: TrendingUp,
    title: 'Increase Revenue',
    description: 'Maximize occupancy rates with smart pricing suggestions and marketing tools.',
  },
];

export default function OwnerFeaturesPage() {
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
                <span className="text-primary font-semibold text-sm">For Property Owners</span>
              </div>
              <h1 className="text-4xl xl:text-5xl font-bold mb-6">
                Manage Your Properties with <span className="gradient-text">Ease & Efficiency</span>
              </h1>
              <p className="text-lg xl:text-xl text-muted-foreground mb-8">
                Everything you need to list, manage, and grow your property business - all in one powerful platform
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button size="lg" asChild>
                  <Link to="/list-property">
                    <Smartphone className="mr-2 h-5 w-5" />
                    Start Listing Now
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/contact">
                    Schedule a Demo
                  </Link>
                </Button>
              </div>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid grid-cols-2 @md:grid-cols-4 gap-6 max-w-4xl mx-auto"
            >
              <div className="text-center">
                <div className="text-3xl xl:text-4xl font-bold text-primary mb-2">500+</div>
                <div className="text-sm text-muted-foreground">Property Owners</div>
              </div>
              <div className="text-center">
                <div className="text-3xl xl:text-4xl font-bold text-primary mb-2">95%</div>
                <div className="text-sm text-muted-foreground">Occupancy Rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl xl:text-4xl font-bold text-primary mb-2">24/7</div>
                <div className="text-sm text-muted-foreground">Support Available</div>
              </div>
              <div className="text-center">
                <div className="text-3xl xl:text-4xl font-bold text-primary mb-2">10K+</div>
                <div className="text-sm text-muted-foreground">Active Students</div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Main Features */}
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
                Powerful <span className="gradient-text">Features</span> for Owners
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Our platform provides all the tools you need to succeed in the property rental business
              </p>
            </motion.div>

            <div className="space-y-24">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  className={`grid xl:grid-cols-2 gap-12 items-center ${
                    index % 2 === 1 ? 'xl:flex-row-reverse' : ''
                  }`}
                >
                  {/* Content */}
                  <div className={index % 2 === 1 ? 'xl:order-2' : ''}>
                    <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl ${feature.color} mb-6`}>
                      <feature.icon className="h-7 w-7" />
                    </div>
                    <h3 className="text-2xl xl:text-3xl font-bold mb-4">{feature.title}</h3>
                    <p className="text-lg text-muted-foreground mb-6">{feature.description}</p>
                    
                    <div className="space-y-3 mb-6">
                      {feature.benefits.map((benefit, idx) => (
                        <div key={idx} className="flex items-start gap-3">
                          <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                          <span className="text-muted-foreground">{benefit}</span>
                        </div>
                      ))}
                    </div>

                    <Button asChild>
                      <Link to="/list-property">
                        Get Started
                      </Link>
                    </Button>
                  </div>

                  {/* Image */}
                  <div className={index % 2 === 1 ? 'xl:order-1' : ''}>
                    <div className="relative rounded-3xl overflow-hidden shadow-hover">
                      <img
                        src={feature.image}
                        alt={feature.title}
                        className="w-full h-[500px] object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent" />
                      
                      {/* Floating Badge */}
                      <div className="absolute bottom-8 left-8 right-8">
                        <Card className="bg-background/90 backdrop-blur-sm border-primary/20">
                          <CardContent className="p-6">
                            <div className="flex items-center gap-4">
                              <div className={`p-3 rounded-xl ${feature.color}`}>
                                <feature.icon className="h-6 w-6" />
                              </div>
                              <div>
                                <h4 className="font-bold text-lg">{feature.title}</h4>
                                <p className="text-sm text-muted-foreground">Available on mobile & web</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Grid */}
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
                Why Choose <span className="gradient-text">RoomSaathi</span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Join hundreds of successful property owners who trust us with their business
              </p>
            </motion.div>

            <div className="grid grid-cols-1 @md:grid-cols-2 xl:grid-cols-4 gap-6">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-hover transition-all duration-300 hover:-translate-y-1">
                    <CardContent className="p-6">
                      <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary mb-4">
                        <benefit.icon className="h-6 w-6" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                      <p className="text-muted-foreground">{benefit.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 xl:py-24">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl mx-auto"
            >
              <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
                <CardContent className="p-8 xl:p-12 text-center">
                  <Users className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h2 className="text-3xl xl:text-4xl font-bold mb-4">
                    Ready to Get Started?
                  </h2>
                  <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                    Join RoomSaathi today and experience the easiest way to manage your properties. 
                    List your first property for free!
                  </p>
                  <div className="flex flex-wrap justify-center gap-4">
                    <Button size="lg" asChild>
                      <Link to="/list-property">
                        <Smartphone className="mr-2 h-5 w-5" />
                        List Your Property
                      </Link>
                    </Button>
                    <Button size="lg" variant="outline" asChild>
                      <Link to="/contact">
                        Contact Sales
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
