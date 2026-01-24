import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router';
import type { Property } from '@/types/index';
import { getProperties } from '@/db/api';
import PropertyCard from '@/components/property/PropertyCard';
import { Skeleton } from '@/components/ui/skeleton';

export default function FeaturedPropertiesSection() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFeaturedProperties();
  }, []);

  const loadFeaturedProperties = async () => {
    setLoading(true);
    try {
      const data = await getProperties({ verified: true });
      setProperties(data.slice(0, 3));
    } catch (error) {
      console.error('Failed to load featured properties:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-16 xl:py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col @md:flex-row justify-between items-start @md:items-center mb-12 gap-4"
        >
          <div>
            <h2 className="text-3xl xl:text-4xl font-bold mb-2">
              Featured <span className="gradient-text">Properties</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Handpicked verified properties just for you
            </p>
          </div>
          <Button asChild variant="outline">
            <Link to="/">
              View All Properties
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
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
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} onFavoriteToggle={loadFeaturedProperties} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
