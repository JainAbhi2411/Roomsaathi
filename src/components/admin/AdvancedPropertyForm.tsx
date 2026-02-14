import { useState, useEffect } from 'react';
import { 
  Trash2, Plus, MapPin, Info, Building, Users, 
  IndianRupee, Image as ImageIcon, Video, Phone, Mail, 
  User, FileText, Settings, Eye, Home, Maximize
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/db/supabase';
import { useToast } from '@/hooks/use-toast';
import type { Property } from '@/types/index';

interface AdvancedPropertyFormProps {
  property?: Property | null;
  onSave: (propertyData: any) => Promise<void>;
  onCancel: () => void;
  hideButtons?: boolean;
}

const PROPERTY_TYPES: Property['type'][] = ['PG', 'Flat', 'Apartment', 'Room', 'Hostel', 'Short Term Stay'];
const CITIES: Property['city'][] = ['Sikar', 'Jaipur', 'Kota'];
const ACCOMMODATION_TYPES = ['Boys', 'Girls', 'Co-living'];
const SUITABLE_FOR_OPTIONS = ['Students', 'Working Professionals', 'Families', 'Bachelors', 'Couples'];
const AVAILABILITY_STATUSES = ['Available', 'Partially Available', 'Fully Occupied', 'Coming Soon'];

// Locality data for each city
const LOCALITIES: Record<Property['city'], string[]> = {
  'Sikar': ['Fatehpur', 'Piprali Road', 'Station Road', 'Devipura', 'Kanwat Road', 'Bypass Road', 'Other'],
  'Jaipur': ['Malviya Nagar', 'Vaishali Nagar', 'Mansarovar', 'Jagatpura', 'Pratap Nagar', 'C-Scheme', 'Other'],
  'Kota': ['Dadabari', 'Talwandi', 'Vigyan Nagar', 'Mahaveer Nagar', 'Gumanpura', 'Aerodrome Circle', 'Other']
};

export default function AdvancedPropertyForm({ 
  property, 
  onSave, 
  onCancel,
  hideButtons = false
}: AdvancedPropertyFormProps) {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: property?.name || '',
    type: property?.type || 'PG' as Property['type'],
    city: property?.city || 'Sikar' as Property['city'],
    locality: property?.locality || '',
    address: property?.address || '',
    state: property?.state || 'Rajasthan',
    pincode: property?.pincode || '',
    price_from: property?.price_from || 0,
    price_to: property?.price_to || 0,
    offer_price: property?.offer_price || 0,
    description: property?.description || '',
    verified: property?.verified || false,
    published: property?.published || false,
    images: property?.images || [],
    video_url: property?.video_url || '',
    contact_phone: property?.contact_phone || '',
    contact_email: property?.contact_email || '',
    owner_name: property?.owner_name || '',
    owner_details: property?.owner_details || '',
    availability_status: property?.availability_status || 'Available',
    accommodation_type: property?.accommodation_type || '',
    suitable_for: property?.suitable_for || [],
    property_size: property?.property_size || 0,
    food_included: property?.food_included || false,
    latitude: property?.latitude || undefined,
    longitude: property?.longitude || undefined,
    total_floors: property?.total_floors || 1,
    rooms_per_floor: property?.rooms_per_floor || 1,
    
    // Flat & Apartment specific
    bedrooms: property?.bedrooms || undefined,
    bathrooms: property?.bathrooms || undefined,
    balconies: property?.balconies || undefined,
    floor_number: property?.floor_number || undefined,
    furnishing_status: property?.furnishing_status || undefined,
    parking_type: property?.parking_type || undefined,
    carpet_area: property?.carpet_area || undefined,
    built_up_area: property?.built_up_area || undefined,
    property_age: property?.property_age || undefined,
    facing_direction: property?.facing_direction || undefined,
    lift_available: property?.lift_available || false,
    power_backup: property?.power_backup || false,
    water_supply: property?.water_supply || undefined,
    maintenance_charges: property?.maintenance_charges || undefined,
    security_deposit_months: property?.security_deposit_months || undefined,
    
    // PG specific
    gender_preference: property?.gender_preference || undefined,
    sharing_type: property?.sharing_type || undefined,
    meal_options: property?.meal_options || [],
    meal_charges: property?.meal_charges || undefined,
    room_type: property?.room_type || undefined,
    attached_bathroom: property?.attached_bathroom || false,
    laundry_service: property?.laundry_service || false,
    notice_period_days: property?.notice_period_days || undefined,
    lock_in_period_months: property?.lock_in_period_months || undefined,
    gate_closing_time: property?.gate_closing_time || '',
    visitor_policy: property?.visitor_policy || undefined,
    
    // Hostel specific
    total_capacity: property?.total_capacity || undefined,
    current_occupancy: property?.current_occupancy || undefined,
    hostel_gender: property?.hostel_gender || undefined,
    meal_plans: property?.meal_plans || [],
    room_types_available: property?.room_types_available || [],
    warden_available: property?.warden_available || false,
    study_room: property?.study_room || false,
    common_area: property?.common_area || false,
    security_hours: property?.security_hours || undefined,
    
    // Room specific
    kitchen_access: property?.kitchen_access || false,
    separate_entrance: property?.separate_entrance || false,
    
    // Short Term Stay specific
    min_stay_duration: property?.min_stay_duration || undefined,
    max_stay_duration: property?.max_stay_duration || undefined,
    daily_rate: property?.daily_rate || undefined,
    weekly_rate: property?.weekly_rate || undefined,
    monthly_rate: property?.monthly_rate || undefined,
    cancellation_policy: property?.cancellation_policy || undefined,
    check_in_time: property?.check_in_time || '',
    check_out_time: property?.check_out_time || '',
    cleaning_service: property?.cleaning_service || undefined,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imagePreview, setImagePreview] = useState<string[]>(formData.images);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Required fields
    if (!formData.name.trim()) {
      newErrors.name = 'Property name is required';
    }
    if (!formData.locality.trim()) {
      newErrors.locality = 'Locality is required';
    }
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    if (formData.price_from <= 0) {
      newErrors.price_from = 'Starting price must be greater than 0';
    }
    if (formData.price_to && formData.price_to < formData.price_from) {
      newErrors.price_to = 'Maximum price must be greater than or equal to starting price';
    }
    if (formData.offer_price && formData.offer_price >= formData.price_from) {
      newErrors.offer_price = 'Offer price must be less than starting price';
    }
    if (formData.total_floors < 1) {
      newErrors.total_floors = 'Total floors must be at least 1';
    }
    if (formData.rooms_per_floor < 1) {
      newErrors.rooms_per_floor = 'Rooms per floor must be at least 1';
    }

    // Contact validation
    if (formData.contact_phone && !/^[0-9]{10}$/.test(formData.contact_phone.replace(/\s/g, ''))) {
      newErrors.contact_phone = 'Phone number must be 10 digits';
    }
    if (formData.contact_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contact_email)) {
      newErrors.contact_email = 'Invalid email format';
    }

    // Location validation
    if (formData.latitude && (formData.latitude < -90 || formData.latitude > 90)) {
      newErrors.latitude = 'Latitude must be between -90 and 90';
    }
    if (formData.longitude && (formData.longitude < -180 || formData.longitude > 180)) {
      newErrors.longitude = 'Longitude must be between -180 and 180';
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

  const handleSuitableForToggle = (option: string) => {
    setFormData(prev => {
      const suitable_for = prev.suitable_for.includes(option)
        ? prev.suitable_for.filter(s => s !== option)
        : [...prev.suitable_for, option];
      return { ...prev, suitable_for };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('AdvancedPropertyForm: handleSubmit called', { hideButtons, property: property?.id });

    if (!validateForm()) {
      console.log('AdvancedPropertyForm: Validation failed');
      toast({
        title: 'Validation Error',
        description: 'Please fix the errors in the form',
        variant: 'destructive',
      });
      return;
    }

    console.log('AdvancedPropertyForm: Validation passed, saving...');
    setIsSaving(true);

    try {
      // Clean up data before saving - remove undefined/null values for optional fields
      const cleanedData: any = {
        ...formData,
        price_to: formData.price_to || null,
        offer_price: formData.offer_price || null,
        property_size: formData.property_size || null,
        latitude: formData.latitude || null,
        longitude: formData.longitude || null,
        pincode: formData.pincode || null,
        video_url: formData.video_url || null,
        contact_phone: formData.contact_phone || null,
        contact_email: formData.contact_email || null,
        owner_name: formData.owner_name || null,
        owner_details: formData.owner_details || null,
        accommodation_type: formData.accommodation_type || null,
        
        // Flat & Apartment specific
        bedrooms: formData.bedrooms || null,
        bathrooms: formData.bathrooms || null,
        balconies: formData.balconies || null,
        floor_number: formData.floor_number || null,
        furnishing_status: formData.furnishing_status || null,
        parking_type: formData.parking_type || null,
        carpet_area: formData.carpet_area || null,
        built_up_area: formData.built_up_area || null,
        property_age: formData.property_age || null,
        facing_direction: formData.facing_direction || null,
        water_supply: formData.water_supply || null,
        maintenance_charges: formData.maintenance_charges || null,
        security_deposit_months: formData.security_deposit_months || null,
        
        // PG specific
        gender_preference: formData.gender_preference || null,
        sharing_type: formData.sharing_type || null,
        meal_options: formData.meal_options?.length ? formData.meal_options : null,
        meal_charges: formData.meal_charges || null,
        room_type: formData.room_type || null,
        notice_period_days: formData.notice_period_days || null,
        lock_in_period_months: formData.lock_in_period_months || null,
        gate_closing_time: formData.gate_closing_time || null,
        visitor_policy: formData.visitor_policy || null,
        
        // Hostel specific
        total_capacity: formData.total_capacity || null,
        current_occupancy: formData.current_occupancy || null,
        hostel_gender: formData.hostel_gender || null,
        meal_plans: formData.meal_plans?.length ? formData.meal_plans : null,
        room_types_available: formData.room_types_available?.length ? formData.room_types_available : null,
        security_hours: formData.security_hours || null,
        
        // Short Term Stay specific
        min_stay_duration: formData.min_stay_duration || null,
        max_stay_duration: formData.max_stay_duration || null,
        daily_rate: formData.daily_rate || null,
        weekly_rate: formData.weekly_rate || null,
        monthly_rate: formData.monthly_rate || null,
        cancellation_policy: formData.cancellation_policy || null,
        check_in_time: formData.check_in_time || null,
        check_out_time: formData.check_out_time || null,
        cleaning_service: formData.cleaning_service || null,
      };

      console.log('AdvancedPropertyForm: Calling onSave with cleaned data');
      await onSave(cleanedData);
      console.log('AdvancedPropertyForm: onSave completed successfully');

      // Only show toast if not in wizard mode (hideButtons = false)
      if (!hideButtons) {
        toast({
          title: 'Success',
          description: property ? 'Property updated successfully' : 'Property created successfully',
        });
      }
    } catch (error: any) {
      console.error('AdvancedPropertyForm: Error saving property:', error);
      // Always show error toast
      toast({
        title: 'Error',
        description: error.message || 'Failed to save property',
        variant: 'destructive',
      });
    } finally {
      console.log('AdvancedPropertyForm: Setting isSaving to false');
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Basic Information
          </CardTitle>
          <CardDescription>Enter the basic details of the property</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">
              Property Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., Green Valley PG, Sunrise Apartments"
              className={errors.name ? 'border-destructive' : ''}
            />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">
                Property Type <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData(prev => ({ ...prev, type: value as Property['type'] }))}
              >
                <SelectTrigger id="type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PROPERTY_TYPES.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="accommodation_type">Accommodation Type</Label>
              <Select
                value={formData.accommodation_type}
                onValueChange={(value) => setFormData(prev => ({ ...prev, accommodation_type: value }))}
              >
                <SelectTrigger id="accommodation_type">
                  <SelectValue placeholder="Select accommodation type" />
                </SelectTrigger>
                <SelectContent>
                  {ACCOMMODATION_TYPES.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="property_size">
                Property Size (sq ft)
              </Label>
              <Input
                id="property_size"
                type="number"
                min="0"
                value={formData.property_size || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, property_size: Number(e.target.value) }))}
                placeholder="e.g., 1200"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">
              Description <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={4}
              placeholder="Describe the property, its features, and what makes it special..."
              className={errors.description ? 'border-destructive' : ''}
            />
            {errors.description && (
              <p className="text-xs text-destructive">{errors.description}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Location Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Location Information
          </CardTitle>
          <CardDescription>Specify the property location details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">
                City <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.city}
                onValueChange={(value) => setFormData(prev => ({ ...prev, city: value as Property['city'], locality: '' }))}
              >
                <SelectTrigger id="city">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CITIES.map(city => (
                    <SelectItem key={city} value={city}>{city}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="locality">
                Locality <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.locality}
                onValueChange={(value) => setFormData(prev => ({ ...prev, locality: value }))}
              >
                <SelectTrigger id="locality" className={errors.locality ? 'border-destructive' : ''}>
                  <SelectValue placeholder="Select locality" />
                </SelectTrigger>
                <SelectContent>
                  {LOCALITIES[formData.city].map(locality => (
                    <SelectItem key={locality} value={locality}>{locality}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.locality && (
                <p className="text-xs text-destructive">{errors.locality}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">
              Complete Address <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
              rows={2}
              placeholder="Enter complete address with landmarks"
              className={errors.address ? 'border-destructive' : ''}
            />
            {errors.address && (
              <p className="text-xs text-destructive">{errors.address}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                value={formData.state}
                onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
                placeholder="Rajasthan"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pincode">Pincode</Label>
              <Input
                id="pincode"
                value={formData.pincode}
                onChange={(e) => setFormData(prev => ({ ...prev, pincode: e.target.value }))}
                placeholder="e.g., 332001"
                maxLength={6}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="latitude">Latitude</Label>
              <Input
                id="latitude"
                type="number"
                step="any"
                value={formData.latitude || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, latitude: e.target.value ? Number(e.target.value) : undefined }))}
                placeholder="e.g., 27.6094"
                className={errors.latitude ? 'border-destructive' : ''}
              />
              {errors.latitude && (
                <p className="text-xs text-destructive">{errors.latitude}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="longitude">Longitude</Label>
              <Input
                id="longitude"
                type="number"
                step="any"
                value={formData.longitude || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, longitude: e.target.value ? Number(e.target.value) : undefined }))}
                placeholder="e.g., 75.1389"
                className={errors.longitude ? 'border-destructive' : ''}
              />
              {errors.longitude && (
                <p className="text-xs text-destructive">{errors.longitude}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pricing Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IndianRupee className="h-5 w-5" />
            Pricing Information
          </CardTitle>
          <CardDescription>Set the pricing details for the property</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price_from">
                Starting Price (₹/month) <span className="text-destructive">*</span>
              </Label>
              <Input
                id="price_from"
                type="number"
                min="0"
                value={formData.price_from}
                onChange={(e) => setFormData(prev => ({ ...prev, price_from: Number(e.target.value) }))}
                className={errors.price_from ? 'border-destructive' : ''}
              />
              {errors.price_from && (
                <p className="text-xs text-destructive">{errors.price_from}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="price_to">Maximum Price (₹/month)</Label>
              <Input
                id="price_to"
                type="number"
                min="0"
                value={formData.price_to || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, price_to: Number(e.target.value) }))}
                className={errors.price_to ? 'border-destructive' : ''}
              />
              {errors.price_to && (
                <p className="text-xs text-destructive">{errors.price_to}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="offer_price">Offer Price (₹/month)</Label>
              <Input
                id="offer_price"
                type="number"
                min="0"
                value={formData.offer_price || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, offer_price: Number(e.target.value) }))}
                className={errors.offer_price ? 'border-destructive' : ''}
              />
              {errors.offer_price && (
                <p className="text-xs text-destructive">{errors.offer_price}</p>
              )}
            </div>
          </div>

          {formData.offer_price > 0 && formData.offer_price < formData.price_from && (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                Discount: ₹{formData.price_from - formData.offer_price} 
                ({Math.round(((formData.price_from - formData.offer_price) / formData.price_from) * 100)}% off)
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Property Structure */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Home className="h-5 w-5" />
            Property Structure
          </CardTitle>
          <CardDescription>Define the physical structure of the property</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="total_floors">
                Total Floors <span className="text-destructive">*</span>
              </Label>
              <Input
                id="total_floors"
                type="number"
                min="1"
                value={formData.total_floors}
                onChange={(e) => setFormData(prev => ({ ...prev, total_floors: Number(e.target.value) }))}
                className={errors.total_floors ? 'border-destructive' : ''}
              />
              {errors.total_floors && (
                <p className="text-xs text-destructive">{errors.total_floors}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="rooms_per_floor">
                Rooms Per Floor <span className="text-destructive">*</span>
              </Label>
              <Input
                id="rooms_per_floor"
                type="number"
                min="1"
                value={formData.rooms_per_floor}
                onChange={(e) => setFormData(prev => ({ ...prev, rooms_per_floor: Number(e.target.value) }))}
                className={errors.rooms_per_floor ? 'border-destructive' : ''}
              />
              {errors.rooms_per_floor && (
                <p className="text-xs text-destructive">{errors.rooms_per_floor}</p>
              )}
            </div>
          </div>

          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Total capacity: {formData.total_floors * formData.rooms_per_floor} rooms
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Suitability & Features */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Suitability & Features
          </CardTitle>
          <CardDescription>Specify who the property is suitable for and additional features</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Suitable For</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {SUITABLE_FOR_OPTIONS.map((option) => (
                <div
                  key={option}
                  className={`flex items-center space-x-2 p-3 rounded-lg border-2 transition-all ${
                    formData.suitable_for.includes(option)
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <Checkbox
                    id={`suitable-${option}`}
                    checked={formData.suitable_for.includes(option)}
                    onCheckedChange={() => handleSuitableForToggle(option)}
                  />
                  <label
                    htmlFor={`suitable-${option}`}
                    className="text-sm font-medium leading-none cursor-pointer"
                  >
                    {option}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-2 p-4 rounded-lg border-2 border-border">
            <Checkbox
              id="food_included"
              checked={formData.food_included}
              onCheckedChange={(checked) => 
                setFormData(prev => ({ ...prev, food_included: checked as boolean }))
              }
            />
            <label
              htmlFor="food_included"
              className="text-sm font-medium leading-none cursor-pointer"
            >
              Food Included
            </label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="availability_status">Availability Status</Label>
            <Select
              value={formData.availability_status}
              onValueChange={(value) => setFormData(prev => ({ ...prev, availability_status: value }))}
            >
              <SelectTrigger id="availability_status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {AVAILABILITY_STATUSES.map(status => (
                  <SelectItem key={status} value={status}>{status}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Flat & Apartment Specific Fields */}
      {(formData.type === 'Flat' || formData.type === 'Apartment') && (
        <Card className="border-primary/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5 text-primary" />
              {formData.type} Specific Details
            </CardTitle>
            <CardDescription>Additional details specific to {formData.type.toLowerCase()}s</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bedrooms">Number of Bedrooms</Label>
                <Select
                  value={formData.bedrooms?.toString() || ''}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, bedrooms: Number(value) }))}
                >
                  <SelectTrigger id="bedrooms">
                    <SelectValue placeholder="Select bedrooms" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5].map(num => (
                      <SelectItem key={num} value={num.toString()}>{num} BHK</SelectItem>
                    ))}
                    <SelectItem value="6">5+ BHK</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bathrooms">Number of Bathrooms</Label>
                <Select
                  value={formData.bathrooms?.toString() || ''}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, bathrooms: Number(value) }))}
                >
                  <SelectTrigger id="bathrooms">
                    <SelectValue placeholder="Select bathrooms" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4].map(num => (
                      <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="balconies">Number of Balconies</Label>
                <Select
                  value={formData.balconies?.toString() || ''}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, balconies: Number(value) }))}
                >
                  <SelectTrigger id="balconies">
                    <SelectValue placeholder="Select balconies" />
                  </SelectTrigger>
                  <SelectContent>
                    {[0, 1, 2, 3].map(num => (
                      <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="floor_number">Floor Number</Label>
                <Input
                  id="floor_number"
                  type="number"
                  min="0"
                  value={formData.floor_number || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, floor_number: Number(e.target.value) }))}
                  placeholder="e.g., 3"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="furnishing_status">Furnishing Status</Label>
                <Select
                  value={formData.furnishing_status || ''}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, furnishing_status: value as any }))}
                >
                  <SelectTrigger id="furnishing_status">
                    <SelectValue placeholder="Select furnishing" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Unfurnished">Unfurnished</SelectItem>
                    <SelectItem value="Semi-Furnished">Semi-Furnished</SelectItem>
                    <SelectItem value="Fully Furnished">Fully Furnished</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="parking_type">Parking Type</Label>
                <Select
                  value={formData.parking_type || ''}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, parking_type: value as any }))}
                >
                  <SelectTrigger id="parking_type">
                    <SelectValue placeholder="Select parking" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="None">None</SelectItem>
                    <SelectItem value="Two-Wheeler">Two-Wheeler</SelectItem>
                    <SelectItem value="Four-Wheeler">Four-Wheeler</SelectItem>
                    <SelectItem value="Both">Both</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="facing_direction">Facing Direction</Label>
                <Select
                  value={formData.facing_direction || ''}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, facing_direction: value as any }))}
                >
                  <SelectTrigger id="facing_direction">
                    <SelectValue placeholder="Select direction" />
                  </SelectTrigger>
                  <SelectContent>
                    {['North', 'South', 'East', 'West', 'North-East', 'North-West', 'South-East', 'South-West'].map(dir => (
                      <SelectItem key={dir} value={dir}>{dir}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="carpet_area">Carpet Area (sq ft)</Label>
                <Input
                  id="carpet_area"
                  type="number"
                  min="0"
                  value={formData.carpet_area || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, carpet_area: Number(e.target.value) }))}
                  placeholder="e.g., 850"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="built_up_area">Built-up Area (sq ft)</Label>
                <Input
                  id="built_up_area"
                  type="number"
                  min="0"
                  value={formData.built_up_area || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, built_up_area: Number(e.target.value) }))}
                  placeholder="e.g., 1000"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="property_age">Property Age (years)</Label>
                <Input
                  id="property_age"
                  type="number"
                  min="0"
                  value={formData.property_age || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, property_age: Number(e.target.value) }))}
                  placeholder="e.g., 5"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="water_supply">Water Supply</Label>
                <Select
                  value={formData.water_supply || ''}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, water_supply: value as any }))}
                >
                  <SelectTrigger id="water_supply">
                    <SelectValue placeholder="Select water supply" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="24/7">24/7</SelectItem>
                    <SelectItem value="Limited Hours">Limited Hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="security_deposit_months">Security Deposit (months)</Label>
                <Input
                  id="security_deposit_months"
                  type="number"
                  min="0"
                  value={formData.security_deposit_months || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, security_deposit_months: Number(e.target.value) }))}
                  placeholder="e.g., 2"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="maintenance_charges">Monthly Maintenance Charges (₹)</Label>
              <Input
                id="maintenance_charges"
                type="number"
                min="0"
                value={formData.maintenance_charges || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, maintenance_charges: Number(e.target.value) }))}
                placeholder="e.g., 1500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2 p-4 rounded-lg border-2 border-border">
                <Checkbox
                  id="lift_available"
                  checked={formData.lift_available}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, lift_available: checked as boolean }))}
                />
                <label htmlFor="lift_available" className="text-sm font-medium cursor-pointer">
                  Lift Available
                </label>
              </div>

              <div className="flex items-center space-x-2 p-4 rounded-lg border-2 border-border">
                <Checkbox
                  id="power_backup"
                  checked={formData.power_backup}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, power_backup: checked as boolean }))}
                />
                <label htmlFor="power_backup" className="text-sm font-medium cursor-pointer">
                  Power Backup
                </label>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* PG Specific Fields */}
      {formData.type === 'PG' && (
        <Card className="border-primary/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              PG Specific Details
            </CardTitle>
            <CardDescription>Additional details specific to paying guest accommodations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="gender_preference">Gender Preference</Label>
                <Select
                  value={formData.gender_preference || ''}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, gender_preference: value as any }))}
                >
                  <SelectTrigger id="gender_preference">
                    <SelectValue placeholder="Select gender preference" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Boys">Boys</SelectItem>
                    <SelectItem value="Girls">Girls</SelectItem>
                    <SelectItem value="Co-living">Co-living</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sharing_type">Sharing Type</Label>
                <Select
                  value={formData.sharing_type || ''}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, sharing_type: value as any }))}
                >
                  <SelectTrigger id="sharing_type">
                    <SelectValue placeholder="Select sharing type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Single">Single</SelectItem>
                    <SelectItem value="Double">Double</SelectItem>
                    <SelectItem value="Triple">Triple</SelectItem>
                    <SelectItem value="4+ Sharing">4+ Sharing</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="room_type">Room Type</Label>
                <Select
                  value={formData.room_type || ''}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, room_type: value as any }))}
                >
                  <SelectTrigger id="room_type">
                    <SelectValue placeholder="Select room type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AC">AC</SelectItem>
                    <SelectItem value="Non-AC">Non-AC</SelectItem>
                    <SelectItem value="Both">Both</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="visitor_policy">Visitor Policy</Label>
                <Select
                  value={formData.visitor_policy || ''}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, visitor_policy: value as any }))}
                >
                  <SelectTrigger id="visitor_policy">
                    <SelectValue placeholder="Select visitor policy" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Allowed">Allowed</SelectItem>
                    <SelectItem value="Not Allowed">Not Allowed</SelectItem>
                    <SelectItem value="Restricted">Restricted</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Meal Options</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {['Breakfast', 'Lunch', 'Dinner', 'All Meals', 'No Meals'].map((meal) => (
                  <div
                    key={meal}
                    className={`flex items-center space-x-2 p-3 rounded-lg border-2 transition-all ${
                      formData.meal_options?.includes(meal)
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <Checkbox
                      id={`meal-${meal}`}
                      checked={formData.meal_options?.includes(meal)}
                      onCheckedChange={(checked) => {
                        setFormData(prev => ({
                          ...prev,
                          meal_options: checked
                            ? [...(prev.meal_options || []), meal]
                            : (prev.meal_options || []).filter(m => m !== meal)
                        }));
                      }}
                    />
                    <label htmlFor={`meal-${meal}`} className="text-sm font-medium cursor-pointer">
                      {meal}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="meal_charges">Monthly Meal Charges (₹)</Label>
              <Input
                id="meal_charges"
                type="number"
                min="0"
                value={formData.meal_charges || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, meal_charges: Number(e.target.value) }))}
                placeholder="e.g., 3000"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="notice_period_days">Notice Period (days)</Label>
                <Input
                  id="notice_period_days"
                  type="number"
                  min="0"
                  value={formData.notice_period_days || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, notice_period_days: Number(e.target.value) }))}
                  placeholder="e.g., 30"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lock_in_period_months">Lock-in Period (months)</Label>
                <Input
                  id="lock_in_period_months"
                  type="number"
                  min="0"
                  value={formData.lock_in_period_months || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, lock_in_period_months: Number(e.target.value) }))}
                  placeholder="e.g., 3"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gate_closing_time">Gate Closing Time</Label>
                <Input
                  id="gate_closing_time"
                  type="time"
                  value={formData.gate_closing_time || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, gate_closing_time: e.target.value }))}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2 p-4 rounded-lg border-2 border-border">
                <Checkbox
                  id="attached_bathroom"
                  checked={formData.attached_bathroom}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, attached_bathroom: checked as boolean }))}
                />
                <label htmlFor="attached_bathroom" className="text-sm font-medium cursor-pointer">
                  Attached Bathroom
                </label>
              </div>

              <div className="flex items-center space-x-2 p-4 rounded-lg border-2 border-border">
                <Checkbox
                  id="laundry_service"
                  checked={formData.laundry_service}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, laundry_service: checked as boolean }))}
                />
                <label htmlFor="laundry_service" className="text-sm font-medium cursor-pointer">
                  Laundry Service
                </label>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Hostel Specific Fields */}
      {formData.type === 'Hostel' && (
        <Card className="border-primary/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5 text-primary" />
              Hostel Specific Details
            </CardTitle>
            <CardDescription>Additional details specific to hostels</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="total_capacity">Total Capacity</Label>
                <Input
                  id="total_capacity"
                  type="number"
                  min="0"
                  value={formData.total_capacity || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, total_capacity: Number(e.target.value) }))}
                  placeholder="e.g., 100"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="current_occupancy">Current Occupancy</Label>
                <Input
                  id="current_occupancy"
                  type="number"
                  min="0"
                  value={formData.current_occupancy || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, current_occupancy: Number(e.target.value) }))}
                  placeholder="e.g., 75"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="hostel_gender">Gender</Label>
                <Select
                  value={formData.hostel_gender || ''}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, hostel_gender: value as any }))}
                >
                  <SelectTrigger id="hostel_gender">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Boys">Boys</SelectItem>
                    <SelectItem value="Girls">Girls</SelectItem>
                    <SelectItem value="Co-ed">Co-ed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Meal Plans</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {['Breakfast', 'Lunch', 'Dinner', 'All Meals'].map((meal) => (
                  <div
                    key={meal}
                    className={`flex items-center space-x-2 p-3 rounded-lg border-2 transition-all ${
                      formData.meal_plans?.includes(meal)
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <Checkbox
                      id={`hostel-meal-${meal}`}
                      checked={formData.meal_plans?.includes(meal)}
                      onCheckedChange={(checked) => {
                        setFormData(prev => ({
                          ...prev,
                          meal_plans: checked
                            ? [...(prev.meal_plans || []), meal]
                            : (prev.meal_plans || []).filter(m => m !== meal)
                        }));
                      }}
                    />
                    <label htmlFor={`hostel-meal-${meal}`} className="text-sm font-medium cursor-pointer">
                      {meal}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Room Types Available</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {['Single', 'Double', 'Triple', 'Dormitory'].map((type) => (
                  <div
                    key={type}
                    className={`flex items-center space-x-2 p-3 rounded-lg border-2 transition-all ${
                      formData.room_types_available?.includes(type)
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <Checkbox
                      id={`room-type-${type}`}
                      checked={formData.room_types_available?.includes(type)}
                      onCheckedChange={(checked) => {
                        setFormData(prev => ({
                          ...prev,
                          room_types_available: checked
                            ? [...(prev.room_types_available || []), type]
                            : (prev.room_types_available || []).filter(t => t !== type)
                        }));
                      }}
                    />
                    <label htmlFor={`room-type-${type}`} className="text-sm font-medium cursor-pointer">
                      {type}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="security_hours">Security Hours</Label>
              <Select
                value={formData.security_hours || ''}
                onValueChange={(value) => setFormData(prev => ({ ...prev, security_hours: value as any }))}
              >
                <SelectTrigger id="security_hours">
                  <SelectValue placeholder="Select security hours" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="24/7">24/7</SelectItem>
                  <SelectItem value="Limited Hours">Limited Hours</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2 p-4 rounded-lg border-2 border-border">
                <Checkbox
                  id="warden_available"
                  checked={formData.warden_available}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, warden_available: checked as boolean }))}
                />
                <label htmlFor="warden_available" className="text-sm font-medium cursor-pointer">
                  Warden Available
                </label>
              </div>

              <div className="flex items-center space-x-2 p-4 rounded-lg border-2 border-border">
                <Checkbox
                  id="study_room"
                  checked={formData.study_room}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, study_room: checked as boolean }))}
                />
                <label htmlFor="study_room" className="text-sm font-medium cursor-pointer">
                  Study Room
                </label>
              </div>
            </div>

            <div className="flex items-center space-x-2 p-4 rounded-lg border-2 border-border">
              <Checkbox
                id="common_area"
                checked={formData.common_area}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, common_area: checked as boolean }))}
              />
              <label htmlFor="common_area" className="text-sm font-medium cursor-pointer">
                Common Area
              </label>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Room Specific Fields */}
      {formData.type === 'Room' && (
        <Card className="border-primary/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Home className="h-5 w-5 text-primary" />
              Room Specific Details
            </CardTitle>
            <CardDescription>Additional details specific to rooms</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="room_sharing_type">Sharing Type</Label>
                <Select
                  value={formData.sharing_type || ''}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, sharing_type: value as any }))}
                >
                  <SelectTrigger id="room_sharing_type">
                    <SelectValue placeholder="Select sharing type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Single">Single</SelectItem>
                    <SelectItem value="Double">Double</SelectItem>
                    <SelectItem value="Triple">Triple</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="room_furnishing">Furnishing Status</Label>
                <Select
                  value={formData.furnishing_status || ''}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, furnishing_status: value as any }))}
                >
                  <SelectTrigger id="room_furnishing">
                    <SelectValue placeholder="Select furnishing" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Unfurnished">Unfurnished</SelectItem>
                    <SelectItem value="Semi-Furnished">Semi-Furnished</SelectItem>
                    <SelectItem value="Fully Furnished">Fully Furnished</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2 p-4 rounded-lg border-2 border-border">
                <Checkbox
                  id="room_attached_bathroom"
                  checked={formData.attached_bathroom}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, attached_bathroom: checked as boolean }))}
                />
                <label htmlFor="room_attached_bathroom" className="text-sm font-medium cursor-pointer">
                  Attached Bathroom
                </label>
              </div>

              <div className="flex items-center space-x-2 p-4 rounded-lg border-2 border-border">
                <Checkbox
                  id="kitchen_access"
                  checked={formData.kitchen_access}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, kitchen_access: checked as boolean }))}
                />
                <label htmlFor="kitchen_access" className="text-sm font-medium cursor-pointer">
                  Kitchen Access
                </label>
              </div>

              <div className="flex items-center space-x-2 p-4 rounded-lg border-2 border-border">
                <Checkbox
                  id="separate_entrance"
                  checked={formData.separate_entrance}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, separate_entrance: checked as boolean }))}
                />
                <label htmlFor="separate_entrance" className="text-sm font-medium cursor-pointer">
                  Separate Entrance
                </label>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Short Term Stay Specific Fields */}
      {formData.type === 'Short Term Stay' && (
        <Card className="border-primary/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-primary" />
              Short Term Stay Details
            </CardTitle>
            <CardDescription>Additional details specific to short term stays</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="min_stay_duration">Minimum Stay (days)</Label>
                <Input
                  id="min_stay_duration"
                  type="number"
                  min="1"
                  value={formData.min_stay_duration || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, min_stay_duration: Number(e.target.value) }))}
                  placeholder="e.g., 1"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="max_stay_duration">Maximum Stay (days)</Label>
                <Input
                  id="max_stay_duration"
                  type="number"
                  min="1"
                  value={formData.max_stay_duration || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, max_stay_duration: Number(e.target.value) }))}
                  placeholder="e.g., 30"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="daily_rate">Daily Rate (₹)</Label>
                <Input
                  id="daily_rate"
                  type="number"
                  min="0"
                  value={formData.daily_rate || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, daily_rate: Number(e.target.value) }))}
                  placeholder="e.g., 500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="weekly_rate">Weekly Rate (₹)</Label>
                <Input
                  id="weekly_rate"
                  type="number"
                  min="0"
                  value={formData.weekly_rate || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, weekly_rate: Number(e.target.value) }))}
                  placeholder="e.g., 3000"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="monthly_rate">Monthly Rate (₹)</Label>
                <Input
                  id="monthly_rate"
                  type="number"
                  min="0"
                  value={formData.monthly_rate || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, monthly_rate: Number(e.target.value) }))}
                  placeholder="e.g., 10000"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="check_in_time">Check-in Time</Label>
                <Input
                  id="check_in_time"
                  type="time"
                  value={formData.check_in_time || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, check_in_time: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="check_out_time">Check-out Time</Label>
                <Input
                  id="check_out_time"
                  type="time"
                  value={formData.check_out_time || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, check_out_time: e.target.value }))}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cancellation_policy">Cancellation Policy</Label>
                <Select
                  value={formData.cancellation_policy || ''}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, cancellation_policy: value as any }))}
                >
                  <SelectTrigger id="cancellation_policy">
                    <SelectValue placeholder="Select policy" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Flexible">Flexible</SelectItem>
                    <SelectItem value="Moderate">Moderate</SelectItem>
                    <SelectItem value="Strict">Strict</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cleaning_service">Cleaning Service</Label>
                <Select
                  value={formData.cleaning_service || ''}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, cleaning_service: value as any }))}
                >
                  <SelectTrigger id="cleaning_service">
                    <SelectValue placeholder="Select cleaning service" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Daily">Daily</SelectItem>
                    <SelectItem value="Weekly">Weekly</SelectItem>
                    <SelectItem value="On Request">On Request</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Media */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            Property Media
          </CardTitle>
          <CardDescription>Add image URLs and video URL for the property</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="image-urls">Property Image URLs</Label>
            <p className="text-sm text-muted-foreground">Enter one image URL per line</p>
            <Textarea
              id="image-urls"
              placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg&#10;https://example.com/image3.jpg"
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
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              {imagePreview.map((url, index) => (
                <div key={index} className="relative group">
                  <img
                    src={url}
                    alt={`Property ${index + 1}`}
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

          <div className="space-y-2">
            <Label htmlFor="video_url">
              <Video className="inline h-4 w-4 mr-1" />
              Video URL (YouTube/Vimeo)
            </Label>
            <Input
              id="video_url"
              value={formData.video_url}
              onChange={(e) => setFormData(prev => ({ ...prev, video_url: e.target.value }))}
              placeholder="https://www.youtube.com/watch?v=..."
            />
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5" />
            Contact Information
          </CardTitle>
          <CardDescription>Provide contact details for inquiries</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contact_phone">Contact Phone</Label>
              <Input
                id="contact_phone"
                value={formData.contact_phone}
                onChange={(e) => setFormData(prev => ({ ...prev, contact_phone: e.target.value }))}
                placeholder="e.g., 9876543210"
                maxLength={10}
                className={errors.contact_phone ? 'border-destructive' : ''}
              />
              {errors.contact_phone && (
                <p className="text-xs text-destructive">{errors.contact_phone}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact_email">Contact Email</Label>
              <Input
                id="contact_email"
                type="email"
                value={formData.contact_email}
                onChange={(e) => setFormData(prev => ({ ...prev, contact_email: e.target.value }))}
                placeholder="e.g., contact@property.com"
                className={errors.contact_email ? 'border-destructive' : ''}
              />
              {errors.contact_email && (
                <p className="text-xs text-destructive">{errors.contact_email}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="owner_name">Owner Name</Label>
            <Input
              id="owner_name"
              value={formData.owner_name}
              onChange={(e) => setFormData(prev => ({ ...prev, owner_name: e.target.value }))}
              placeholder="e.g., Rajesh Kumar"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="owner_details">Owner Details</Label>
            <Textarea
              id="owner_details"
              value={formData.owner_details}
              onChange={(e) => setFormData(prev => ({ ...prev, owner_details: e.target.value }))}
              rows={2}
              placeholder="Additional information about the owner..."
            />
          </div>
        </CardContent>
      </Card>

      {/* Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Property Settings
          </CardTitle>
          <CardDescription>Configure property visibility and verification status</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg border-2 border-border">
            <div className="space-y-0.5">
              <Label htmlFor="verified" className="text-base">RoomSaathi Verified</Label>
              <p className="text-sm text-muted-foreground">Mark this property as verified</p>
            </div>
            <Switch
              id="verified"
              checked={formData.verified}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, verified: checked }))}
            />
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg border-2 border-border">
            <div className="space-y-0.5">
              <Label htmlFor="published" className="text-base">Published</Label>
              <p className="text-sm text-muted-foreground">Make this property visible to users</p>
            </div>
            <Switch
              id="published"
              checked={formData.published}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, published: checked }))}
            />
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* Form Actions */}
      {!hideButtons && (
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSaving}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSaving}>
            {isSaving ? 'Saving...' : property ? 'Update Property' : 'Create Property'}
          </Button>
        </div>
      )}
    </form>
  );
}
