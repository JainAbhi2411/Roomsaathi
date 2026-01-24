import { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import type { FilterOptions } from '@/types/index';
import { getLocalitiesByCity } from '@/db/api';

interface FilterBarProps {
  filters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
}

const CITIES = ['Sikar', 'Jaipur', 'Kota'];
const PROPERTY_TYPES = ['PG', 'Flat', 'Apartment', 'Room', 'Hostel', 'Short Term Stay'];

export default function FilterBar({ filters, onFilterChange }: FilterBarProps) {
  const [localities, setLocalities] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<number[]>([filters.price_min || 0, filters.price_max || 50000]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (filters.city) {
      getLocalitiesByCity(filters.city).then(setLocalities);
    } else {
      setLocalities([]);
    }
  }, [filters.city]);

  const handleCityChange = (city: string) => {
    onFilterChange({ ...filters, city, locality: undefined });
  };

  const handleLocalityChange = (locality: string) => {
    onFilterChange({ ...filters, locality });
  };

  const handleTypeChange = (type: string) => {
    onFilterChange({ ...filters, type });
  };

  const handleVerifiedToggle = () => {
    onFilterChange({ ...filters, verified: !filters.verified });
  };

  const handleSearchChange = (search: string) => {
    onFilterChange({ ...filters, search });
  };

  const handlePriceApply = () => {
    onFilterChange({ ...filters, price_min: priceRange[0], price_max: priceRange[1] });
    setIsOpen(false);
  };

  const clearFilters = () => {
    onFilterChange({});
    setPriceRange([0, 50000]);
  };

  const activeFilterCount = [
    filters.city,
    filters.locality,
    filters.type,
    filters.verified,
    filters.price_min !== undefined || filters.price_max !== undefined,
  ].filter(Boolean).length;

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search properties by name, locality..."
          value={filters.search || ''}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Quick Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <Select value={filters.city || ''} onValueChange={handleCityChange}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Select City" />
          </SelectTrigger>
          <SelectContent>
            {CITIES.map((city) => (
              <SelectItem key={city} value={city}>
                {city}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {filters.city && localities.length > 0 && (
          <Select value={filters.locality || ''} onValueChange={handleLocalityChange}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select Locality" />
            </SelectTrigger>
            <SelectContent>
              {localities.map((locality) => (
                <SelectItem key={locality} value={locality}>
                  {locality}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        <Select value={filters.type || ''} onValueChange={handleTypeChange}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Property Type" />
          </SelectTrigger>
          <SelectContent>
            {PROPERTY_TYPES.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          variant={filters.verified ? 'default' : 'outline'}
          onClick={handleVerifiedToggle}
          size="sm"
        >
          RoomSaathi Verified
        </Button>

        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm">
              <SlidersHorizontal className="mr-2 h-4 w-4" />
              More Filters
              {activeFilterCount > 0 && (
                <Badge variant="default" className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center">
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Filter Properties</SheetTitle>
            </SheetHeader>
            <div className="mt-6 space-y-6">
              <div>
                <Label className="mb-3 block">Price Range (₹/month)</Label>
                <Slider
                  value={priceRange}
                  onValueChange={setPriceRange}
                  max={50000}
                  min={0}
                  step={1000}
                  className="mb-2"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>₹{priceRange[0].toLocaleString()}</span>
                  <span>₹{priceRange[1].toLocaleString()}</span>
                </div>
              </div>
              <Button onClick={handlePriceApply} className="w-full">
                Apply Filters
              </Button>
            </div>
          </SheetContent>
        </Sheet>

        {activeFilterCount > 0 && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            <X className="mr-2 h-4 w-4" />
            Clear All
          </Button>
        )}
      </div>

      {/* Active Filters Display */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {filters.city && (
            <Badge variant="secondary">
              City: {filters.city}
              <X
                className="ml-1 h-3 w-3 cursor-pointer"
                onClick={() => onFilterChange({ ...filters, city: undefined, locality: undefined })}
              />
            </Badge>
          )}
          {filters.locality && (
            <Badge variant="secondary">
              Locality: {filters.locality}
              <X
                className="ml-1 h-3 w-3 cursor-pointer"
                onClick={() => onFilterChange({ ...filters, locality: undefined })}
              />
            </Badge>
          )}
          {filters.type && (
            <Badge variant="secondary">
              Type: {filters.type}
              <X
                className="ml-1 h-3 w-3 cursor-pointer"
                onClick={() => onFilterChange({ ...filters, type: undefined })}
              />
            </Badge>
          )}
          {filters.verified && (
            <Badge variant="secondary">
              Verified Only
              <X
                className="ml-1 h-3 w-3 cursor-pointer"
                onClick={() => onFilterChange({ ...filters, verified: undefined })}
              />
            </Badge>
          )}
          {(filters.price_min !== undefined || filters.price_max !== undefined) && (
            <Badge variant="secondary">
              Price: ₹{filters.price_min || 0} - ₹{filters.price_max || 50000}
              <X
                className="ml-1 h-3 w-3 cursor-pointer"
                onClick={() => onFilterChange({ ...filters, price_min: undefined, price_max: undefined })}
              />
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
