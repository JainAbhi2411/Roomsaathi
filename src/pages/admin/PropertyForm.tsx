import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ArrowLeft, Save, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { createProperty, updateProperty, getAllPropertiesAdmin, bulkCreatePropertyPolicies, bulkDeletePropertyPolicies } from '@/db/adminApi';
import { getPoliciesByPropertyId } from '@/db/api';
import { useToast } from '@/hooks/use-toast';
import { useEffect } from 'react';
import type { Property, PropertyPolicy } from '@/types/index';

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
    offer_price: 0,
    description: '',
    verified: false,
    images: [] as string[],
    video_url: '',
    contact_phone: '',
    contact_email: '',
    owner_name: '',
    owner_details: '',
    availability_status: 'available',
    accommodation_type: '',
    suitable_for: [] as string[],
    latitude: undefined as number | undefined,
    longitude: undefined as number | undefined,
    total_floors: 1,
    rooms_per_floor: 1
  });

  const [policies, setPolicies] = useState<Array<Omit<PropertyPolicy, 'id' | 'property_id' | 'created_at' | 'updated_at'>>>([
    { policy_title: 'Check-in & Check-out', policy_description: '', policy_icon: 'Clock', display_order: 1 },
    { policy_title: 'Guest Policy', policy_description: '', policy_icon: 'Users', display_order: 2 },
    { policy_title: 'Payment Terms', policy_description: '', policy_icon: 'CreditCard', display_order: 3 },
  ]);

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
        offer_price: property.offer_price || 0,
        description: property.description || '',
        verified: property.verified || false,
        images: property.images || [],
        video_url: property.video_url || '',
        contact_phone: property.contact_phone || '',
        contact_email: property.contact_email || '',
        owner_name: property.owner_name || '',
        owner_details: property.owner_details || '',
        availability_status: property.availability_status || 'available',
        accommodation_type: property.accommodation_type || '',
        suitable_for: property.suitable_for || [],
        latitude: property.latitude,
        longitude: property.longitude,
        total_floors: property.total_floors || 1,
        rooms_per_floor: property.rooms_per_floor || 1
      });

      // Load existing policies
      try {
        const existingPolicies = await getPoliciesByPropertyId(id!);
        if (existingPolicies.length > 0) {
          setPolicies(existingPolicies.map(p => ({
            policy_title: p.policy_title,
            policy_description: p.policy_description,
            policy_icon: p.policy_icon,
            display_order: p.display_order
          })));
        }
      } catch (error) {
        console.error('Error loading policies:', error);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let propertyId: string | undefined;

      if (isEdit) {
        const result = await updateProperty(id!, formData);
        if (!result.success) {
          toast({
            title: 'Error',
            description: result.error || 'Failed to update property',
            variant: 'destructive'
          });
          return;
        }
        propertyId = id!;
      } else {
        const result = await createProperty(formData as any);
        if (!result.success) {
          toast({
            title: 'Error',
            description: result.error || 'Failed to create property',
            variant: 'destructive'
          });
          return;
        }
        propertyId = result.data?.id;
      }

      // Save policies if property was created or updated
      if (propertyId && policies.length > 0) {
        // Delete existing policies and create new ones
        await bulkDeletePropertyPolicies(propertyId);
        
        const policiesToCreate = policies
          .filter(p => p.policy_title && p.policy_description)
          .map((p, index) => ({
            property_id: propertyId!,
            policy_title: p.policy_title,
            policy_description: p.policy_description,
            policy_icon: p.policy_icon || '',
            display_order: index + 1
          }));

        if (policiesToCreate.length > 0) {
          await bulkCreatePropertyPolicies(policiesToCreate);
        }
      }

      toast({
        title: 'Success',
        description: `Property ${isEdit ? 'updated' : 'created'} successfully${!isEdit ? '. You can now add room details from the Room Management section.' : ''}`,
        duration: 5000
      });
      
      // Navigate to room management if creating new property, otherwise back to properties list
      if (!isEdit && propertyId) {
        setTimeout(() => {
          navigate(`/admin/rooms?property=${propertyId}`);
        }, 1500);
      } else {
        navigate('/admin/properties');
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

  const addPolicy = () => {
    setPolicies(prev => [...prev, {
      policy_title: '',
      policy_description: '',
      policy_icon: 'FileText',
      display_order: prev.length + 1
    }]);
  };

  const removePolicy = (index: number) => {
    setPolicies(prev => prev.filter((_, i) => i !== index));
  };

  const updatePolicy = (index: number, field: string, value: string) => {
    setPolicies(prev => prev.map((policy, i) => 
      i === index ? { ...policy, [field]: value } : policy
    ));
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

              <div className="space-y-2">
                <Label htmlFor="offer_price">Offer Price (₹/month)</Label>
                <Input
                  id="offer_price"
                  type="number"
                  value={formData.offer_price}
                  onChange={(e) => setFormData(prev => ({ ...prev, offer_price: Number(e.target.value) }))}
                  placeholder="Special offer price (optional)"
                />
                <p className="text-xs text-muted-foreground">
                  Set a special offer price lower than the regular price to show discount badge
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="total_floors">Total Floors *</Label>
                <Input
                  id="total_floors"
                  type="number"
                  min="1"
                  value={formData.total_floors}
                  onChange={(e) => setFormData(prev => ({ ...prev, total_floors: Number(e.target.value) }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="rooms_per_floor">Rooms Per Floor *</Label>
                <Input
                  id="rooms_per_floor"
                  type="number"
                  min="1"
                  value={formData.rooms_per_floor}
                  onChange={(e) => setFormData(prev => ({ ...prev, rooms_per_floor: Number(e.target.value) }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Total Rooms</Label>
                <div className="p-3 bg-muted rounded-md">
                  <p className="text-lg font-semibold text-foreground">
                    {formData.total_floors * formData.rooms_per_floor} rooms
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Calculated: {formData.total_floors} floors × {formData.rooms_per_floor} rooms/floor
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="accommodation_type">Accommodation Type</Label>
                <Select 
                  value={formData.accommodation_type} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, accommodation_type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select accommodation type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Boys">Boys</SelectItem>
                    <SelectItem value="Girls">Girls</SelectItem>
                    <SelectItem value="Co-living">Co-living</SelectItem>
                    <SelectItem value="Family">Family</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="video_url">Video URL</Label>
                <Input
                  id="video_url"
                  type="url"
                  value={formData.video_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, video_url: e.target.value }))}
                  placeholder="https://youtube.com/watch?v=..."
                />
                <p className="text-xs text-muted-foreground">
                  YouTube or other video platform URL
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="latitude">Latitude</Label>
                <Input
                  id="latitude"
                  type="number"
                  step="any"
                  value={formData.latitude || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, latitude: e.target.value ? Number(e.target.value) : undefined }))}
                  placeholder="27.6172"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="longitude">Longitude</Label>
                <Input
                  id="longitude"
                  type="number"
                  step="any"
                  value={formData.longitude || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, longitude: e.target.value ? Number(e.target.value) : undefined }))}
                  placeholder="75.1389"
                />
              </div>
            </div>

            {/* Suitable For - Multi-select */}
            <div className="space-y-2">
              <Label>Suitable For</Label>
              <div className="grid grid-cols-2 @md:grid-cols-4 gap-3">
                {['Students', 'Working Professionals', 'Families', 'Bachelors'].map((type) => (
                  <div key={type} className="flex items-center space-x-2">
                    <Checkbox
                      id={`suitable-${type}`}
                      checked={formData.suitable_for.includes(type)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setFormData(prev => ({ ...prev, suitable_for: [...prev.suitable_for, type] }));
                        } else {
                          setFormData(prev => ({ ...prev, suitable_for: prev.suitable_for.filter(t => t !== type) }));
                        }
                      }}
                    />
                    <label htmlFor={`suitable-${type}`} className="text-sm cursor-pointer">
                      {type}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-3">Contact Information</h3>
              </div>
              <div className="grid grid-cols-1 @md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="owner_name">Owner/Manager Name</Label>
                  <Input
                    id="owner_name"
                    value={formData.owner_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, owner_name: e.target.value }))}
                    placeholder="John Doe"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact_phone">Contact Phone</Label>
                  <Input
                    id="contact_phone"
                    type="tel"
                    value={formData.contact_phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, contact_phone: e.target.value }))}
                    placeholder="+91 98765 43210"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact_email">Contact Email</Label>
                  <Input
                    id="contact_email"
                    type="email"
                    value={formData.contact_email}
                    onChange={(e) => setFormData(prev => ({ ...prev, contact_email: e.target.value }))}
                    placeholder="owner@example.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="owner_details">Owner Details</Label>
                  <Textarea
                    id="owner_details"
                    value={formData.owner_details}
                    onChange={(e) => setFormData(prev => ({ ...prev, owner_details: e.target.value }))}
                    rows={2}
                    placeholder="Additional owner information..."
                  />
                </div>
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
              <div className="p-4 bg-muted/50 border border-border rounded-lg">
                <h3 className="font-semibold mb-2">📝 Important Notes</h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• <strong>Amenities:</strong> Managed separately via the amenities table after property creation</li>
                  <li>• <strong>Room Details:</strong> Add individual room specifications using the "Room Management" section after creating the property</li>
                  <li>• <strong>Images:</strong> Provide direct URLs to property images (one per line)</li>
                  <li>• <strong>Location:</strong> Add latitude/longitude for map integration (optional but recommended)</li>
                </ul>
              </div>
            </div>

            {/* Property Policies */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Property Policies</Label>
                  <p className="text-sm text-muted-foreground">
                    Add property-specific policies and rules for guests
                  </p>
                </div>
                <Button type="button" variant="outline" size="sm" onClick={addPolicy}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Policy
                </Button>
              </div>

              <div className="space-y-4">
                {policies.map((policy, index) => (
                  <Card key={index} className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 space-y-3">
                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-2">
                              <Label htmlFor={`policy-title-${index}`}>Policy Title</Label>
                              <Input
                                id={`policy-title-${index}`}
                                value={policy.policy_title}
                                onChange={(e) => updatePolicy(index, 'policy_title', e.target.value)}
                                placeholder="e.g., Check-in & Check-out"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`policy-icon-${index}`}>Icon Name (optional)</Label>
                              <Input
                                id={`policy-icon-${index}`}
                                value={policy.policy_icon || ''}
                                onChange={(e) => updatePolicy(index, 'policy_icon', e.target.value)}
                                placeholder="e.g., Clock, Users, Shield"
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`policy-description-${index}`}>Policy Description</Label>
                            <Textarea
                              id={`policy-description-${index}`}
                              value={policy.policy_description}
                              onChange={(e) => updatePolicy(index, 'policy_description', e.target.value)}
                              rows={3}
                              placeholder="Describe the policy in detail..."
                            />
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removePolicy(index)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {policies.length === 0 && (
                <div className="text-center py-8 border-2 border-dashed rounded-lg">
                  <p className="text-sm text-muted-foreground mb-2">No policies added yet</p>
                  <Button type="button" variant="outline" size="sm" onClick={addPolicy}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Your First Policy
                  </Button>
                </div>
              )}
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
