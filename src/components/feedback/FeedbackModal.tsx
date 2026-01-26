import { useState } from 'react';
import { X, Send, MessageCircle, User, Mail, Phone, Home, AlertCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { submitChatbotFeedback } from '@/db/api';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FeedbackModal({ isOpen, onClose }: FeedbackModalProps) {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    propertyType: '',
    problem: '',
  });
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.name.trim()) {
      toast({
        title: 'Name Required',
        description: 'Please enter your name',
        variant: 'destructive',
      });
      return;
    }

    if (!formData.email.trim()) {
      toast({
        title: 'Email Required',
        description: 'Please enter your email',
        variant: 'destructive',
      });
      return;
    }

    if (!formData.propertyType) {
      toast({
        title: 'Property Type Required',
        description: 'Please select the type of property you are looking for',
        variant: 'destructive',
      });
      return;
    }

    if (!formData.problem.trim()) {
      toast({
        title: 'Feedback Required',
        description: 'Please tell us about any problems you faced',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsSubmitting(true);
      await submitChatbotFeedback({
        name: formData.name,
        email: formData.email,
        phone: formData.phone || undefined,
        looking_for: formData.propertyType,
        problem: formData.problem,
      });

      toast({
        title: 'Thank You! 🎉',
        description: 'Your feedback has been submitted successfully. We will review it soon!',
      });

      // Reset form and close
      setFormData({
        name: '',
        email: '',
        phone: '',
        propertyType: '',
        problem: '',
      });
      setStep(1);
      onClose();
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast({
        title: 'Submission Failed',
        description: 'Failed to submit feedback. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setStep(1);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <MessageCircle className="w-6 h-6 text-primary" />
            We'd Love Your Feedback!
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Welcome Message */}
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
            <p className="text-sm text-muted-foreground">
              👋 Hello! We're here to help. Please share your experience with us so we can serve you better.
            </p>
          </div>

          {/* Chatbot-like Form */}
          <div className="space-y-4">
            {/* Step 1: Name */}
            <div className="space-y-2 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <Label htmlFor="name" className="flex items-center gap-2">
                <User className="w-4 h-4 text-primary" />
                What's your name? *
              </Label>
              <Input
                id="name"
                placeholder="Enter your name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="transition-all"
              />
            </div>

            {/* Step 2: Email */}
            {formData.name && (
              <div className="space-y-2 animate-in fade-in slide-in-from-bottom-4 duration-300">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-primary" />
                  What's your email address? *
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="transition-all"
                />
              </div>
            )}

            {/* Step 3: Phone */}
            {formData.email && (
              <div className="space-y-2 animate-in fade-in slide-in-from-bottom-4 duration-300">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-primary" />
                  Phone number (Optional)
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+91 XXXXX XXXXX"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="transition-all"
                />
              </div>
            )}

            {/* Step 4: Property Type */}
            {formData.email && (
              <div className="space-y-2 animate-in fade-in slide-in-from-bottom-4 duration-300">
                <Label htmlFor="propertyType" className="flex items-center gap-2">
                  <Home className="w-4 h-4 text-primary" />
                  What type of property are you looking for? *
                </Label>
                <Select
                  value={formData.propertyType}
                  onValueChange={(value) => handleInputChange('propertyType', value)}
                >
                  <SelectTrigger id="propertyType">
                    <SelectValue placeholder="Select property type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PG">PG (Paying Guest)</SelectItem>
                    <SelectItem value="Flat">Flat</SelectItem>
                    <SelectItem value="Apartment">Apartment</SelectItem>
                    <SelectItem value="Room">Room</SelectItem>
                    <SelectItem value="Hostel">Hostel</SelectItem>
                    <SelectItem value="Short Term Stay">Short Term Stay</SelectItem>
                    <SelectItem value="Mess Center">Mess Center</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Step 5: Problem/Feedback */}
            {formData.propertyType && (
              <div className="space-y-2 animate-in fade-in slide-in-from-bottom-4 duration-300">
                <Label htmlFor="problem" className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-primary" />
                  What problems did you face or what feedback do you have? *
                </Label>
                <Textarea
                  id="problem"
                  placeholder="Tell us about your experience, any issues you faced, or suggestions you have..."
                  value={formData.problem}
                  onChange={(e) => handleInputChange('problem', e.target.value)}
                  rows={4}
                  className="transition-all resize-none"
                />
              </div>
            )}
          </div>

          {/* Submit Button */}
          {formData.name && formData.email && formData.propertyType && formData.problem && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full"
                size="lg"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Submit Feedback
                  </>
                )}
              </Button>
            </div>
          )}

          {/* Helper Text */}
          <p className="text-xs text-center text-muted-foreground">
            Your feedback helps us improve RoomSaathi for everyone. Thank you! 💙
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
