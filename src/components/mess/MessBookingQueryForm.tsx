import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, X, Sparkles, Phone, Mail, User, MessageSquare, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { createMessBookingQuery } from '@/db/api';
import type { MessCenter } from '@/types/index';

interface MessBookingQueryFormProps {
  mess: MessCenter;
  onClose: () => void;
}

export default function MessBookingQueryForm({ mess, onClose }: MessBookingQueryFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: `I'm interested in booking mess services at ${mess.name}. Please provide details about the special RoomSaathi discount.`
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.phone.trim()) {
      toast({
        title: 'Missing Information',
        description: 'Please provide your name and phone number.',
        variant: 'destructive'
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await createMessBookingQuery({
        name: formData.name,
        phone: formData.phone,
        email: formData.email || null,
        message: formData.message,
        mess_center_id: mess.id,
        mess_center_name: mess.name
      });

      setIsSuccess(true);
      toast({
        title: 'Query Submitted Successfully!',
        description: 'Our team will contact you soon with discount details.',
      });

      // Auto close after 3 seconds
      setTimeout(() => {
        onClose();
      }, 3000);
    } catch (error) {
      console.error('Failed to submit query:', error);
      toast({
        title: 'Submission Failed',
        description: 'Please try again or contact us directly.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="w-full"
    >
      <Card className="relative overflow-hidden border-2 border-accent/20 shadow-lg">
        {/* Decorative background pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-primary/5 pointer-events-none" />
        <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 hover:bg-background/80"
        >
          <X className="w-4 h-4" />
        </Button>

        <div className="relative p-6 space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2">
              <Sparkles className="w-6 h-6 text-accent animate-pulse" />
              <h3 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Book via RoomSaathi
              </h3>
              <Sparkles className="w-6 h-6 text-accent animate-pulse" />
            </div>
            <p className="text-sm text-muted-foreground">
              Get special discount on mess booking at <span className="font-semibold text-foreground">{mess.name}</span>
            </p>
          </div>

          <AnimatePresence mode="wait">
            {isSuccess ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex flex-col items-center justify-center py-8 space-y-4"
              >
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-10 h-10 text-accent" />
                </div>
                <div className="text-center space-y-2">
                  <h4 className="text-xl font-semibold text-foreground">Query Submitted!</h4>
                  <p className="text-sm text-muted-foreground">
                    We'll contact you soon with exclusive discount details
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSubmit}
                className="space-y-4"
              >
                {/* Name field */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="flex items-center gap-2">
                    <User className="w-4 h-4 text-primary" />
                    Your Name *
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    placeholder="Enter your full name"
                    required
                    className="border-primary/20 focus:border-primary"
                  />
                </div>

                {/* Phone field */}
                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-primary" />
                    Phone Number *
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    placeholder="Enter your phone number"
                    required
                    className="border-primary/20 focus:border-primary"
                  />
                </div>

                {/* Email field */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-primary" />
                    Email (Optional)
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    placeholder="Enter your email address"
                    className="border-primary/20 focus:border-primary"
                  />
                </div>

                {/* Message field */}
                <div className="space-y-2">
                  <Label htmlFor="message" className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-primary" />
                    Message
                  </Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => handleChange('message', e.target.value)}
                    placeholder="Any specific requirements or questions?"
                    rows={4}
                    className="border-primary/20 focus:border-primary resize-none"
                  />
                </div>

                {/* Discount info banner */}
                <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-foreground">
                        Special RoomSaathi Discount Available!
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Book through RoomSaathi and get exclusive discounts on your mess subscription
                      </p>
                    </div>
                  </div>
                </div>

                {/* Submit button */}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg hover:shadow-accent/20 transition-all"
                >
                  {isSubmitting ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: 'linear' }}
                        className="w-4 h-4 border-2 border-accent-foreground border-t-transparent rounded-full mr-2"
                      />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Submit Query
                    </>
                  )}
                </Button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </Card>
    </motion.div>
  );
}
