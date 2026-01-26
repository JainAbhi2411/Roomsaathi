import { motion } from 'motion/react';
import { MapPin, Star, IndianRupee, CheckCircle2, Utensils, Navigation, Sparkles } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { MessCenter } from '@/types/index';

interface MessCardProps {
  mess: MessCenter;
  onViewDetails: (mess: MessCenter) => void;
  onViewMap: (mess: MessCenter) => void;
  onBookQuery?: (mess: MessCenter) => void;
}

export default function MessCard({ mess, onViewDetails, onViewMap, onBookQuery }: MessCardProps) {
  const defaultImage = 'https://miaoda-site-img.s3cdn.medo.dev/images/mess-default.jpg';
  const imageUrl = mess.images && mess.images.length > 0 ? mess.images[0] : defaultImage;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className="h-full"
    >
      <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/20 h-full flex flex-col group cursor-pointer" onClick={() => onViewDetails(mess)}>
        {/* Compact Image Section */}
        <div className="relative h-32 overflow-hidden">
          <motion.img
            src={imageUrl}
            alt={mess.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          
          {/* Verified Badge */}
          {mess.verified && (
            <Badge className="absolute top-2 left-2 bg-primary text-primary-foreground shadow-lg">
              <CheckCircle2 className="w-3 h-3 mr-1" />
              Verified
            </Badge>
          )}
          
          {/* Distance Badge */}
          {mess.distance !== undefined && (
            <Badge className="absolute top-2 right-2 bg-background/95 text-foreground font-bold shadow-lg">
              <Navigation className="w-3 h-3 mr-1" />
              {mess.distance.toFixed(1)} km
            </Badge>
          )}

          {/* Rating Badge - Bottom Right */}
          <div className="absolute bottom-2 right-2 bg-background/95 px-2 py-1 rounded-full flex items-center gap-1 shadow-lg">
            <Star className="w-3 h-3 fill-accent text-accent" />
            <span className="font-bold text-sm">{mess.rating.toFixed(1)}</span>
          </div>
        </div>

        {/* Compact Content Section */}
        <CardContent className="p-3 flex-1 flex flex-col">
          <div className="space-y-2 flex-1">
            {/* Name */}
            <h3 className="font-bold text-base line-clamp-1 group-hover:text-primary transition-colors">
              {mess.name}
            </h3>

            {/* Location - Compact */}
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <MapPin className="w-3 h-3 flex-shrink-0" />
              <span className="line-clamp-1">{mess.locality}</span>
            </div>

            {/* Meal Types - Compact Pills */}
            <div className="flex items-center gap-1 flex-wrap">
              {mess.meal_types.slice(0, 3).map((meal) => (
                <Badge key={meal} variant="secondary" className="text-xs capitalize px-2 py-0 h-5">
                  {meal}
                </Badge>
              ))}
              {mess.meal_types.length > 3 && (
                <Badge variant="secondary" className="text-xs px-2 py-0 h-5">
                  +{mess.meal_types.length - 3}
                </Badge>
              )}
            </div>

            {/* Pricing - Prominent */}
            <div className="flex items-center gap-1 bg-primary/10 px-2 py-1.5 rounded-lg">
              <IndianRupee className="w-4 h-4 text-primary" />
              <span className="font-bold text-sm text-primary">
                {mess.pricing.monthly ? (
                  <>₹{mess.pricing.monthly}/mo</>
                ) : (
                  <>From ₹{Math.min(...Object.values(mess.pricing).filter(v => typeof v === 'number'))}</>
                )}
              </span>
            </div>
          </div>

          {/* Action Buttons - Compact */}
          <div className="flex gap-2 mt-3 pt-3 border-t">
            {onBookQuery ? (
              <>
                <Button
                  variant="default"
                  size="sm"
                  className="flex-1 h-8 text-xs bg-accent text-accent-foreground hover:bg-accent/90"
                  onClick={(e) => {
                    e.stopPropagation();
                    onBookQuery(mess);
                  }}
                >
                  <Sparkles className="w-3 h-3 mr-1" />
                  Book Now
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 px-3"
                  onClick={(e) => {
                    e.stopPropagation();
                    onViewMap(mess);
                  }}
                >
                  <MapPin className="w-3 h-3" />
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="default"
                  size="sm"
                  className="flex-1 h-8 text-xs"
                  onClick={(e) => {
                    e.stopPropagation();
                    onViewDetails(mess);
                  }}
                >
                  Details
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 px-3"
                  onClick={(e) => {
                    e.stopPropagation();
                    onViewMap(mess);
                  }}
                >
                  <MapPin className="w-3 h-3" />
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
