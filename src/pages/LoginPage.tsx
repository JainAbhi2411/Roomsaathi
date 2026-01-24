import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { motion } from 'motion/react';
import { Mail, Phone, User, Lock, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/layouts/Header';
import Footer from '@/components/layouts/Footer';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'details' | 'otp'>('details');
  const [loading, setLoading] = useState(false);
  const { signInWithEmail, verifyOtp } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from || '/';

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate email
    if (!email || !email.includes('@')) {
      toast({
        title: 'Invalid Email',
        description: 'Please enter a valid email address',
        variant: 'destructive',
      });
      return;
    }

    // Validate phone number (optional but recommended)
    if (phone && phone.length < 10) {
      toast({
        title: 'Invalid Phone Number',
        description: 'Please enter a valid 10-digit phone number',
        variant: 'destructive',
      });
      return;
    }

    console.log('Sending OTP to:', email);
    setLoading(true);
    const { error } = await signInWithEmail(email, phone, name);
    setLoading(false);

    if (error) {
      console.error('Failed to send OTP:', error);
      toast({
        title: 'Error Sending OTP',
        description: error.message || 'Failed to send OTP. Please try again.',
        variant: 'destructive',
      });
    } else {
      console.log('OTP sent successfully');
      toast({
        title: 'OTP Sent Successfully! ✅',
        description: 'Please check your email inbox (and spam folder) for the 6-digit verification code.',
      });
      setStep('otp');
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!otp || otp.length !== 6) {
      toast({
        title: 'Invalid OTP',
        description: 'Please enter the 6-digit OTP sent to your email',
        variant: 'destructive',
      });
      return;
    }

    console.log('Verifying OTP for:', email);
    setLoading(true);
    const { error } = await verifyOtp(email, otp);
    setLoading(false);

    if (error) {
      console.error('Failed to verify OTP:', error);
      toast({
        title: 'Verification Failed',
        description: error.message || 'Invalid OTP. Please check the code and try again.',
        variant: 'destructive',
      });
    } else {
      console.log('Login successful');
      toast({
        title: 'Success! 🎉',
        description: 'You have been logged in successfully.',
      });
      navigate(from, { replace: true });
    }
  };

  const handleBack = () => {
    setStep('details');
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
                {step === 'details' 
                  ? 'Enter your details to get started'
                  : 'Enter the OTP sent to your email'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              {step === 'details' ? (
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="your.email@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10"
                        required
                        autoFocus
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name">Your Name (Optional)</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="name"
                        type="text"
                        placeholder="Enter your full name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number (Optional)</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="10-digit mobile number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                        className="pl-10"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      We'll send a verification code to your email
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
                    Change Email
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
                      OTP sent to {email}
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
            <p className="mt-2 text-xs">Check your spam folder if you don't see the email</p>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
