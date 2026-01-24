import React, { useState } from 'react';
import { motion } from 'motion/react';
import Header from '@/components/layouts/Header';
import Footer from '@/components/layouts/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Search, MessageCircle, Mail, Phone } from 'lucide-react';

const faqCategories = [
  {
    category: 'General',
    faqs: [
      {
        question: 'What is RoomSaathi?',
        answer: 'RoomSaathi is a comprehensive student accommodation platform that connects students with verified properties including PG, flats, apartments, rooms, and hostels in Sikar, Jaipur, and Kota. We make finding your perfect home away from home simple, safe, and stress-free.',
      },
      {
        question: 'Which cities does RoomSaathi operate in?',
        answer: 'Currently, RoomSaathi operates in three major cities: Sikar, Jaipur, and Kota. We are continuously expanding and plan to add more cities soon.',
      },
      {
        question: 'Is RoomSaathi free to use for students?',
        answer: 'Yes! RoomSaathi is completely free for students. You can browse properties, save favorites, and contact property owners without any charges or hidden fees.',
      },
      {
        question: 'How do I contact RoomSaathi support?',
        answer: 'You can reach us through multiple channels: WhatsApp at +91 98765 43210, call us directly, email at support@roomsaathi.com, or use the contact form on our website. Our support team is available 24/7 to assist you.',
      },
    ],
  },
  {
    category: 'For Students',
    faqs: [
      {
        question: 'How do I search for properties?',
        answer: 'Simply visit our Browse Properties page and use filters to narrow down your search by city, locality, property type, price range, and amenities. You can also use the search bar to find specific properties.',
      },
      {
        question: 'What does "RoomSaathi Verified" mean?',
        answer: 'RoomSaathi Verified properties have been personally inspected by our team to ensure they meet our quality and safety standards. These properties have verified ownership, accurate photos, and confirmed amenities.',
      },
      {
        question: 'How do I book a property?',
        answer: 'Once you find a property you like, click on it to view full details. You can then contact the property owner directly through the provided contact information. Our team is also available to assist you with the booking process.',
      },
      {
        question: 'Can I visit the property before booking?',
        answer: 'Absolutely! We highly recommend visiting properties before making a decision. Contact the property owner through our platform to schedule a visit at a convenient time.',
      },
      {
        question: 'What is the Welcome Kit benefit?',
        answer: 'When you book through RoomSaathi, you receive a complimentary welcome kit on your move-in day containing essential items to help you settle in comfortably.',
      },
      {
        question: 'Are there any brokerage charges?',
        answer: 'No! RoomSaathi operates on a zero-brokerage model. You can book properties directly with owners without paying any brokerage fees.',
      },
    ],
  },
  {
    category: 'For Property Owners',
    faqs: [
      {
        question: 'How do I list my property on RoomSaathi?',
        answer: 'You can list your property through our website or mobile app. Simply click on "List Your Property", fill in the details, upload photos, and submit. Our team will verify the listing and make it live within 24 hours.',
      },
      {
        question: 'Is there a fee to list properties?',
        answer: 'We offer flexible listing plans. Your first property listing is free! For additional properties and premium features, we have affordable subscription plans. Contact our sales team for detailed pricing.',
      },
      {
        question: 'How does the verification process work?',
        answer: 'After you submit your property listing, our team will contact you to schedule a verification visit. We inspect the property, verify ownership documents, and ensure all details are accurate. Once verified, your property gets the "RoomSaathi Verified" badge.',
      },
      {
        question: 'Can I manage multiple properties?',
        answer: 'Yes! Our management software allows you to manage multiple properties from a single dashboard. Track bookings, payments, tenant details, and more all in one place.',
      },
      {
        question: 'How do I receive inquiries from students?',
        answer: 'When students are interested in your property, they can contact you directly through the phone number or email provided in your listing. You\'ll also receive notifications through our app.',
      },
      {
        question: 'Can I update my property details after listing?',
        answer: 'Yes, you can update your property details, photos, pricing, and availability anytime through your owner dashboard on our website or mobile app.',
      },
    ],
  },
  {
    category: 'Payments & Policies',
    faqs: [
      {
        question: 'What payment methods are accepted?',
        answer: 'Payment terms are decided directly between students and property owners. We recommend using secure payment methods and maintaining proper documentation for all transactions.',
      },
      {
        question: 'What is the refund policy?',
        answer: 'Refund policies vary by property and are set by individual property owners. We recommend discussing refund terms with the owner before booking. Refer to our Guest Refund Policy page for general guidelines.',
      },
      {
        question: 'Are there any hidden charges?',
        answer: 'No. RoomSaathi believes in complete transparency. All charges, including rent, security deposit, and maintenance fees, are clearly mentioned in property listings. There are no hidden charges from our platform.',
      },
      {
        question: 'What is the cancellation policy?',
        answer: 'Cancellation policies are property-specific and set by owners. Always check the cancellation terms before booking. Our Booking Policy page provides detailed information.',
      },
    ],
  },
  {
    category: 'Safety & Security',
    faqs: [
      {
        question: 'How does RoomSaathi ensure property safety?',
        answer: 'We verify all properties through physical inspections, check ownership documents, and ensure basic safety standards are met. Verified properties display the "RoomSaathi Verified" badge.',
      },
      {
        question: 'What should I do if I face issues with a property?',
        answer: 'Contact our support team immediately at +91 98765 43210 or support@roomsaathi.com. We will work with you and the property owner to resolve the issue as quickly as possible.',
      },
      {
        question: 'Is my personal information safe?',
        answer: 'Yes. We take data privacy seriously and follow strict security protocols. Your personal information is encrypted and never shared with third parties without your consent. Read our Privacy Policy for more details.',
      },
      {
        question: 'How do I report a fraudulent listing?',
        answer: 'If you suspect a listing is fraudulent, please report it immediately through our website or contact our support team. We take such reports seriously and investigate promptly.',
      },
    ],
  },
];

export default function FAQsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', ...faqCategories.map(cat => cat.category)];

  const filteredFAQs = faqCategories.filter(cat => {
    if (selectedCategory !== 'All' && cat.category !== selectedCategory) return false;
    
    if (searchQuery) {
      return cat.faqs.some(faq => 
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return true;
  });

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
              className="text-center max-w-3xl mx-auto"
            >
              <div className="inline-block px-4 py-2 bg-primary/10 rounded-full mb-4">
                <span className="text-primary font-semibold text-sm">Help Center</span>
              </div>
              <h1 className="text-4xl xl:text-5xl font-bold mb-6">
                Frequently Asked <span className="gradient-text">Questions</span>
              </h1>
              <p className="text-lg xl:text-xl text-muted-foreground mb-8">
                Find answers to common questions about RoomSaathi, property listings, and our services
              </p>

              {/* Search Bar */}
              <div className="relative max-w-xl mx-auto">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search for answers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-12 text-base"
                />
              </div>
            </motion.div>
          </div>
        </section>

        {/* Categories */}
        <section className="py-8 border-b border-border">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-center gap-3">
              {categories.map((category, index) => (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Button
                    variant={selectedCategory === category ? 'default' : 'outline'}
                    onClick={() => setSelectedCategory(category)}
                    className="transition-all"
                  >
                    {category}
                  </Button>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="py-16 xl:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              {filteredFAQs.length > 0 ? (
                <div className="space-y-8">
                  {filteredFAQs.map((category, catIndex) => (
                    <motion.div
                      key={category.category}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: catIndex * 0.1 }}
                    >
                      <h2 className="text-2xl font-bold mb-4">{category.category}</h2>
                      <Accordion type="single" collapsible className="space-y-3">
                        {category.faqs.map((faq, faqIndex) => (
                          <AccordionItem
                            key={faqIndex}
                            value={`${category.category}-${faqIndex}`}
                            className="border border-border rounded-lg px-6 bg-card hover:shadow-card transition-shadow"
                          >
                            <AccordionTrigger className="text-left hover:no-underline py-4">
                              <span className="font-semibold">{faq.question}</span>
                            </AccordionTrigger>
                            <AccordionContent className="text-muted-foreground pb-4">
                              {faq.answer}
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-16"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                    <Search className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">No results found</h3>
                  <p className="text-muted-foreground">
                    Try adjusting your search or browse by category
                  </p>
                </motion.div>
              )}
            </div>
          </div>
        </section>

        {/* Contact Support */}
        <section className="py-16 xl:py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl mx-auto"
            >
              <Card className="border-primary/20">
                <CardContent className="p-8 xl:p-12">
                  <div className="text-center mb-8">
                    <h2 className="text-3xl xl:text-4xl font-bold mb-4">
                      Still Have <span className="gradient-text">Questions?</span>
                    </h2>
                    <p className="text-lg text-muted-foreground">
                      Can't find the answer you're looking for? Our support team is here to help
                    </p>
                  </div>

                  <div className="grid grid-cols-1 @md:grid-cols-3 gap-6">
                    <Card className="hover:shadow-hover transition-all duration-300 hover:-translate-y-1">
                      <CardContent className="p-6 text-center">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-green-500/10 text-green-500 mb-4">
                          <MessageCircle className="h-6 w-6" />
                        </div>
                        <h3 className="font-semibold mb-2">WhatsApp</h3>
                        <p className="text-sm text-muted-foreground mb-4">Chat with us instantly</p>
                        <Button variant="outline" size="sm" asChild>
                          <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer">
                            Chat Now
                          </a>
                        </Button>
                      </CardContent>
                    </Card>

                    <Card className="hover:shadow-hover transition-all duration-300 hover:-translate-y-1">
                      <CardContent className="p-6 text-center">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-500/10 text-blue-500 mb-4">
                          <Phone className="h-6 w-6" />
                        </div>
                        <h3 className="font-semibold mb-2">Call Us</h3>
                        <p className="text-sm text-muted-foreground mb-4">+91 98765 43210</p>
                        <Button variant="outline" size="sm" asChild>
                          <a href="tel:+919876543210">
                            Call Now
                          </a>
                        </Button>
                      </CardContent>
                    </Card>

                    <Card className="hover:shadow-hover transition-all duration-300 hover:-translate-y-1">
                      <CardContent className="p-6 text-center">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-orange-500/10 text-orange-500 mb-4">
                          <Mail className="h-6 w-6" />
                        </div>
                        <h3 className="font-semibold mb-2">Email</h3>
                        <p className="text-sm text-muted-foreground mb-4">support@roomsaathi.com</p>
                        <Button variant="outline" size="sm" asChild>
                          <a href="mailto:support@roomsaathi.com">
                            Send Email
                          </a>
                        </Button>
                      </CardContent>
                    </Card>
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
