import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MapPin, Phone, Mail, Star, IndianRupee, Clock, CheckCircle2, 
  Utensils, ChevronLeft, ChevronRight, X 
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import type { MessCenter } from '@/types/index';

interface MessDetailDialogProps {
  mess: MessCenter | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onViewMap: (mess: MessCenter) => void;
}

export default function MessDetailDialog({ 
  mess, 
  open, 
  onOpenChange,
  onViewMap 
}: MessDetailDialogProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!mess) return null;

  const images = mess.images && mess.images.length > 0 
    ? mess.images 
    : ['https://miaoda-site-img.s3cdn.medo.dev/images/mess-default.jpg'];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {mess.name}
            {mess.verified && (
              <Badge className="bg-primary text-primary-foreground">
                <CheckCircle2 className="w-3 h-3 mr-1" />
                Verified
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Image Gallery */}
          <div className="relative h-80 rounded-lg overflow-hidden bg-muted">
            <AnimatePresence mode="wait">
              <motion.img
                key={currentImageIndex}
                src={images[currentImageIndex]}
                alt={`${mess.name} - Image ${currentImageIndex + 1}`}
                className="w-full h-full object-cover"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              />
            </AnimatePresence>

            {images.length > 1 && (
              <>
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background"
                  onClick={prevImage}
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background"
                  onClick={nextImage}
                >
                  <ChevronRight className="w-5 h-5" />
                </Button>
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-background/80 px-3 py-1 rounded-full text-sm">
                  {currentImageIndex + 1} / {images.length}
                </div>
              </>
            )}

            {/* Rating Badge */}
            <div className="absolute top-2 right-2 bg-background/90 px-3 py-1 rounded-full flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">{mess.rating.toFixed(1)}</span>
            </div>
          </div>

          {/* Description */}
          {mess.description && (
            <div>
              <h3 className="font-semibold mb-2">About</h3>
              <p className="text-muted-foreground">{mess.description}</p>
            </div>
          )}

          {/* Location and Contact */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h3 className="font-semibold">Location</h3>
              <div className="space-y-2">
                <div className="flex items-start gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                  <div>
                    <p>{mess.address}</p>
                    <p className="text-muted-foreground">{mess.locality}, {mess.city}</p>
                  </div>
                </div>
                {mess.distance !== undefined && (
                  <Badge variant="secondary">
                    {mess.distance.toFixed(2)} km from property
                  </Badge>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold">Contact Information</h3>
              <div className="space-y-2">
                {mess.contact_phone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <a href={`tel:${mess.contact_phone}`} className="hover:text-primary">
                      {mess.contact_phone}
                    </a>
                  </div>
                )}
                {mess.contact_email && (
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <a href={`mailto:${mess.contact_email}`} className="hover:text-primary">
                      {mess.contact_email}
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* Meal Types */}
          <div>
            <h3 className="font-semibold mb-3">Available Meals</h3>
            <div className="flex gap-2 flex-wrap">
              {mess.meal_types.map((meal) => (
                <Badge key={meal} variant="secondary" className="capitalize">
                  <Utensils className="w-3 h-3 mr-1" />
                  {meal}
                </Badge>
              ))}
            </div>
          </div>

          {/* Pricing */}
          <div>
            <h3 className="font-semibold mb-3">Pricing</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {mess.pricing.breakfast && (
                <div className="bg-muted p-3 rounded-lg">
                  <p className="text-sm text-muted-foreground">Breakfast</p>
                  <p className="font-semibold flex items-center">
                    <IndianRupee className="w-4 h-4" />
                    {mess.pricing.breakfast}
                  </p>
                </div>
              )}
              {mess.pricing.lunch && (
                <div className="bg-muted p-3 rounded-lg">
                  <p className="text-sm text-muted-foreground">Lunch</p>
                  <p className="font-semibold flex items-center">
                    <IndianRupee className="w-4 h-4" />
                    {mess.pricing.lunch}
                  </p>
                </div>
              )}
              {mess.pricing.dinner && (
                <div className="bg-muted p-3 rounded-lg">
                  <p className="text-sm text-muted-foreground">Dinner</p>
                  <p className="font-semibold flex items-center">
                    <IndianRupee className="w-4 h-4" />
                    {mess.pricing.dinner}
                  </p>
                </div>
              )}
              {mess.pricing.snacks && (
                <div className="bg-muted p-3 rounded-lg">
                  <p className="text-sm text-muted-foreground">Snacks</p>
                  <p className="font-semibold flex items-center">
                    <IndianRupee className="w-4 h-4" />
                    {mess.pricing.snacks}
                  </p>
                </div>
              )}
              {mess.pricing.monthly && (
                <div className="bg-primary/10 p-3 rounded-lg md:col-span-2">
                  <p className="text-sm text-muted-foreground">Monthly Package</p>
                  <p className="font-semibold text-lg flex items-center text-primary">
                    <IndianRupee className="w-5 h-5" />
                    {mess.pricing.monthly}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Timings */}
          {Object.keys(mess.timings).length > 0 && (
            <div>
              <h3 className="font-semibold mb-3">Timings</h3>
              <div className="grid md:grid-cols-2 gap-3">
                {mess.timings.breakfast && (
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">Breakfast:</span>
                    <span className="text-muted-foreground">{mess.timings.breakfast}</span>
                  </div>
                )}
                {mess.timings.lunch && (
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">Lunch:</span>
                    <span className="text-muted-foreground">{mess.timings.lunch}</span>
                  </div>
                )}
                {mess.timings.dinner && (
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">Dinner:</span>
                    <span className="text-muted-foreground">{mess.timings.dinner}</span>
                  </div>
                )}
                {mess.timings.snacks && (
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">Snacks:</span>
                    <span className="text-muted-foreground">{mess.timings.snacks}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Amenities */}
          {mess.amenities && mess.amenities.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3">Amenities</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {mess.amenities.map((amenity) => (
                  <div key={amenity} className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Button */}
          <div className="flex gap-3">
            <Button
              className="flex-1"
              onClick={() => {
                onViewMap(mess);
                onOpenChange(false);
              }}
            >
              <MapPin className="w-4 h-4 mr-2" />
              View on Map
            </Button>
            {mess.contact_phone && (
              <Button variant="outline" asChild>
                <a href={`tel:${mess.contact_phone}`}>
                  <Phone className="w-4 h-4 mr-2" />
                  Call Now
                </a>
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
