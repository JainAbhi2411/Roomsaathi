import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'motion/react';
import { X, Building2, User, Mail, Phone, MapPin, Home, DollarSign, FileText, CheckCircle2, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { submitPropertyListingRequest } from '@/db/api';
import { useToast } from '@/hooks/use-toast';

const propertyTypes = ['PG', 'Flat', 'Apartment', 'Room', 'Hostel', 'Short Term Stay'] as const;
const cities = ['Sikar', 'Jaipur', 'Kota'] as const;

const commonAmenities = [
  'WiFi',
  'Parking',
  'Power Backup',
  'Security',
  'CCTV',
  'Lift',
  'Water Supply',
  'Gym',
  'Laundry',
  'AC',
  'Furnished',
  'Attached Bathroom',
  'Kitchen',
  'Balcony',
];

const listPropertySchema = z.object({
  // Owner Details
  owner_name: z.string().min(2, 'Name must be at least 2 characters'),
  owner_email: z.string().email('Invalid email address'),
  owner_phone: z.string().min(10, 'Phone must be at least 10 digits').max(15, 'Phone must be at most 15 digits'),
  owner_alternate_phone: z.string().optional(),
  
  // Property Details
  property_name: z.string().min(3, 'Property name must be at least 3 characters'),
  property_type: z.enum(propertyTypes, { required_error: 'Please select a property type' }),
  city: z.enum(cities, { required_error: 'Please select a city' }),
  locality: z.string().min(2, 'Locality is required'),
  address: z.string().min(10, 'Please provide complete address'),
  
  // Property Specifications
  total_rooms: z.string().optional(),
  available_rooms: z.string().optional(),
  price_range_min: z.string().optional(),
  price_range_max: z.string().optional(),
  
  // Additional Info
  description: z.string().optional(),
});

type ListPropertyFormData = z.infer<typeof listPropertySchema>;

interface ListPropertyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ListPropertyModal({ open, onOpenChange }: ListPropertyModalProps) {
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<ListPropertyFormData>({
    resolver: zodResolver(listPropertySchema),
  });

  const propertyType = watch('property_type');
  const city = watch('city');

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities(prev =>
      prev.includes(amenity)
        ? prev.filter(a => a !== amenity)
        : [...prev, amenity]
    );
  };

  const onSubmit = async (data: ListPropertyFormData) => {
    setIsSubmitting(true);
    try {
      await submitPropertyListingRequest({
        owner_name: data.owner_name,
        owner_email: data.owner_email,
        owner_phone: data.owner_phone,
        owner_alternate_phone: data.owner_alternate_phone,
        property_name: data.property_name,
        property_type: data.property_type,
        city: data.city,
        locality: data.locality,
        address: data.address,
        total_rooms: data.total_rooms ? parseInt(data.total_rooms) : undefined,
        available_rooms: data.available_rooms ? parseInt(data.available_rooms) : undefined,
        price_range_min: data.price_range_min ? parseInt(data.price_range_min) : undefined,
        price_range_max: data.price_range_max ? parseInt(data.price_range_max) : undefined,
        amenities: selectedAmenities,
        description: data.description,
      });

      setIsSuccess(true);
      toast({
        title: 'Success!',
        description: 'Your property listing request has been submitted successfully. Our team will contact you soon.',
      });

      // Reset form after 2 seconds
      setTimeout(() => {
        reset();
        setSelectedAmenities([]);
        setIsSuccess(false);
        onOpenChange(false);
      }, 2000);
    } catch (error) {
      console.error('Error submitting listing request:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit your request. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      reset();
      setSelectedAmenities([]);
      setIsSuccess(false);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Building2 className="h-6 w-6 text-primary" />
            List Your Property
          </DialogTitle>
          <DialogDescription>
            Fill in the details below and our team will get in touch with you shortly to complete the listing process.
          </DialogDescription>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {isSuccess ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex flex-col items-center justify-center py-12"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              >
                <CheckCircle2 className="h-20 w-20 text-primary mb-4" />
              </motion.div>
              <h3 className="text-2xl font-bold mb-2">Request Submitted!</h3>
              <p className="text-muted-foreground text-center">
                Thank you for choosing RoomSaathi. Our team will contact you within 24 hours.
              </p>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-6"
            >
              {/* Owner Details Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-lg font-semibold">
                  <User className="h-5 w-5 text-primary" />
                  <h3>Owner Details</h3>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="owner_name">Full Name *</Label>
                    <Input
                      id="owner_name"
                      placeholder="Enter your full name"
                      {...register('owner_name')}
                      className={errors.owner_name ? 'border-destructive' : ''}
                    />
                    {errors.owner_name && (
                      <p className="text-sm text-destructive">{errors.owner_name.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="owner_email">Email Address *</Label>
                    <Input
                      id="owner_email"
                      type="email"
                      placeholder="your.email@example.com"
                      {...register('owner_email')}
                      className={errors.owner_email ? 'border-destructive' : ''}
                    />
                    {errors.owner_email && (
                      <p className="text-sm text-destructive">{errors.owner_email.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="owner_phone">Phone Number *</Label>
                    <Input
                      id="owner_phone"
                      type="tel"
                      placeholder="1234567890"
                      {...register('owner_phone')}
                      className={errors.owner_phone ? 'border-destructive' : ''}
                    />
                    {errors.owner_phone && (
                      <p className="text-sm text-destructive">{errors.owner_phone.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="owner_alternate_phone">Alternate Phone (Optional)</Label>
                    <Input
                      id="owner_alternate_phone"
                      type="tel"
                      placeholder="Alternate contact number"
                      {...register('owner_alternate_phone')}
                    />
                  </div>
                </div>
              </div>

              {/* Property Details Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-lg font-semibold">
                  <Home className="h-5 w-5 text-primary" />
                  <h3>Property Details</h3>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="property_name">Property Name *</Label>
                    <Input
                      id="property_name"
                      placeholder="e.g., Sunshine PG, Royal Apartments"
                      {...register('property_name')}
                      className={errors.property_name ? 'border-destructive' : ''}
                    />
                    {errors.property_name && (
                      <p className="text-sm text-destructive">{errors.property_name.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="property_type">Property Type *</Label>
                    <Select
                      value={propertyType}
                      onValueChange={(value) => setValue('property_type', value as typeof propertyTypes[number])}
                    >
                      <SelectTrigger className={errors.property_type ? 'border-destructive' : ''}>
                        <SelectValue placeholder="Select property type" />
                      </SelectTrigger>
                      <SelectContent>
                        {propertyTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.property_type && (
                      <p className="text-sm text-destructive">{errors.property_type.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Select
                      value={city}
                      onValueChange={(value) => setValue('city', value as typeof cities[number])}
                    >
                      <SelectTrigger className={errors.city ? 'border-destructive' : ''}>
                        <SelectValue placeholder="Select city" />
                      </SelectTrigger>
                      <SelectContent>
                        {cities.map((cityOption) => (
                          <SelectItem key={cityOption} value={cityOption}>
                            {cityOption}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.city && (
                      <p className="text-sm text-destructive">{errors.city.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="locality">Locality *</Label>
                    <Input
                      id="locality"
                      placeholder="e.g., Malviya Nagar, Civil Lines"
                      {...register('locality')}
                      className={errors.locality ? 'border-destructive' : ''}
                    />
                    {errors.locality && (
                      <p className="text-sm text-destructive">{errors.locality.message}</p>
                    )}
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="address">Complete Address *</Label>
                    <Textarea
                      id="address"
                      placeholder="Enter complete address with landmarks"
                      rows={2}
                      {...register('address')}
                      className={errors.address ? 'border-destructive' : ''}
                    />
                    {errors.address && (
                      <p className="text-sm text-destructive">{errors.address.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Property Specifications Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-lg font-semibold">
                  <DollarSign className="h-5 w-5 text-primary" />
                  <h3>Property Specifications</h3>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="total_rooms">Total Rooms</Label>
                    <Input
                      id="total_rooms"
                      type="number"
                      placeholder="e.g., 10"
                      {...register('total_rooms')}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="available_rooms">Available Rooms</Label>
                    <Input
                      id="available_rooms"
                      type="number"
                      placeholder="e.g., 5"
                      {...register('available_rooms')}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="price_range_min">Minimum Price (₹/month)</Label>
                    <Input
                      id="price_range_min"
                      type="number"
                      placeholder="e.g., 5000"
                      {...register('price_range_min')}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="price_range_max">Maximum Price (₹/month)</Label>
                    <Input
                      id="price_range_max"
                      type="number"
                      placeholder="e.g., 15000"
                      {...register('price_range_max')}
                    />
                  </div>
                </div>
              </div>

              {/* Amenities Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-lg font-semibold">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  <h3>Amenities</h3>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {commonAmenities.map((amenity) => (
                    <button
                      key={amenity}
                      type="button"
                      onClick={() => toggleAmenity(amenity)}
                      className={`p-3 rounded-lg border-2 text-sm font-medium transition-all ${
                        selectedAmenities.includes(amenity)
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      {amenity}
                    </button>
                  ))}
                </div>
              </div>

              {/* Description Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-lg font-semibold">
                  <FileText className="h-5 w-5 text-primary" />
                  <h3>Additional Information</h3>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Property Description (Optional)</Label>
                  <Textarea
                    id="description"
                    placeholder="Tell us more about your property, special features, nearby facilities, etc."
                    rows={4}
                    {...register('description')}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  disabled={isSubmitting}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Request'
                  )}
                </Button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
