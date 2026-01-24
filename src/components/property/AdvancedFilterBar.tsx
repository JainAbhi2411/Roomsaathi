import React, { useState, useEffect } from 'react';
import type { FilterOptions } from '@/types/index';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Sparkles, DollarSign, GraduationCap, Home } from 'lucide-react';

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
const suitableForOptions = ['Boys', 'Girls', 'Family', 'Bachelors', 'Students'];

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
  const [priceRange, setPriceRange] = useState<[number, number]>([
    filters.price_min || 0,
    filters.price_max || 50000
  ]);

  useEffect(() => {
    setLocalFilters(filters);
    setSelectedAmenities(filters.amenities || []);
    setPriceRange([filters.price_min || 0, filters.price_max || 50000]);
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
    const numValue = value ? Number.parseInt(value) : undefined;
    if (type === 'min') {
      handleChange('price_min', numValue);
      setPriceRange([numValue || 0, priceRange[1]]);
    } else {
      handleChange('price_max', numValue);
      setPriceRange([priceRange[0], numValue || 50000]);
    }
  };

  const handlePriceSliderChange = (values: number[]) => {
    setPriceRange([values[0], values[1]]);
    handleChange('price_min', values[0] > 0 ? values[0] : undefined);
    handleChange('price_max', values[1] < 50000 ? values[1] : undefined);
  };

  const applyQuickFilter = (preset: 'budget' | 'premium' | 'student') => {
    let presetFilters: Partial<FilterOptions> = {};
    
    if (preset === 'budget') {
      presetFilters = {
        price_min: 0,
        price_max: 8000,
        suitable_for: 'Students',
      };
    } else if (preset === 'premium') {
      presetFilters = {
        price_min: 15000,
        price_max: 50000,
        verified: true,
        amenities: ['WiFi', 'AC', 'Security'],
      };
    } else if (preset === 'student') {
      presetFilters = {
        suitable_for: 'Students',
        food_included: true,
        amenities: ['WiFi', 'Mess/Kitchen'],
      };
    }

    const updated = { ...localFilters, ...presetFilters };
    
    if (presetFilters.amenities) {
      setSelectedAmenities(presetFilters.amenities);
    }
    if (presetFilters.price_min !== undefined || presetFilters.price_max !== undefined) {
      setPriceRange([presetFilters.price_min || 0, presetFilters.price_max || 50000]);
    }
    
    setLocalFilters(updated);
    onFilterChange(updated);
  };

  const clearFilters = () => {
    setLocalFilters({});
    setSelectedAmenities([]);
    onFilterChange({});
  };

  return (
    <div className="space-y-6">
      {/* Quick Filter Presets */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold">Quick Filters</Label>
        <div className="grid grid-cols-3 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => applyQuickFilter('budget')}
            className="flex flex-col items-center gap-1 h-auto py-3"
          >
            <DollarSign className="h-4 w-4 text-green-500" />
            <span className="text-xs">Budget</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => applyQuickFilter('premium')}
            className="flex flex-col items-center gap-1 h-auto py-3"
          >
            <Sparkles className="h-4 w-4 text-amber-500" />
            <span className="text-xs">Premium</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => applyQuickFilter('student')}
            className="flex flex-col items-center gap-1 h-auto py-3"
          >
            <GraduationCap className="h-4 w-4 text-blue-500" />
            <span className="text-xs">Student</span>
          </Button>
        </div>
      </div>

      <Separator />
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

      {/* Price Range Filter with Slider */}
      <div className="space-y-4">
        <Label>Price Range (₹/month)</Label>
        <div className="space-y-4">
          <Slider
            min={0}
            max={50000}
            step={500}
            value={priceRange}
            onValueChange={handlePriceSliderChange}
            className="w-full"
          />
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>₹{priceRange[0].toLocaleString()}</span>
            <span>₹{priceRange[1].toLocaleString()}</span>
          </div>
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
      </div>

      <Separator />

      {/* Suitable For */}
      <div className="space-y-2">
        <Label>Suitable For</Label>
        <Select
          value={localFilters.suitable_for || 'all'}
          onValueChange={(value) => handleChange('suitable_for', value === 'all' ? undefined : value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Any" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any</SelectItem>
            {suitableForOptions.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
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
        <Label className="flex items-center justify-between">
          <span>Amenities</span>
          {selectedAmenities.length > 0 && (
            <Badge variant="secondary" className="text-xs">
              {selectedAmenities.length} selected
            </Badge>
          )}
        </Label>
        <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
          {amenitiesList.map((amenity) => (
            <div key={amenity} className="flex items-center space-x-2">
              <Checkbox
                id={amenity}
                checked={selectedAmenities.includes(amenity)}
                onCheckedChange={() => handleAmenityToggle(amenity)}
              />
              <Label htmlFor={amenity} className="cursor-pointer text-sm font-normal">
                {amenity}
              </Label>
            </div>
          ))}
        </div>
        {selectedAmenities.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2 pt-2 border-t border-border">
            {selectedAmenities.map((amenity) => (
              <Badge key={amenity} variant="secondary" className="text-xs gap-1">
                {amenity}
                <button
                  type="button"
                  onClick={() => handleAmenityToggle(amenity)}
                  className="ml-0.5 hover:text-destructive"
                >
                  ×
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>

      <Separator />

      {/* Filter Summary */}
      {(localFilters.city || localFilters.type || localFilters.verified || selectedAmenities.length > 0) && (
        <div className="space-y-2 p-3 bg-muted/50 rounded-lg border border-border">
          <Label className="text-xs font-semibold text-muted-foreground uppercase">Active Filters</Label>
          <div className="space-y-1 text-sm">
            {localFilters.city && (
              <div className="flex items-center gap-2">
                <Home className="h-3 w-3 text-muted-foreground" />
                <span>{localFilters.city}</span>
              </div>
            )}
            {localFilters.type && (
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Type:</span>
                <span>{localFilters.type}</span>
              </div>
            )}
            {localFilters.verified && (
              <div className="flex items-center gap-2">
                <Sparkles className="h-3 w-3 text-amber-500" />
                <span>Verified Only</span>
              </div>
            )}
            {selectedAmenities.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Amenities:</span>
                <span>{selectedAmenities.length}</span>
              </div>
            )}
          </div>
        </div>
      )}

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
