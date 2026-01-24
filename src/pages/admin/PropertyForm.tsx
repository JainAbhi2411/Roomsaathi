import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ArrowLeft, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { createProperty, updateProperty, getAllPropertiesAdmin } from '@/db/adminApi';
import { useToast } from '@/hooks/use-toast';
import { useEffect } from 'react';
import type { Property } from '@/types/index';

export default function PropertyForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const isEdit = !!id;

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: 'PG' as Property['type'],
    city: 'Sikar' as Property['city'],
    locality: '',
    address: '',
    price_from: 0,
    price_to: 0,
    description: '',
    verified: false,
    images: [] as string[],
    availability_status: 'available'
  });

  useEffect(() => {
    if (isEdit && id) {
      loadProperty();
    }
  }, [id, isEdit]);

  const loadProperty = async () => {
    const properties = await getAllPropertiesAdmin();
    const property = properties.find(p => p.id === id);
    if (property) {
      setFormData({
        name: property.name,
        type: property.type,
        city: property.city,
        locality: property.locality,
        address: property.address,
        price_from: property.price_from,
        price_to: property.price_to || 0,
        description: property.description || '',
        verified: property.verified || false,
        images: property.images || [],
        availability_status: property.availability_status || 'available'
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = isEdit
        ? await updateProperty(id!, formData)
        : await createProperty(formData as any);

      if (result.success) {
        toast({
          title: 'Success',
          description: `Property ${isEdit ? 'updated' : 'created'} successfully`
        });
        navigate('/admin/properties');
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Failed to save property',
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAmenityToggle = (amenity: string) => {
    // Amenities will be managed separately through the amenities table
    // For now, we'll skip this functionality
  };

  const handleImagesChange = (value: string) => {
    const urls = value.split('\n').map(url => url.trim()).filter(url => url);
    setFormData(prev => ({ ...prev, images: urls }));
  };

  const commonAmenities = [
    'WiFi', 'AC', 'Parking', 'Laundry', 'Kitchen', 'TV', 'Gym', 'Security',
    'Power Backup', 'Water Supply', 'Furnished', 'Semi-Furnished'
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/admin/properties')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {isEdit ? 'Edit Property' : 'Add New Property'}
          </h1>
          <p className="text-muted-foreground">
            {isEdit ? 'Update property details' : 'Create a new property listing'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Property Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 @md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Property Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Property Type *</Label>
                <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value as Property['type'] }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PG">PG</SelectItem>
                    <SelectItem value="Flat">Flat</SelectItem>
                    <SelectItem value="Apartment">Apartment</SelectItem>
                    <SelectItem value="Room">Room</SelectItem>
                    <SelectItem value="Hostel">Hostel</SelectItem>
                    <SelectItem value="Short Term Stay">Short Term Stay</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">City *</Label>
                <Select value={formData.city} onValueChange={(value) => setFormData(prev => ({ ...prev, city: value as Property['city'] }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Sikar">Sikar</SelectItem>
                    <SelectItem value="Jaipur">Jaipur</SelectItem>
                    <SelectItem value="Kota">Kota</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="locality">Locality *</Label>
                <Input
                  id="locality"
                  value={formData.locality}
                  onChange={(e) => setFormData(prev => ({ ...prev, locality: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price_from">Price From (₹/month) *</Label>
                <Input
                  id="price_from"
                  type="number"
                  value={formData.price_from}
                  onChange={(e) => setFormData(prev => ({ ...prev, price_from: Number(e.target.value) }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price_to">Price To (₹/month)</Label>
                <Input
                  id="price_to"
                  type="number"
                  value={formData.price_to}
                  onChange={(e) => setFormData(prev => ({ ...prev, price_to: Number(e.target.value) }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Full Address *</Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                rows={2}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={4}
                placeholder="Describe the property..."
              />
            </div>

            {/* Amenities - Note: These should be managed in amenities table */}
            <div className="space-y-2">
              <Label>Amenities (Managed separately via amenities table)</Label>
              <p className="text-sm text-muted-foreground">
                Amenities are managed through the amenities table. Add them after creating the property.
              </p>
            </div>

            {/* Images */}
            <div className="space-y-2">
              <Label htmlFor="images">Image URLs (one per line)</Label>
              <Textarea
                id="images"
                value={formData.images.join('\n')}
                onChange={(e) => handleImagesChange(e.target.value)}
                rows={5}
                placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
              />
            </div>

            {/* Checkboxes */}
            <div className="flex gap-6">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="verified"
                  checked={formData.verified}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, verified: checked as boolean }))}
                />
                <label htmlFor="verified" className="text-sm cursor-pointer">
                  RoomSaathi Verified
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="available"
                  checked={formData.availability_status === 'available'}
                  onCheckedChange={(checked) => setFormData(prev => ({ 
                    ...prev, 
                    availability_status: checked ? 'available' : 'unavailable' 
                  }))}
                />
                <label htmlFor="available" className="text-sm cursor-pointer">
                  Available
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => navigate('/admin/properties')}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                <Save className="mr-2 h-4 w-4" />
                {isLoading ? 'Saving...' : isEdit ? 'Update Property' : 'Create Property'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
