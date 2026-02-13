import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, SlidersHorizontal, Mic, Home, Heart, User, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'motion/react';
import { supabase } from '@/db/supabase';
import { useSearchFilter } from '@/contexts/SearchFilterContext';
import { useAuth } from '@/contexts/AuthContext';
import type { Property } from '@/types';
import MobileAdvancedFilters from '@/components/mobile/MobileAdvancedFilters';

export default function MobileHomePage() {
  const navigate = useNavigate();
  const { filters, updateFilter } = useSearchFilter();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadFeaturedProperties();
  }, []);

  const loadFeaturedProperties = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('published', true)
        .eq('verified', true)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setFeaturedProperties(data || []);
    } catch (error) {
      console.error('Error loading properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePropertyClick = (propertyId: string) => {
    navigate(`/mobile/property/${propertyId}`);
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      updateFilter('search', searchQuery);
    }
    navigate('/mobile/search');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-card border-b border-border">
        <div className="p-4 space-y-3">
          {/* Logo and Title */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Home className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-foreground">RoomSaathi</h1>
                <p className="text-xs text-muted-foreground">Find your perfect home</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/mobile/favorites')}
            >
              <Heart className="w-5 h-5" />
            </Button>
          </div>

          {/* Search Bar */}
          <div className="flex gap-2">
            <div 
              className="flex-1 relative cursor-pointer"
              onClick={() => navigate('/mobile/search')}
            >
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <Input
                placeholder="Search properties..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-9"
              />
            </div>
            <Sheet open={showFilters} onOpenChange={setShowFilters}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <SlidersHorizontal className="w-4 h-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="h-[90vh] overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>Advanced Filters</SheetTitle>
                </SheetHeader>
                <MobileAdvancedFilters 
                  onApply={() => {
                    setShowFilters(false);
                    navigate('/mobile/search');
                  }}
                  onClose={() => setShowFilters(false)}
                />
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 pb-24">
        {/* Featured Properties */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Featured Properties</h2>
            <Badge variant="secondary">RoomSaathi Verified</Badge>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="overflow-hidden">
                  <div className="h-48 bg-muted animate-pulse" />
                  <CardContent className="p-4 space-y-2">
                    <div className="h-4 bg-muted rounded animate-pulse" />
                    <div className="h-3 bg-muted rounded w-2/3 animate-pulse" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {featuredProperties.map((property, index) => (
                <motion.div
                  key={property.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card
                    className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => handlePropertyClick(property.id)}
                  >
                    <div className="relative h-48">
                      <img
                        src={property.images[0] || '/placeholder-property.jpg'}
                        alt={property.name}
                        className="w-full h-full object-cover"
                      />
                      {property.verified && (
                        <Badge className="absolute top-2 right-2 bg-accent text-accent-foreground">
                          Verified
                        </Badge>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-foreground mb-1">{property.name}</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        {property.locality}, {property.city}
                      </p>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-lg font-bold text-primary">
                            ₹{property.price_from.toLocaleString()}
                            {property.price_to && ` - ₹${property.price_to.toLocaleString()}`}
                          </p>
                          <p className="text-xs text-muted-foreground">{property.type}</p>
                        </div>
                        <Button size="sm" variant="outline">
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Voice Chat FAB */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, type: 'spring' }}
        className="fixed bottom-20 right-4 z-20"
      >
        <Button
          size="lg"
          onClick={() => navigate('/mobile/chat')}
          className="w-16 h-16 rounded-full bg-gradient-to-r from-primary to-accent shadow-lg hover:shadow-xl"
        >
          <Mic className="w-6 h-6 text-primary-foreground" />
        </Button>
      </motion.div>

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
            className="flex-col h-auto py-2 text-primary"
          >
            <Home className="w-5 h-5 mb-1" />
            <span className="text-xs">Home</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex-col h-auto py-2"
            onClick={() => navigate('/mobile/search')}
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
