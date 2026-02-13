import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Header from '@/components/layouts/Header';
import Footer from '@/components/layouts/Footer';
import ListPropertyModal from '@/components/modals/ListPropertyModal';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Smartphone, BarChart3, Zap, Shield, Clock, TrendingUp, CheckCircle2, Users, Send, ExternalLink, Phone, User as UserIcon } from 'lucide-react';
import { Link } from 'react-router';
import { useToast } from '@/hooks/use-toast';
import { createUserQuery } from '@/db/api';

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
  const [quickListingForm, setQuickListingForm] = useState({ name: '', phone: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isListPropertyModalOpen, setIsListPropertyModalOpen] = useState(false);
  const { toast } = useToast();

  const handleQuickListingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Save to database
      await createUserQuery({
        name: quickListingForm.name,
        email: null, // Email not collected in Quick Listing form
        phone: quickListingForm.phone,
        message: 'Quick Listing Request - Owner wants to list property',
        property_name: 'Owner Listing Request',
      });

      // Show success message
      setShowSuccess(true);

      toast({
        title: 'Request Submitted! 🎉',
        description: 'Thank you for your interest! Our team will contact you soon to help you list your property.',
      });

      // Reset form after 3 seconds
      setTimeout(() => {
        setQuickListingForm({ name: '', phone: '' });
        setShowSuccess(false);
      }, 3000);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to submit request. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-4 xl:py-8 xl:py-16 xl:py-24 bg-gradient-to-b from-primary/5 to-background">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-3xl mx-auto mb-12"
            >
              <div className="inline-block px-3 xl:px-4 py-2 bg-primary/10 rounded-full mb-4">
                <span className="text-primary font-semibold text-sm">For Property Owners</span>
              </div>
              <h1 className="text-lg xl:text-2xl xl:text-4xl xl:text-5xl font-bold mb-6">
                Manage Your Properties with <span className="gradient-text">Ease & Efficiency</span>
              </h1>
              <p className="text-lg xl:text-base xl:text-xl text-muted-foreground mb-8">
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
              className="grid grid-cols-2 @md:grid-cols-4 gap-3 xl:gap-3 xl:p-6 max-w-4xl mx-auto"
            >
              <div className="text-center">
                <div className="text-base xl:text-xl xl:text-3xl xl:text-lg xl:text-2xl xl:text-4xl font-bold text-primary mb-2">500+</div>
                <div className="text-sm text-muted-foreground">Property Owners</div>
              </div>
              <div className="text-center">
                <div className="text-base xl:text-xl xl:text-3xl xl:text-lg xl:text-2xl xl:text-4xl font-bold text-primary mb-2">95%</div>
                <div className="text-sm text-muted-foreground">Occupancy Rate</div>
              </div>
              <div className="text-center">
                <div className="text-base xl:text-xl xl:text-3xl xl:text-lg xl:text-2xl xl:text-4xl font-bold text-primary mb-2">24/7</div>
                <div className="text-sm text-muted-foreground">Support Available</div>
              </div>
              <div className="text-center">
                <div className="text-base xl:text-xl xl:text-3xl xl:text-lg xl:text-2xl xl:text-4xl font-bold text-primary mb-2">10K+</div>
                <div className="text-sm text-muted-foreground">Active Students</div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Main Features - Enhanced Interactive Banners */}
        <section className="py-4 xl:py-8 xl:py-16 xl:py-24">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-base xl:text-xl xl:text-3xl xl:text-lg xl:text-2xl xl:text-4xl font-bold mb-4">
                Powerful <span className="gradient-text">Features</span> for Owners
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Our platform provides all the tools you need to succeed in the property rental business
              </p>
            </motion.div>

            <div className="space-y-16">
              {/* Quick Listing Banner */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-500/10 via-primary/5 to-purple-500/10 border-2 border-primary/20"
              >
                <div className="absolute inset-0 bg-grid-white/5" />
                <div className="relative grid xl:grid-cols-2 gap-4 xl:gap-4 xl:p-8 p-4 xl:p-8 xl:p-12">
                  {/* Left: Content & Form */}
                  <div className="space-y-6">
                    <motion.div
                      initial={{ scale: 0.9 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5 }}
                      className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-500/20 text-blue-500 mb-4"
                    >
                      <Smartphone className="h-8 w-8" />
                    </motion.div>
                    
                    <div>
                      <h3 className="text-base xl:text-xl xl:text-3xl xl:text-lg xl:text-2xl xl:text-4xl font-bold mb-4">
                        Quick Listing in <span className="gradient-text">Minutes</span>
                      </h3>
                      <p className="text-lg text-muted-foreground mb-6">
                        List your property quickly and easily. Our team will guide you through the entire process.
                      </p>
                    </div>

                    <div className="space-y-3">
                      {[
                        'Fast & Easy Setup',
                        'Professional Photography Support',
                        'Instant Online Visibility',
                        'Dedicated Account Manager',
                      ].map((benefit, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.4, delay: idx * 0.1 }}
                          className="flex items-center gap-3"
                        >
                          <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                          <span className="text-muted-foreground">{benefit}</span>
                        </motion.div>
                      ))}
                    </div>

                    {/* Quick Listing Form */}
                    <AnimatePresence mode="wait">
                      {!showSuccess ? (
                        <motion.form
                          key="form"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          onSubmit={handleQuickListingSubmit}
                          className="space-y-4 bg-background/50 backdrop-blur-sm p-3 xl:p-6 rounded-2xl border border-border"
                        >
                          <div className="space-y-2">
                            <Label htmlFor="owner-name">Your Name</Label>
                            <div className="relative">
                              <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              <Input
                                id="owner-name"
                                placeholder="Enter your name"
                                value={quickListingForm.name}
                                onChange={(e) => setQuickListingForm({ ...quickListingForm, name: e.target.value })}
                                className="pl-10"
                                required
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="owner-phone">Phone Number</Label>
                            <div className="relative">
                              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              <Input
                                id="owner-phone"
                                placeholder="10-digit mobile number"
                                value={quickListingForm.phone}
                                onChange={(e) => setQuickListingForm({ ...quickListingForm, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                                className="pl-10"
                                required
                              />
                            </div>
                          </div>
                          <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                            {isSubmitting ? (
                              <>Submitting...</>
                            ) : (
                              <>
                                <Send className="mr-2 h-4 w-4" />
                                Submit Request
                              </>
                            )}
                          </Button>
                        </motion.form>
                      ) : (
                        <motion.div
                          key="success"
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          className="bg-primary/10 border-2 border-primary/30 p-4 xl:p-8 rounded-2xl text-center"
                        >
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', duration: 0.6 }}
                            className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 text-primary mb-4"
                          >
                            <CheckCircle2 className="h-8 w-8" />
                          </motion.div>
                          <h4 className="text-lg xl:text-2xl font-bold mb-2">Request Submitted!</h4>
                          <p className="text-muted-foreground">
                            Our team will contact you soon. Check WhatsApp for the property details form.
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Right: Mobile App Image */}
                  <div className="relative flex items-center justify-center">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                      whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8 }}
                      className="relative"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/30 to-purple-500/30 blur-3xl" />
                      <img
                        src="https://miaoda-site-img.s3cdn.medo.dev/images/1a49f9b3-b677-40e8-be27-e9ef957d0732.jpg"
                        alt="Mobile App"
                        className="relative w-full max-w-md h-auto rounded-3xl shadow-2xl"
                      />
                    </motion.div>
                  </div>
                </div>
              </motion.div>

              {/* Management Software Banner */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-500/10 via-primary/5 to-blue-500/10 border-2 border-primary/20"
              >
                <div className="absolute inset-0 bg-grid-white/5" />
                <div className="relative grid xl:grid-cols-2 gap-4 xl:gap-4 xl:p-8 p-4 xl:p-8 xl:p-12">
                  {/* Left: Mobile App Image */}
                  <div className="relative flex items-center justify-center xl:order-1">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
                      whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8 }}
                      className="relative"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/30 to-blue-500/30 blur-3xl" />
                      <img
                        src="https://miaoda-site-img.s3cdn.medo.dev/images/f0e098ff-0007-44d3-8e76-a131283558af.jpg"
                        alt="Management Software Dashboard"
                        className="relative w-full max-w-md h-auto rounded-3xl shadow-2xl"
                      />
                    </motion.div>
                  </div>

                  {/* Right: Content */}
                  <div className="space-y-6 xl:order-2">
                    <motion.div
                      initial={{ scale: 0.9 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5 }}
                      className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-purple-500/20 text-purple-500 mb-4"
                    >
                      <BarChart3 className="h-8 w-8" />
                    </motion.div>
                    
                    <div>
                      <h3 className="text-base xl:text-xl xl:text-3xl xl:text-lg xl:text-2xl xl:text-4xl font-bold mb-4">
                        Management <span className="gradient-text">Software</span>
                      </h3>
                      <p className="text-lg text-muted-foreground mb-6">
                        Comprehensive dashboard to manage all your properties, bookings, and payments in one place. Available on web and mobile.
                      </p>
                    </div>

                    <div className="space-y-3">
                      {[
                        'Track Bookings & Occupancy Rates',
                        'Automated Payment Reminders',
                        'Tenant Management System',
                        'Revenue Analytics & Reports',
                        'Mobile App for On-the-Go Management',
                        'Real-time Notifications',
                      ].map((benefit, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.4, delay: idx * 0.1 }}
                          className="flex items-center gap-3"
                        >
                          <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                          <span className="text-muted-foreground">{benefit}</span>
                        </motion.div>
                      ))}
                    </div>

                    {/* CTA Buttons */}
                    <div className="flex flex-wrap gap-4 pt-4">
                      <Button size="lg" asChild>
                        <a href="https://rosamanage.netlify.app/" target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="mr-2 h-4 w-4" />
                          Visit Management Portal
                        </a>
                      </Button>
                      <Button size="lg" variant="outline" asChild>
                        <Link to="/contact">
                          Schedule Demo
                        </Link>
                      </Button>
                    </div>

                    {/* Mobile App Badge */}
                    <div className="bg-background/50 backdrop-blur-sm p-4 rounded-xl border border-border">
                      <div className="flex items-center gap-3">
                        <Smartphone className="h-6 w-6 text-primary" />
                        <div>
                          <p className="font-semibold">Mobile App Available</p>
                          <p className="text-sm text-muted-foreground">Manage your properties anywhere, anytime</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Benefits Grid */}
        <section className="py-4 xl:py-8 xl:py-16 xl:py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-base xl:text-xl xl:text-3xl xl:text-lg xl:text-2xl xl:text-4xl font-bold mb-4">
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
                      <h3 className="text-base xl:text-xl font-semibold mb-2">{benefit.title}</h3>
                      <p className="text-muted-foreground">{benefit.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-4 xl:py-8 xl:py-16 xl:py-24">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl mx-auto"
            >
              <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
                <CardContent className="p-4 xl:p-8 xl:p-12 text-center">
                  <Users className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h2 className="text-base xl:text-xl xl:text-3xl xl:text-lg xl:text-2xl xl:text-4xl font-bold mb-4">
                    Ready to Get Started?
                  </h2>
                  <p className="text-lg text-muted-foreground mb-4 xl:mb-8 max-w-2xl mx-auto">
                    Join RoomSaathi today and experience the easiest way to manage your properties. 
                    List your first property for free!
                  </p>
                  <div className="flex flex-wrap justify-center gap-4">
                    <Button 
                      size="lg"
                      onClick={() => setIsListPropertyModalOpen(true)}
                    >
                      <Smartphone className="mr-2 h-5 w-5" />
                      List Your Property
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
      
      {/* List Property Modal */}
      <ListPropertyModal 
        open={isListPropertyModalOpen} 
        onOpenChange={setIsListPropertyModalOpen} 
      />
    </div>
  );
}
