import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useSearchParams } from 'react-router';
import { Grid3x3, List, SlidersHorizontal } from 'lucide-react';
import type { Property } from '@/types/index';
import type { FilterOptions } from '@/types/index';
import { getProperties } from '@/db/api';
import PropertyCard from '@/components/property/PropertyCard';
import FilterBar from '@/components/property/FilterBar';
import Header from '@/components/layouts/Header';
import Footer from '@/components/layouts/Footer';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

type SortOption = 'newest' | 'price_low' | 'price_high' | 'name_az' | 'name_za';
type ViewMode = 'grid' | 'list';

export default function BrowsePropertiesPage() {
  const [searchParams] = useSearchParams();
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterOptions>({});
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  useEffect(() => {
    const urlFilters: FilterOptions = {};
    const city = searchParams.get('city');
    const type = searchParams.get('type');
    const search = searchParams.get('search');
    const verified = searchParams.get('verified');

    if (city) urlFilters.city = city;
    if (type) urlFilters.type = type;
    if (search) urlFilters.search = search;
    if (verified === 'true') urlFilters.verified = true;

    setFilters(urlFilters);
  }, [searchParams]);

  useEffect(() => {
    loadProperties();
  }, [filters]);

  useEffect(() => {
    sortProperties();
  }, [sortBy, properties]);

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

  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
    setMobileFiltersOpen(false);
  };

  const activeFilterCount = [
    filters.city,
    filters.locality,
    filters.type,
    filters.verified,
    filters.price_min !== undefined || filters.price_max !== undefined,
    filters.search,
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

        <div className="container mx-auto px-4 py-8">
          <div className="grid xl:grid-cols-[280px_1fr] gap-8">
            {/* Desktop Sidebar Filters */}
            <aside className="hidden xl:block">
              <div className="sticky top-24">
                <div className="bg-card border border-border rounded-lg p-6">
                  <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                    <SlidersHorizontal className="h-5 w-5" />
                    Filters
                    {activeFilterCount > 0 && (
                      <Badge variant="default" className="ml-auto">
                        {activeFilterCount}
                      </Badge>
                    )}
                  </h3>
                  <FilterBar filters={filters} onFilterChange={handleFilterChange} />
                </div>
              </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1">
              {/* Toolbar */}
              <div className="flex flex-col @md:flex-row justify-between items-start @md:items-center gap-4 mb-6">
                <div className="flex items-center gap-4 flex-wrap">
                  {/* Mobile Filter Button */}
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
                        <FilterBar filters={filters} onFilterChange={handleFilterChange} />
                      </div>
                    </SheetContent>
                  </Sheet>

                  <div className="text-sm text-muted-foreground">
                    {loading ? (
                      <span>Loading...</span>
                    ) : (
                      <span>
                        <strong className="text-foreground">{filteredProperties.length}</strong> properties found
                      </span>
                    )}
                  </div>
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
                      <PropertyCard property={property} onFavoriteToggle={loadProperties} />
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
                    <SlidersHorizontal className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h2 className="text-2xl font-semibold mb-2">No properties found</h2>
                  <p className="text-muted-foreground mb-6">
                    Try adjusting your filters to see more results
                  </p>
                  <Button onClick={() => setFilters({})}>Clear All Filters</Button>
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
