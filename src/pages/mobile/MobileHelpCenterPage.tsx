import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  HelpCircle, 
  MessageCircle, 
  Phone, 
  Mail, 
  ChevronRight,
  Search
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { motion } from 'motion/react';

export default function MobileHelpCenterPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const faqs = [
    {
      question: 'How do I search for properties?',
      answer: 'Use the search bar on the home page to search by location, property type, or price range. You can also use advanced filters to narrow down your search.'
    },
    {
      question: 'How do I schedule a property visit?',
      answer: 'Open any property detail page and click the "Schedule Visit" button. Fill in your preferred date, time, and contact details. The property owner will confirm your visit.'
    },
    {
      question: 'How do I save properties to favorites?',
      answer: 'Click the heart icon on any property card or detail page to add it to your favorites. You can view all your saved properties in the Favorites section.'
    },
    {
      question: 'What does "RoomSaathi Verified" mean?',
      answer: 'RoomSaathi Verified properties have been personally inspected by our team to ensure they meet quality standards and the listing information is accurate.'
    },
    {
      question: 'How do I contact property owners?',
      answer: 'On the property detail page, you\'ll find contact information including phone number and email. You can call directly or send an inquiry through our platform.'
    },
    {
      question: 'Is there a fee to use RoomSaathi?',
      answer: 'No, RoomSaathi is completely free for property seekers. You can search, save favorites, and contact property owners without any charges.'
    },
    {
      question: 'How do I report a problem with a listing?',
      answer: 'If you find any issues with a property listing, please contact our support team immediately through the contact options below.'
    },
    {
      question: 'Can I cancel a scheduled visit?',
      answer: 'Yes, you can view and manage your scheduled visits in your profile. Please inform the property owner if you need to cancel or reschedule.'
    }
  ];

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="flex items-center gap-3 p-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="shrink-0"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold">Help & Support</h1>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="border-2 bg-gradient-to-br from-primary/10 to-secondary/10">
            <CardContent className="pt-6 text-center">
              <HelpCircle className="h-12 w-12 mx-auto mb-3 text-primary" />
              <h2 className="text-xl font-bold mb-2">How can we help you?</h2>
              <p className="text-sm text-muted-foreground">
                Find answers to common questions or contact our support team
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search for help..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-11"
            />
          </div>
        </motion.div>

        {/* Contact Options */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <h3 className="font-semibold mb-3">Contact Us</h3>
          <div className="grid grid-cols-1 gap-3">
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <a href="tel:+919876543210" className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Phone className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">Call Us</p>
                    <p className="text-sm text-muted-foreground">+91 98765 43210</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </a>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <a href="mailto:support@roomsaathi.com" className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">Email Us</p>
                    <p className="text-sm text-muted-foreground">support@roomsaathi.com</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </a>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <MessageCircle className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">Live Chat</p>
                    <p className="text-sm text-muted-foreground">Chat with our team</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* FAQs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <h3 className="font-semibold mb-3">Frequently Asked Questions</h3>
          <Card>
            <CardContent className="p-0">
              <Accordion type="single" collapsible className="w-full">
                {filteredFaqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="px-4 text-left">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="px-4 text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>

          {filteredFaqs.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <p>No results found for "{searchQuery}"</p>
              <p className="text-sm mt-2">Try different keywords or contact our support team</p>
            </div>
          )}
        </motion.div>

        {/* Additional Help */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <Card className="border-dashed">
            <CardContent className="pt-6 text-center">
              <p className="text-sm text-muted-foreground mb-3">
                Can't find what you're looking for?
              </p>
              <Button variant="outline" onClick={() => navigate('/contact')}>
                Contact Support
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
