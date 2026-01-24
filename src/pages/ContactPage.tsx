import { useState } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router';
import {
  Phone, Mail, MapPin, Clock, Send, MessageCircle,
  User, FileText, CheckCircle2, HelpCircle, BookOpen
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Header from '@/components/layouts/Header';
import Footer from '@/components/layouts/Footer';

export default function ContactPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      toast({
        title: 'Message Sent Successfully!',
        description: 'We\'ll get back to you within 24 hours.',
      });
      setIsSubmitting(false);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    }, 1500);
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const contactInfo = [
    {
      icon: Phone,
      title: 'Phone',
      value: '+91 7374035907',
      description: 'Available 24/7 for your queries',
      action: 'tel:+917374035907',
      color: 'text-blue-600',
      bgColor: 'bg-blue-600/10'
    },
    {
      icon: Mail,
      title: 'Email',
      value: 'jainabhi7374@gmail.com',
      description: 'We respond within 24 hours',
      action: 'mailto:jainabhi7374@gmail.com',
      color: 'text-green-600',
      bgColor: 'bg-green-600/10'
    },
    {
      icon: MapPin,
      title: 'Location',
      value: 'Sikar, Jaipur, Kota',
      description: 'Rajasthan, India',
      action: null,
      color: 'text-purple-600',
      bgColor: 'bg-purple-600/10'
    }
  ];

  const quickLinks = [
    {
      icon: HelpCircle,
      title: 'Help Center',
      description: 'Browse our knowledge base',
      link: '/help-center',
      color: 'text-blue-600'
    },
    {
      icon: BookOpen,
      title: 'How to Use',
      description: 'Learn how to use the platform',
      link: '/how-to-use',
      color: 'text-green-600'
    },
    {
      icon: MessageCircle,
      title: 'FAQs',
      description: 'Find quick answers',
      link: '/faqs',
      color: 'text-purple-600'
    }
  ];

  const officeHours = [
    { day: 'Monday - Friday', hours: '9:00 AM - 9:00 PM' },
    { day: 'Saturday', hours: '10:00 AM - 6:00 PM' },
    { day: 'Sunday', hours: '10:00 AM - 4:00 PM' }
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
                Get in <span className="gradient-text">Touch</span>
              </h1>
              <p className="text-lg text-muted-foreground">
                Have questions? We're here to help! Reach out to us through any of the channels below.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Contact Info Cards */}
        <section className="py-12 xl:py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 @md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-16">
              {contactInfo.map((info, index) => (
                <motion.div
                  key={info.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="h-full text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                    <CardContent className="p-6">
                      <div className={`w-16 h-16 rounded-full ${info.bgColor} flex items-center justify-center mx-auto mb-4`}>
                        <info.icon className={`h-8 w-8 ${info.color}`} />
                      </div>
                      <h3 className="font-semibold text-lg mb-2">{info.title}</h3>
                      {info.action ? (
                        <a
                          href={info.action}
                          className={`font-bold text-lg mb-2 block hover:${info.color} transition-colors`}
                        >
                          {info.value}
                        </a>
                      ) : (
                        <p className="font-bold text-lg mb-2">{info.value}</p>
                      )}
                      <p className="text-sm text-muted-foreground">{info.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {/* Contact Form */}
              <div className="xl:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl">Send us a Message</CardTitle>
                    <CardDescription>
                      Fill out the form below and we'll get back to you as soon as possible
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 @md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name *</Label>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="name"
                              placeholder="Enter your name"
                              value={formData.name}
                              onChange={(e) => handleChange('name', e.target.value)}
                              className="pl-10"
                              required
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address *</Label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="email"
                              type="email"
                              placeholder="your@email.com"
                              value={formData.email}
                              onChange={(e) => handleChange('email', e.target.value)}
                              className="pl-10"
                              required
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 @md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number</Label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="phone"
                              type="tel"
                              placeholder="+91 XXXXX XXXXX"
                              value={formData.phone}
                              onChange={(e) => handleChange('phone', e.target.value)}
                              className="pl-10"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="subject">Subject *</Label>
                          <Select
                            value={formData.subject}
                            onValueChange={(value) => handleChange('subject', value)}
                            required
                          >
                            <SelectTrigger id="subject">
                              <SelectValue placeholder="Select a subject" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="general">General Inquiry</SelectItem>
                              <SelectItem value="property">Property Related</SelectItem>
                              <SelectItem value="booking">Booking Support</SelectItem>
                              <SelectItem value="technical">Technical Issue</SelectItem>
                              <SelectItem value="feedback">Feedback</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="message">Message *</Label>
                        <div className="relative">
                          <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Textarea
                            id="message"
                            placeholder="Tell us how we can help you..."
                            value={formData.message}
                            onChange={(e) => handleChange('message', e.target.value)}
                            className="pl-10 min-h-[150px]"
                            required
                          />
                        </div>
                      </div>

                      <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? (
                          <>
                            <span className="animate-spin mr-2">⏳</span>
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send className="mr-2 h-5 w-5" />
                            Send Message
                          </>
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Office Hours */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5" />
                      Office Hours
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {officeHours.map((schedule, index) => (
                      <div key={index} className="flex justify-between items-center py-2 border-b last:border-0">
                        <span className="text-sm font-medium">{schedule.day}</span>
                        <span className="text-sm text-muted-foreground">{schedule.hours}</span>
                      </div>
                    ))}
                    <div className="pt-3 mt-3 border-t">
                      <div className="flex items-center gap-2 text-sm text-green-600">
                        <CheckCircle2 className="h-4 w-4" />
                        <span className="font-medium">Phone support available 24/7</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Links */}
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Links</CardTitle>
                    <CardDescription>
                      Find answers faster
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {quickLinks.map((link) => (
                      <Link
                        key={link.title}
                        to={link.link}
                        className="flex items-center gap-3 p-3 rounded-lg bg-muted hover:bg-primary/10 transition-colors group"
                      >
                        <div className="p-2 rounded-lg bg-background">
                          <link.icon className={`h-4 w-4 ${link.color}`} />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-sm group-hover:text-primary transition-colors">
                            {link.title}
                          </p>
                          <p className="text-xs text-muted-foreground">{link.description}</p>
                        </div>
                      </Link>
                    ))}
                  </CardContent>
                </Card>

                {/* Emergency Contact */}
                <Card className="border-primary/20 bg-primary/5">
                  <CardHeader>
                    <CardTitle className="text-lg">Need Immediate Help?</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      For urgent matters, please call us directly:
                    </p>
                    <Button asChild className="w-full" size="lg">
                      <a href="tel:+917374035907">
                        <Phone className="mr-2 h-5 w-5" />
                        Call +91 7374035907
                      </a>
                    </Button>
                    <Button asChild variant="outline" className="w-full">
                      <a href="mailto:jainabhi7374@gmail.com">
                        <Mail className="mr-2 h-5 w-5" />
                        Email Us
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Map Section (Optional) */}
        <section className="py-12 xl:py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <Card>
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">Our Service Areas</CardTitle>
                  <CardDescription>
                    We operate in three major cities of Rajasthan
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 @md:grid-cols-3 gap-6">
                    {['Sikar', 'Jaipur', 'Kota'].map((city) => (
                      <div key={city} className="text-center p-6 rounded-lg bg-muted">
                        <MapPin className="h-8 w-8 text-primary mx-auto mb-3" />
                        <h3 className="font-semibold text-lg mb-1">{city}</h3>
                        <p className="text-sm text-muted-foreground">Rajasthan, India</p>
                      </div>
                    ))}
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
