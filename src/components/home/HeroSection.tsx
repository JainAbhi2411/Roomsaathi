import { motion, AnimatePresence } from 'motion/react';
import { Search, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useSearchFilter } from '@/contexts/SearchFilterContext';

const heroImages = [
  {
    url: 'https://miaoda-site-img.s3cdn.medo.dev/images/9e0e51b8-011a-424c-b7f9-037bb1db001c.jpg',
    alt: 'Students studying together in hostel room',
    label: 'Student Hostels',
  },
  {
    url: 'https://miaoda-site-img.s3cdn.medo.dev/images/2298646c-5884-46dd-9489-da8836dbdf2b.jpg',
    alt: 'PG paying guest accommodation',
    label: 'PG Accommodations',
  },
  {
    url: 'https://miaoda-site-img.s3cdn.medo.dev/images/750cf05c-5157-4b42-bb9c-1e218d432ae6.jpg',
    alt: 'College students group in hostel',
    label: 'Shared Living',
  },
  {
    url: 'https://miaoda-site-img.s3cdn.medo.dev/images/3f4580cb-9242-45f9-8494-dc1b7a4af2d3.jpg',
    alt: 'Affordable student accommodation',
    label: 'Affordable Rooms',
  },
];

export default function HeroSection() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const navigate = useNavigate();
  const { updateFilter, applyFiltersToUrl } = useSearchFilter();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      updateFilter('search', searchQuery.trim());
      navigate(`/browse?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/browse');
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-secondary/20 to-background py-10 xl:py-24">
      <div className="container mx-auto px-3 xl:px-4">
        <div className="grid xl:grid-cols-2 gap-4 xl:gap-8 xl:gap-3 xl:gap-6 xl:gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-4 xl:space-y-6"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <h1 className="text-2xl xl:text-6xl font-bold leading-tight mb-3 xl:mb-4">
                Find Your Perfect
                <span className="gradient-text block">Home Away From Home</span>
              </h1>
              <p className="text-sm xl:text-xl text-muted-foreground">
                Discover quality PG, flats, apartments, rooms, and hostels across Sikar, Jaipur, and Kota. Your comfort is our priority.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="flex flex-col @md:flex-row gap-2 xl:gap-3 max-w-xl"
            >
              <div className="relative flex-1">
                <Search className="absolute left-2.5 xl:left-3 top-1/2 -translate-y-1/2 h-4 w-4 xl:h-5 xl:w-5 text-muted-foreground" />
                <Input
                  placeholder="Search by location, property name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="pl-9 xl:pl-10 h-10 xl:h-12 text-sm xl:text-base"
                />
              </div>
              <Button size="lg" onClick={handleSearch} className="h-10 xl:h-12 bg-accent text-accent-foreground hover:bg-accent/90 shadow-accent font-semibold text-sm xl:text-base">
                Search
                <ArrowRight className="ml-1.5 xl:ml-2 h-3.5 w-3.5 xl:h-4 xl:w-4" />
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="flex flex-wrap gap-3 xl:gap-4 pt-2 xl:pt-4"
            >
              <div className="text-center">
                <div className="text-lg xl:text-3xl font-bold text-primary">500+</div>
                <div className="text-xs xl:text-sm text-muted-foreground">Properties</div>
              </div>
              <div className="text-center">
                <div className="text-lg xl:text-3xl font-bold text-accent">3</div>
                <div className="text-xs xl:text-sm text-muted-foreground">Cities</div>
              </div>
              <div className="text-center">
                <div className="text-lg xl:text-3xl font-bold text-primary">1000+</div>
                <div className="text-xs xl:text-sm text-muted-foreground">Happy Tenants</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Image with Hanging Animation */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            {/* Hook at the top */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="absolute -top-6 xl:-top-8 left-1/2 -translate-x-1/2 z-20"
            >
              <div className="relative">
                {/* Hook shape */}
                <svg width="30" height="30" viewBox="0 0 40 40" className="text-muted-foreground xl:w-10 xl:h-10">
                  <path
                    d="M20 5 L20 15 Q20 20 25 20 L30 20"
                    stroke="currentColor"
                    strokeWidth="3"
                    fill="none"
                    strokeLinecap="round"
                  />
                  <circle cx="20" cy="5" r="3" fill="currentColor" />
                </svg>
              </div>
            </motion.div>

            {/* Hanging rope/string */}
            <motion.div
              animate={{ 
                rotate: [0, 2, 0, -2, 0],
              }}
              transition={{ 
                duration: 4,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut"
              }}
              className="absolute top-0 left-1/2 -translate-x-1/2 w-0.5 xl:w-1 h-8 xl:h-12 bg-muted-foreground/40 origin-top z-10"
              style={{ transformOrigin: 'top center' }}
            />

            {/* Image container with hanging animation */}
            <motion.div
              animate={{ 
                rotate: [0, 1.5, 0, -1.5, 0],
                y: [0, -3, 0, -3, 0]
              }}
              transition={{ 
                duration: 4,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut"
              }}
              className="relative rounded-xl xl:rounded-2xl overflow-hidden shadow-hover"
              style={{ transformOrigin: 'top center' }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentImageIndex}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.7 }}
                  className="relative"
                >
                  <img
                    src={heroImages[currentImageIndex].url}
                    alt={heroImages[currentImageIndex].alt}
                    className="w-full h-auto object-cover aspect-[4/3]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                  
                  {/* Image label */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="absolute top-2 right-2 xl:top-4 xl:right-4 bg-primary/90 backdrop-blur-sm text-primary-foreground px-2.5 py-1.5 xl:px-3 xl:px-4 xl:py-2 rounded-full text-xs xl:text-sm font-semibold"
                  >
                    {heroImages[currentImageIndex].label}
                  </motion.div>

                  {/* Bottom info card */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="absolute bottom-3 left-3 right-3 xl:bottom-6 xl:left-6 xl:right-6 bg-card/90 backdrop-blur-sm rounded-lg p-2.5 xl:p-4 border border-border"
                  >
                    <p className="text-xs xl:text-sm font-semibold">✨ Verified Properties</p>
                    <p className="text-[10px] xl:text-xs text-muted-foreground mt-0.5 xl:mt-1">
                      All properties are verified by RoomSaathi for your safety
                    </p>
                  </motion.div>
                </motion.div>
              </AnimatePresence>

              {/* Image indicators */}
              <div className="absolute bottom-14 xl:bottom-20 left-1/2 -translate-x-1/2 flex gap-1.5 xl:gap-2 z-10">
                {heroImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`h-1.5 xl:h-2 rounded-full transition-all ${
                      index === currentImageIndex 
                        ? 'bg-primary w-6 xl:w-8' 
                        : 'bg-white/60 w-1.5 xl:w-2 hover:bg-white/80'
                    }`}
                    aria-label={`View image ${index + 1}`}
                  />
                ))}
              </div>
            </motion.div>

            {/* Floating Elements */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' }}
              className="absolute -top-4 -right-4 bg-primary text-primary-foreground rounded-full p-3 xl:p-4 shadow-lg hidden xl:block"
            >
              <span className="text-base xl:text-2xl">🏠</span>
            </motion.div>
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2.5, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' }}
              className="absolute -bottom-4 -left-4 bg-secondary text-secondary-foreground rounded-full p-3 xl:p-4 shadow-lg hidden xl:block"
            >
              <span className="text-base xl:text-2xl">🔑</span>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
