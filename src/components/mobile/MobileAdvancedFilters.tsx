import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useSearchFilter } from '@/contexts/SearchFilterContext';
import { supabase } from '@/db/supabase';
import { X } from 'lucide-react';

interface MobileAdvancedFiltersProps {
  onApply: () => void;
  onClose: () => void;
}

const CITIES = ['Sikar', 'Jaipur', 'Kota'];
const PROPERTY_TYPES = ['PG', 'Flat', 'Apartment', 'Room', 'Hostel', 'Short Term Stay'];
const SUITABLE_FOR = ['Students', 'Working Professionals', 'Families', 'Bachelors'];
const FURNISHING_TYPES = ['Unfurnished', 'Semi-Furnished', 'Fully Furnished'];
const OCCUPANCY_TYPES = ['Single', 'Double', 'Triple', '4+ Sharing'];

const COMMON_AMENITIES = [
  'WiFi',
  'AC',
  'Parking',
  'Power Backup',
  'Lift',
  'Security',
  'Water Supply',
  'Laundry',
  'Gym',
  'Common Area'
];

export default function MobileAdvancedFilters({ onApply, onClose }: MobileAdvancedFiltersProps) {
  const { filters, updateFilter, clearFilters } = useSearchFilter();
  const [localities, setLocalities] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([
    filters.price_min || 0,
    filters.price_max || 50000
  ]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(filters.amenities || []);

  useEffect(() => {
    if (filters.city) {
      loadLocalities(filters.city);
    }
  }, [filters.city]);

  const loadLocalities = async (city: string) => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('locality')
        .eq('city', city)
        .eq('published', true);

      if (error) throw error;

      const uniqueLocalities = Array.from(
        new Set(
          (data || [])
            .map((p: { locality: string }) => p.locality)
            .filter(Boolean)
        )
      ) as string[];
      setLocalities(uniqueLocalities.sort());
    } catch (error) {
      console.error('Error loading localities:', error);
    }
  };

  const handleCityChange = (city: string) => {
    updateFilter('city', city);
    updateFilter('locality', undefined); // Clear locality when city changes
  };

  const handlePriceChange = (value: [number, number]) => {
    setPriceRange(value);
    updateFilter('price_min', value[0]);
    updateFilter('price_max', value[1]);
  };

  const toggleAmenity = (amenity: string) => {
    const updated = selectedAmenities.includes(amenity)
      ? selectedAmenities.filter(a => a !== amenity)
      : [...selectedAmenities, amenity];
    
    setSelectedAmenities(updated);
    updateFilter('amenities', updated.length > 0 ? updated : undefined);
  };

  const handleClearAll = () => {
    clearFilters();
    setPriceRange([0, 50000]);
    setSelectedAmenities([]);
  };

  const handleApply = () => {
    onApply();
  };

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1 -mx-6 px-6">
        <div className="space-y-6 py-6">
          {/* Location Filters */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm">Location</h3>
            
            <div className="space-y-2">
              <Label>City</Label>
              <Select 
                value={filters.city || ''} 
                onValueChange={handleCityChange}
              >
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

            {filters.city && localities.length > 0 && (
              <div className="space-y-2">
                <Label>Locality</Label>
                <Select 
                  value={filters.locality || ''} 
                  onValueChange={(value) => updateFilter('locality', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select locality" />
                  </SelectTrigger>
                  <SelectContent>
                    {localities.map(locality => (
                      <SelectItem key={locality} value={locality}>
                        {locality}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <Separator />

          {/* Property Type */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm">Property Type</h3>
            <Select 
              value={filters.type || ''} 
              onValueChange={(value) => updateFilter('type', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select property type" />
              </SelectTrigger>
              <SelectContent>
                {PROPERTY_TYPES.map(type => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Separator />

          {/* Price Range */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm">Price Range</h3>
              <span className="text-sm text-muted-foreground">
                ₹{priceRange[0].toLocaleString()} - ₹{priceRange[1].toLocaleString()}
              </span>
            </div>
            <Slider
              min={0}
              max={50000}
              step={1000}
              value={priceRange}
              onValueChange={handlePriceChange}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>₹0</span>
              <span>₹50,000</span>
            </div>
          </div>

          <Separator />

          {/* Quick Filters */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm">Quick Filters</h3>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="verified">RoomSaathi Verified</Label>
              <Switch
                id="verified"
                checked={filters.verified || false}
                onCheckedChange={(checked) => updateFilter('verified', checked || undefined)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="food">Food Included</Label>
              <Switch
                id="food"
                checked={filters.food_included || false}
                onCheckedChange={(checked) => updateFilter('food_included', checked || undefined)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="parking">Parking Available</Label>
              <Switch
                id="parking"
                checked={filters.parking_available || false}
                onCheckedChange={(checked) => updateFilter('parking_available', checked || undefined)}
              />
            </div>
          </div>

          <Separator />

          {/* Suitable For */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm">Suitable For</h3>
            <Select 
              value={filters.suitable_for || ''} 
              onValueChange={(value) => updateFilter('suitable_for', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select suitable for" />
              </SelectTrigger>
              <SelectContent>
                {SUITABLE_FOR.map(option => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Separator />

          {/* Furnishing Type */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm">Furnishing Type</h3>
            <Select 
              value={filters.furnishing_type || ''} 
              onValueChange={(value) => updateFilter('furnishing_type', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select furnishing type" />
              </SelectTrigger>
              <SelectContent>
                {FURNISHING_TYPES.map(type => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Separator />

          {/* Occupancy Type */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm">Occupancy Type</h3>
            <Select 
              value={filters.occupancy_type || ''} 
              onValueChange={(value) => updateFilter('occupancy_type', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select occupancy type" />
              </SelectTrigger>
              <SelectContent>
                {OCCUPANCY_TYPES.map(type => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Separator />

          {/* Amenities */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm">Amenities</h3>
            <div className="flex flex-wrap gap-2">
              {COMMON_AMENITIES.map(amenity => (
                <Badge
                  key={amenity}
                  variant={selectedAmenities.includes(amenity) ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => toggleAmenity(amenity)}
                >
                  {amenity}
                  {selectedAmenities.includes(amenity) && (
                    <X className="w-3 h-3 ml-1" />
                  )}
                </Badge>
              ))}
            </div>
          </div>

          <Separator />

          {/* Availability Status */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm">Availability</h3>
            <Select 
              value={filters.availability_status || ''} 
              onValueChange={(value) => updateFilter('availability_status', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select availability" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Available">Available</SelectItem>
                <SelectItem value="Limited">Limited</SelectItem>
                <SelectItem value="Coming Soon">Coming Soon</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </ScrollArea>

      {/* Action Buttons */}
      <div className="border-t border-border p-4 space-y-2 bg-card">
        <Button 
          onClick={handleApply}
          className="w-full"
        >
          Apply Filters
        </Button>
        <Button 
          variant="outline"
          onClick={handleClearAll}
          className="w-full"
        >
          Clear All Filters
        </Button>
      </div>
    </div>
  );
}
