import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'motion/react';

export default function MobilePrivacyPolicyPage() {
  const navigate = useNavigate();

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
          <h1 className="text-lg font-semibold">Privacy Policy</h1>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="border-2">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="h-8 w-8 text-primary" />
                <div>
                  <h2 className="text-xl font-bold">Your Privacy Matters</h2>
                  <p className="text-sm text-muted-foreground">Last updated: January 2026</p>
                </div>
              </div>

              <div className="space-y-6 text-sm">
                <section>
                  <h3 className="font-semibold text-base mb-2">1. Information We Collect</h3>
                  <p className="text-muted-foreground">
                    We collect information you provide directly to us, including your name, email address, 
                    phone number, and property preferences when you use our services.
                  </p>
                </section>

                <section>
                  <h3 className="font-semibold text-base mb-2">2. How We Use Your Information</h3>
                  <p className="text-muted-foreground mb-2">
                    We use the information we collect to:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-2">
                    <li>Provide, maintain, and improve our services</li>
                    <li>Send you property recommendations and updates</li>
                    <li>Respond to your inquiries and support requests</li>
                    <li>Process your property visit schedules</li>
                    <li>Communicate with you about our services</li>
                  </ul>
                </section>

                <section>
                  <h3 className="font-semibold text-base mb-2">3. Information Sharing</h3>
                  <p className="text-muted-foreground">
                    We do not sell your personal information. We may share your information with property 
                    owners when you schedule a visit or express interest in their properties.
                  </p>
                </section>

                <section>
                  <h3 className="font-semibold text-base mb-2">4. Data Security</h3>
                  <p className="text-muted-foreground">
                    We implement appropriate security measures to protect your personal information from 
                    unauthorized access, alteration, disclosure, or destruction.
                  </p>
                </section>

                <section>
                  <h3 className="font-semibold text-base mb-2">5. Your Rights</h3>
                  <p className="text-muted-foreground mb-2">
                    You have the right to:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-2">
                    <li>Access your personal information</li>
                    <li>Correct inaccurate information</li>
                    <li>Request deletion of your information</li>
                    <li>Opt-out of marketing communications</li>
                  </ul>
                </section>

                <section>
                  <h3 className="font-semibold text-base mb-2">6. Cookies and Tracking</h3>
                  <p className="text-muted-foreground">
                    We use cookies and similar tracking technologies to improve your experience on our 
                    platform and analyze usage patterns.
                  </p>
                </section>

                <section>
                  <h3 className="font-semibold text-base mb-2">7. Children's Privacy</h3>
                  <p className="text-muted-foreground">
                    Our services are not intended for children under 18 years of age. We do not knowingly 
                    collect personal information from children.
                  </p>
                </section>

                <section>
                  <h3 className="font-semibold text-base mb-2">8. Changes to Privacy Policy</h3>
                  <p className="text-muted-foreground">
                    We may update this privacy policy from time to time. We will notify you of any changes 
                    by posting the new policy on this page.
                  </p>
                </section>

                <section>
                  <h3 className="font-semibold text-base mb-2">9. Contact Us</h3>
                  <p className="text-muted-foreground">
                    If you have any questions about this privacy policy, please contact us at 
                    privacy@roomsaathi.com
                  </p>
                </section>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
