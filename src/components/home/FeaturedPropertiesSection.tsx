import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router';
import type { PropertyWithDetails } from '@/types/index';
import { getProperties } from '@/db/api';
import { supabase } from '@/db/supabase';
import PropertyCardSmall from '@/components/property/PropertyCardSmall';
import { Skeleton } from '@/components/ui/skeleton';

export default function FeaturedPropertiesSection() {
  const [properties, setProperties] = useState<PropertyWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadFeaturedProperties();
  }, []);

  // Set up real-time subscription for properties
  useEffect(() => {
    const channel = supabase
      .channel('featured-properties-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'properties',
          filter: 'published=eq.true'
        },
        (payload) => {
          console.log('Featured property change detected:', payload);
          // Reload properties when any change occurs
          loadFeaturedProperties();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const loadFeaturedProperties = async () => {
    setLoading(true);
    try {
      const data = await getProperties({ verified: true });
      setProperties(data.slice(0, 8));
    } catch (error) {
      console.error('Failed to load featured properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      const newScrollLeft = scrollContainerRef.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);
      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="py-8 xl:py-16 xl:py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col @md:flex-row justify-between items-start @md:items-center mb-2 xl:mb-4 xl:mb-8 gap-4"
        >
          <div>
            <h2 className="text-xl xl:text-4xl font-bold mb-2">
              Featured <span className="gradient-text">Properties</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Handpicked verified properties just for you
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll('left')}
              className="h-9 w-9"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll('right')}
              className="h-9 w-9"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button asChild variant="outline" className="ml-2">
              <Link to="/browse">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </motion.div>

        {loading ? (
          <div className="flex gap-4 overflow-hidden">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex-shrink-0 w-64 space-y-3">
                <Skeleton className="h-40 w-full bg-muted" />
                <Skeleton className="h-4 w-3/4 bg-muted" />
                <Skeleton className="h-3 w-full bg-muted" />
                <Skeleton className="h-3 w-1/2 bg-muted" />
              </div>
            ))}
          </div>
        ) : (
          <div
            ref={scrollContainerRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {properties.map((property, index) => (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="flex-shrink-0 w-64"
              >
                <PropertyCardSmall property={property} onFavoriteToggle={loadFeaturedProperties} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
