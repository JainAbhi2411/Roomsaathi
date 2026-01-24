import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useSearchParams } from 'react-router';
import type { Property } from '@/types/index';
import type { FilterOptions } from '@/types/index';
import { getProperties } from '@/db/api';
import PropertyCard from '@/components/property/PropertyCard';
import FilterBar from '@/components/property/FilterBar';
import Header from '@/components/layouts/Header';
import Footer from '@/components/layouts/Footer';
import { Skeleton } from '@/components/ui/skeleton';
import HeroSection from '@/components/home/HeroSection';
import HowItWorksSection from '@/components/home/HowItWorksSection';
import PropertyTypesSection from '@/components/home/PropertyTypesSection';
import CitiesSection from '@/components/home/CitiesSection';
import FeaturedPropertiesSection from '@/components/home/FeaturedPropertiesSection';
import WhyChooseUsSection from '@/components/home/WhyChooseUsSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import StatsSection from '@/components/home/StatsSection';
import CTASection from '@/components/home/CTASection';
import { Separator } from '@/components/ui/separator';

export default function HomePage() {
  const [searchParams] = useSearchParams();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({});
  const [showAllProperties, setShowAllProperties] = useState(false);

  useEffect(() => {
    const urlFilters: FilterOptions = {};
    const city = searchParams.get('city');
    const type = searchParams.get('type');
    const search = searchParams.get('search');

    if (city) urlFilters.city = city;
    if (type) urlFilters.type = type;
    if (search) urlFilters.search = search;

    if (Object.keys(urlFilters).length > 0) {
      setFilters(urlFilters);
      setShowAllProperties(true);
    }
  }, [searchParams]);

  useEffect(() => {
    if (showAllProperties) {
      loadProperties();
    }
  }, [filters, showAllProperties]);

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

  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
    setShowAllProperties(true);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <HeroSection />

        {/* Show all sections when not filtering */}
        {!showAllProperties && (
          <>
            <FeaturedPropertiesSection />
            <Separator />
            <PropertyTypesSection />
            <Separator />
            <HowItWorksSection />
            <Separator />
            <CitiesSection />
            <Separator />
            <WhyChooseUsSection />
            <Separator />
            <StatsSection />
            <Separator />
            <TestimonialsSection />
            <Separator />
            <CTASection />
          </>
        )}

        {/* Show filtered properties section */}
        {showAllProperties && (
          <section className="py-12 xl:py-16 container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <h2 className="text-3xl font-bold mb-2">
                Browse <span className="gradient-text">Properties</span>
              </h2>
              <p className="text-muted-foreground">
                {properties.length} properties found
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-8"
            >
              <FilterBar filters={filters} onFilterChange={handleFilterChange} />
            </motion.div>

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
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}
