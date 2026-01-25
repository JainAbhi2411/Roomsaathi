import { motion } from 'motion/react';
import { MapPin, Phone, Star, IndianRupee, Clock, CheckCircle2, Utensils } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { MessCenter } from '@/types/index';

interface MessCardProps {
  mess: MessCenter;
  onViewDetails: (mess: MessCenter) => void;
  onViewMap: (mess: MessCenter) => void;
}

export default function MessCard({ mess, onViewDetails, onViewMap }: MessCardProps) {
  const defaultImage = 'https://miaoda-site-img.s3cdn.medo.dev/images/mess-default.jpg';
  const imageUrl = mess.images && mess.images.length > 0 ? mess.images[0] : defaultImage;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
        <div className="relative h-48 overflow-hidden">
          <img
            src={imageUrl}
            alt={mess.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          {mess.verified && (
            <Badge className="absolute top-2 left-2 bg-primary text-primary-foreground">
              <CheckCircle2 className="w-3 h-3 mr-1" />
              Verified
            </Badge>
          )}
          {mess.distance !== undefined && (
            <Badge className="absolute top-2 right-2 bg-background/90 text-foreground">
              {mess.distance.toFixed(1)} km away
            </Badge>
          )}
        </div>

        <CardContent className="p-4">
          <div className="space-y-3">
            {/* Name and Rating */}
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-semibold text-lg line-clamp-1">{mess.name}</h3>
              <div className="flex items-center gap-1 shrink-0">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium text-sm">{mess.rating.toFixed(1)}</span>
              </div>
            </div>

            {/* Description */}
            {mess.description && (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {mess.description}
              </p>
            )}

            {/* Location */}
            <div className="flex items-start gap-2 text-sm">
              <MapPin className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
              <span className="text-muted-foreground line-clamp-1">
                {mess.locality}, {mess.city}
              </span>
            </div>

            {/* Meal Types */}
            <div className="flex items-center gap-2 flex-wrap">
              <Utensils className="w-4 h-4 text-muted-foreground" />
              <div className="flex gap-1 flex-wrap">
                {mess.meal_types.map((meal) => (
                  <Badge key={meal} variant="secondary" className="text-xs capitalize">
                    {meal}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Pricing */}
            <div className="flex items-center gap-2 text-sm">
              <IndianRupee className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium">
                {mess.pricing.monthly ? (
                  <>₹{mess.pricing.monthly}/month</>
                ) : (
                  <>Starting from ₹{Math.min(...Object.values(mess.pricing).filter(v => typeof v === 'number'))}</>
                )}
              </span>
            </div>

            {/* Contact */}
            {mess.contact_phone && (
              <div className="flex items-center gap-2 text-sm">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">{mess.contact_phone}</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2">
              <Button
                variant="default"
                size="sm"
                className="flex-1"
                onClick={() => onViewDetails(mess)}
              >
                View Details
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => onViewMap(mess)}
              >
                <MapPin className="w-4 h-4 mr-1" />
                Map View
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
