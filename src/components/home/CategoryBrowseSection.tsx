import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bed, Building2, Home, DoorOpen, Hotel, Calendar } from 'lucide-react';
import type { Property } from '@/types/index';
import { getProperties } from '@/db/api';
import PropertyCard from '@/components/property/PropertyCard';
import { Skeleton } from '@/components/ui/skeleton';

const categories = [
  {
    value: 'PG',
    label: 'PG',
    fullLabel: 'Paying Guest',
    icon: Bed,
    image: 'https://miaoda-site-img.s3cdn.medo.dev/images/ad358b0c-8e3b-481f-a8c0-56b7976bb017.jpg',
    color: 'from-orange-500/20 to-orange-600/20',
    iconColor: 'text-orange-500',
  },
  {
    value: 'Apartments',
    label: 'Apartments',
    fullLabel: 'Luxury Apartments',
    icon: Building2,
    image: 'https://miaoda-site-img.s3cdn.medo.dev/images/495d4fbd-6b6f-4b12-aa9f-35357572918d.jpg',
    color: 'from-blue-500/20 to-blue-600/20',
    iconColor: 'text-blue-500',
  },
  {
    value: 'Flats',
    label: 'Flats',
    fullLabel: 'Independent Flats',
    icon: Home,
    image: 'https://miaoda-site-img.s3cdn.medo.dev/images/72f7c747-f507-4823-b1cc-5718e6e0f0e9.jpg',
    color: 'from-green-500/20 to-green-600/20',
    iconColor: 'text-green-500',
  },
  {
    value: 'Rooms',
    label: 'Rooms',
    fullLabel: 'Private Rooms',
    icon: DoorOpen,
    image: 'https://miaoda-site-img.s3cdn.medo.dev/images/3f8497d2-4bb2-4d61-89d4-7947175ec3d3.jpg',
    color: 'from-purple-500/20 to-purple-600/20',
    iconColor: 'text-purple-500',
  },
  {
    value: 'Hostels',
    label: 'Hostels',
    fullLabel: 'Student Hostels',
    icon: Hotel,
    image: 'https://miaoda-site-img.s3cdn.medo.dev/images/c6bd8b53-d617-4e0d-bb3d-43c39bc9a1d5.jpg',
    color: 'from-pink-500/20 to-pink-600/20',
    iconColor: 'text-pink-500',
  },
  {
    value: 'Short Term Stays',
    label: 'Short Term',
    fullLabel: 'Short Term Stays',
    icon: Calendar,
    image: 'https://miaoda-site-img.s3cdn.medo.dev/images/d3e9a292-70ad-4572-bcdc-da47694ea772.jpg',
    color: 'from-yellow-500/20 to-yellow-600/20',
    iconColor: 'text-yellow-500',
  },
];

export default function CategoryBrowseSection() {
  const [selectedCategory, setSelectedCategory] = useState('PG');
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategoryProperties();
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
    <section className="py-16 xl:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl xl:text-4xl font-bold mb-4">
            Browse by <span className="gradient-text">Category</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Select a category to explore properties tailored to your needs
          </p>
        </motion.div>

        <div className="grid xl:grid-cols-[320px_1fr] gap-8">
          {/* Left Sidebar - Category Selection */}
          <div className="space-y-4">
            {categories.map((category, index) => (
              <motion.button
                key={category.value}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                onClick={() => setSelectedCategory(category.value)}
                className={`relative w-full h-24 rounded-2xl overflow-hidden transition-all duration-300 group ${
                  selectedCategory === category.value
                    ? 'ring-4 ring-primary shadow-hover scale-105'
                    : 'hover:scale-105 hover:shadow-card'
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
                  <div className="absolute inset-0 bg-gradient-to-r from-background/80 to-background/40" />
                </div>

                {/* Content */}
                <div className="relative h-full flex items-center justify-between px-6">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl bg-background/90 backdrop-blur-sm ${
                      selectedCategory === category.value ? 'bg-primary text-primary-foreground' : ''
                    } transition-colors`}>
                      <category.icon className={`h-6 w-6 ${
                        selectedCategory === category.value ? '' : category.iconColor
                      }`} />
                    </div>
                    <div className="text-left">
                      <h3 className="font-bold text-lg">{category.label}</h3>
                      <p className="text-xs text-muted-foreground">{category.fullLabel}</p>
                    </div>
                  </div>

                  {/* Active Indicator */}
                  {selectedCategory === category.value && (
                    <motion.div
                      layoutId="activeCategory"
                      className="w-2 h-12 bg-primary rounded-full"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                </div>

                {/* Cutout Corner Effect */}
                <div className={`absolute top-0 right-0 w-16 h-16 ${
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
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    {selectedCategoryData && (
                      <>
                        <div className={`p-2 rounded-lg bg-background ${selectedCategoryData.iconColor}`}>
                          <selectedCategoryData.icon className="h-6 w-6" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold">{selectedCategoryData.fullLabel}</h3>
                          <p className="text-sm text-muted-foreground">
                            {properties.length} properties available
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Scrollable Property Grid */}
                <div className="max-h-[600px] overflow-y-auto pr-2 scrollbar-thin">
                  {loading ? (
                    <div className="grid grid-cols-1 @md:grid-cols-2 gap-6">
                      {[...Array(4)].map((_, i) => (
                        <div key={i} className="space-y-4">
                          <Skeleton className="h-48 w-full bg-muted" />
                          <Skeleton className="h-6 w-3/4 bg-muted" />
                          <Skeleton className="h-4 w-full bg-muted" />
                          <Skeleton className="h-4 w-2/3 bg-muted" />
                        </div>
                      ))}
                    </div>
                  ) : properties.length > 0 ? (
                    <div className="grid grid-cols-1 @md:grid-cols-2 gap-6">
                      {properties.map((property, index) => (
                        <motion.div
                          key={property.id}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                        >
                          <PropertyCard property={property} onFavoriteToggle={loadCategoryProperties} />
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-16"
                    >
                      <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted mb-4 ${selectedCategoryData?.iconColor}`}>
                        {selectedCategoryData && <selectedCategoryData.icon className="h-10 w-10" />}
                      </div>
                      <h3 className="text-xl font-semibold mb-2">No properties found</h3>
                      <p className="text-muted-foreground">
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
