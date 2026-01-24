import { motion } from 'motion/react';
import { Link } from 'react-router';
import {
  Search, Filter, Heart, Calendar, MessageCircle, Phone,
  Mail, MapPin, Star, CheckCircle2, Home, Users, CreditCard,
  Shield, Video, Image, FileText, Clock, ArrowRight, BookOpen
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/layouts/Header';
import Footer from '@/components/layouts/Footer';

export default function HowToUsePage() {
  const steps = [
    {
      number: 1,
      title: 'Search for Properties',
      description: 'Start your journey by searching for your ideal accommodation',
      icon: Search,
      color: 'text-blue-600',
      bgColor: 'bg-blue-600/10',
      details: [
        'Visit the homepage or browse page',
        'Use the search bar to enter your preferences',
        'Select your preferred city (Sikar, Jaipur, or Kota)',
        'Choose the locality within the city',
        'Browse through available properties'
      ],
      image: '🔍'
    },
    {
      number: 2,
      title: 'Apply Filters',
      description: 'Narrow down your search with powerful filters',
      icon: Filter,
      color: 'text-green-600',
      bgColor: 'bg-green-600/10',
      details: [
        'Filter by property type (PG, Flat, Apartment, Room, Hostel)',
        'Set your budget range using the price slider',
        'Select required amenities (WiFi, Parking, Gym, etc.)',
        'Choose RoomSaathi Verified properties for quality assurance',
        'Filter by availability status'
      ],
      image: '🎯'
    },
    {
      number: 3,
      title: 'View Property Details',
      description: 'Explore comprehensive information about each property',
      icon: Home,
      color: 'text-purple-600',
      bgColor: 'bg-purple-600/10',
      details: [
        'View high-quality property images in the gallery',
        'Watch video tours if available',
        'Check detailed room specifications and pricing',
        'Review all amenities and facilities',
        'Read property policies and terms',
        'See location on the map'
      ],
      image: '🏠'
    },
    {
      number: 4,
      title: 'Save Favorites',
      description: 'Keep track of properties you like',
      icon: Heart,
      color: 'text-red-600',
      bgColor: 'bg-red-600/10',
      details: [
        'Click the heart icon on any property card',
        'Properties are saved to your Favorites list',
        'Access favorites anytime from the navigation menu',
        'Compare multiple properties side by side',
        'Remove properties from favorites when needed'
      ],
      image: '❤️'
    },
    {
      number: 5,
      title: 'Schedule a Visit',
      description: 'Book an appointment to see the property in person',
      icon: Calendar,
      color: 'text-orange-600',
      bgColor: 'bg-orange-600/10',
      details: [
        'Click "Schedule a Visit" on the property details page',
        'Select your preferred date and time',
        'Provide your contact information',
        'Add any special requirements or questions',
        'Receive confirmation via email/SMS'
      ],
      image: '📅'
    },
    {
      number: 6,
      title: 'Contact Owner',
      description: 'Get in touch with property owners directly',
      icon: MessageCircle,
      color: 'text-teal-600',
      bgColor: 'bg-teal-600/10',
      details: [
        'Find contact details on the property page',
        'Call the owner directly using the phone number',
        'Send an email with your queries',
        'Use "Send Query" form for detailed questions',
        'Get responses within 24 hours'
      ],
      image: '💬'
    }
  ];

  const features = [
    {
      icon: Shield,
      title: 'RoomSaathi Verified',
      description: 'Properties personally inspected by our team for quality and safety',
      color: 'text-green-600'
    },
    {
      icon: Video,
      title: 'Video Tours',
      description: 'Watch property videos to get a better view before visiting',
      color: 'text-blue-600'
    },
    {
      icon: Image,
      title: 'Photo Gallery',
      description: 'Browse through multiple high-quality images of each property',
      color: 'text-purple-600'
    },
    {
      icon: MapPin,
      title: 'Location Maps',
      description: 'View exact property location and nearby landmarks on the map',
      color: 'text-red-600'
    },
    {
      icon: FileText,
      title: 'Detailed Information',
      description: 'Access complete property details, room specs, and policies',
      color: 'text-orange-600'
    },
    {
      icon: Star,
      title: 'Quality Assurance',
      description: 'All properties meet our standards for safety and amenities',
      color: 'text-yellow-600'
    }
  ];

  const tips = [
    {
      icon: CheckCircle2,
      title: 'Start Early',
      tip: 'Begin your property search at least 2-3 weeks before your move-in date to get the best options.'
    },
    {
      icon: CheckCircle2,
      title: 'Visit in Person',
      tip: 'Always schedule a visit to see the property, check the neighborhood, and meet the owner before booking.'
    },
    {
      icon: CheckCircle2,
      title: 'Read Policies',
      tip: 'Carefully read the property policies, payment terms, and cancellation policy before committing.'
    },
    {
      icon: CheckCircle2,
      title: 'Check Amenities',
      tip: 'Verify that all listed amenities are available and in working condition during your visit.'
    },
    {
      icon: CheckCircle2,
      title: 'Ask Questions',
      tip: 'Don\'t hesitate to ask the owner about any concerns regarding rules, facilities, or maintenance.'
    },
    {
      icon: CheckCircle2,
      title: 'Compare Options',
      tip: 'Save multiple properties to favorites and compare them based on price, location, and amenities.'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 py-16 xl:py-24">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl mx-auto text-center"
            >
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <BookOpen className="h-10 w-10 text-primary" />
              </div>
              <h1 className="text-4xl xl:text-5xl font-bold mb-6">
                How to Use <span className="gradient-text">RoomSaathi</span>
              </h1>
              <p className="text-lg text-muted-foreground mb-8">
                Your complete guide to finding the perfect accommodation on RoomSaathi platform
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button asChild size="lg">
                  <Link to="/browse">
                    Start Browsing
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/help-center">
                    Visit Help Center
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Step-by-Step Guide */}
        <section className="py-12 xl:py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl xl:text-4xl font-bold mb-4">
                Step-by-Step Guide
              </h2>
              <p className="text-muted-foreground">
                Follow these simple steps to find your perfect accommodation
              </p>
            </div>

            <div className="max-w-4xl mx-auto space-y-8">
              {steps.map((step, index) => (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                    <CardContent className="p-0">
                      <div className="@container">
                        <div className="flex flex-col @md:flex-row">
                          {/* Number Badge */}
                          <div className={`${step.bgColor} p-8 flex items-center justify-center @md:w-32`}>
                            <div className="text-center">
                              <div className={`text-6xl font-bold ${step.color} mb-2`}>
                                {step.number}
                              </div>
                              <div className="text-4xl">{step.image}</div>
                            </div>
                          </div>

                          {/* Content */}
                          <div className="flex-1 p-6 @md:p-8">
                            <div className="flex items-start gap-4 mb-4">
                              <div className={`p-3 rounded-lg ${step.bgColor}`}>
                                <step.icon className={`h-6 w-6 ${step.color}`} />
                              </div>
                              <div className="flex-1">
                                <h3 className="text-2xl font-bold mb-2">{step.title}</h3>
                                <p className="text-muted-foreground mb-4">{step.description}</p>
                              </div>
                            </div>

                            <ul className="space-y-2">
                              {step.details.map((detail, idx) => (
                                <li key={idx} className="flex items-start gap-2">
                                  <CheckCircle2 className={`h-5 w-5 ${step.color} mt-0.5 flex-shrink-0`} />
                                  <span className="text-sm">{detail}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Key Features */}
        <section className="py-12 xl:py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl xl:text-4xl font-bold mb-4">
                Platform Features
              </h2>
              <p className="text-muted-foreground">
                Powerful features to help you find the perfect accommodation
              </p>
            </div>

            <div className="grid grid-cols-1 @md:grid-cols-2 xl:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                    <CardHeader>
                      <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center mb-4">
                        <feature.icon className={`h-6 w-6 ${feature.color}`} />
                      </div>
                      <CardTitle className="text-xl">{feature.title}</CardTitle>
                      <CardDescription>{feature.description}</CardDescription>
                    </CardHeader>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Pro Tips */}
        <section className="py-12 xl:py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl xl:text-4xl font-bold mb-4">
                Pro Tips for Success
              </h2>
              <p className="text-muted-foreground">
                Expert advice to help you make the best decision
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 @md:grid-cols-2 gap-6">
                {tips.map((tip, index) => (
                  <motion.div
                    key={tip.title}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card className="h-full">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="p-2 rounded-lg bg-green-600/10">
                            <tip.icon className="h-5 w-5 text-green-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold mb-2">{tip.title}</h3>
                            <p className="text-sm text-muted-foreground">{tip.tip}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Need Help CTA */}
        <section className="py-12 xl:py-16 bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <Card className="border-primary/20">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl xl:text-3xl mb-2">
                    Need More Help?
                  </CardTitle>
                  <CardDescription className="text-base">
                    Our support team is here to assist you every step of the way
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 @md:grid-cols-3 gap-4">
                    <a
                      href="tel:+917374035907"
                      className="flex flex-col items-center gap-2 p-4 rounded-lg bg-muted hover:bg-primary/10 transition-colors group"
                    >
                      <Phone className="h-8 w-8 text-primary group-hover:scale-110 transition-transform" />
                      <p className="font-semibold">Call Us</p>
                      <p className="text-sm text-muted-foreground">+91 7374035907</p>
                    </a>
                    <a
                      href="mailto:jainabhi7374@gmail.com"
                      className="flex flex-col items-center gap-2 p-4 rounded-lg bg-muted hover:bg-primary/10 transition-colors group"
                    >
                      <Mail className="h-8 w-8 text-primary group-hover:scale-110 transition-transform" />
                      <p className="font-semibold">Email Us</p>
                      <p className="text-sm text-muted-foreground text-center">jainabhi7374@gmail.com</p>
                    </a>
                    <Link
                      to="/help-center"
                      className="flex flex-col items-center gap-2 p-4 rounded-lg bg-muted hover:bg-primary/10 transition-colors group"
                    >
                      <MessageCircle className="h-8 w-8 text-primary group-hover:scale-110 transition-transform" />
                      <p className="font-semibold">Help Center</p>
                      <p className="text-sm text-muted-foreground">Visit Now</p>
                    </Link>
                  </div>

                  <div className="text-center pt-4">
                    <Button asChild size="lg">
                      <Link to="/contact">
                        Contact Support
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
