import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useSearchParams } from 'react-router';
import { Grid3x3, List, SlidersHorizontal, Search, X, Filter, Navigation, Loader2 } from 'lucide-react';
import type { PropertyWithDetails } from '@/types/index';
import type { FilterOptions } from '@/types/index';
import { getProperties } from '@/db/api';
import PropertyCard from '@/components/property/PropertyCard';
import FilterModal from '@/components/property/FilterModal';
import Header from '@/components/layouts/Header';
import Footer from '@/components/layouts/Footer';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useSearchFilter } from '@/contexts/SearchFilterContext';
import { useGeolocation } from '@/hooks/use-geolocation';
import { calculateDistance, formatDistance } from '@/lib/geolocation';
import { useToast } from '@/hooks/use-toast';

type SortOption = 'newest' | 'price_low' | 'price_high' | 'name_az' | 'name_za' | 'distance';
type ViewMode = 'grid' | 'list';

export default function BrowsePropertiesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { 
    filters: contextFilters, 
    updateFilter, 
    clearFilters: clearContextFilters, 
    activeFilterCount,
    userLocation: contextUserLocation,
    setUserLocation: setContextUserLocation,
    nearMeActive,
    setNearMeActive
  } = useSearchFilter();
  const [properties, setProperties] = useState<PropertyWithDetails[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<PropertyWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>(() => {
    // Initialize sort from URL or default to 'newest'
    const sortParam = searchParams.get('sort');
    return (sortParam as SortOption) || 'newest';
  });
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [isSearchBarSticky, setIsSearchBarSticky] = useState(false);
  const searchBarRef = useRef<HTMLDivElement>(null);
  const searchTimeoutRef = useRef<number | undefined>(undefined);
  const { location: geoLocation, loading: locationLoading, requestLocation, isAvailable: isGeolocationAvailable } = useGeolocation();
  const { toast } = useToast();

  // Initialize search query from context filters
  useEffect(() => {
    if (contextFilters.search) {
      setSearchQuery(contextFilters.search);
    }
  }, [contextFilters.search]);

  // Initialize sort from URL and restore Near Me state
  useEffect(() => {
    const sortParam = searchParams.get('sort');
    if (sortParam) {
      setSortBy(sortParam as SortOption);
    }
    // If Near Me was active and we have location, restore it
    if (nearMeActive && contextUserLocation) {
      setSortBy('distance');
    }
  }, []);

  // Update geolocation when it changes
  useEffect(() => {
    if (geoLocation) {
      setContextUserLocation(geoLocation);
    }
  }, [geoLocation, setContextUserLocation]);

  // Sticky search bar on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (searchBarRef.current) {
        const rect = searchBarRef.current.getBoundingClientRect();
        setIsSearchBarSticky(rect.top <= 64); // 64px is header height
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Load properties when filters change
  useEffect(() => {
    loadProperties();
    // Poll for updates every 30 seconds
    const interval = setInterval(loadProperties, 30000);
    return () => clearInterval(interval);
  }, [contextFilters]);

  // Sort properties when sort option changes or user location changes
  useEffect(() => {
    sortProperties();
  }, [sortBy, properties, contextUserLocation]);

  // Real-time search with debouncing
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = window.setTimeout(() => {
      if (searchQuery !== (contextFilters.search || '')) {
        updateFilter('search', searchQuery || undefined);
        updateUrlParams();
      }
    }, 500); // 500ms debounce

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery]);

  const loadProperties = async () => {
    setLoading(true);
    try {
      const data = await getProperties(contextFilters);
      setProperties(data);
      setFilteredProperties(data);
    } catch (error) {
      console.error('Failed to load properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const sortProperties = () => {
    let sorted = [...properties];
    
    // Calculate distances if user location is available and sorting by distance
    if (sortBy === 'distance' && contextUserLocation) {
      sorted = sorted.map(property => {
        if (property.latitude && property.longitude) {
          const distance = calculateDistance(contextUserLocation, {
            latitude: property.latitude,
            longitude: property.longitude
          });
          return { ...property, distance };
        }
        return { ...property, distance: undefined };
      });
    }
    
    switch (sortBy) {
      case 'distance':
        // Sort by distance (properties without coordinates go to the end)
        sorted.sort((a, b) => {
          if (a.distance === undefined && b.distance === undefined) return 0;
          if (a.distance === undefined) return 1;
          if (b.distance === undefined) return -1;
          return a.distance - b.distance;
        });
        break;
      case 'price_low':
        sorted.sort((a, b) => a.price_from - b.price_from);
        break;
      case 'price_high':
        sorted.sort((a, b) => b.price_from - a.price_from);
        break;
      case 'name_az':
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name_za':
        sorted.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'newest':
      default:
        sorted.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
    }
    setFilteredProperties(sorted);
  };

  const updateUrlParams = useCallback(() => {
    const params = new URLSearchParams();
    if (contextFilters.city) params.set('city', contextFilters.city);
    if (contextFilters.locality) params.set('locality', contextFilters.locality);
    if (contextFilters.type) params.set('type', contextFilters.type);
    if (contextFilters.search) params.set('search', contextFilters.search);
    if (contextFilters.verified) params.set('verified', 'true');
    if (contextFilters.price_min) params.set('price_min', contextFilters.price_min.toString());
    if (contextFilters.price_max) params.set('price_max', contextFilters.price_max.toString());
    if (contextFilters.amenities && contextFilters.amenities.length > 0) {
      params.set('amenities', contextFilters.amenities.join(','));
    }
    if (contextFilters.suitable_for) params.set('suitable_for', contextFilters.suitable_for);
    if (contextFilters.food_included) params.set('food_included', 'true');
    if (contextFilters.availability_status) params.set('availability_status', contextFilters.availability_status);
    if (contextFilters.furnishing_type) params.set('furnishing_type', contextFilters.furnishing_type);
    if (contextFilters.occupancy_type) params.set('occupancy_type', contextFilters.occupancy_type);
    if (contextFilters.parking_available) params.set('parking_available', 'true');
    if (contextFilters.floor_preference) params.set('floor_preference', contextFilters.floor_preference);
    if (contextFilters.deposit_min) params.set('deposit_min', contextFilters.deposit_min.toString());
    if (contextFilters.deposit_max) params.set('deposit_max', contextFilters.deposit_max.toString());
    
    // Add sort parameter to URL
    if (sortBy !== 'newest') {
      params.set('sort', sortBy);
    }

    setSearchParams(params);
  }, [contextFilters, sortBy, setSearchParams]);

  const handleFilterChange = (newFilters: FilterOptions) => {
    // Update each filter in context
    Object.keys(newFilters).forEach(key => {
      updateFilter(key as keyof FilterOptions, newFilters[key as keyof FilterOptions]);
    });
    updateUrlParams();
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    clearContextFilters();
  };

  const removeFilter = (key: keyof FilterOptions) => {
    if (key === 'search') {
      setSearchQuery('');
    }
    updateFilter(key, undefined);
    updateUrlParams();
  };

  const handleNearMeClick = async () => {
    if (!isGeolocationAvailable) {
      toast({
        title: 'Location Not Available',
        description: 'Your browser does not support geolocation.',
        variant: 'destructive'
      });
      return;
    }

    await requestLocation();
    
    if (geoLocation) {
      setContextUserLocation(geoLocation);
      setNearMeActive(true);
      setSortBy('distance');
      updateUrlParams();
      toast({
        title: 'Location Detected',
        description: 'Properties are now sorted by distance from your location.',
      });
    } else {
      toast({
        title: 'Location Access Denied',
        description: 'Please enable location access to use the "Near Me" feature.',
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Page Header */}
        <section className="bg-muted/30 py-6 xl:py-6 xl:py-12 border-b border-border">
          <div className="container mx-auto px-3 xl:px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-lg xl:text-2xl xl:text-lg xl:text-2xl xl:text-4xl font-bold mb-1.5 xl:mb-2">
                Browse <span className="gradient-text">Properties</span>
              </h1>
              <p className="text-sm xl:text-base text-muted-foreground">
                Discover your perfect accommodation from our extensive collection
              </p>
            </motion.div>
          </div>
        </section>

        {/* Search Bar - Becomes Sticky */}
        <div
          ref={searchBarRef}
          className={`bg-background border-b border-border transition-all duration-300 ${
            isSearchBarSticky ? 'sticky top-14 xl:top-16 z-40 shadow-md' : ''
          }`}
        >
          <div className="container mx-auto px-3 xl:px-3 xl:px-4 py-3 xl:py-4">
            <div className="flex gap-2 xl:gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 xl:left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 xl:h-4 xl:w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search properties..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 xl:pl-10 pr-9 xl:pr-10 h-9 xl:h-10 text-sm"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 xl:right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-3.5 w-3.5 xl:h-4 xl:w-4" />
                  </button>
                )}
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setFilterModalOpen(true)}
                className="h-9 px-3 xl:px-4 gap-2"
              >
                <SlidersHorizontal className="h-4 w-4" />
                <span className="hidden @md:inline">Filters</span>
                {activeFilterCount > 0 && (
                  <Badge variant="default" className="ml-1 text-xs px-1.5 py-0">
                    {activeFilterCount}
                  </Badge>
                )}
              </Button>
            </div>

            {/* Active Filter Chips */}
            {activeFilterCount > 0 && (
              <div className="flex flex-wrap gap-1.5 xl:gap-2 mt-2 xl:mt-3">
                {contextFilters.city && (
                  <Badge variant="secondary" className="gap-1 text-[10px] xl:text-xs px-1.5 xl:px-2 py-0.5">
                    City: {contextFilters.city}
                    <button type="button" onClick={() => removeFilter('city')} className="ml-0.5 xl:ml-1 hover:text-destructive">
                      <X className="h-2.5 w-2.5 xl:h-3 xl:w-3" />
                    </button>
                  </Badge>
                )}
                {contextFilters.locality && (
                  <Badge variant="secondary" className="gap-1 text-[10px] xl:text-xs px-1.5 xl:px-2 py-0.5">
                    Locality: {contextFilters.locality}
                    <button type="button" onClick={() => removeFilter('locality')} className="ml-0.5 xl:ml-1 hover:text-destructive">
                      <X className="h-2.5 w-2.5 xl:h-3 xl:w-3" />
                    </button>
                  </Badge>
                )}
                {contextFilters.type && (
                  <Badge variant="secondary" className="gap-1">
                    Type: {contextFilters.type}
                    <button type="button" onClick={() => removeFilter('type')} className="ml-1 hover:text-destructive">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                {contextFilters.verified && (
                  <Badge variant="secondary" className="gap-1">
                    Verified Only
                    <button type="button" onClick={() => removeFilter('verified')} className="ml-1 hover:text-destructive">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                {(contextFilters.price_min || contextFilters.price_max) && (
                  <Badge variant="secondary" className="gap-1">
                    Price: ₹{contextFilters.price_min || 0} - ₹{contextFilters.price_max || '∞'}
                    <button type="button" onClick={() => {
                      updateFilter('price_min', undefined);
                      updateFilter('price_max', undefined);
                    }} className="ml-1 hover:text-destructive">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                {contextFilters.suitable_for && (
                  <Badge variant="secondary" className="gap-1">
                    Suitable for: {contextFilters.suitable_for}
                    <button type="button" onClick={() => removeFilter('suitable_for')} className="ml-1 hover:text-destructive">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                {contextFilters.food_included && (
                  <Badge variant="secondary" className="gap-1">
                    Food Included
                    <button type="button" onClick={() => removeFilter('food_included')} className="ml-1 hover:text-destructive">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                {contextFilters.amenities && contextFilters.amenities.length > 0 && (
                  <Badge variant="secondary" className="gap-1">
                    {contextFilters.amenities.length} Amenities
                    <button type="button" onClick={() => removeFilter('amenities')} className="ml-1 hover:text-destructive">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                {contextFilters.furnishing_type && (
                  <Badge variant="secondary" className="gap-1">
                    {contextFilters.furnishing_type}
                    <button type="button" onClick={() => removeFilter('furnishing_type')} className="ml-1 hover:text-destructive">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                {contextFilters.occupancy_type && (
                  <Badge variant="secondary" className="gap-1">
                    {contextFilters.occupancy_type} Occupancy
                    <button type="button" onClick={() => removeFilter('occupancy_type')} className="ml-1 hover:text-destructive">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                {contextFilters.parking_available && (
                  <Badge variant="secondary" className="gap-1">
                    Parking Available
                    <button type="button" onClick={() => removeFilter('parking_available')} className="ml-1 hover:text-destructive">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAllFilters}
                  className="h-6 text-xs"
                >
                  Clear All
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="container mx-auto px-3 xl:px-3 xl:px-4 py-6 xl:py-8">
          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex flex-col @md:flex-row justify-between items-start @md:items-center gap-3 xl:gap-4 mb-4 xl:mb-6">
              <div className="text-xs xl:text-sm text-muted-foreground">
                {loading ? (
                  <span>Loading...</span>
                ) : (
                  <span>
                    <strong className="text-foreground">{filteredProperties.length}</strong> properties found
                    {sortBy === 'distance' && contextUserLocation && (
                      <span className="ml-2 text-primary">• Sorted by distance</span>
                      )}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 xl:gap-3 flex-wrap">
                  {/* Near Me Button */}
                  <Button
                    variant={sortBy === 'distance' ? 'default' : 'outline'}
                    size="sm"
                    onClick={handleNearMeClick}
                    disabled={locationLoading}
                    className="gap-1.5 xl:gap-2 h-8 xl:h-9 text-xs xl:text-sm px-2.5 xl:px-3"
                  >
                    {locationLoading ? (
                      <Loader2 className="h-3 w-3 xl:h-4 xl:w-4 animate-spin" />
                    ) : (
                      <Navigation className="h-3 w-3 xl:h-4 xl:w-4" />
                    )}
                    Near Me
                  </Button>

                  {/* Sort Dropdown */}
                  <Select 
                    value={sortBy} 
                    onValueChange={(value) => {
                      setSortBy(value as SortOption);
                      if (value === 'distance') {
                        setNearMeActive(true);
                      }
                      // Update URL will happen via useEffect watching sortBy
                      setTimeout(updateUrlParams, 0);
                    }}
                  >
                    <SelectTrigger className="w-36 xl:w-48 h-8 xl:h-9 text-xs xl:text-sm">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest First</SelectItem>
                      <SelectItem value="distance">Distance (Near Me)</SelectItem>
                      <SelectItem value="price_low">Price: Low to High</SelectItem>
                      <SelectItem value="price_high">Price: High to Low</SelectItem>
                      <SelectItem value="name_az">Name: A to Z</SelectItem>
                      <SelectItem value="name_za">Name: Z to A</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* View Mode Toggle */}
                  <div className="hidden @md:flex border border-border rounded-lg">
                    <Button
                      variant={viewMode === 'grid' ? 'default' : 'ghost'}
                      size="icon"
                      onClick={() => setViewMode('grid')}
                      className="rounded-r-none"
                    >
                      <Grid3x3 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === 'list' ? 'default' : 'ghost'}
                      size="icon"
                      onClick={() => setViewMode('list')}
                      className="rounded-l-none"
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <Separator className="mb-6" />

              {/* Properties Grid/List */}
              {loading ? (
                <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5' : 'space-y-6'}>
                  {[...Array(9)].map((_, i) => (
                    <div key={i} className="space-y-4">
                      <Skeleton className="h-48 w-full bg-muted" />
                      <Skeleton className="h-6 w-3/4 bg-muted" />
                      <Skeleton className="h-4 w-full bg-muted" />
                      <Skeleton className="h-4 w-2/3 bg-muted" />
                    </div>
                  ))}
                </div>
              ) : filteredProperties.length > 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4 }}
                  className={
                    viewMode === 'grid'
                      ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5'
                      : 'space-y-6'
                  }
                >
                  {filteredProperties.map((property, index) => (
                    <motion.div
                      key={property.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <PropertyCard property={property} />
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-4 xl:py-8 xl:py-16"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                    <Search className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-base xl:text-xl font-semibold mb-2">No properties found</h3>
                  <p className="text-muted-foreground mb-6">
                    Try adjusting your filters or search query
                  </p>
                  <Button onClick={clearAllFilters}>Clear All Filters</Button>
                </motion.div>
              )}
          </div>
        </div>

        {/* Filter Modal */}
        <FilterModal
          open={filterModalOpen}
          onOpenChange={setFilterModalOpen}
          filters={contextFilters}
          onApplyFilters={handleFilterChange}
        />
      </main>
      <Footer />
    </div>
  );
}
