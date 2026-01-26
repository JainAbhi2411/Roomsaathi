import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MapPin, Phone, Mail, Star, IndianRupee, Clock, CheckCircle2, 
  Utensils, ChevronLeft, ChevronRight, Navigation, Sparkles
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
      <AnimatePresence>
        {open && (
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
            >
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-2xl">
                  <Utensils className="w-6 h-6 text-primary" />
                  {mess.name}
                  {mess.verified && (
                    <Badge className="bg-primary text-primary-foreground">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-6 mt-4">
                {/* Image Gallery with Smooth Transitions */}
                <motion.div 
                  className="relative h-80 rounded-xl overflow-hidden bg-muted shadow-lg"
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1, duration: 0.4 }}
                >
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={currentImageIndex}
                      src={images[currentImageIndex]}
                      alt={`${mess.name} - Image ${currentImageIndex + 1}`}
                      className="w-full h-full object-cover"
                      initial={{ opacity: 0, x: 100 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      transition={{ duration: 0.4 }}
                    />
                  </AnimatePresence>

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

                  {images.length > 1 && (
                    <>
                      <Button
                        variant="secondary"
                        size="icon"
                        className="absolute left-3 top-1/2 -translate-y-1/2 bg-background/90 hover:bg-background shadow-lg"
                        onClick={prevImage}
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </Button>
                      <Button
                        variant="secondary"
                        size="icon"
                        className="absolute right-3 top-1/2 -translate-y-1/2 bg-background/90 hover:bg-background shadow-lg"
                        onClick={nextImage}
                      >
                        <ChevronRight className="w-5 h-5" />
                      </Button>
                      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-background/90 px-4 py-1.5 rounded-full text-sm font-medium shadow-lg">
                        {currentImageIndex + 1} / {images.length}
                      </div>
                    </>
                  )}

                  {/* Rating Badge */}
                  <motion.div 
                    className="absolute top-3 right-3 bg-background/95 px-4 py-2 rounded-full flex items-center gap-2 shadow-lg"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, type: 'spring' }}
                  >
                    <Star className="w-5 h-5 fill-accent text-accent" />
                    <span className="font-bold text-lg">{mess.rating.toFixed(1)}</span>
                  </motion.div>

                  {/* Distance Badge */}
                  {mess.distance !== undefined && (
                    <motion.div
                      className="absolute top-3 left-3 bg-primary/95 text-primary-foreground px-4 py-2 rounded-full flex items-center gap-2 shadow-lg font-bold"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.4, type: 'spring' }}
                    >
                      <Navigation className="w-4 h-4" />
                      {mess.distance.toFixed(2)} km away
                    </motion.div>
                  )}
                </motion.div>

                {/* Description with Animation */}
                {mess.description && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.3 }}
                    className="bg-gradient-to-br from-secondary/30 to-secondary/10 p-4 rounded-lg border"
                  >
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-primary" />
                      About This Place
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">{mess.description}</p>
                  </motion.div>
                )}

                {/* Location and Contact - Side by Side */}
                <motion.div 
                  className="grid md:grid-cols-2 gap-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.3 }}
                >
                  <div className="space-y-3 bg-muted/50 p-4 rounded-lg">
                    <h3 className="font-semibold flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-primary" />
                      Location
                    </h3>
                    <div className="space-y-2">
                      <div className="text-sm">
                        <p className="font-medium">{mess.address}</p>
                        <p className="text-muted-foreground">{mess.locality}, {mess.city}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 bg-muted/50 p-4 rounded-lg">
                    <h3 className="font-semibold flex items-center gap-2">
                      <Phone className="w-4 h-4 text-primary" />
                      Contact
                    </h3>
                    <div className="space-y-2">
                      {mess.contact_phone && (
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="w-4 h-4 text-muted-foreground" />
                          <a href={`tel:${mess.contact_phone}`} className="hover:text-primary font-medium">
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
                </motion.div>

                <Separator />

                {/* Meal Types with Animation */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.3 }}
                >
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Utensils className="w-4 h-4 text-primary" />
                    Available Meals
                  </h3>
                  <div className="flex gap-2 flex-wrap">
                    {mess.meal_types.map((meal, index) => (
                      <motion.div
                        key={meal}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5 + index * 0.05 }}
                      >
                        <Badge variant="secondary" className="capitalize text-sm px-3 py-1">
                          {meal}
                        </Badge>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Pricing with Animation */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.3 }}
                >
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <IndianRupee className="w-4 h-4 text-primary" />
                    Pricing
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {mess.pricing.breakfast && (
                      <motion.div 
                        className="bg-gradient-to-br from-secondary/50 to-secondary/20 p-3 rounded-lg border"
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                      >
                        <p className="text-xs text-muted-foreground mb-1">Breakfast</p>
                        <p className="font-bold text-lg flex items-center">
                          <IndianRupee className="w-4 h-4" />
                          {mess.pricing.breakfast}
                        </p>
                      </motion.div>
                    )}
                    {mess.pricing.lunch && (
                      <motion.div 
                        className="bg-gradient-to-br from-secondary/50 to-secondary/20 p-3 rounded-lg border"
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                      >
                        <p className="text-xs text-muted-foreground mb-1">Lunch</p>
                        <p className="font-bold text-lg flex items-center">
                          <IndianRupee className="w-4 h-4" />
                          {mess.pricing.lunch}
                        </p>
                      </motion.div>
                    )}
                    {mess.pricing.dinner && (
                      <motion.div 
                        className="bg-gradient-to-br from-secondary/50 to-secondary/20 p-3 rounded-lg border"
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                      >
                        <p className="text-xs text-muted-foreground mb-1">Dinner</p>
                        <p className="font-bold text-lg flex items-center">
                          <IndianRupee className="w-4 h-4" />
                          {mess.pricing.dinner}
                        </p>
                      </motion.div>
                    )}
                    {mess.pricing.snacks && (
                      <motion.div 
                        className="bg-gradient-to-br from-secondary/50 to-secondary/20 p-3 rounded-lg border"
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                      >
                        <p className="text-xs text-muted-foreground mb-1">Snacks</p>
                        <p className="font-bold text-lg flex items-center">
                          <IndianRupee className="w-4 h-4" />
                          {mess.pricing.snacks}
                        </p>
                      </motion.div>
                    )}
                    {mess.pricing.monthly && (
                      <motion.div 
                        className="bg-gradient-to-br from-primary/20 to-primary/10 p-3 rounded-lg border-2 border-primary/30 md:col-span-2"
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                      >
                        <p className="text-xs text-muted-foreground mb-1">Monthly Package</p>
                        <p className="font-bold text-xl flex items-center text-primary">
                          <IndianRupee className="w-5 h-5" />
                          {mess.pricing.monthly}
                        </p>
                      </motion.div>
                    )}
                  </div>
                </motion.div>

                {/* Timings */}
                {Object.keys(mess.timings).length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.3 }}
                  >
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-primary" />
                      Timings
                    </h3>
                    <div className="grid md:grid-cols-2 gap-3">
                      {mess.timings.breakfast && (
                        <div className="flex items-center gap-2 text-sm bg-muted/50 p-2 rounded">
                          <span className="font-medium min-w-[80px]">Breakfast:</span>
                          <span className="text-muted-foreground">{mess.timings.breakfast}</span>
                        </div>
                      )}
                      {mess.timings.lunch && (
                        <div className="flex items-center gap-2 text-sm bg-muted/50 p-2 rounded">
                          <span className="font-medium min-w-[80px]">Lunch:</span>
                          <span className="text-muted-foreground">{mess.timings.lunch}</span>
                        </div>
                      )}
                      {mess.timings.dinner && (
                        <div className="flex items-center gap-2 text-sm bg-muted/50 p-2 rounded">
                          <span className="font-medium min-w-[80px]">Dinner:</span>
                          <span className="text-muted-foreground">{mess.timings.dinner}</span>
                        </div>
                      )}
                      {mess.timings.snacks && (
                        <div className="flex items-center gap-2 text-sm bg-muted/50 p-2 rounded">
                          <span className="font-medium min-w-[80px]">Snacks:</span>
                          <span className="text-muted-foreground">{mess.timings.snacks}</span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* Amenities */}
                {mess.amenities && mess.amenities.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7, duration: 0.3 }}
                  >
                    <h3 className="font-semibold mb-3">Amenities</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {mess.amenities.map((amenity, index) => (
                        <motion.div 
                          key={amenity} 
                          className="flex items-center gap-2 text-sm bg-muted/50 p-2 rounded"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.8 + index * 0.03 }}
                        >
                          <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                          <span>{amenity}</span>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Action Buttons */}
                <motion.div 
                  className="flex gap-3 pt-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.3 }}
                >
                  <Button
                    className="flex-1"
                    size="lg"
                    onClick={() => {
                      onViewMap(mess);
                      onOpenChange(false);
                    }}
                  >
                    <MapPin className="w-4 h-4 mr-2" />
                    View on Map
                  </Button>
                  {mess.contact_phone && (
                    <Button variant="outline" size="lg" asChild>
                      <a href={`tel:${mess.contact_phone}`}>
                        <Phone className="w-4 h-4 mr-2" />
                        Call Now
                      </a>
                    </Button>
                  )}
                </motion.div>
              </div>
            </motion.div>
          </DialogContent>
        )}
      </AnimatePresence>
    </Dialog>
  );
}
