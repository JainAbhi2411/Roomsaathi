import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Heart } from 'lucide-react';
import type { Property } from '@/types/index';
import { getFavoriteProperties } from '@/db/api';
import PropertyCard from '@/components/property/PropertyCard';
import Header from '@/components/layouts/Header';
import Footer from '@/components/layouts/Footer';
import { Skeleton } from '@/components/ui/skeleton';

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    setLoading(true);
    try {
      const data = await getFavoriteProperties();
      setFavorites(data);
    } catch (error) {
      console.error('Failed to load favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <Heart className="h-8 w-8 text-primary fill-current" />
            <h1 className="text-3xl xl:text-4xl font-bold">My Favorites</h1>
          </div>
          <p className="text-muted-foreground">
            Properties you've saved for later
          </p>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-48 w-full bg-muted" />
                <Skeleton className="h-6 w-3/4 bg-muted" />
                <Skeleton className="h-4 w-full bg-muted" />
                <Skeleton className="h-4 w-2/3 bg-muted" />
              </div>
            ))}
          </div>
        ) : favorites.length > 0 ? (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {favorites.map((property) => (
              <PropertyCard key={property.id} property={property} onFavoriteToggle={loadFavorites} />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-semibold mb-2">No favorites yet</h2>
            <p className="text-muted-foreground">Start adding properties to your favorites to see them here</p>
          </motion.div>
        )}
      </main>
      <Footer />
    </div>
  );
}
