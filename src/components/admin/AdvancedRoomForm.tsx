import { useState, useEffect } from 'react';
import { X, Trash2, Plus, Info, Calculator, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/db/supabase';
import { useToast } from '@/hooks/use-toast';
import type { Room } from '@/types/index';

interface AdvancedRoomFormProps {
  propertyId: string;
  room?: Room | null;
  maxFloors: number;
  onSave: (roomData: any) => Promise<void>;
  onCancel: () => void;
}

const COMMON_AMENITIES = [
  { id: 'ac', label: 'AC', icon: '❄️' },
  { id: 'wifi', label: 'WiFi', icon: '📶' },
  { id: 'attached_bathroom', label: 'Attached Bathroom', icon: '🚿' },
  { id: 'balcony', label: 'Balcony', icon: '🏞️' },
  { id: 'wardrobe', label: 'Wardrobe', icon: '👔' },
  { id: 'study_table', label: 'Study Table', icon: '📚' },
  { id: 'chair', label: 'Chair', icon: '🪑' },
  { id: 'bed', label: 'Bed', icon: '🛏️' },
  { id: 'mattress', label: 'Mattress', icon: '🛌' },
  { id: 'fan', label: 'Fan', icon: '🌀' },
  { id: 'window', label: 'Window', icon: '🪟' },
  { id: 'geyser', label: 'Geyser', icon: '♨️' },
  { id: 'tv', label: 'TV', icon: '📺' },
  { id: 'refrigerator', label: 'Refrigerator', icon: '🧊' },
  { id: 'cupboard', label: 'Cupboard', icon: '🗄️' },
  { id: 'mirror', label: 'Mirror', icon: '🪞' },
];

export default function AdvancedRoomForm({ 
  propertyId, 
  room, 
  maxFloors, 
  onSave, 
  onCancel 
}: AdvancedRoomFormProps) {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    floor_number: room?.floor_number || 1,
    room_number: room?.room_number || '',
    room_type: room?.room_type || '',
    seats: room?.seats || 1,
    rent_per_seat: room?.rent_per_seat || 0,
    price: room?.price || 0,
    short_term_available: room?.short_term_available || false,
    is_available: room?.is_available ?? true,
    description: room?.description || '',
    amenities: room?.amenities || [],
    images: room?.images || [],
    specifications: room?.specifications || {},
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imagePreview, setImagePreview] = useState<string[]>(formData.images);

  // Auto-calculate price when seats or rent_per_seat changes
  useEffect(() => {
    if (formData.seats && formData.rent_per_seat) {
      const calculatedPrice = formData.seats * formData.rent_per_seat;
      setFormData(prev => ({ ...prev, price: calculatedPrice }));
    }
  }, [formData.seats, formData.rent_per_seat]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.room_number.trim()) {
      newErrors.room_number = 'Room number is required';
    }
    if (!formData.room_type.trim()) {
      newErrors.room_type = 'Room type is required';
    }
    if (formData.floor_number < 1 || formData.floor_number > maxFloors) {
      newErrors.floor_number = `Floor must be between 1 and ${maxFloors}`;
    }
    if (formData.seats < 1) {
      newErrors.seats = 'At least 1 seat is required';
    }
    if (formData.rent_per_seat < 0) {
      newErrors.rent_per_seat = 'Rent per seat cannot be negative';
    }
    if (formData.price < 0) {
      newErrors.price = 'Price cannot be negative';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageUrlsChange = (value: string) => {
    // Split by newlines and filter out empty lines
    const urls = value.split('\n').map(url => url.trim()).filter(url => url.length > 0);
    
    setFormData(prev => ({
      ...prev,
      images: urls,
    }));
    
    setImagePreview(urls);
  };

  const handleRemoveImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
    setImagePreview(prev => prev.filter((_, i) => i !== index));
  };

  const handleAmenityToggle = (amenityId: string) => {
    const amenity = COMMON_AMENITIES.find(a => a.id === amenityId);
    if (!amenity) return;

    setFormData(prev => {
      const amenities = prev.amenities.includes(amenity.label)
        ? prev.amenities.filter(a => a !== amenity.label)
        : [...prev.amenities, amenity.label];
      return { ...prev, amenities };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast({
        title: 'Validation Error',
        description: 'Please fix the errors in the form',
        variant: 'destructive',
      });
      return;
    }

    setIsSaving(true);

    try {
      await onSave({
        property_id: propertyId,
        ...formData,
      });

      toast({
        title: 'Success',
        description: room ? 'Room updated successfully' : 'Room created successfully',
      });
    } catch (error: any) {
      console.error('Error saving room:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to save room',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>Enter the basic details of the room</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="floor_number">
                Floor Number <span className="text-destructive">*</span>
              </Label>
              <Input
                id="floor_number"
                type="number"
                min="1"
                max={maxFloors}
                value={formData.floor_number}
                onChange={(e) => setFormData(prev => ({ ...prev, floor_number: Number(e.target.value) }))}
                className={errors.floor_number ? 'border-destructive' : ''}
              />
              {errors.floor_number && (
                <p className="text-xs text-destructive">{errors.floor_number}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="room_number">
                Room Number <span className="text-destructive">*</span>
              </Label>
              <Input
                id="room_number"
                value={formData.room_number}
                onChange={(e) => setFormData(prev => ({ ...prev, room_number: e.target.value }))}
                placeholder="e.g., 101, A1, etc."
                className={errors.room_number ? 'border-destructive' : ''}
              />
              {errors.room_number && (
                <p className="text-xs text-destructive">{errors.room_number}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="room_type">
                Room Type <span className="text-destructive">*</span>
              </Label>
              <Input
                id="room_type"
                value={formData.room_type}
                onChange={(e) => setFormData(prev => ({ ...prev, room_type: e.target.value }))}
                placeholder="e.g., Single, Double, Triple"
                className={errors.room_type ? 'border-destructive' : ''}
              />
              {errors.room_type && (
                <p className="text-xs text-destructive">{errors.room_type}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              placeholder="Describe the room features, view, etc."
            />
          </div>
        </CardContent>
      </Card>

      {/* Pricing & Capacity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Pricing & Capacity
          </CardTitle>
          <CardDescription>Set the pricing and capacity details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="seats">
                Number of Seats <span className="text-destructive">*</span>
              </Label>
              <Input
                id="seats"
                type="number"
                min="1"
                value={formData.seats}
                onChange={(e) => setFormData(prev => ({ ...prev, seats: Number(e.target.value) }))}
                className={errors.seats ? 'border-destructive' : ''}
              />
              {errors.seats && (
                <p className="text-xs text-destructive">{errors.seats}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="rent_per_seat">
                Rent Per Seat (₹/month) <span className="text-destructive">*</span>
              </Label>
              <Input
                id="rent_per_seat"
                type="number"
                min="0"
                value={formData.rent_per_seat}
                onChange={(e) => setFormData(prev => ({ ...prev, rent_per_seat: Number(e.target.value) }))}
                className={errors.rent_per_seat ? 'border-destructive' : ''}
              />
              {errors.rent_per_seat && (
                <p className="text-xs text-destructive">{errors.rent_per_seat}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">
                Total Room Price (₹/month) <span className="text-destructive">*</span>
              </Label>
              <Input
                id="price"
                type="number"
                min="0"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: Number(e.target.value) }))}
                className={errors.price ? 'border-destructive' : ''}
              />
              {errors.price && (
                <p className="text-xs text-destructive">{errors.price}</p>
              )}
            </div>
          </div>

          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Auto-calculated price: ₹{formData.seats * formData.rent_per_seat} 
              ({formData.seats} seats × ₹{formData.rent_per_seat})
              {formData.price !== formData.seats * formData.rent_per_seat && (
                <span className="text-warning ml-2">
                  (You've set a custom price)
                </span>
              )}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Amenities */}
      <Card>
        <CardHeader>
          <CardTitle>Room Amenities</CardTitle>
          <CardDescription>Select all amenities available in this room</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {COMMON_AMENITIES.map((amenity) => (
              <div
                key={amenity.id}
                className={`flex items-center space-x-2 p-3 rounded-lg border-2 transition-all ${
                  formData.amenities.includes(amenity.label)
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <Checkbox
                  id={`amenity-${amenity.id}`}
                  checked={formData.amenities.includes(amenity.label)}
                  onCheckedChange={() => handleAmenityToggle(amenity.id)}
                />
                <label
                  htmlFor={`amenity-${amenity.id}`}
                  className="text-sm font-medium leading-none cursor-pointer flex items-center gap-1"
                >
                  <span>{amenity.icon}</span>
                  <span>{amenity.label}</span>
                </label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Room Images */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            Room Images
          </CardTitle>
          <CardDescription>Add image URLs for the room (one URL per line)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="room-image-urls">Room Image URLs</Label>
            <p className="text-sm text-muted-foreground">Enter one image URL per line</p>
            <Textarea
              id="room-image-urls"
              placeholder="https://example.com/room1.jpg&#10;https://example.com/room2.jpg&#10;https://example.com/room3.jpg"
              value={formData.images.join('\n')}
              onChange={(e) => handleImageUrlsChange(e.target.value)}
              rows={6}
              className="font-mono text-sm"
            />
            <span className="text-sm text-muted-foreground">
              {imagePreview.length} image URL(s) added
            </span>
          </div>

          {imagePreview.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {imagePreview.map((url, index) => (
                <div key={index} className="relative group">
                  <img
                    src={url}
                    alt={`Room ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg border-2 border-border"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x200?text=Invalid+URL';
                    }}
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleRemoveImage(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <Badge className="absolute bottom-2 left-2" variant="secondary">
                    {index + 1}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Availability Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Availability Settings</CardTitle>
          <CardDescription>Configure room availability options</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2 p-4 rounded-lg border-2 border-border">
            <Checkbox
              id="short_term_available"
              checked={formData.short_term_available}
              onCheckedChange={(checked) => 
                setFormData(prev => ({ ...prev, short_term_available: checked as boolean }))
              }
            />
            <label
              htmlFor="short_term_available"
              className="text-sm font-medium leading-none cursor-pointer"
            >
              Available for Short Term Stay
            </label>
          </div>

          <div className="flex items-center space-x-2 p-4 rounded-lg border-2 border-border">
            <Checkbox
              id="is_available"
              checked={formData.is_available}
              onCheckedChange={(checked) => 
                setFormData(prev => ({ ...prev, is_available: checked as boolean }))
              }
            />
            <label
              htmlFor="is_available"
              className="text-sm font-medium leading-none cursor-pointer"
            >
              Room Available for Booking
            </label>
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* Form Actions */}
      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSaving}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSaving}>
          {isSaving ? 'Saving...' : room ? 'Update Room' : 'Create Room'}
        </Button>
      </div>
    </form>
  );
}
