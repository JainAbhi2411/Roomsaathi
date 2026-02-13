import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { PropertyWithDetails } from '@/types/index';
import { getProperties } from '@/db/api';
import { supabase } from '@/db/supabase';
import PropertyCardSmall from '@/components/property/PropertyCardSmall';
import { Skeleton } from '@/components/ui/skeleton';

const categories = [
  { value: 'PG', label: 'PG (Paying Guest)', icon: '🏠' },
  { value: 'Apartments', label: 'Apartments', icon: '🏢' },
  { value: 'Flats', label: 'Flats', icon: '🏘️' },
  { value: 'Rooms', label: 'Rooms', icon: '🚪' },
  { value: 'Hostels', label: 'Hostels', icon: '🏨' },
  { value: 'Short Term Stays', label: 'Short Term Stays', icon: '📅' },
];

export default function CategoryPropertiesSection() {
  const [selectedCategory, setSelectedCategory] = useState('PG');
  const [properties, setProperties] = useState<PropertyWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadCategoryProperties();
  }, [selectedCategory]);

  // Set up real-time subscription for properties
  useEffect(() => {
    const channel = supabase
      .channel('category-section-properties-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'properties',
          filter: 'published=eq.true'
        },
        (payload) => {
          console.log('Category section property change detected:', payload);
          // Reload properties when any change occurs
          loadCategoryProperties();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedCategory]);

  const loadCategoryProperties = async () => {
    setLoading(true);
    try {
      const data = await getProperties({ type: selectedCategory });
      setProperties(data.slice(0, 10));
    } catch (error) {
      console.error('Failed to load category properties:', error);
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

  const selectedCategoryData = categories.find(cat => cat.value === selectedCategory);

  return (
    <section className="py-8 xl:py-16 xl:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col @md:flex-row justify-between items-start @md:items-center mb-2 xl:mb-4 xl:mb-8 gap-4"
        >
          <div className="flex-1">
            <h2 className="text-xl xl:text-4xl font-bold mb-2">
              Browse by <span className="gradient-text">Category</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Explore properties based on your accommodation needs
            </p>
          </div>
          
          <div className="flex items-center gap-3 w-full @md:w-auto">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full @md:w-64">
                <SelectValue>
                  <span className="flex items-center gap-2">
                    <span>{selectedCategoryData?.icon}</span>
                    <span>{selectedCategoryData?.label}</span>
                  </span>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    <span className="flex items-center gap-2">
                      <span>{category.icon}</span>
                      <span>{category.label}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="hidden @md:flex items-center gap-2">
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
            </div>
          </div>
        </motion.div>

        {loading ? (
          <div className="flex gap-4 overflow-hidden">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex-shrink-0 w-64 space-y-3">
                <Skeleton className="h-40 w-full bg-muted" />
                <Skeleton className="h-4 w-3/4 bg-muted" />
                <Skeleton className="h-3 w-full bg-muted" />
                <Skeleton className="h-3 w-1/2 bg-muted" />
              </div>
            ))}
          </div>
        ) : properties.length > 0 ? (
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
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="flex-shrink-0 w-64"
              >
                <PropertyCardSmall property={property} onFavoriteToggle={loadCategoryProperties} />
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
              <span className="text-3xl">{selectedCategoryData?.icon}</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">No properties found</h3>
            <p className="text-muted-foreground">
              No {selectedCategory} properties available at the moment
            </p>
          </motion.div>
        )}

        {/* Mobile scroll buttons */}
        <div className="flex @md:hidden items-center justify-center gap-2 mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => scroll('left')}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => scroll('right')}
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
    </section>
  );
}
