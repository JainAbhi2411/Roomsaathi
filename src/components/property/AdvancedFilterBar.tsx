import React, { useState, useEffect } from 'react';
import type { FilterOptions } from '@/types/index';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

interface AdvancedFilterBarProps {
  filters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
}

const cities = ['Sikar', 'Jaipur', 'Kota'];
const propertyTypes = ['PG', 'Flats', 'Apartments', 'Rooms', 'Hostels', 'Short Term Stays'];
const amenitiesList = [
  'WiFi',
  'AC',
  'Parking',
  'Laundry',
  'Gym',
  'Security',
  'Power Backup',
  'Water Supply',
  'Mess/Kitchen',
  'TV',
  'Refrigerator',
  'Geyser',
];
const genderOptions = ['Male', 'Female', 'Co-ed'];

// Localities by city
const localitiesByCity: Record<string, string[]> = {
  Sikar: ['Fatehpur', 'Piprali Road', 'Station Road', 'Devipura', 'Neem Ka Thana'],
  Jaipur: ['Malviya Nagar', 'Vaishali Nagar', 'C-Scheme', 'Bani Park', 'Mansarovar', 'Jagatpura'],
  Kota: ['Jawahar Nagar', 'Dadabari', 'Talwandi', 'Vigyan Nagar', 'Mahaveer Nagar'],
};

export default function AdvancedFilterBar({ filters, onFilterChange }: AdvancedFilterBarProps) {
  const [localFilters, setLocalFilters] = useState<FilterOptions>(filters);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(filters.amenities || []);
  const [availableLocalities, setAvailableLocalities] = useState<string[]>([]);

  useEffect(() => {
    setLocalFilters(filters);
    setSelectedAmenities(filters.amenities || []);
  }, [filters]);

  useEffect(() => {
    if (localFilters.city) {
      setAvailableLocalities(localitiesByCity[localFilters.city] || []);
    } else {
      setAvailableLocalities([]);
    }
  }, [localFilters.city]);

  const handleChange = (key: keyof FilterOptions, value: any) => {
    const updated = { ...localFilters, [key]: value };
    
    // Clear locality if city changes
    if (key === 'city' && value !== localFilters.city) {
      delete updated.locality;
    }
    
    setLocalFilters(updated);
    onFilterChange(updated);
  };

  const handleAmenityToggle = (amenity: string) => {
    const updated = selectedAmenities.includes(amenity)
      ? selectedAmenities.filter(a => a !== amenity)
      : [...selectedAmenities, amenity];
    
    setSelectedAmenities(updated);
    handleChange('amenities', updated.length > 0 ? updated : undefined);
  };

  const handlePriceChange = (type: 'min' | 'max', value: string) => {
    const numValue = value ? parseInt(value) : undefined;
    if (type === 'min') {
      handleChange('price_min', numValue);
    } else {
      handleChange('price_max', numValue);
    }
  };

  const clearFilters = () => {
    setLocalFilters({});
    setSelectedAmenities([]);
    onFilterChange({});
  };

  return (
    <div className="space-y-6">
      {/* City Filter */}
      <div className="space-y-2">
        <Label>City</Label>
        <Select
          value={localFilters.city || 'all'}
          onValueChange={(value) => handleChange('city', value === 'all' ? undefined : value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select city" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Cities</SelectItem>
            {cities.map((city) => (
              <SelectItem key={city} value={city}>
                {city}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Locality Filter */}
      {localFilters.city && availableLocalities.length > 0 && (
        <div className="space-y-2">
          <Label>Locality</Label>
          <Select
            value={localFilters.locality || 'all'}
            onValueChange={(value) => handleChange('locality', value === 'all' ? undefined : value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select locality" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Localities</SelectItem>
              {availableLocalities.map((locality) => (
                <SelectItem key={locality} value={locality}>
                  {locality}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <Separator />

      {/* Property Type Filter */}
      <div className="space-y-2">
        <Label>Property Type</Label>
        <Select
          value={localFilters.type || 'all'}
          onValueChange={(value) => handleChange('type', value === 'all' ? undefined : value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="All types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {propertyTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Separator />

      {/* Price Range Filter */}
      <div className="space-y-3">
        <Label>Price Range (₹/month)</Label>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Input
              type="number"
              placeholder="Min"
              value={localFilters.price_min || ''}
              onChange={(e) => handlePriceChange('min', e.target.value)}
            />
          </div>
          <div>
            <Input
              type="number"
              placeholder="Max"
              value={localFilters.price_max || ''}
              onChange={(e) => handlePriceChange('max', e.target.value)}
            />
          </div>
        </div>
      </div>

      <Separator />

      {/* Gender Preference */}
      <div className="space-y-2">
        <Label>Gender Preference</Label>
        <Select
          value={localFilters.gender || 'all'}
          onValueChange={(value) => handleChange('gender', value === 'all' ? undefined : value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Any" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any</SelectItem>
            {genderOptions.map((gender) => (
              <SelectItem key={gender} value={gender}>
                {gender}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Separator />

      {/* Verified Only */}
      <div className="flex items-center space-x-2">
        <Checkbox
          id="verified"
          checked={localFilters.verified || false}
          onCheckedChange={(checked) => handleChange('verified', checked || undefined)}
        />
        <Label htmlFor="verified" className="cursor-pointer">
          RoomSaathi Verified Only
        </Label>
      </div>

      {/* Food Included */}
      <div className="flex items-center space-x-2">
        <Checkbox
          id="food"
          checked={localFilters.food_included || false}
          onCheckedChange={(checked) => handleChange('food_included', checked || undefined)}
        />
        <Label htmlFor="food" className="cursor-pointer">
          Food Included
        </Label>
      </div>

      <Separator />

      {/* Amenities Filter */}
      <div className="space-y-3">
        <Label>Amenities</Label>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {amenitiesList.map((amenity) => (
            <div key={amenity} className="flex items-center space-x-2">
              <Checkbox
                id={amenity}
                checked={selectedAmenities.includes(amenity)}
                onCheckedChange={() => handleAmenityToggle(amenity)}
              />
              <Label htmlFor={amenity} className="cursor-pointer text-sm">
                {amenity}
              </Label>
            </div>
          ))}
        </div>
        {selectedAmenities.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {selectedAmenities.map((amenity) => (
              <Badge key={amenity} variant="secondary" className="text-xs">
                {amenity}
              </Badge>
            ))}
          </div>
        )}
      </div>

      <Separator />

      {/* Clear Filters Button */}
      <Button
        variant="outline"
        className="w-full"
        onClick={clearFilters}
      >
        Clear All Filters
      </Button>
    </div>
  );
}
