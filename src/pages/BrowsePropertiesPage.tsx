import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useSearchParams } from 'react-router';
import { Grid3x3, List, SlidersHorizontal, Search, X, Filter } from 'lucide-react';
import type { PropertyWithDetails } from '@/types/index';
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
import { useSearchFilter } from '@/contexts/SearchFilterContext';
import { supabase } from '@/db/supabase';

type SortOption = 'newest' | 'price_low' | 'price_high' | 'name_az' | 'name_za';
type ViewMode = 'grid' | 'list';

export default function BrowsePropertiesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { filters: contextFilters, updateFilter, clearFilters: clearContextFilters, activeFilterCount } = useSearchFilter();
  const [properties, setProperties] = useState<PropertyWithDetails[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<PropertyWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [isSearchBarSticky, setIsSearchBarSticky] = useState(false);
  const searchBarRef = useRef<HTMLDivElement>(null);
  const searchTimeoutRef = useRef<number | undefined>(undefined);

  // Initialize search query from context filters
  useEffect(() => {
    if (contextFilters.search) {
      setSearchQuery(contextFilters.search);
    }
  }, [contextFilters.search]);

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

  const loadProperties = useCallback(async () => {
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
  }, [contextFilters]);

  // Sort properties when sort option changes
  useEffect(() => {
    loadProperties();
  }, [loadProperties]);

  useEffect(() => {
  const channel = supabase
    .channel('browse-properties-realtime')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'properties',
      },
      (payload) => {
        const newRow = payload.new as PropertyWithDetails | null;
        const oldRow = payload.old as PropertyWithDetails | null;

        // INSERT or DELETE → always reload
        if (payload.eventType === 'INSERT' || payload.eventType === 'DELETE') {
          loadProperties();
          return;
        }

        // UPDATE → check if anything meaningful actually changed
        if (payload.eventType === 'UPDATE' && newRow && oldRow) {
          const hasMeaningfulChange =
            newRow.price_from !== oldRow.price_from ||
            newRow.price_to !== oldRow.price_to ||
            newRow.verified !== oldRow.verified ||
            newRow.city !== oldRow.city ||
            newRow.locality !== oldRow.locality ||
            newRow.type !== oldRow.type;

          if (!hasMeaningfulChange) {
            // Ignore useless updates (views, updated_at, etc.)
            return;
          }

          // Optional: respect current city filter
          if (
            contextFilters.city &&
            newRow.city !== contextFilters.city
          ) {
            return;
          }

          loadProperties();
        }
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}, [loadProperties, contextFilters.city]);


 useEffect(() => {
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
        sorted.sort(
          (a, b) =>
            new Date(b.created_at).getTime() -
            new Date(a.created_at).getTime()
        );
    }

    setFilteredProperties(sorted);
  }, [sortBy, properties]);

  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = window.setTimeout(() => {
      if (searchQuery !== (contextFilters.search || '')) {
        updateFilter('search', searchQuery || undefined);
        updateUrlParams();
      }
    }, 500);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery]);

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

    setSearchParams(params);
  }, [contextFilters, setSearchParams]);

  const handleFilterChange = (newFilters: FilterOptions) => {
    // Update each filter in context
    Object.keys(newFilters).forEach(key => {
      updateFilter(key as keyof FilterOptions, newFilters[key as keyof FilterOptions]);
    });
    updateUrlParams();
    setMobileFiltersOpen(false);
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
                    <AdvancedFilterBar filters={contextFilters} onFilterChange={handleFilterChange} />
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            {/* Active Filter Chips */}
            {activeFilterCount > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {contextFilters.city && (
                  <Badge variant="secondary" className="gap-1">
                    City: {contextFilters.city}
                    <button type="button" onClick={() => removeFilter('city')} className="ml-1 hover:text-destructive">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                {contextFilters.locality && (
                  <Badge variant="secondary" className="gap-1">
                    Locality: {contextFilters.locality}
                    <button type="button" onClick={() => removeFilter('locality')} className="ml-1 hover:text-destructive">
                      <X className="h-3 w-3" />
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
                    <Filter className="h-5 w-5" />
                    Advanced Filters
                    {activeFilterCount > 0 && (
                      <Badge variant="default" className="ml-auto">
                        {activeFilterCount}
                      </Badge>
                    )}
                  </h3>
                  <AdvancedFilterBar filters={contextFilters} onFilterChange={handleFilterChange} />
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
