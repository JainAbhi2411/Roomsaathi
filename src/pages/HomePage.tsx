import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import type { Property } from '@/types/index';
import type { FilterOptions } from '@/types/index';
import { getProperties } from '@/db/api';
import PropertyCard from '@/components/property/PropertyCard';
import FilterBar from '@/components/property/FilterBar';
import Header from '@/components/layouts/Header';
import Footer from '@/components/layouts/Footer';
import { Skeleton } from '@/components/ui/skeleton';

export default function HomePage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterOptions>({});

  useEffect(() => {
    loadProperties();
  }, [filters]);

  const loadProperties = async () => {
    setLoading(true);
    try {
      const data = await getProperties(filters);
      setProperties(data);
    } catch (error) {
      console.error('Failed to load properties:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl xl:text-5xl font-bold mb-4">
            Find Your Perfect <span className="gradient-text">Home</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover quality PG, flats, apartments, rooms, and hostels in Sikar, Jaipur, and Kota
          </p>
        </motion.div>

        {/* Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <FilterBar filters={filters} onFilterChange={setFilters} />
        </motion.div>

        {/* Properties Grid */}
        {loading ? (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-48 w-full bg-muted" />
                <Skeleton className="h-6 w-3/4 bg-muted" />
                <Skeleton className="h-4 w-full bg-muted" />
                <Skeleton className="h-4 w-2/3 bg-muted" />
              </div>
            ))}
          </div>
        ) : properties.length > 0 ? (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} onFavoriteToggle={loadProperties} />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <h2 className="text-2xl font-semibold mb-2">No properties found</h2>
            <p className="text-muted-foreground">Try adjusting your filters to see more results</p>
          </motion.div>
        )}
      </main>
      <Footer />
    </div>
  );
}
