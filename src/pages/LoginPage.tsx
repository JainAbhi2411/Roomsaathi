import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { motion } from 'motion/react';
import { Phone, Lock, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/layouts/Header';
import Footer from '@/components/layouts/Footer';

export default function LoginPage() {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [loading, setLoading] = useState(false);
  const { signInWithPhone, verifyOtp } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from || '/';

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate phone number
    if (!phone || phone.length < 10) {
      toast({
        title: 'Invalid Phone Number',
        description: 'Please enter a valid 10-digit phone number',
        variant: 'destructive',
      });
      return;
    }

    // Format phone number with country code
    const formattedPhone = phone.startsWith('+91') ? phone : `+91${phone}`;

    setLoading(true);
    const { error } = await signInWithPhone(formattedPhone);
    setLoading(false);

    if (error) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to send OTP. Please try again.',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'OTP Sent!',
        description: 'Please check your phone for the verification code.',
      });
      setStep('otp');
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!otp || otp.length !== 6) {
      toast({
        title: 'Invalid OTP',
        description: 'Please enter the 6-digit OTP sent to your phone',
        variant: 'destructive',
      });
      return;
    }

    const formattedPhone = phone.startsWith('+91') ? phone : `+91${phone}`;

    setLoading(true);
    const { error } = await verifyOtp(formattedPhone, otp);
    setLoading(false);

    if (error) {
      toast({
        title: 'Verification Failed',
        description: error.message || 'Invalid OTP. Please try again.',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Success!',
        description: 'You have been logged in successfully.',
      });
      navigate(from, { replace: true });
    }
  };

  const handleBack = () => {
    setStep('phone');
    setOtp('');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center px-4 py-12 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Card className="border-2">
            <CardHeader className="space-y-1 text-center">
              <CardTitle className="text-3xl font-bold">
                Welcome to <span className="gradient-text">RoomSaathi</span>
              </CardTitle>
              <CardDescription>
                {step === 'phone' 
                  ? 'Enter your phone number to get started'
                  : 'Enter the OTP sent to your phone'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              {step === 'phone' ? (
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="Enter 10-digit mobile number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                        className="pl-10"
                        required
                        autoFocus
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      We'll send you a one-time password (OTP) to verify your number
                    </p>
                  </div>

                  <Button type="submit" className="w-full" size="lg" disabled={loading}>
                    {loading ? 'Sending OTP...' : 'Send OTP'}
                  </Button>

                  <div className="text-center text-sm text-muted-foreground">
                    By continuing, you agree to our Terms of Service and Privacy Policy
                  </div>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={handleBack}
                    className="mb-4"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Change Number
                  </Button>

                  <div className="space-y-2">
                    <Label htmlFor="otp">Verification Code</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="otp"
                        type="text"
                        placeholder="Enter 6-digit OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        className="pl-10 text-center text-2xl tracking-widest"
                        required
                        autoFocus
                        maxLength={6}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      OTP sent to +91 {phone}
                    </p>
                  </div>

                  <Button type="submit" className="w-full" size="lg" disabled={loading}>
                    {loading ? 'Verifying...' : 'Verify & Login'}
                  </Button>

                  <div className="text-center">
                    <Button
                      type="button"
                      variant="link"
                      onClick={handleSendOtp}
                      disabled={loading}
                      className="text-sm"
                    >
                      Didn't receive OTP? Resend
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>Need help? Contact us at support@roomsaathi.com</p>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
