import { motion } from 'motion/react';
import { Link } from 'react-router';
import { MapPin, IndianRupee, Wifi, Car, Utensils, Shield, Users, UserCheck, Sparkles, Tag, Navigation } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Property, PropertyWithDetails } from '@/types/index';
import VerifiedBadge from './VerifiedBadge';
import FavoriteButton from './FavoriteButton';
import { useState, useEffect } from 'react';
import { isFavorite } from '@/db/api';
import { formatDistance } from '@/lib/geolocation';

interface PropertyCardProps {
  property: Property | PropertyWithDetails;
  onFavoriteToggle?: () => void;
}

// Amenity icons mapping
const amenityIconMap: Record<string, React.ElementType> = {
  'WiFi': Wifi,
  'Parking': Car,
  'Mess/Kitchen': Utensils,
  'Security': Shield,
};

export default function PropertyCard({ property, onFavoriteToggle }: PropertyCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [favorite, setFavorite] = useState(false);

  useEffect(() => {
    isFavorite(property.id).then(setFavorite);
  }, [property.id]);

  useEffect(() => {
    if (property.images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [property.images.length]);

  // Calculate price display with offer
  const hasOffer = property.offer_price && property.offer_price < property.price_from;
  const displayPrice = hasOffer ? property.offer_price : property.price_from;
  const priceDisplay = property.price_to && !hasOffer
    ? `₹${property.price_from.toLocaleString()} - ₹${property.price_to.toLocaleString()}`
    : `₹${displayPrice!.toLocaleString()}`;
  
  const discountPercentage = hasOffer
    ? Math.round(((property.price_from - property.offer_price!) / property.price_from) * 100)
    : 0;

  // Get amenities if available
  const propertyWithDetails = property as PropertyWithDetails;
  const amenities = propertyWithDetails.amenities || [];
  const displayAmenities = amenities.slice(0, 4);
  
  // Check if distance is available
  const hasDistance = propertyWithDetails.distance !== undefined;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -6 }}
      className="h-full"
    >
      <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/20 h-full flex flex-col">
        <Link to={`/property/${property.id}`} className="block">
          <div className="relative h-44 xl:h-48 overflow-hidden bg-gradient-to-br from-muted to-muted/50">
            {property.images.length > 0 ? (
              <img
                src={property.images[currentImageIndex]}
                alt={property.name}
                className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground">
                No image available
              </div>
            )}
            
            {/* Gradient overlay for better badge visibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />
            
            {/* Top badges */}
            <div className="absolute top-2 left-2 flex flex-col gap-1.5">
              <VerifiedBadge verified={property.verified} />
              {hasOffer && (
                <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 shadow-lg text-xs">
                  <Tag className="h-3 w-3 mr-1" />
                  {discountPercentage}% OFF
                </Badge>
              )}
            </div>
            
            <div className="absolute top-2 right-2">
              <Badge variant="secondary" className="backdrop-blur-sm bg-background/90 shadow-md text-xs">
                {property.type}
              </Badge>
            </div>

            {/* Image indicators */}
            {property.images.length > 1 && (
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                {property.images.map((_, index) => (
                  <div
                    key={index}
                    className={`h-1 rounded-full transition-all duration-300 ${
                      index === currentImageIndex 
                        ? 'bg-white w-5 shadow-lg' 
                        : 'bg-white/50 w-1'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </Link>

        <CardContent className="p-3.5 flex-1 flex flex-col">
          <Link to={`/property/${property.id}`} className="block mb-2">
            <h3 className="font-bold text-base xl:text-lg mb-1.5 hover:text-primary transition-colors line-clamp-2 leading-tight">
              {property.name}
            </h3>
          </Link>

          {/* Location */}
          <div className="flex items-start gap-1 text-xs text-muted-foreground mb-2">
            <MapPin className="h-3.5 w-3.5 mt-0.5 shrink-0" />
            <span className="line-clamp-1">{property.locality}, {property.city}</span>
          </div>
          
          {/* Distance Badge (if available) */}
          {hasDistance && (
            <div className="mb-2">
              <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 text-xs gap-1">
                <Navigation className="h-3 w-3" />
                {formatDistance(propertyWithDetails.distance!)} away
              </Badge>
            </div>
          )}
          
          {/* Accommodation Type & Suitable For */}
          <div className="space-y-1.5 mb-2">
            {property.accommodation_type && (
              <div className="flex items-center gap-1 text-xs">
                <Users className="h-3 w-3 text-primary" />
                <span className="font-medium text-foreground">{property.accommodation_type}</span>
              </div>
            )}

            {property.suitable_for && property.suitable_for.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {property.suitable_for.slice(0, 2).map((type) => (
                  <Badge
                    key={type}
                    variant="outline"
                    className="text-xs bg-primary/5 border-primary/30 text-primary hover:bg-primary/10 py-0"
                  >
                    <UserCheck className="h-2.5 w-2.5 mr-0.5" />
                    {type}
                  </Badge>
                ))}
                {property.suitable_for.length > 2 && (
                  <Badge variant="outline" className="text-xs bg-muted py-0">
                    +{property.suitable_for.length - 2}
                  </Badge>
                )}
              </div>
            )}
          </div>

          {/* Amenities */}
          {displayAmenities.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {displayAmenities.map((amenity) => {
                const IconComponent = amenityIconMap[amenity.amenity_name] || Shield;
                return (
                  <div
                    key={amenity.id}
                    className="flex items-center gap-1 text-xs bg-secondary/60 text-secondary-foreground px-2 py-1 rounded-lg hover:bg-secondary transition-colors"
                    title={amenity.amenity_name}
                  >
                    <IconComponent className="h-3 w-3" />
                    <span className="hidden xl:inline font-medium">{amenity.amenity_name}</span>
                  </div>
                );
              })}
              {amenities.length > 4 && (
                <div className="flex items-center text-xs text-muted-foreground px-1.5 py-1">
                  +{amenities.length - 4}
                </div>
              )}
            </div>
          )}

          {/* Spacer to push price and footer to bottom */}
          <div className="flex-1" />

          {/* Price Section */}
          <div className="mb-2.5">
            {hasOffer ? (
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-0.5 text-xl xl:text-2xl font-bold text-primary">
                    <IndianRupee className="h-4 w-4 xl:h-5 xl:w-5" />
                    <span>{property.offer_price!.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-0.5 text-xs text-muted-foreground line-through">
                    <IndianRupee className="h-3 w-3" />
                    <span>{property.price_from.toLocaleString()}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Sparkles className="h-3 w-3 text-orange-500" />
                  <span>Special Offer</span>
                  <span className="font-semibold">• /month</span>
                </div>
              </div>
            ) : (
              <div className="flex items-baseline gap-1">
                <div className="flex items-center gap-0.5 text-xl xl:text-2xl font-bold text-primary">
                  <IndianRupee className="h-4 w-4 xl:h-5 xl:w-5" />
                  <span>{priceDisplay}</span>
                </div>
                <span className="text-xs font-medium text-muted-foreground">/month</span>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-between items-center pt-2.5 border-t">
            <Badge 
              variant={property.availability_status === 'Available' ? 'default' : 'secondary'} 
              className="text-xs font-medium"
            >
              {property.availability_status}
            </Badge>
            <FavoriteButton
              propertyId={property.id}
              isFavorite={favorite}
              onToggle={() => {
                setFavorite(!favorite);
                onFavoriteToggle?.();
              }}
            />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
