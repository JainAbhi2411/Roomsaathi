import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, MapPin, Home, User, Search, Loader2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/db/supabase';
import type { Property } from '@/types';
import { motion } from 'motion/react';

export default function MobileFavoritesPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();
  
  const [favorites, setFavorites] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        navigate('/mobile/login', { replace: true });
      } else {
        loadFavorites();
      }
    }
  }, [user, authLoading, navigate]);

  const loadFavorites = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      
      const { data: favData } = await supabase
        .from('favorites')
        .select('id, property_id, properties(*)')
        .eq('user_session_id', user.id)
        .order('created_at', { ascending: false });

      if (favData) {
        const props = favData
          .map((f: any) => ({
            ...f.properties,
            favorite_id: f.id
          }))
          .filter(Boolean) as Property[];
        setFavorites(props);
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
      toast({
        title: 'Error',
        description: 'Failed to load favorites',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const removeFavorite = async (propertyId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('property_id', propertyId)
        .eq('user_session_id', user.id);

      if (error) throw error;

      setFavorites(prev => prev.filter(p => p.id !== propertyId));
      
      toast({
        title: 'Removed',
        description: 'Property removed from favorites',
      });
    } catch (error) {
      console.error('Error removing favorite:', error);
      toast({
        title: 'Error',
        description: 'Failed to remove favorite',
        variant: 'destructive',
      });
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 pb-20">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="flex items-center gap-3 p-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="shrink-0"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold">My Favorites</h1>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {favorites.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <Heart className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-xl font-semibold mb-2">No Favorites Yet</h2>
            <p className="text-muted-foreground mb-6">
              Start adding properties to your favorites
            </p>
            <Button onClick={() => navigate('/mobile/search')}>
              Browse Properties
            </Button>
          </motion.div>
        ) : (
          <div className="space-y-3">
            {favorites.map((property, index) => (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="flex gap-3 p-3">
                      {/* Property Image */}
                      <div
                        className="w-24 h-24 rounded-lg overflow-hidden bg-muted shrink-0 cursor-pointer"
                        onClick={() => navigate(`/mobile/property/${property.id}`)}
                      >
                        {property.images?.[0] ? (
                          <img
                            src={property.images[0]}
                            alt={property.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Home className="h-8 w-8 text-muted-foreground" />
                          </div>
                        )}
                      </div>

                      {/* Property Info */}
                      <div
                        className="flex-1 min-w-0 cursor-pointer"
                        onClick={() => navigate(`/mobile/property/${property.id}`)}
                      >
                        <div className="flex items-start gap-2 mb-1">
                          <h3 className="font-semibold text-sm line-clamp-1 flex-1">
                            {property.name}
                          </h3>
                          <Badge variant="secondary" className="shrink-0 text-xs">
                            {property.type}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                          <MapPin className="h-3 w-3 shrink-0" />
                          <span className="line-clamp-1">
                            {property.locality}, {property.city}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-lg font-bold text-primary">
                              ₹{property.price_from.toLocaleString()}
                            </p>
                            <p className="text-xs text-muted-foreground">per month</p>
                          </div>
                          
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeFavorite(property.id);
                            }}
                            className="shrink-0"
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t">
        <div className="flex items-center justify-around p-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/mobile/home')}
            className="flex-col h-auto py-2"
          >
            <Home className="h-5 w-5" />
            <span className="text-xs mt-1">Home</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/mobile/search')}
            className="flex-col h-auto py-2"
          >
            <Search className="h-5 w-5" />
            <span className="text-xs mt-1">Search</span>
          </Button>
          <Button
            variant="default"
            size="icon"
            className="flex-col h-auto py-2"
          >
            <Heart className="h-5 w-5" />
            <span className="text-xs mt-1">Favorites</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/mobile/profile')}
            className="flex-col h-auto py-2"
          >
            <User className="h-5 w-5" />
            <span className="text-xs mt-1">Profile</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
