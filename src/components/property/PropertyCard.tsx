import { motion } from 'motion/react';
import { Link } from 'react-router';
import { MapPin, IndianRupee, Wifi, Car, Utensils, Shield, Users } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Property, PropertyWithDetails } from '@/types/index';
import VerifiedBadge from './VerifiedBadge';
import FavoriteButton from './FavoriteButton';
import { useState, useEffect } from 'react';
import { isFavorite } from '@/db/api';

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

  const priceDisplay = property.price_to
    ? `₹${property.price_from.toLocaleString()} - ₹${property.price_to.toLocaleString()}`
    : `₹${property.price_from.toLocaleString()}`;

  // Get amenities if available
  const propertyWithDetails = property as PropertyWithDetails;
  const amenities = propertyWithDetails.amenities || [];
  const displayAmenities = amenities.slice(0, 4);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -4 }}
    >
      <Card className="overflow-hidden hover:shadow-hover transition-shadow duration-300">
        <Link to={`/property/${property.id}`}>
          <div className="relative h-48 overflow-hidden bg-muted">
            {property.images.length > 0 ? (
              <img
                src={property.images[currentImageIndex]}
                alt={property.name}
                className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground">
                No image available
              </div>
            )}
            <div className="absolute top-2 left-2">
              <VerifiedBadge verified={property.verified} />
            </div>
            <div className="absolute top-2 right-2">
              <Badge variant="secondary">{property.type}</Badge>
            </div>
            {property.images.length > 1 && (
              <div className="absolute bottom-2 right-2 flex gap-1">
                {property.images.map((_, index) => (
                  <div
                    key={index}
                    className={`h-1.5 w-1.5 rounded-full transition-all ${
                      index === currentImageIndex ? 'bg-primary w-4' : 'bg-white/60'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </Link>

        <CardContent className="p-4">
          <Link to={`/property/${property.id}`}>
            <h3 className="font-semibold text-lg mb-2 hover:text-primary transition-colors line-clamp-1">
              {property.name}
            </h3>
          </Link>
          <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
            <MapPin className="h-4 w-4" />
            <span className="line-clamp-1">{property.locality}, {property.city}</span>
          </div>
          
          {/* Accommodation Type */}
          {property.accommodation_type && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
              <Users className="h-3.5 w-3.5" />
              <span>{property.accommodation_type}</span>
            </div>
          )}

          {/* Amenities */}
          {displayAmenities.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {displayAmenities.map((amenity) => {
                const IconComponent = amenityIconMap[amenity.amenity_name] || Shield;
                return (
                  <div
                    key={amenity.id}
                    className="flex items-center gap-1 text-xs bg-secondary/50 text-secondary-foreground px-2 py-1 rounded-md"
                    title={amenity.amenity_name}
                  >
                    <IconComponent className="h-3 w-3" />
                    <span className="hidden xl:inline">{amenity.amenity_name}</span>
                  </div>
                );
              })}
              {amenities.length > 4 && (
                <div className="flex items-center text-xs text-muted-foreground px-2 py-1">
                  +{amenities.length - 4} more
                </div>
              )}
            </div>
          )}

          <div className="flex items-center gap-1 text-lg font-bold text-primary">
            <IndianRupee className="h-5 w-5" />
            <span>{priceDisplay}</span>
            <span className="text-sm font-normal text-muted-foreground">/month</span>
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0 flex justify-between items-center">
          <Badge variant="outline" className="text-xs">
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
        </CardFooter>
      </Card>
    </motion.div>
  );
}
