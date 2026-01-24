import { motion } from 'motion/react';
import { MapPin, IndianRupee, Heart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router';
import type { Property } from '@/types/index';
import VerifiedBadge from './VerifiedBadge';
import { useState } from 'react';
import { addToFavorites, removeFromFavorites } from '@/db/api';

interface PropertyCardSmallProps {
  property: Property;
  onFavoriteToggle?: () => void;
}

export default function PropertyCardSmall({ property, onFavoriteToggle }: PropertyCardSmallProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);

  const handleFavoriteToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isTogglingFavorite) return;
    
    setIsTogglingFavorite(true);
    try {
      if (isFavorite) {
        await removeFromFavorites(property.id);
        setIsFavorite(false);
      } else {
        await addToFavorites(property.id);
        setIsFavorite(true);
      }
      onFavoriteToggle?.();
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    } finally {
      setIsTogglingFavorite(false);
    }
  };

  return (
    <Link to={`/property/${property.id}`}>
      <Card className="group overflow-hidden hover:shadow-hover transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">
        {/* Image */}
        <div className="relative h-40 overflow-hidden">
          <img
            src={property.images[0]}
            alt={property.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
          
          {/* Favorite Button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background transition-colors"
            onClick={handleFavoriteToggle}
            disabled={isTogglingFavorite}
          >
            <Heart
              className={`h-4 w-4 transition-colors ${
                isFavorite ? 'fill-primary text-primary' : 'text-muted-foreground'
              }`}
            />
          </Button>

          {/* Verified Badge */}
          {property.verified && (
            <div className="absolute top-2 left-2">
              <VerifiedBadge verified={property.verified} />
            </div>
          )}

          {/* Property Type Badge */}
          <Badge className="absolute bottom-2 left-2 bg-primary/90 backdrop-blur-sm">
            {property.type}
          </Badge>
        </div>

        {/* Content */}
        <CardContent className="p-3 flex-1 flex flex-col">
          <h3 className="font-semibold text-sm mb-1 line-clamp-1 group-hover:text-primary transition-colors">
            {property.name}
          </h3>
          
          <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
            <MapPin className="h-3 w-3 flex-shrink-0" />
            <span className="line-clamp-1">{property.locality}, {property.city}</span>
          </div>

          <div className="flex items-center gap-1 mt-auto">
            <IndianRupee className="h-4 w-4 text-primary" />
            <span className="font-bold text-primary">
              {property.price_from.toLocaleString()}
            </span>
            <span className="text-xs text-muted-foreground">/month</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
