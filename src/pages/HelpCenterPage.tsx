import { useState } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router';
import {
  Search, Phone, Mail, MessageCircle, BookOpen, HelpCircle,
  FileText, Shield, CreditCard, Home, Users, Settings,
  ChevronRight, Clock, MapPin, Star, CheckCircle2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import Header from '@/components/layouts/Header';
import Footer from '@/components/layouts/Footer';
import PolicyModal from '@/components/ui/PolicyModal';
import { policies } from '@/data/policies';
import type { PolicyContent } from '@/data/policies';

export default function HelpCenterPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState<PolicyContent | null>(null);

  const openPolicy = (policyId: string) => {
    setSelectedPolicy(policies[policyId]);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedPolicy(null), 300);
  };
  const quickLinks = [
    {
      icon: BookOpen,
      title: 'How to Use',
      description: 'Learn how to use RoomSaathi platform',
      link: '/how-to-use',
      color: 'text-blue-600'
    },
    {
      icon: HelpCircle,
      title: 'FAQs',
      description: 'Find answers to common questions',
      link: '/faqs',
      color: 'text-green-600'
    },
    {
      icon: MessageCircle,
      title: 'Contact Support',
      description: 'Get in touch with our support team',
      link: '/contact',
      color: 'text-purple-600'
    },
    {
      icon: FileText,
      title: 'Policies',
      description: 'Read our terms and policies',
      link: '/terms',
      color: 'text-orange-600'
    }
  ];

  const popularTopics = [
    {
      category: 'Getting Started',
      icon: Home,
      questions: [
        { q: 'How do I search for properties?', a: 'Use the search bar on the homepage or browse page. You can filter by city, locality, property type, price range, and amenities to find your perfect accommodation.' },
        { q: 'What is RoomSaathi Verified?', a: 'RoomSaathi Verified properties have been personally inspected by our team. They meet our quality standards for safety, cleanliness, and amenities.' },
        { q: 'How do I save my favorite properties?', a: 'Click the heart icon on any property card to add it to your favorites. You can view all saved properties in the Favorites section.' },
        { q: 'Can I schedule a property visit?', a: 'Yes! On any property details page, click "Schedule a Visit" to book an appointment. Our team will coordinate with the property owner.' }
      ]
    },
    {
      category: 'Booking & Payments',
      icon: CreditCard,
      questions: [
        { q: 'How do I book a property?', a: 'After viewing property details, click "Send Query" or "Schedule Visit". Our team will guide you through the booking process and payment options.' },
        { q: 'What payment methods are accepted?', a: 'Most properties accept UPI, bank transfer, cash, and cheques. Specific payment methods are listed on each property page.' },
        { q: 'Is there a security deposit?', a: 'Yes, most properties require a security deposit (usually 1-2 months rent) which is refundable when you vacate.' },
        { q: 'What is the cancellation policy?', a: 'Cancellation policies vary by property. Check the "Policies" tab on the property details page for specific terms.' }
      ]
    },
    {
      category: 'Property Features',
      icon: Settings,
      questions: [
        { q: 'What amenities are typically included?', a: 'Common amenities include WiFi, power backup, water supply, security, and parking. Each property lists its specific amenities.' },
        { q: 'Are meals included in PG accommodations?', a: 'Many PGs offer mess facilities. Check the property details for meal options and pricing.' },
        { q: 'Can I see room specifications?', a: 'Yes! Each property page has a "Rooms" tab showing detailed specifications, images, and pricing for different room types.' },
        { q: 'Are short-term stays available?', a: 'Some properties offer short-term stays. Look for the "Short Term Stay" badge or filter by this option when browsing.' }
      ]
    },
    {
      category: 'Account & Support',
      icon: Users,
      questions: [
        { q: 'Do I need an account to browse properties?', a: 'No, you can browse properties without an account. However, creating an account helps you save favorites and track your queries.' },
        { q: 'How do I contact property owners?', a: 'Contact information is available on each property details page. You can call, email, or send a query through our platform.' },
        { q: 'What if I face issues with a property?', a: 'Contact our support team immediately at +91 7374035907 or email jainabhi7374@gmail.com. We\'re here to help!' },
        { q: 'How do I report a problem?', a: 'Use the "Contact Support" option or reach out directly via phone or email. We respond to all queries within 24 hours.' }
      ]
    }
  ];

  const contactMethods = [
    {
      icon: Phone,
      title: 'Phone Support',
      description: 'Call us for immediate assistance',
      value: '+91 7374035907',
      action: 'tel:+917374035907',
      buttonText: 'Call Now',
      available: '24/7 Available'
    },
    {
      icon: Mail,
      title: 'Email Support',
      description: 'Send us your queries via email',
      value: 'jainabhi7374@gmail.com',
      action: 'mailto:jainabhi7374@gmail.com',
      buttonText: 'Send Email',
      available: 'Response within 24 hours'
    },
    {
      icon: MessageCircle,
      title: 'Live Chat',
      description: 'Chat with our support team',
      value: 'Available on website',
      action: '/contact',
      buttonText: 'Start Chat',
      available: 'Mon-Sat, 9 AM - 9 PM'
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
              <h1 className="text-4xl xl:text-5xl font-bold mb-6">
                How can we <span className="gradient-text">help you?</span>
              </h1>
              <p className="text-lg text-muted-foreground mb-8">
                Search our knowledge base or get in touch with our support team
              </p>

              {/* Search Bar */}
              <div className="relative max-w-2xl mx-auto">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search for help articles, FAQs, guides..."
                  className="pl-12 pr-4 py-6 text-lg"
                />
              </div>
            </motion.div>
          </div>
        </section>

        {/* Quick Links */}
        <section className="py-12 xl:py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 @md:grid-cols-2 xl:grid-cols-4 gap-6">
              {quickLinks.map((link, index) => (
                <motion.div
                  key={link.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Link to={link.link}>
                    <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer group">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className={`p-3 rounded-lg bg-muted group-hover:bg-primary/10 transition-colors`}>
                            <link.icon className={`h-6 w-6 ${link.color}`} />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">
                              {link.title}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {link.description}
                            </p>
                          </div>
                          <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Popular Topics */}
        <section className="py-12 xl:py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl xl:text-4xl font-bold mb-4">
                Popular Help Topics
              </h2>
              <p className="text-muted-foreground">
                Find answers to the most frequently asked questions
              </p>
            </div>

            <Tabs defaultValue="getting-started" className="max-w-5xl mx-auto">
              <TabsList className="grid w-full grid-cols-2 xl:grid-cols-4 mb-8">
                <TabsTrigger value="getting-started">Getting Started</TabsTrigger>
                <TabsTrigger value="booking">Booking</TabsTrigger>
                <TabsTrigger value="features">Features</TabsTrigger>
                <TabsTrigger value="support">Support</TabsTrigger>
              </TabsList>

              {popularTopics.map((topic, index) => (
                <TabsContent
                  key={topic.category}
                  value={topic.category.toLowerCase().replace(' & ', '-').replace(' ', '-')}
                  className="space-y-4"
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <topic.icon className="h-5 w-5" />
                        {topic.category}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Accordion type="single" collapsible className="w-full">
                        {topic.questions.map((item, qIndex) => (
                          <AccordionItem key={qIndex} value={`item-${qIndex}`}>
                            <AccordionTrigger className="text-left">
                              {item.q}
                            </AccordionTrigger>
                            <AccordionContent className="text-muted-foreground">
                              {item.a}
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </CardContent>
                  </Card>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </section>

        {/* Contact Support */}
        <section className="py-12 xl:py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl xl:text-4xl font-bold mb-4">
                Still Need Help?
              </h2>
              <p className="text-muted-foreground">
                Our support team is always ready to assist you
              </p>
            </div>

            <div className="grid grid-cols-1 @md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {contactMethods.map((method, index) => (
                <motion.div
                  key={method.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="h-full text-center">
                    <CardHeader>
                      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                        <method.icon className="h-8 w-8 text-primary" />
                      </div>
                      <CardTitle>{method.title}</CardTitle>
                      <CardDescription>{method.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <p className="font-semibold text-lg mb-1">{method.value}</p>
                        <p className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                          <Clock className="h-3 w-3" />
                          {method.available}
                        </p>
                      </div>
                      <Button asChild className="w-full">
                        <a href={method.action}>
                          {method.buttonText}
                        </a>
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Additional Resources */}
        <section className="py-12 xl:py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <Card className="border-primary/20">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">Additional Resources</CardTitle>
                  <CardDescription>
                    Explore more helpful resources and guides
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 @md:grid-cols-2 gap-4">
                    <Link to="/how-to-use" className="flex items-center gap-3 p-4 rounded-lg bg-background hover:bg-muted transition-colors group">
                      <BookOpen className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-semibold group-hover:text-primary transition-colors">How to Use Guide</p>
                        <p className="text-sm text-muted-foreground">Complete platform walkthrough</p>
                      </div>
                      <ChevronRight className="h-5 w-5 ml-auto text-muted-foreground group-hover:text-primary transition-colors" />
                    </Link>
                    <Link to="/faqs" className="flex items-center gap-3 p-4 rounded-lg bg-background hover:bg-muted transition-colors group">
                      <HelpCircle className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-semibold group-hover:text-primary transition-colors">FAQs</p>
                        <p className="text-sm text-muted-foreground">Frequently asked questions</p>
                      </div>
                      <ChevronRight className="h-5 w-5 ml-auto text-muted-foreground group-hover:text-primary transition-colors" />
                    </Link>
                    <button 
                      onClick={() => openPolicy('service-terms')}
                      className="flex items-center gap-3 p-4 rounded-lg bg-background hover:bg-muted transition-colors group w-full text-left"
                    >
                      <Shield className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-semibold group-hover:text-primary transition-colors">Terms & Policies</p>
                        <p className="text-sm text-muted-foreground">Read our terms and conditions</p>
                      </div>
                      <ChevronRight className="h-5 w-5 ml-auto text-muted-foreground group-hover:text-primary transition-colors" />
                    </button>
                    <Link to="/contact" className="flex items-center gap-3 p-4 rounded-lg bg-background hover:bg-muted transition-colors group">
                      <MessageCircle className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-semibold group-hover:text-primary transition-colors">Contact Us</p>
                        <p className="text-sm text-muted-foreground">Get in touch with our team</p>
                      </div>
                      <ChevronRight className="h-5 w-5 ml-auto text-muted-foreground group-hover:text-primary transition-colors" />
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      
      {/* Policy Modal */}
      <PolicyModal isOpen={isModalOpen} onClose={closeModal} policy={selectedPolicy} />
    </div>
  );
}
