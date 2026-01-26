import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Utensils, MapPin, AlertCircle, Sparkles, Gift, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import MessCard from './MessCard';
import MessDetailDialog from './MessDetailDialog';
import MessMapView from './MessMapView';
import MessBookingQueryForm from './MessBookingQueryForm';
import { getNearbyMessCenters } from '@/db/api';
import type { MessCenter, Property } from '@/types/index';

interface NearbyMessSectionProps {
  property: Property;
}

export default function NearbyMessSection({ property }: NearbyMessSectionProps) {
  const [messCenters, setMessCenters] = useState<MessCenter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMess, setSelectedMess] = useState<MessCenter | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingMess, setBookingMess] = useState<MessCenter | null>(null);

  useEffect(() => {
    loadNearbyMess();
  }, [property.id]);

  const loadNearbyMess = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getNearbyMessCenters(property.id, 5); // 5km radius
      setMessCenters(data);
    } catch (err) {
      console.error('Failed to load nearby mess centers:', err);
      setError('Failed to load nearby mess centers. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (mess: MessCenter) => {
    setSelectedMess(mess);
    setIsDetailOpen(true);
  };

  const handleViewMap = (mess: MessCenter) => {
    setSelectedMess(mess);
    setIsMapOpen(true);
  };

  const handleBookQuery = (mess: MessCenter) => {
    setBookingMess(mess);
    setShowBookingForm(true);
  };

  const handleCloseBookingForm = () => {
    setShowBookingForm(false);
    setBookingMess(null);
  };

  const propertyLocation = property.latitude && property.longitude
    ? {
        latitude: property.latitude,
        longitude: property.longitude,
        name: property.name,
      }
    : null;

  return (
    <>
      <Card className="overflow-hidden border-2 hover:border-primary/20 transition-colors">
        <CardHeader className="bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Utensils className="w-6 h-6 text-primary" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span>Nearby Mess & Tiffin Centers</span>
                  <Sparkles className="w-4 h-4 text-accent" />
                </div>
                <p className="text-sm font-normal text-muted-foreground mt-1">
                  Convenient dining options within 5km
                </p>
              </div>
            </CardTitle>
            {!loading && messCenters.length > 0 && (
              <Badge variant="secondary" className="text-lg px-4 py-2">
                {messCenters.length} Found
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          {/* Special Discount Offer Banner */}
          {!loading && messCenters.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="relative overflow-hidden border-2 border-accent/30 bg-gradient-to-br from-accent/10 via-accent/5 to-transparent shadow-lg">
                {/* Animated background elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  <motion.div
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: 'easeInOut',
                    }}
                    className="absolute -top-10 -right-10 w-40 h-40 bg-accent/20 rounded-full blur-3xl"
                  />
                  <motion.div
                    animate={{
                      scale: [1, 1.3, 1],
                      opacity: [0.2, 0.4, 0.2],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: 'easeInOut',
                      delay: 1,
                    }}
                    className="absolute -bottom-10 -left-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl"
                  />
                </div>

                <CardContent className="relative p-6">
                  <div className="flex items-start gap-4">
                    <motion.div
                      animate={{
                        rotate: [0, 10, -10, 0],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: 'easeInOut',
                      }}
                      className="flex-shrink-0"
                    >
                      <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center">
                        <Gift className="w-6 h-6 text-accent" />
                      </div>
                    </motion.div>
                    <div className="flex-1 space-y-2">
                      <h3 className="text-xl font-bold bg-gradient-to-r from-accent via-primary to-accent bg-clip-text text-transparent">
                        🎉 Special RoomSaathi Discount!
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Book mess services through RoomSaathi and get <span className="font-bold text-accent">exclusive discounts</span> on your subscription. Our team will help you get the best deals!
                      </p>
                      <div className="flex items-center gap-2 pt-2">
                        <Sparkles className="w-4 h-4 text-accent" />
                        <span className="text-xs font-semibold text-foreground">
                          Click "Book Now" on any mess below to get started
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Booking Form with Transition */}
          <AnimatePresence mode="wait">
            {showBookingForm && bookingMess && (
              <MessBookingQueryForm
                mess={bookingMess}
                onClose={handleCloseBookingForm}
              />
            )}
          </AnimatePresence>

          {/* Mess Centers List */}
          {loading ? (
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="h-32 w-full bg-muted" />
                  <CardContent className="p-3 space-y-2">
                    <Skeleton className="h-5 w-3/4 bg-muted" />
                    <Skeleton className="h-4 w-full bg-muted" />
                    <Skeleton className="h-4 w-2/3 bg-muted" />
                    <div className="flex gap-2 pt-2">
                      <Skeleton className="h-8 flex-1 bg-muted" />
                      <Skeleton className="h-8 w-12 bg-muted" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : error ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : messCenters.length === 0 ? (
            <Alert>
              <MapPin className="h-4 w-4" />
              <AlertDescription>
                No mess or tiffin centers found within 5km of this property.
              </AlertDescription>
            </Alert>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
                {messCenters.map((mess, index) => (
                  <motion.div
                    key={mess.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <MessCard
                      mess={mess}
                      onViewDetails={handleViewDetails}
                      onViewMap={handleViewMap}
                      onBookQuery={handleBookQuery}
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <MessDetailDialog
        mess={selectedMess}
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
        onViewMap={handleViewMap}
      />

      {/* Map View Dialog */}
      <MessMapView
        mess={selectedMess}
        propertyLocation={propertyLocation}
        open={isMapOpen}
        onOpenChange={setIsMapOpen}
      />
    </>
  );
}
