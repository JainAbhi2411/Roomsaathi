import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMessCenterById } from '@/db/api';
import { createMessCenter, updateMessCenter } from '@/db/adminApi';
import { supabase } from '@/db/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Plus, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const MEAL_TYPES = ['breakfast', 'lunch', 'dinner', 'snacks'];
const CITIES = ['Sikar', 'Jaipur', 'Kota'];

export default function AdminMessForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    city: '',
    locality: '',
    latitude: 0,
    longitude: 0,
    contact_phone: '',
    contact_email: '',
    images: [] as string[],
    meal_types: [] as string[],
    pricing: {
      breakfast: 0,
      lunch: 0,
      dinner: 0,
      snacks: 0,
      monthly: 0
    },
    timings: {
      breakfast: '',
      lunch: '',
      dinner: '',
      snacks: ''
    },
    amenities: [] as string[],
    rating: 4.0,
    verified: false
  });

  const [newAmenity, setNewAmenity] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isEdit && id) {
      loadMessCenter();
    }
  }, [id]);

  const loadMessCenter = async () => {
    try {
      const data = await getMessCenterById(id!);
      if (data) {
        setFormData({
          name: data.name,
          description: data.description || '',
          address: data.address,
          city: data.city,
          locality: data.locality,
          latitude: data.latitude,
          longitude: data.longitude,
          contact_phone: data.contact_phone || '',
          contact_email: data.contact_email || '',
          images: data.images || [],
          meal_types: data.meal_types || [],
          pricing: {
            breakfast: data.pricing?.breakfast || 0,
            lunch: data.pricing?.lunch || 0,
            dinner: data.pricing?.dinner || 0,
            snacks: data.pricing?.snacks || 0,
            monthly: data.pricing?.monthly || 0
          },
          timings: {
            breakfast: data.timings?.breakfast || '',
            lunch: data.timings?.lunch || '',
            dinner: data.timings?.dinner || '',
            snacks: data.timings?.snacks || ''
          },
          amenities: data.amenities || [],
          rating: data.rating || 4.0,
          verified: data.verified || false
        });
      }
    } catch (error) {
      console.error('Error loading mess center:', error);
      toast({
        title: 'Error',
        description: 'Failed to load mess center',
        variant: 'destructive'
      });
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (1MB limit)
    if (file.size > 1024 * 1024) {
      toast({
        title: 'Error',
        description: 'File size must be less than 1MB',
        variant: 'destructive'
      });
      return;
    }

    try {
      setUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
      const filePath = `mess-images/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('property-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('property-images')
        .getPublicUrl(filePath);

      setFormData({ ...formData, images: [...formData.images, publicUrl] });
      toast({
        title: 'Success',
        description: 'Image uploaded successfully'
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to upload image',
        variant: 'destructive'
      });
    } finally {
      setUploading(false);
    }
  };

  const handleAddImageUrl = () => {
    if (newImageUrl.trim()) {
      setFormData({ ...formData, images: [...formData.images, newImageUrl.trim()] });
      setNewImageUrl('');
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index)
    });
  };

  const handleAddAmenity = () => {
    if (newAmenity.trim() && !formData.amenities.includes(newAmenity.trim())) {
      setFormData({ ...formData, amenities: [...formData.amenities, newAmenity.trim()] });
      setNewAmenity('');
    }
  };

  const handleRemoveAmenity = (amenity: string) => {
    setFormData({
      ...formData,
      amenities: formData.amenities.filter(a => a !== amenity)
    });
  };

  const handleMealTypeToggle = (mealType: string) => {
    if (formData.meal_types.includes(mealType)) {
      setFormData({
        ...formData,
        meal_types: formData.meal_types.filter(t => t !== mealType)
      });
    } else {
      setFormData({
        ...formData,
        meal_types: [...formData.meal_types, mealType]
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.name || !formData.address || !formData.city || !formData.locality) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields',
        variant: 'destructive'
      });
      return;
    }

    try {
      setSubmitting(true);
      const result = isEdit
        ? await updateMessCenter(id!, formData)
        : await createMessCenter(formData);

      if (result.success) {
        toast({
          title: 'Success',
          description: `Mess center ${isEdit ? 'updated' : 'created'} successfully`
        });
        navigate('/admin/mess');
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || `Failed to ${isEdit ? 'update' : 'create'} mess center`,
        variant: 'destructive'
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate('/admin/mess')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold">{isEdit ? 'Edit' : 'Add'} Mess Center</h1>
          <p className="text-muted-foreground">
            {isEdit ? 'Update mess center details' : 'Create a new mess center'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Mess Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter mess name"
                  required
                />
              </div>

              <div>
                <Label htmlFor="contact_phone">Contact Phone</Label>
                <Input
                  id="contact_phone"
                  value={formData.contact_phone}
                  onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                  placeholder="+91 9876543210"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter mess description"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="contact_email">Contact Email</Label>
              <Input
                id="contact_email"
                type="email"
                value={formData.contact_email}
                onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                placeholder="contact@mess.com"
              />
            </div>
          </CardContent>
        </Card>

        {/* Location */}
        <Card>
          <CardHeader>
            <CardTitle>Location Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="address">Address *</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Enter full address"
                required
              />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city">City *</Label>
                <Select value={formData.city} onValueChange={(value) => setFormData({ ...formData, city: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select city" />
                  </SelectTrigger>
                  <SelectContent>
                    {CITIES.map(city => (
                      <SelectItem key={city} value={city}>
                        {city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="locality">Locality *</Label>
                <Input
                  id="locality"
                  value={formData.locality}
                  onChange={(e) => setFormData({ ...formData, locality: e.target.value })}
                  placeholder="Enter locality"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="latitude">Latitude</Label>
                <Input
                  id="latitude"
                  type="number"
                  step="0.000001"
                  value={formData.latitude}
                  onChange={(e) => setFormData({ ...formData, latitude: parseFloat(e.target.value) || 0 })}
                  placeholder="27.6119"
                />
              </div>

              <div>
                <Label htmlFor="longitude">Longitude</Label>
                <Input
                  id="longitude"
                  type="number"
                  step="0.000001"
                  value={formData.longitude}
                  onChange={(e) => setFormData({ ...formData, longitude: parseFloat(e.target.value) || 0 })}
                  placeholder="75.1397"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Meal Types & Pricing */}
        <Card>
          <CardHeader>
            <CardTitle>Meal Types & Pricing</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Meal Types Available</Label>
              <div className="flex flex-wrap gap-4 mt-2">
                {MEAL_TYPES.map(type => (
                  <div key={type} className="flex items-center space-x-2">
                    <Checkbox
                      id={type}
                      checked={formData.meal_types.includes(type)}
                      onCheckedChange={() => handleMealTypeToggle(type)}
                    />
                    <label htmlFor={type} className="text-sm capitalize cursor-pointer">
                      {type}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 xl:grid-cols-5 gap-4">
              <div>
                <Label htmlFor="price_breakfast">Breakfast (₹)</Label>
                <Input
                  id="price_breakfast"
                  type="number"
                  value={formData.pricing.breakfast}
                  onChange={(e) => setFormData({
                    ...formData,
                    pricing: { ...formData.pricing, breakfast: parseFloat(e.target.value) || 0 }
                  })}
                />
              </div>

              <div>
                <Label htmlFor="price_lunch">Lunch (₹)</Label>
                <Input
                  id="price_lunch"
                  type="number"
                  value={formData.pricing.lunch}
                  onChange={(e) => setFormData({
                    ...formData,
                    pricing: { ...formData.pricing, lunch: parseFloat(e.target.value) || 0 }
                  })}
                />
              </div>

              <div>
                <Label htmlFor="price_dinner">Dinner (₹)</Label>
                <Input
                  id="price_dinner"
                  type="number"
                  value={formData.pricing.dinner}
                  onChange={(e) => setFormData({
                    ...formData,
                    pricing: { ...formData.pricing, dinner: parseFloat(e.target.value) || 0 }
                  })}
                />
              </div>

              <div>
                <Label htmlFor="price_snacks">Snacks (₹)</Label>
                <Input
                  id="price_snacks"
                  type="number"
                  value={formData.pricing.snacks}
                  onChange={(e) => setFormData({
                    ...formData,
                    pricing: { ...formData.pricing, snacks: parseFloat(e.target.value) || 0 }
                  })}
                />
              </div>

              <div>
                <Label htmlFor="price_monthly">Monthly (₹)</Label>
                <Input
                  id="price_monthly"
                  type="number"
                  value={formData.pricing.monthly}
                  onChange={(e) => setFormData({
                    ...formData,
                    pricing: { ...formData.pricing, monthly: parseFloat(e.target.value) || 0 }
                  })}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Timings */}
        <Card>
          <CardHeader>
            <CardTitle>Meal Timings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="timing_breakfast">Breakfast Timing</Label>
                <Input
                  id="timing_breakfast"
                  value={formData.timings.breakfast}
                  onChange={(e) => setFormData({
                    ...formData,
                    timings: { ...formData.timings, breakfast: e.target.value }
                  })}
                  placeholder="7:00 AM - 10:00 AM"
                />
              </div>

              <div>
                <Label htmlFor="timing_lunch">Lunch Timing</Label>
                <Input
                  id="timing_lunch"
                  value={formData.timings.lunch}
                  onChange={(e) => setFormData({
                    ...formData,
                    timings: { ...formData.timings, lunch: e.target.value }
                  })}
                  placeholder="12:00 PM - 3:00 PM"
                />
              </div>

              <div>
                <Label htmlFor="timing_dinner">Dinner Timing</Label>
                <Input
                  id="timing_dinner"
                  value={formData.timings.dinner}
                  onChange={(e) => setFormData({
                    ...formData,
                    timings: { ...formData.timings, dinner: e.target.value }
                  })}
                  placeholder="7:00 PM - 10:00 PM"
                />
              </div>

              <div>
                <Label htmlFor="timing_snacks">Snacks Timing</Label>
                <Input
                  id="timing_snacks"
                  value={formData.timings.snacks}
                  onChange={(e) => setFormData({
                    ...formData,
                    timings: { ...formData.timings, snacks: e.target.value }
                  })}
                  placeholder="4:00 PM - 7:00 PM"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Images */}
        <Card>
          <CardHeader>
            <CardTitle>Images</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="image_upload">Upload Image</Label>
              <Input
                id="image_upload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading}
              />
            </div>

            <div>
              <Label htmlFor="image_url">Or Add Image URL</Label>
              <div className="flex gap-2">
                <Input
                  id="image_url"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                />
                <Button type="button" onClick={handleAddImageUrl}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {formData.images.length > 0 && (
              <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                {formData.images.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image}
                      alt={`Mess ${index + 1}`}
                      className="w-full h-32 object-cover rounded"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleRemoveImage(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Amenities */}
        <Card>
          <CardHeader>
            <CardTitle>Amenities</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={newAmenity}
                onChange={(e) => setNewAmenity(e.target.value)}
                placeholder="Enter amenity"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddAmenity())}
              />
              <Button type="button" onClick={handleAddAmenity}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            {formData.amenities.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.amenities.map((amenity, index) => (
                  <Badge key={index} variant="secondary" className="gap-2">
                    {amenity}
                    <X
                      className="w-3 h-3 cursor-pointer"
                      onClick={() => handleRemoveAmenity(amenity)}
                    />
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Status */}
        <Card>
          <CardHeader>
            <CardTitle>Status & Rating</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="rating">Rating (0-5)</Label>
                <Input
                  id="rating"
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  value={formData.rating}
                  onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) || 0 })}
                />
              </div>

              <div className="flex items-center space-x-2 pt-8">
                <Checkbox
                  id="verified"
                  checked={formData.verified}
                  onCheckedChange={(checked) => setFormData({ ...formData, verified: checked as boolean })}
                />
                <label htmlFor="verified" className="text-sm font-medium cursor-pointer">
                  RoomSaathi Verified
                </label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex gap-4">
          <Button type="submit" disabled={submitting} className="flex-1">
            {submitting ? 'Saving...' : isEdit ? 'Update Mess Center' : 'Create Mess Center'}
          </Button>
          <Button type="button" variant="outline" onClick={() => navigate('/admin/mess')}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
