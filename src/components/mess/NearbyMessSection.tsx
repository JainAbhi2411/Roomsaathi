import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Utensils, MapPin, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import MessCard from './MessCard';
import MessDetailDialog from './MessDetailDialog';
import MessMapView from './MessMapView';
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

  const propertyLocation = property.latitude && property.longitude
    ? {
        latitude: property.latitude,
        longitude: property.longitude,
        name: property.name,
      }
    : null;

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Utensils className="w-6 h-6 text-primary" />
            Nearby Mess & Tiffin Centers
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Find convenient dining options near this property
          </p>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <Skeleton className="h-48 w-full bg-muted" />
                  <CardContent className="p-4 space-y-3">
                    <Skeleton className="h-6 w-3/4 bg-muted" />
                    <Skeleton className="h-4 w-full bg-muted" />
                    <Skeleton className="h-4 w-2/3 bg-muted" />
                    <div className="flex gap-2">
                      <Skeleton className="h-9 flex-1 bg-muted" />
                      <Skeleton className="h-9 flex-1 bg-muted" />
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
              transition={{ duration: 0.3 }}
            >
              <div className="mb-4 text-sm text-muted-foreground">
                Found {messCenters.length} mess center{messCenters.length !== 1 ? 's' : ''} within 5km
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {messCenters.map((mess) => (
                  <MessCard
                    key={mess.id}
                    mess={mess}
                    onViewDetails={handleViewDetails}
                    onViewMap={handleViewMap}
                  />
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
