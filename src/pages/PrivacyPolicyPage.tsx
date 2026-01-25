import { motion } from 'motion/react';
import { Shield, Lock, Eye, Database, UserCheck, Bell } from 'lucide-react';
import Header from '@/components/layouts/Header';
import Footer from '@/components/layouts/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function PrivacyPolicyPage() {
  const sections = [
    {
      icon: Database,
      title: '1. Information We Collect',
      content: `We collect information you provide directly to us, including your name, username, contact information, and property preferences. We also collect information about your use of our platform, including search queries, property views, and favorites.`
    },
    {
      icon: Lock,
      title: '2. How We Use Your Information',
      content: `We use the information we collect to provide, maintain, and improve our services, to communicate with you, to personalize your experience, and to protect the security and integrity of our platform.`
    },
    {
      icon: Shield,
      title: '3. Information Sharing',
      content: `We do not sell your personal information. We may share your information with property owners when you express interest in their listings, and with service providers who assist us in operating our platform.`
    },
    {
      icon: Eye,
      title: '4. Your Privacy Rights',
      content: `You have the right to access, update, or delete your personal information. You can manage your account settings and privacy preferences at any time through your account dashboard.`
    },
    {
      icon: UserCheck,
      title: '5. Data Security',
      content: `We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.`
    },
    {
      icon: Bell,
      title: '6. Cookies and Tracking',
      content: `We use cookies and similar tracking technologies to collect information about your browsing activities and to remember your preferences. You can control cookies through your browser settings.`
    }
  ];

  const additionalPolicies = [
    {
      title: '7. Third-Party Services',
      content: 'Our platform may contain links to third-party websites or services. We are not responsible for the privacy practices of these third parties.'
    },
    {
      title: '8. Children\'s Privacy',
      content: 'RoomSaathi is not intended for users under the age of 18. We do not knowingly collect personal information from children.'
    },
    {
      title: '9. Changes to Privacy Policy',
      content: 'We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on this page.'
    },
    {
      title: '10. Contact Us',
      content: 'If you have questions about this Privacy Policy, please contact us at privacy@roomsaathi.com'
    }
  ];

  const userTypes = [
    {
      title: 'For Tenants/Users',
      points: [
        'Your search history and property preferences are stored to improve recommendations',
        'Contact information is shared with property owners only when you initiate contact',
        'Your favorites and saved properties are private and not shared with others',
        'You can delete your account and all associated data at any time'
      ]
    },
    {
      title: 'For Property Owners',
      points: [
        'Your property listings and contact information are publicly visible',
        'You receive notifications when users show interest in your properties',
        'Your account information is kept secure and not shared with third parties',
        'You control what information is displayed in your property listings'
      ]
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
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl xl:text-5xl font-bold mb-4">
              Privacy <span className="gradient-text">Policy</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Your privacy is important to us. Learn how we collect, use, and protect your information.
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

          {/* User Type Specific Policies */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="max-w-4xl mx-auto mb-8"
          >
            <h2 className="text-2xl font-bold mb-6 text-center">Privacy by User Type</h2>
            <div className="grid xl:grid-cols-2 gap-6">
              {userTypes.map((type, index) => (
                <Card key={index} className="border-2">
                  <CardHeader>
                    <CardTitle className="text-lg">{type.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {type.points.map((point, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                          <span className="text-sm text-muted-foreground">{point}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>

          {/* Additional Policies */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="max-w-4xl mx-auto"
          >
            <Card className="border-2">
              <CardHeader>
                <CardTitle>Additional Privacy Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {additionalPolicies.map((policy, index) => (
                  <div key={index} className="space-y-2">
                    <h3 className="font-semibold text-lg">{policy.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {policy.content}
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
            transition={{ duration: 0.5, delay: 0.8 }}
            className="max-w-4xl mx-auto mt-8 text-center"
          >
            <p className="text-sm text-muted-foreground">
              By using RoomSaathi, you consent to the collection and use of your information as described in this Privacy Policy.
            </p>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
