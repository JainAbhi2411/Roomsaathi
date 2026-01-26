import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import type { FilterOptions } from '@/types/index';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Sparkles, 
  DollarSign, 
  GraduationCap, 
  MapPin, 
  Home, 
  Bed, 
  Car, 
  Shield,
  Utensils,
  Wifi,
  X
} from 'lucide-react';

interface FilterModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: FilterOptions;
  onApplyFilters: (filters: FilterOptions) => void;
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
  'Attached Bathroom',
  'Balcony',
  'CCTV',
];
const suitableForOptions = ['Boys', 'Girls', 'Family', 'Bachelors', 'Students'];
const availabilityOptions = ['Available', 'Coming Soon', 'Limited'];
const furnishingTypes = ['Fully Furnished', 'Semi Furnished', 'Unfurnished'];
const occupancyTypes = ['Single', 'Double', 'Triple', 'Shared'];
const floorPreferences = ['Ground Floor', 'Low Floor (1-2)', 'Mid Floor (3-5)', 'High Floor (6+)'];

// Localities by city
const localitiesByCity: Record<string, string[]> = {
  Sikar: ['Fatehpur', 'Piprali Road', 'Station Road', 'Devipura', 'Neem Ka Thana'],
  Jaipur: ['Malviya Nagar', 'Vaishali Nagar', 'C-Scheme', 'Bani Park', 'Mansarovar', 'Jagatpura'],
  Kota: ['Jawahar Nagar', 'Dadabari', 'Talwandi', 'Vigyan Nagar', 'Mahaveer Nagar'],
};

export default function FilterModal({ open, onOpenChange, filters, onApplyFilters }: FilterModalProps) {
  const [localFilters, setLocalFilters] = useState<FilterOptions>(filters);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(filters.amenities || []);
  const [availableLocalities, setAvailableLocalities] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([
    filters.price_min || 0,
    filters.price_max || 50000
  ]);
  const [depositRange, setDepositRange] = useState<[number, number]>([
    filters.deposit_min || 0,
    filters.deposit_max || 100000
  ]);

  useEffect(() => {
    setLocalFilters(filters);
    setSelectedAmenities(filters.amenities || []);
    setPriceRange([filters.price_min || 0, filters.price_max || 50000]);
    setDepositRange([filters.deposit_min || 0, filters.deposit_max || 100000]);
  }, [filters, open]);

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
  };

  const handleAmenityToggle = (amenity: string) => {
    const updated = selectedAmenities.includes(amenity)
      ? selectedAmenities.filter(a => a !== amenity)
      : [...selectedAmenities, amenity];
    
    setSelectedAmenities(updated);
    setLocalFilters({ ...localFilters, amenities: updated.length > 0 ? updated : undefined });
  };

  const handlePriceSliderChange = (values: number[]) => {
    setPriceRange([values[0], values[1]]);
    setLocalFilters({
      ...localFilters,
      price_min: values[0] > 0 ? values[0] : undefined,
      price_max: values[1] < 50000 ? values[1] : undefined
    });
  };

  const handleDepositSliderChange = (values: number[]) => {
    setDepositRange([values[0], values[1]]);
    setLocalFilters({
      ...localFilters,
      deposit_min: values[0] > 0 ? values[0] : undefined,
      deposit_max: values[1] < 100000 ? values[1] : undefined
    });
  };

  const applyQuickFilter = (preset: 'budget' | 'premium' | 'student') => {
    let presetFilters: Partial<FilterOptions> = {};
    
    if (preset === 'budget') {
      presetFilters = {
        price_min: 0,
        price_max: 8000,
        suitable_for: 'Students',
      };
      setPriceRange([0, 8000]);
    } else if (preset === 'premium') {
      presetFilters = {
        price_min: 15000,
        price_max: 50000,
        verified: true,
        amenities: ['WiFi', 'AC', 'Security'],
        furnishing_type: 'Fully Furnished',
      };
      setPriceRange([15000, 50000]);
      setSelectedAmenities(['WiFi', 'AC', 'Security']);
    } else if (preset === 'student') {
      presetFilters = {
        suitable_for: 'Students',
        food_included: true,
        amenities: ['WiFi', 'Mess/Kitchen'],
      };
      setSelectedAmenities(['WiFi', 'Mess/Kitchen']);
    }

    setLocalFilters({ ...localFilters, ...presetFilters });
  };

  const clearAllFilters = () => {
    setLocalFilters({});
    setSelectedAmenities([]);
    setPriceRange([0, 50000]);
    setDepositRange([0, 100000]);
  };

  const handleApply = () => {
    onApplyFilters(localFilters);
    onOpenChange(false);
  };

  const activeFilterCount = Object.keys(localFilters).filter(key => {
    const value = localFilters[key as keyof FilterOptions];
    return value !== undefined && value !== '' && (Array.isArray(value) ? value.length > 0 : true);
  }).length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0">
        <DialogHeader className="px-6 pt-6 pb-4">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl">Advanced Filters</DialogTitle>
              <DialogDescription className="mt-1">
                Refine your search to find the perfect property
              </DialogDescription>
            </div>
            {activeFilterCount > 0 && (
              <Badge variant="default" className="text-sm px-3 py-1">
                {activeFilterCount} Active
              </Badge>
            )}
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-180px)] px-6">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="basic">Basic</TabsTrigger>
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
              <TabsTrigger value="amenities">Amenities</TabsTrigger>
            </TabsList>

            {/* Basic Filters Tab */}
            <TabsContent value="basic" className="space-y-6">
              {/* Quick Filter Presets */}
              <div className="space-y-3">
                <Label className="text-sm font-semibold">Quick Filters</Label>
                <div className="grid grid-cols-3 gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => applyQuickFilter('budget')}
                    className="flex flex-col items-center gap-2 h-auto py-4 hover:border-primary hover:bg-primary/5"
                  >
                    <DollarSign className="h-5 w-5 text-green-500" />
                    <span className="text-sm font-medium">Budget</span>
                    <span className="text-xs text-muted-foreground">Under ₹8k</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => applyQuickFilter('premium')}
                    className="flex flex-col items-center gap-2 h-auto py-4 hover:border-primary hover:bg-primary/5"
                  >
                    <Sparkles className="h-5 w-5 text-amber-500" />
                    <span className="text-sm font-medium">Premium</span>
                    <span className="text-xs text-muted-foreground">₹15k+</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => applyQuickFilter('student')}
                    className="flex flex-col items-center gap-2 h-auto py-4 hover:border-primary hover:bg-primary/5"
                  >
                    <GraduationCap className="h-5 w-5 text-blue-500" />
                    <span className="text-sm font-medium">Student</span>
                    <span className="text-xs text-muted-foreground">With food</span>
                  </Button>
                </div>
              </div>

              <Separator />

              {/* Location Filters */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="h-4 w-4 text-primary" />
                  <Label className="text-base font-semibold">Location</Label>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
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
                </div>
              </div>

              <Separator />

              {/* Property Type */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 mb-2">
                  <Home className="h-4 w-4 text-primary" />
                  <Label className="text-base font-semibold">Property Type</Label>
                </div>
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

              {/* Price Range */}
              <div className="space-y-4">
                <Label className="text-base font-semibold">Price Range (₹/month)</Label>
                <div className="space-y-4">
                  <Slider
                    min={0}
                    max={50000}
                    step={500}
                    value={priceRange}
                    onValueChange={handlePriceSliderChange}
                    className="w-full"
                  />
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">₹{priceRange[0].toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">to</div>
                    <div className="text-sm font-medium">₹{priceRange[1].toLocaleString()}</div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Suitable For */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">Suitable For</Label>
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
            </TabsContent>

            {/* Advanced Filters Tab */}
            <TabsContent value="advanced" className="space-y-6">
              {/* Availability Status */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">Availability</Label>
                <Select
                  value={localFilters.availability_status || 'all'}
                  onValueChange={(value) => handleChange('availability_status', value === 'all' ? undefined : value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Any" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Any</SelectItem>
                    {availabilityOptions.map((option) => (
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
                <div className="flex items-center gap-2 mb-2">
                  <Bed className="h-4 w-4 text-primary" />
                  <Label className="text-base font-semibold">Furnishing</Label>
                </div>
                <Select
                  value={localFilters.furnishing_type || 'all'}
                  onValueChange={(value) => handleChange('furnishing_type', value === 'all' ? undefined : value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Any" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Any</SelectItem>
                    {furnishingTypes.map((type) => (
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
                <Label className="text-base font-semibold">Occupancy Type</Label>
                <Select
                  value={localFilters.occupancy_type || 'all'}
                  onValueChange={(value) => handleChange('occupancy_type', value === 'all' ? undefined : value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Any" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Any</SelectItem>
                    {occupancyTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              {/* Floor Preference */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">Floor Preference</Label>
                <Select
                  value={localFilters.floor_preference || 'all'}
                  onValueChange={(value) => handleChange('floor_preference', value === 'all' ? undefined : value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Any" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Any Floor</SelectItem>
                    {floorPreferences.map((pref) => (
                      <SelectItem key={pref} value={pref}>
                        {pref}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              {/* Deposit Range */}
              <div className="space-y-4">
                <Label className="text-base font-semibold">Security Deposit Range (₹)</Label>
                <div className="space-y-4">
                  <Slider
                    min={0}
                    max={100000}
                    step={1000}
                    value={depositRange}
                    onValueChange={handleDepositSliderChange}
                    className="w-full"
                  />
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">₹{depositRange[0].toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">to</div>
                    <div className="text-sm font-medium">₹{depositRange[1].toLocaleString()}</div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Additional Options */}
              <div className="space-y-4">
                <Label className="text-base font-semibold">Additional Options</Label>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                    <Checkbox
                      id="verified"
                      checked={localFilters.verified || false}
                      onCheckedChange={(checked) => handleChange('verified', checked || undefined)}
                    />
                    <div className="flex items-center gap-2 flex-1">
                      <Shield className="h-4 w-4 text-primary" />
                      <Label htmlFor="verified" className="cursor-pointer font-medium">
                        RoomSaathi Verified Only
                      </Label>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                    <Checkbox
                      id="food"
                      checked={localFilters.food_included || false}
                      onCheckedChange={(checked) => handleChange('food_included', checked || undefined)}
                    />
                    <div className="flex items-center gap-2 flex-1">
                      <Utensils className="h-4 w-4 text-primary" />
                      <Label htmlFor="food" className="cursor-pointer font-medium">
                        Food Included
                      </Label>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                    <Checkbox
                      id="parking"
                      checked={localFilters.parking_available || false}
                      onCheckedChange={(checked) => handleChange('parking_available', checked || undefined)}
                    />
                    <div className="flex items-center gap-2 flex-1">
                      <Car className="h-4 w-4 text-primary" />
                      <Label htmlFor="parking" className="cursor-pointer font-medium">
                        Parking Available
                      </Label>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Amenities Tab */}
            <TabsContent value="amenities" className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Wifi className="h-4 w-4 text-primary" />
                    <Label className="text-base font-semibold">Select Amenities</Label>
                  </div>
                  {selectedAmenities.length > 0 && (
                    <Badge variant="secondary">
                      {selectedAmenities.length} selected
                    </Badge>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {amenitiesList.map((amenity) => (
                    <div
                      key={amenity}
                      className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                    >
                      <Checkbox
                        id={amenity}
                        checked={selectedAmenities.includes(amenity)}
                        onCheckedChange={() => handleAmenityToggle(amenity)}
                      />
                      <Label htmlFor={amenity} className="cursor-pointer font-medium flex-1">
                        {amenity}
                      </Label>
                    </div>
                  ))}
                </div>

                {selectedAmenities.length > 0 && (
                  <div className="space-y-2 pt-4 border-t border-border">
                    <Label className="text-sm text-muted-foreground">Selected Amenities:</Label>
                    <div className="flex flex-wrap gap-2">
                      {selectedAmenities.map((amenity) => (
                        <Badge key={amenity} variant="secondary" className="gap-1.5 px-3 py-1">
                          {amenity}
                          <button
                            type="button"
                            onClick={() => handleAmenityToggle(amenity)}
                            className="hover:text-destructive"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </ScrollArea>

        <DialogFooter className="px-6 py-4 border-t border-border">
          <div className="flex items-center justify-between w-full gap-3">
            <Button
              variant="outline"
              onClick={clearAllFilters}
              className="flex-1"
            >
              Clear All
            </Button>
            <Button
              onClick={handleApply}
              className="flex-1"
            >
              Apply Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
