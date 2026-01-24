import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useSearchParams } from 'react-router';
import { Grid3x3, List, SlidersHorizontal, Search, X } from 'lucide-react';
import type { Property } from '@/types/index';
import type { FilterOptions } from '@/types/index';
import { getProperties } from '@/db/api';
import PropertyCard from '@/components/property/PropertyCard';
import AdvancedFilterBar from '@/components/property/AdvancedFilterBar';
import Header from '@/components/layouts/Header';
import Footer from '@/components/layouts/Footer';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

type SortOption = 'newest' | 'price_low' | 'price_high' | 'name_az' | 'name_za';
type ViewMode = 'grid' | 'list';

export default function BrowsePropertiesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterOptions>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [isSearchBarSticky, setIsSearchBarSticky] = useState(false);
  const searchBarRef = useRef<HTMLDivElement>(null);
  const searchTimeoutRef = useRef<number | undefined>(undefined);

  // Initialize filters from URL
  useEffect(() => {
    const urlFilters: FilterOptions = {};
    const city = searchParams.get('city');
    const locality = searchParams.get('locality');
    const type = searchParams.get('type');
    const search = searchParams.get('search');
    const verified = searchParams.get('verified');
    const priceMin = searchParams.get('price_min');
    const priceMax = searchParams.get('price_max');
    const amenities = searchParams.get('amenities');
    const gender = searchParams.get('gender');
    const foodIncluded = searchParams.get('food_included');

    if (city) urlFilters.city = city;
    if (locality) urlFilters.locality = locality;
    if (type) urlFilters.type = type;
    if (search) {
      urlFilters.search = search;
      setSearchQuery(search);
    }
    if (verified === 'true') urlFilters.verified = true;
    if (priceMin) urlFilters.price_min = parseInt(priceMin);
    if (priceMax) urlFilters.price_max = parseInt(priceMax);
    if (amenities) urlFilters.amenities = amenities.split(',');
    if (gender) urlFilters.gender = gender;
    if (foodIncluded === 'true') urlFilters.food_included = true;

    setFilters(urlFilters);
  }, [searchParams]);

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
  }, [filters]);

  // Sort properties when sort option changes
  useEffect(() => {
    sortProperties();
  }, [sortBy, properties]);

  // Real-time search with debouncing
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = window.setTimeout(() => {
      if (searchQuery !== (filters.search || '')) {
        updateFilters({ ...filters, search: searchQuery || undefined });
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
      const data = await getProperties(filters);
      setProperties(data);
      setFilteredProperties(data);
    } catch (error) {
      console.error('Failed to load properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const sortProperties = () => {
    const sorted = [...properties];
    switch (sortBy) {
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

  const updateFilters = useCallback((newFilters: FilterOptions) => {
    // Update URL params
    const params = new URLSearchParams();
    if (newFilters.city) params.set('city', newFilters.city);
    if (newFilters.locality) params.set('locality', newFilters.locality);
    if (newFilters.type) params.set('type', newFilters.type);
    if (newFilters.search) params.set('search', newFilters.search);
    if (newFilters.verified) params.set('verified', 'true');
    if (newFilters.price_min) params.set('price_min', newFilters.price_min.toString());
    if (newFilters.price_max) params.set('price_max', newFilters.price_max.toString());
    if (newFilters.amenities && newFilters.amenities.length > 0) {
      params.set('amenities', newFilters.amenities.join(','));
    }
    if (newFilters.gender) params.set('gender', newFilters.gender);
    if (newFilters.food_included) params.set('food_included', 'true');

    setSearchParams(params);
    setFilters(newFilters);
    setMobileFiltersOpen(false);
  }, [setSearchParams]);

  const handleFilterChange = (newFilters: FilterOptions) => {
    updateFilters(newFilters);
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    updateFilters({});
  };

  const removeFilter = (key: keyof FilterOptions) => {
    const newFilters = { ...filters };
    delete newFilters[key];
    if (key === 'search') {
      setSearchQuery('');
    }
    updateFilters(newFilters);
  };

  const activeFilterCount = [
    filters.city,
    filters.locality,
    filters.type,
    filters.verified,
    filters.price_min !== undefined || filters.price_max !== undefined,
    filters.search,
    filters.amenities && filters.amenities.length > 0,
    filters.gender,
    filters.food_included,
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Page Header */}
        <section className="bg-muted/30 py-8 xl:py-12 border-b border-border">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-3xl xl:text-4xl font-bold mb-2">
                Browse <span className="gradient-text">Properties</span>
              </h1>
              <p className="text-muted-foreground">
                Discover your perfect accommodation from our extensive collection
              </p>
            </motion.div>
          </div>
        </section>

        {/* Search Bar - Becomes Sticky */}
        <div
          ref={searchBarRef}
          className={`bg-background border-b border-border transition-all duration-300 ${
            isSearchBarSticky ? 'sticky top-16 z-40 shadow-md' : ''
          }`}
        >
          <div className="container mx-auto px-4 py-4">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search by property name, locality, or amenities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-10"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" className="xl:hidden">
                    <SlidersHorizontal className="mr-2 h-4 w-4" />
                    Filters
                    {activeFilterCount > 0 && (
                      <Badge variant="default" className="ml-2">
                        {activeFilterCount}
                      </Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-full @sm:w-96 overflow-y-auto">
                  <SheetHeader>
                    <SheetTitle>Filter Properties</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6">
                    <AdvancedFilterBar filters={filters} onFilterChange={handleFilterChange} />
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            {/* Active Filter Chips */}
            {activeFilterCount > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {filters.city && (
                  <Badge variant="secondary" className="gap-1">
                    City: {filters.city}
                    <button onClick={() => removeFilter('city')} className="ml-1 hover:text-destructive">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                {filters.locality && (
                  <Badge variant="secondary" className="gap-1">
                    Locality: {filters.locality}
                    <button onClick={() => removeFilter('locality')} className="ml-1 hover:text-destructive">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                {filters.type && (
                  <Badge variant="secondary" className="gap-1">
                    Type: {filters.type}
                    <button onClick={() => removeFilter('type')} className="ml-1 hover:text-destructive">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                {filters.verified && (
                  <Badge variant="secondary" className="gap-1">
                    Verified Only
                    <button onClick={() => removeFilter('verified')} className="ml-1 hover:text-destructive">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                {(filters.price_min || filters.price_max) && (
                  <Badge variant="secondary" className="gap-1">
                    Price: ₹{filters.price_min || 0} - ₹{filters.price_max || '∞'}
                    <button onClick={() => {
                      const newFilters = { ...filters };
                      delete newFilters.price_min;
                      delete newFilters.price_max;
                      updateFilters(newFilters);
                    }} className="ml-1 hover:text-destructive">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                {filters.gender && (
                  <Badge variant="secondary" className="gap-1">
                    Gender: {filters.gender}
                    <button onClick={() => removeFilter('gender')} className="ml-1 hover:text-destructive">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                {filters.food_included && (
                  <Badge variant="secondary" className="gap-1">
                    Food Included
                    <button onClick={() => removeFilter('food_included')} className="ml-1 hover:text-destructive">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                {filters.amenities && filters.amenities.length > 0 && (
                  <Badge variant="secondary" className="gap-1">
                    {filters.amenities.length} Amenities
                    <button onClick={() => removeFilter('amenities')} className="ml-1 hover:text-destructive">
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

        <div className="container mx-auto px-4 py-8">
          <div className="grid xl:grid-cols-[300px_1fr] gap-8">
            {/* Desktop Sidebar Filters */}
            <aside className="hidden xl:block">
              <div className="sticky top-32">
                <div className="bg-card border border-border rounded-lg p-6">
                  <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                    <SlidersHorizontal className="h-5 w-5" />
                    Advanced Filters
                    {activeFilterCount > 0 && (
                      <Badge variant="default" className="ml-auto">
                        {activeFilterCount}
                      </Badge>
                    )}
                  </h3>
                  <AdvancedFilterBar filters={filters} onFilterChange={handleFilterChange} />
                </div>
              </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1">
              {/* Toolbar */}
              <div className="flex flex-col @md:flex-row justify-between items-start @md:items-center gap-4 mb-6">
                <div className="text-sm text-muted-foreground">
                  {loading ? (
                    <span>Loading...</span>
                  ) : (
                    <span>
                      <strong className="text-foreground">{filteredProperties.length}</strong> properties found
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  {/* Sort Dropdown */}
                  <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest First</SelectItem>
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
                <div className={viewMode === 'grid' ? 'grid grid-cols-1 @md:grid-cols-2 xl:grid-cols-2 gap-6' : 'space-y-6'}>
                  {[...Array(6)].map((_, i) => (
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
                      ? 'grid grid-cols-1 @md:grid-cols-2 xl:grid-cols-2 gap-6'
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
                  className="text-center py-16"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                    <Search className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">No properties found</h3>
                  <p className="text-muted-foreground mb-6">
                    Try adjusting your filters or search query
                  </p>
                  <Button onClick={clearAllFilters}>Clear All Filters</Button>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
