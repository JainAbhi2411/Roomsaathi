import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bed, Building2, Home, DoorOpen, Hotel, Calendar } from 'lucide-react';
import type { PropertyWithDetails } from '@/types/index';
import { getProperties } from '@/db/api';
import { supabase } from '@/db/supabase';
import PropertyCardSmall from '@/components/property/PropertyCardSmall';
import { Skeleton } from '@/components/ui/skeleton';

const categories = [
  {
    value: 'PG',
    label: 'PG',
    fullLabel: 'Paying Guest',
    icon: Bed,
    image: 'https://miaoda-site-img.s3cdn.medo.dev/images/ad358b0c-8e3b-481f-a8c0-56b7976bb017.jpg',
    color: 'from-primary/20 to-primary/30',
    iconColor: 'text-primary',
  },
  {
    value: 'Apartment',
    label: 'Apartments',
    fullLabel: 'Luxury Apartments',
    icon: Building2,
    image: 'https://miaoda-site-img.s3cdn.medo.dev/images/495d4fbd-6b6f-4b12-aa9f-35357572918d.jpg',
    color: 'from-accent/20 to-accent/30',
    iconColor: 'text-accent',
  },
  {
    value: 'Flat',
    label: 'Flats',
    fullLabel: 'Independent Flats',
    icon: Home,
    image: 'https://miaoda-site-img.s3cdn.medo.dev/images/72f7c747-f507-4823-b1cc-5718e6e0f0e9.jpg',
    color: 'from-primary/20 to-primary/30',
    iconColor: 'text-primary',
  },
  {
    value: 'Room',
    label: 'Rooms',
    fullLabel: 'Private Rooms',
    icon: DoorOpen,
    image: 'https://miaoda-site-img.s3cdn.medo.dev/images/3f8497d2-4bb2-4d61-89d4-7947175ec3d3.jpg',
    color: 'from-accent/20 to-accent/30',
    iconColor: 'text-accent',
  },
  {
    value: 'Hostel',
    label: 'Hostels',
    fullLabel: 'Student Hostels',
    icon: Hotel,
    image: 'https://miaoda-site-img.s3cdn.medo.dev/images/c6bd8b53-d617-4e0d-bb3d-43c39bc9a1d5.jpg',
    color: 'from-primary/20 to-primary/30',
    iconColor: 'text-primary',
  },
  {
    value: 'Short Term Stay',
    label: 'Short Term',
    fullLabel: 'Short Term Stays',
    icon: Calendar,
    image: 'https://miaoda-site-img.s3cdn.medo.dev/images/d3e9a292-70ad-4572-bcdc-da47694ea772.jpg',
    color: 'from-accent/20 to-accent/30',
    iconColor: 'text-accent',
  },
];

export default function CategoryBrowseSection() {
  const [selectedCategory, setSelectedCategory] = useState('PG');
  const [properties, setProperties] = useState<PropertyWithDetails[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategoryProperties();
  }, [selectedCategory]);

  // Set up real-time subscription for properties
  useEffect(() => {
    const channel = supabase
      .channel('category-properties-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'properties',
          filter: 'published=eq.true'
        },
        (payload) => {
          console.log('Category property change detected:', payload);
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
      setProperties(data);
    } catch (error) {
      console.error('Failed to load category properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const selectedCategoryData = categories.find(cat => cat.value === selectedCategory);

  return (
    <section className="py-12 xl:py-8 xl:py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h2 className="text-lg xl:text-3xl font-bold mb-2">
            Browse by <span className="gradient-text">Category</span>
          </h2>
          <p className="text-sm xl:text-base text-muted-foreground">
            Select a category to explore properties tailored to your needs
          </p>
        </motion.div>

        <div className="grid xl:grid-cols-[280px_1fr] gap-6">
          {/* Left Sidebar - Category Selection */}
          <div className="space-y-3">
            {categories.map((category, index) => (
              <motion.button
                key={category.value}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                onClick={() => setSelectedCategory(category.value)}
                className={`relative w-full h-16 rounded-xl overflow-hidden transition-all duration-300 group ${
                  selectedCategory === category.value
                    ? 'ring-2 ring-primary shadow-hover scale-[1.02]'
                    : 'hover:scale-[1.02] hover:shadow-card'
                }`}
              >
                {/* Background Image with Cutout Effect */}
                <div className="absolute inset-0">
                  <img
                    src={category.image}
                    alt={category.label}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  {/* Gradient Overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${category.color} backdrop-blur-[1px]`} />
                  <div className="absolute inset-0 bg-gradient-to-r from-background/85 to-background/50" />
                </div>

                {/* Content */}
                <div className="relative h-full flex items-center justify-between px-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-background/90 backdrop-blur-sm ${
                      selectedCategory === category.value ? 'bg-primary text-primary-foreground' : ''
                    } transition-colors`}>
                      <category.icon className={`h-4 w-4 ${
                        selectedCategory === category.value ? '' : category.iconColor
                      }`} />
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold text-sm">{category.label}</h3>
                      <p className="text-xs text-muted-foreground">{category.fullLabel}</p>
                    </div>
                  </div>

                  {/* Active Indicator */}
                  {selectedCategory === category.value && (
                    <motion.div
                      layoutId="activeCategory"
                      className="w-1 h-8 bg-primary rounded-full"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                </div>

                {/* Cutout Corner Effect */}
                <div className={`absolute top-0 right-0 w-12 h-12 ${
                  selectedCategory === category.value ? 'bg-primary/20' : 'bg-background/20'
                } transition-colors`}
                  style={{
                    clipPath: 'polygon(100% 0, 0 0, 100% 100%)',
                  }}
                />
              </motion.button>
            ))}
          </div>

          {/* Right Side - Property Grid with Vertical Scroll */}
          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedCategory}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                {/* Category Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {selectedCategoryData && (
                      <>
                        <div className={`p-2 rounded-lg bg-background ${selectedCategoryData.iconColor}`}>
                          <selectedCategoryData.icon className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold">{selectedCategoryData.fullLabel}</h3>
                          <p className="text-xs text-muted-foreground">
                            {properties.length} properties available
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Scrollable Property Grid */}
                <div className="max-h-[500px] overflow-y-auto pr-2 scrollbar-thin">
                  {loading ? (
                    <div className="grid grid-cols-1 @md:grid-cols-2 xl:grid-cols-3 gap-4">
                      {[...Array(6)].map((_, i) => (
                        <div key={i} className="space-y-3">
                          <Skeleton className="h-40 w-full bg-muted" />
                          <Skeleton className="h-4 w-3/4 bg-muted" />
                          <Skeleton className="h-3 w-full bg-muted" />
                          <Skeleton className="h-3 w-2/3 bg-muted" />
                        </div>
                      ))}
                    </div>
                  ) : properties.length > 0 ? (
                    <div className="grid grid-cols-1 @md:grid-cols-2 xl:grid-cols-3 gap-4">
                      {properties.map((property, index) => (
                        <motion.div
                          key={property.id}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
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
                      <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-3 ${selectedCategoryData?.iconColor}`}>
                        {selectedCategoryData && <selectedCategoryData.icon className="h-8 w-8" />}
                      </div>
                      <h3 className="text-lg font-semibold mb-1">No properties found</h3>
                      <p className="text-sm text-muted-foreground">
                        No {selectedCategory} properties available at the moment
                      </p>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
