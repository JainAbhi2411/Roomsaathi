import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, Clock, User, Phone, Calendar as CalendarIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router';
import { createPropertyVisit } from '@/db/api';

interface ScheduleVisitDialogProps {
  propertyId: string;
  propertyName: string;
}

export default function ScheduleVisitDialog({ propertyId, propertyName }: ScheduleVisitDialogProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    visitDate: '',
    visitTime: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen && !user) {
      // Redirect to login if not authenticated
      toast({
        title: 'Login Required',
        description: 'Please login to schedule a property visit',
      });
      navigate('/login', { state: { from: window.location.pathname } });
      return;
    }
    setOpen(newOpen);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !profile) {
      toast({
        title: 'Authentication Required',
        description: 'Please login to schedule a visit',
        variant: 'destructive',
      });
      return;
    }

    // Validate date is in the future
    const selectedDate = new Date(`${formData.visitDate}T${formData.visitTime}`);
    const now = new Date();
    
    if (selectedDate <= now) {
      toast({
        title: 'Invalid Date/Time',
        description: 'Please select a future date and time',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await createPropertyVisit({
        property_id: propertyId,
        user_id: user.id,
        visitor_name: profile.username || 'Guest',
        visitor_phone: formData.phone,
        visit_date: formData.visitDate,
        visit_time: formData.visitTime,
        message: formData.message || null,
      });

      toast({
        title: 'Visit Scheduled!',
        description: `Your visit to ${propertyName} has been scheduled successfully.`,
      });

      setOpen(false);
      setFormData({ name: '', phone: '', visitDate: '', visitTime: '', message: '' });
    } catch (error) {
      console.error('Error scheduling visit:', error);
      toast({
        title: 'Error',
        description: 'Failed to schedule visit. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get minimum date (today)
  const today = new Date().toISOString().split('T')[0];

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="w-full" size="lg">
          <CalendarIcon className="mr-2 h-5 w-5" />
          Schedule Visit
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Schedule a Property Visit</DialogTitle>
          <p className="text-sm text-muted-foreground">
            Book a visit to see {propertyName} in person
          </p>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* Name (Read-only, from profile) */}
          <div className="space-y-2">
            <Label htmlFor="name">Your Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter your name"
                className="pl-10"
                required
              />
            </div>
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="Enter your phone number"
                className="pl-10"
                required
              />
            </div>
          </div>

          {/* Visit Date */}
          <div className="space-y-2">
            <Label htmlFor="visitDate">Preferred Date *</Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="visitDate"
                type="date"
                min={today}
                value={formData.visitDate}
                onChange={(e) => setFormData({ ...formData, visitDate: e.target.value })}
                className="pl-10"
                required
              />
            </div>
          </div>

          {/* Visit Time */}
          <div className="space-y-2">
            <Label htmlFor="visitTime">Preferred Time *</Label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="visitTime"
                type="time"
                value={formData.visitTime}
                onChange={(e) => setFormData({ ...formData, visitTime: e.target.value })}
                className="pl-10"
                required
              />
            </div>
          </div>

          {/* Message (Optional) */}
          <div className="space-y-2">
            <Label htmlFor="message">Message (Optional)</Label>
            <Textarea
              id="message"
              placeholder="Any specific requirements or questions..."
              rows={3}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            />
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={isSubmitting}>
              {isSubmitting ? 'Scheduling...' : 'Confirm Visit'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
