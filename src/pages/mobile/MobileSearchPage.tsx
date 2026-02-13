import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Search, 
  SlidersHorizontal,
  X,
  MapPin,
  Home,
  Heart,
  User,
  TrendingUp,
  Clock,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from '@/db/supabase';
import { useSearchFilter } from '@/contexts/SearchFilterContext';
import { useAuth } from '@/contexts/AuthContext';
import type { Property } from '@/types';
import MobileAdvancedFilters from '@/components/mobile/MobileAdvancedFilters';

export default function MobileSearchPage() {
  const navigate = useNavigate();
  const { filters, updateFilter, clearFilters, activeFilterCount } = useSearchFilter();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState(filters.search || '');
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [popularSearches] = useState([
    'PG near coaching',
    'Affordable flats',
    'Girls hostel',
    'Furnished apartments',
    'Single room'
  ]);

  useEffect(() => {
    loadRecentSearches();
    if (filters.search || Object.keys(filters).length > 0) {
      searchProperties();
    }
  }, []);

  useEffect(() => {
    if (searchQuery !== filters.search) {
      setSearchQuery(filters.search || '');
    }
  }, [filters.search]);

  const loadRecentSearches = () => {
    const stored = localStorage.getItem('roomsaathi_recent_searches');
    if (stored) {
      setRecentSearches(JSON.parse(stored));
    }
  };

  const saveRecentSearch = (query: string) => {
    if (!query.trim()) return;
    
    const updated = [query, ...recentSearches.filter(s => s !== query)].slice(0, 10);
    setRecentSearches(updated);
    localStorage.setItem('roomsaathi_recent_searches', JSON.stringify(updated));
  };

  const searchProperties = async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('properties')
        .select('*')
        .eq('published', true);

      // Apply filters
      if (filters.city) {
        query = query.eq('city', filters.city);
      }
      if (filters.locality) {
        query = query.eq('locality', filters.locality);
      }
      if (filters.type) {
        query = query.eq('type', filters.type);
      }
      if (filters.verified) {
        query = query.eq('verified', true);
      }
      if (filters.price_min) {
        query = query.gte('price_from', filters.price_min);
      }
      if (filters.price_max) {
        query = query.lte('price_from', filters.price_max);
      }
      if (filters.search) {
        query = query.or(`name.ilike.%${filters.search}%,locality.ilike.%${filters.search}%,address.ilike.%${filters.search}%`);
      }
      if (filters.food_included !== undefined) {
        query = query.eq('food_included', filters.food_included);
      }
      if (filters.suitable_for) {
        query = query.contains('suitable_for', [filters.suitable_for]);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      setProperties(data || []);
    } catch (error) {
      console.error('Error searching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      updateFilter('search', searchQuery);
      saveRecentSearch(searchQuery);
    }
    searchProperties();
  };

  const handleQuickSearch = (query: string) => {
    setSearchQuery(query);
    updateFilter('search', query);
    saveRecentSearch(query);
    searchProperties();
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    updateFilter('search', '');
  };

  const handleClearAllFilters = () => {
    clearFilters();
    setSearchQuery('');
    setProperties([]);
  };

  const removeFilter = (key: keyof typeof filters) => {
    updateFilter(key, undefined);
    searchProperties();
  };

  const getFilterLabel = (key: string, value: any): string => {
    if (key === 'city' || key === 'locality' || key === 'type') return value;
    if (key === 'verified') return 'Verified';
    if (key === 'food_included') return 'Food Included';
    if (key === 'price_min') return `Min ₹${value}`;
    if (key === 'price_max') return `Max ₹${value}`;
    if (key === 'suitable_for') return value;
    return value;
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-card border-b border-border">
        <div className="p-4 space-y-3">
          {/* Top Bar */}
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/mobile')}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-lg font-bold flex-1">Search Properties</h1>
          </div>

          {/* Search Bar */}
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-9 pr-9"
              />
              {searchQuery && (
                <button
                  onClick={handleClearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              )}
            </div>
            <Button onClick={handleSearch}>
              Search
            </Button>
            <Sheet open={showFilters} onOpenChange={setShowFilters}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="relative">
                  <SlidersHorizontal className="w-4 h-4" />
                  {activeFilterCount > 0 && (
                    <Badge 
                      variant="destructive" 
                      className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-xs"
                    >
                      {activeFilterCount}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="h-[90vh] overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>Advanced Filters</SheetTitle>
                </SheetHeader>
                <MobileAdvancedFilters 
                  onApply={() => {
                    setShowFilters(false);
                    searchProperties();
                  }}
                  onClose={() => setShowFilters(false)}
                />
              </SheetContent>
            </Sheet>
          </div>

          {/* Active Filters */}
          {activeFilterCount > 0 && (
            <div className="flex flex-wrap gap-2">
              {Object.entries(filters).map(([key, value]) => {
                if (key === 'search' || !value) return null;
                return (
                  <Badge 
                    key={key} 
                    variant="secondary"
                    className="gap-1"
                  >
                    {getFilterLabel(key, value)}
                    <button
                      onClick={() => removeFilter(key as keyof typeof filters)}
                      className="ml-1"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                );
              })}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearAllFilters}
                className="h-6 text-xs"
              >
                Clear All
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Show suggestions when no search */}
        {!searchQuery && properties.length === 0 && (
          <>
            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <h3 className="font-semibold text-sm">Recent Searches</h3>
                  </div>
                  <div className="space-y-2">
                    {recentSearches.map((search, index) => (
                      <button
                        key={index}
                        onClick={() => handleQuickSearch(search)}
                        className="w-full flex items-center gap-3 p-3 rounded-lg bg-card hover:bg-accent transition-colors text-left"
                      >
                        <Search className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{search}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Popular Searches */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-muted-foreground" />
                  <h3 className="font-semibold text-sm">Popular Searches</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {popularSearches.map((search, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="cursor-pointer hover:bg-accent"
                      onClick={() => handleQuickSearch(search)}
                    >
                      {search}
                    </Badge>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        )}

        {/* Search Results */}
        {!loading && properties.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-3"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">
                {properties.length} {properties.length === 1 ? 'Property' : 'Properties'} Found
              </h3>
            </div>
            
            <div className="space-y-3">
              <AnimatePresence>
                {properties.map((property, index) => (
                  <motion.div
                    key={property.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card 
                      className="cursor-pointer hover:shadow-lg transition-shadow"
                      onClick={() => navigate(`/mobile/property/${property.id}`)}
                    >
                      <CardContent className="p-0">
                        {/* Property Image */}
                        <div className="relative h-48 bg-muted">
                          {property.images?.[0] ? (
                            <img 
                              src={property.images[0]} 
                              alt={property.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Home className="w-12 h-12 text-muted-foreground" />
                            </div>
                          )}
                          {property.verified && (
                            <Badge className="absolute top-2 right-2 bg-green-500">
                              ✓ Verified
                            </Badge>
                          )}
                        </div>

                        {/* Property Details */}
                        <div className="p-4 space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="font-semibold text-base line-clamp-1">
                              {property.name}
                            </h3>
                            <Badge variant="outline">{property.type}</Badge>
                          </div>

                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <MapPin className="w-4 h-4" />
                            <span className="line-clamp-1">
                              {property.locality}, {property.city}
                            </span>
                          </div>

                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-lg font-bold text-primary">
                                ₹{property.price_from.toLocaleString()}
                                <span className="text-sm font-normal text-muted-foreground">/month</span>
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={(e) => {
                                e.stopPropagation();
                                // Handle favorite toggle
                              }}
                            >
                              <Heart className="w-5 h-5" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {/* Empty State */}
        {!loading && searchQuery && properties.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="font-semibold mb-2">No properties found</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Try adjusting your filters or search terms
            </p>
            <Button variant="outline" onClick={handleClearAllFilters}>
              Clear All Filters
            </Button>
          </motion.div>
        )}
      </div>

      {/* Floating AI Chat Button */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, type: 'spring' }}
        className="fixed bottom-20 right-4 z-20"
      >
        <Button
          size="icon"
          onClick={() => navigate('/mobile/chat')}
          className="h-14 w-14 rounded-full shadow-lg bg-gradient-to-br from-primary to-secondary hover:shadow-xl transition-shadow"
        >
          <Sparkles className="h-6 w-6" />
        </Button>
      </motion.div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border">
        <div className="flex items-center justify-around p-2">
          <Button
            variant="ghost"
            size="sm"
            className="flex-col h-auto py-2"
            onClick={() => navigate('/mobile')}
          >
            <Home className="w-5 h-5 mb-1" />
            <span className="text-xs">Home</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex-col h-auto py-2 text-primary"
          >
            <Search className="w-5 h-5 mb-1" />
            <span className="text-xs">Search</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex-col h-auto py-2"
            onClick={() => navigate('/mobile/favorites')}
          >
            <Heart className="w-5 h-5 mb-1" />
            <span className="text-xs">Favorites</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex-col h-auto py-2"
            onClick={() => {
              if (user) {
                navigate('/mobile/profile');
              } else {
                navigate('/mobile/login');
              }
            }}
          >
            <User className="w-5 h-5 mb-1" />
            <span className="text-xs">{user ? 'Profile' : 'Login'}</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
