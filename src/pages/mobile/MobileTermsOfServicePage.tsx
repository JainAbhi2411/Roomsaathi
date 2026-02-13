import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'motion/react';

export default function MobileTermsOfServicePage() {
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
          <h1 className="text-lg font-semibold">Terms of Service</h1>
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
                <FileText className="h-8 w-8 text-primary" />
                <div>
                  <h2 className="text-xl font-bold">Terms of Service</h2>
                  <p className="text-sm text-muted-foreground">Last updated: January 2026</p>
                </div>
              </div>

              <div className="space-y-6 text-sm">
                <section>
                  <h3 className="font-semibold text-base mb-2">1. Acceptance of Terms</h3>
                  <p className="text-muted-foreground">
                    By accessing and using RoomSaathi, you accept and agree to be bound by the terms and 
                    provisions of this agreement. If you do not agree to these terms, please do not use our services.
                  </p>
                </section>

                <section>
                  <h3 className="font-semibold text-base mb-2">2. Use of Services</h3>
                  <p className="text-muted-foreground mb-2">
                    You agree to use our services only for lawful purposes and in accordance with these terms:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-2">
                    <li>You must be at least 18 years old to use our services</li>
                    <li>You are responsible for maintaining account security</li>
                    <li>You must provide accurate and complete information</li>
                    <li>You will not misuse or abuse our platform</li>
                  </ul>
                </section>

                <section>
                  <h3 className="font-semibold text-base mb-2">3. Property Listings</h3>
                  <p className="text-muted-foreground">
                    RoomSaathi acts as a platform connecting property seekers with property owners. We do not 
                    own, manage, or control the properties listed on our platform. All property information is 
                    provided by property owners or their representatives.
                  </p>
                </section>

                <section>
                  <h3 className="font-semibold text-base mb-2">4. User Responsibilities</h3>
                  <p className="text-muted-foreground mb-2">
                    As a user, you agree to:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-2">
                    <li>Verify property details independently before making decisions</li>
                    <li>Conduct due diligence before entering any agreements</li>
                    <li>Report any fraudulent or suspicious listings</li>
                    <li>Respect property owners' time and policies</li>
                  </ul>
                </section>

                <section>
                  <h3 className="font-semibold text-base mb-2">5. Disclaimer of Warranties</h3>
                  <p className="text-muted-foreground">
                    Our services are provided "as is" without warranties of any kind. We do not guarantee the 
                    accuracy, completeness, or reliability of property listings or other content on our platform.
                  </p>
                </section>

                <section>
                  <h3 className="font-semibold text-base mb-2">6. Limitation of Liability</h3>
                  <p className="text-muted-foreground">
                    RoomSaathi shall not be liable for any indirect, incidental, special, consequential, or 
                    punitive damages resulting from your use of our services or any property transactions.
                  </p>
                </section>

                <section>
                  <h3 className="font-semibold text-base mb-2">7. Intellectual Property</h3>
                  <p className="text-muted-foreground">
                    All content on RoomSaathi, including text, graphics, logos, and software, is the property 
                    of RoomSaathi or its content suppliers and is protected by intellectual property laws.
                  </p>
                </section>

                <section>
                  <h3 className="font-semibold text-base mb-2">8. Termination</h3>
                  <p className="text-muted-foreground">
                    We reserve the right to terminate or suspend your account and access to our services at our 
                    sole discretion, without notice, for conduct that we believe violates these terms.
                  </p>
                </section>

                <section>
                  <h3 className="font-semibold text-base mb-2">9. Changes to Terms</h3>
                  <p className="text-muted-foreground">
                    We may modify these terms at any time. Continued use of our services after changes 
                    constitutes acceptance of the modified terms.
                  </p>
                </section>

                <section>
                  <h3 className="font-semibold text-base mb-2">10. Governing Law</h3>
                  <p className="text-muted-foreground">
                    These terms shall be governed by and construed in accordance with the laws of India, 
                    without regard to its conflict of law provisions.
                  </p>
                </section>

                <section>
                  <h3 className="font-semibold text-base mb-2">11. Contact Information</h3>
                  <p className="text-muted-foreground">
                    For questions about these terms, please contact us at legal@roomsaathi.com
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
