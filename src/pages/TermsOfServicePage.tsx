import { motion } from 'motion/react';
import { FileText, Shield, Scale, AlertCircle } from 'lucide-react';
import Header from '@/components/layouts/Header';
import Footer from '@/components/layouts/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function TermsOfServicePage() {
  const sections = [
    {
      icon: FileText,
      title: '1. Acceptance of Terms',
      content: `By accessing and using RoomSaathi, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to these Terms of Service, please do not use our platform.`
    },
    {
      icon: Shield,
      title: '2. User Accounts',
      content: `You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account. You must notify us immediately of any unauthorized use of your account.`
    },
    {
      icon: Scale,
      title: '3. Property Listings',
      content: `Property owners are responsible for the accuracy of their listings. RoomSaathi does not guarantee the accuracy, completeness, or reliability of any property information. Users should verify all details directly with property owners before making any commitments.`
    },
    {
      icon: AlertCircle,
      title: '4. User Conduct',
      content: `You agree not to use RoomSaathi for any unlawful purpose or in any way that could damage, disable, or impair the platform. You must not attempt to gain unauthorized access to any part of the platform, other accounts, or computer systems.`
    }
  ];

  const additionalTerms = [
    {
      title: '5. Intellectual Property',
      content: 'All content on RoomSaathi, including text, graphics, logos, and software, is the property of RoomSaathi and protected by copyright laws.'
    },
    {
      title: '6. Limitation of Liability',
      content: 'RoomSaathi shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the platform.'
    },
    {
      title: '7. Privacy',
      content: 'Your use of RoomSaathi is also governed by our Privacy Policy. Please review our Privacy Policy to understand our practices.'
    },
    {
      title: '8. Modifications',
      content: 'We reserve the right to modify these terms at any time. Continued use of the platform after changes constitutes acceptance of the modified terms.'
    },
    {
      title: '9. Termination',
      content: 'We may terminate or suspend your account and access to the platform immediately, without prior notice, for any breach of these Terms of Service.'
    },
    {
      title: '10. Contact Information',
      content: 'For questions about these Terms of Service, please contact us at legal@roomsaathi.com'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="container mx-auto px-4 py-12 xl:py-16">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
              <Scale className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl xl:text-5xl font-bold mb-4">
              Terms of <span className="gradient-text">Service</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Please read these terms carefully before using RoomSaathi
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Last Updated: January 24, 2026
            </p>
          </motion.div>

          {/* Main Sections */}
          <div className="max-w-4xl mx-auto space-y-6 mb-8">
            {sections.map((section, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="border-2 hover:border-primary/50 transition-colors">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <section.icon className="w-5 h-5 text-primary" />
                      </div>
                      {section.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      {section.content}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Additional Terms */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="max-w-4xl mx-auto"
          >
            <Card className="border-2">
              <CardHeader>
                <CardTitle>Additional Terms</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {additionalTerms.map((term, index) => (
                  <div key={index} className="space-y-2">
                    <h3 className="font-semibold text-lg">{term.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {term.content}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* Footer Note */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="max-w-4xl mx-auto mt-8 text-center"
          >
            <p className="text-sm text-muted-foreground">
              By using RoomSaathi, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
            </p>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
