import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  MapPin,
  GraduationCap,
  Hospital,
  Bus,
  Train,
  BookOpen,
  Navigation,
  Star,
  Clock,
  ExternalLink,
  Home,
  ArrowRight,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  fetchAllNearbyAmenities,
  formatAmenityDistance,
  getAmenityTypeLabel,
  getDirectionUrl,
  type NearbyAmenity,
} from '@/services/googleMapsService';
import { AmenityType } from '@/types';

interface NeighborhoodAmenitiesProps {
  latitude: number;
  longitude: number;
  radius?: number;
}

const AMENITY_ICONS: Record<AmenityType, React.ComponentType<{ className?: string }>> = {
  [AmenityType.COACHING]: BookOpen,
  [AmenityType.HOSPITAL]: Hospital,
  [AmenityType.BUS_STATION]: Bus,
  [AmenityType.RAILWAY_STATION]: Train,
  [AmenityType.COLLEGE]: GraduationCap,
};

const AMENITY_COLORS: Record<AmenityType, string> = {
  [AmenityType.COACHING]: 'from-info/20 to-info/10 border-info/30',
  [AmenityType.HOSPITAL]: 'from-destructive/20 to-destructive/10 border-destructive/30',
  [AmenityType.BUS_STATION]: 'from-success/20 to-success/10 border-success/30',
  [AmenityType.RAILWAY_STATION]: 'from-primary/20 to-primary/10 border-primary/30',
  [AmenityType.COLLEGE]: 'from-accent/20 to-accent/10 border-accent/30',
};

const AMENITY_TEXT_COLORS: Record<AmenityType, string> = {
  [AmenityType.COACHING]: 'text-info',
  [AmenityType.HOSPITAL]: 'text-destructive',
  [AmenityType.BUS_STATION]: 'text-success',
  [AmenityType.RAILWAY_STATION]: 'text-primary',
  [AmenityType.COLLEGE]: 'text-accent-foreground',
};

export function NeighborhoodAmenities({
  latitude,
  longitude,
  radius = 5000,
}: NeighborhoodAmenitiesProps) {
  const [amenities, setAmenities] = useState<Record<AmenityType, NearbyAmenity[]>>({
    [AmenityType.COACHING]: [],
    [AmenityType.HOSPITAL]: [],
    [AmenityType.BUS_STATION]: [],
    [AmenityType.RAILWAY_STATION]: [],
    [AmenityType.COLLEGE]: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAmenity, setSelectedAmenity] = useState<{
    amenity: NearbyAmenity;
    type: AmenityType;
  } | null>(null);

  useEffect(() => {
    const loadAmenities = async () => {
      try {
        setLoading(true);
        setError(null);
        const results = await fetchAllNearbyAmenities(latitude, longitude, radius);
        setAmenities(results);
      } catch (err) {
        console.error('Error loading amenities:', err);
        setError('Failed to load nearby amenities');
      } finally {
        setLoading(false);
      }
    };

    if (latitude && longitude) {
      loadAmenities();
    }
  }, [latitude, longitude, radius]);

  // Flatten all amenities into a single array with type info
  const allAmenities = Object.entries(amenities).flatMap(([type, list]) =>
    list.slice(0, 3).map((amenity) => ({
      amenity,
      type: type as AmenityType,
    }))
  );

  // Calculate positions in a circular pattern
  const getCircularPosition = (index: number, total: number) => {
    const angle = (index * 360) / total - 90; // Start from top
    const radius = 45; // Percentage from center
    const x = 50 + radius * Math.cos((angle * Math.PI) / 180);
    const y = 50 + radius * Math.sin((angle * Math.PI) / 180);
    return { x, y, angle: angle + 90 };
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">Neighborhood Amenities</h2>
          <p className="text-muted-foreground">
            Discover important places near this property
          </p>
        </div>
        <div className="flex items-center justify-center min-h-[500px]">
          <Skeleton className="h-96 w-full max-w-3xl rounded-2xl bg-muted" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">Neighborhood Amenities</h2>
          <p className="text-destructive">{error}</p>
        </div>
      </div>
    );
  }

  // Check if we have any amenities
  const hasAmenities = allAmenities.length > 0;

  if (!hasAmenities) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">Neighborhood Amenities</h2>
          <p className="text-muted-foreground">
            No nearby amenities found within {radius / 1000}km radius
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2 flex items-center gap-3">
          <MapPin className="h-7 w-7 text-primary" />
          Neighborhood Amenities
        </h2>
        <p className="text-muted-foreground">
          Explore nearby places within {radius / 1000}km • Click any amenity for details
        </p>
      </div>

      {/* Circular Amenities Map */}
      <Card className="overflow-hidden bg-gradient-to-br from-secondary/20 to-background">
        <CardContent className="p-8 xl:p-12">
          <div className="relative w-full aspect-square max-w-3xl mx-auto">
            {/* Center Property Circle */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, type: 'spring' }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
            >
              <div className="relative">
                {/* Pulse effect */}
                <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping" />
                <div className="relative bg-gradient-to-br from-primary to-primary/80 rounded-full p-8 shadow-2xl border-4 border-background">
                  <Home className="h-12 w-12 text-primary-foreground" />
                </div>
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
                  <Badge className="bg-primary text-primary-foreground font-semibold px-4 py-1">
                    Property
                  </Badge>
                </div>
              </div>
            </motion.div>

            {/* Amenities positioned in circle */}
            {allAmenities.map((item, index) => {
              const position = getCircularPosition(index, allAmenities.length);
              const Icon = AMENITY_ICONS[item.type];
              const colorClass = AMENITY_COLORS[item.type];
              const textColor = AMENITY_TEXT_COLORS[item.type];

              return (
                <motion.div
                  key={`${item.type}-${item.amenity.id}`}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="absolute"
                  style={{
                    left: `${position.x}%`,
                    top: `${position.y}%`,
                    transform: 'translate(-50%, -50%)',
                  }}
                >
                  {/* Connection Line */}
                  <svg
                    className="absolute top-1/2 left-1/2 pointer-events-none"
                    style={{
                      width: '200px',
                      height: '200px',
                      transform: 'translate(-50%, -50%)',
                    }}
                  >
                    <defs>
                      <marker
                        id={`arrowhead-${index}`}
                        markerWidth="10"
                        markerHeight="10"
                        refX="9"
                        refY="3"
                        orient="auto"
                      >
                        <polygon
                          points="0 0, 10 3, 0 6"
                          className="fill-primary/30"
                        />
                      </marker>
                    </defs>
                    <motion.line
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.8, delay: index * 0.1 }}
                      x1="100"
                      y1="100"
                      x2={100 - (position.x - 50) * 2}
                      y2={100 - (position.y - 50) * 2}
                      stroke="hsl(var(--primary))"
                      strokeWidth="2"
                      strokeDasharray="5,5"
                      strokeOpacity="0.3"
                      markerEnd={`url(#arrowhead-${index})`}
                    />
                  </svg>

                  {/* Amenity Badge */}
                  <motion.button
                    whileHover={{ scale: 1.1, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedAmenity(item)}
                    className={`relative bg-gradient-to-br ${colorClass} border-2 rounded-full px-4 py-2 shadow-lg hover:shadow-xl transition-all cursor-pointer group`}
                  >
                    <div className="flex items-center gap-2">
                      <Icon className={`h-4 w-4 ${textColor}`} />
                      <span className="text-sm font-medium text-foreground max-w-[120px] truncate">
                        {item.amenity.name}
                      </span>
                    </div>
                    
                    {/* Distance badge */}
                    <div className="absolute -top-2 -right-2 bg-background border-2 border-primary rounded-full px-2 py-0.5 text-xs font-bold text-primary shadow-md">
                      {formatAmenityDistance(item.amenity.distance)}
                    </div>

                    {/* Hover indicator */}
                    <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Badge variant="secondary" className="text-xs whitespace-nowrap">
                        Click for details
                      </Badge>
                    </div>
                  </motion.button>
                </motion.div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            {Object.entries(amenities).map(([type, list]) => {
              if (list.length === 0) return null;
              const amenityType = type as AmenityType;
              const Icon = AMENITY_ICONS[amenityType];
              const textColor = AMENITY_TEXT_COLORS[amenityType];

              return (
                <div
                  key={type}
                  className="flex items-center gap-2 px-3 py-1.5 bg-muted/50 rounded-full"
                >
                  <Icon className={`h-4 w-4 ${textColor}`} />
                  <span className="text-sm font-medium">
                    {getAmenityTypeLabel(amenityType)}
                  </span>
                  <Badge variant="secondary" className="text-xs">
                    {list.length}
                  </Badge>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Detail Modal */}
      <Dialog open={!!selectedAmenity} onOpenChange={() => setSelectedAmenity(null)}>
        <DialogContent className="max-w-md">
          {selectedAmenity && (
            <>
              <DialogHeader>
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg bg-gradient-to-br ${AMENITY_COLORS[selectedAmenity.type]} border-2`}>
                    {(() => {
                      const Icon = AMENITY_ICONS[selectedAmenity.type];
                      return <Icon className={`h-5 w-5 ${AMENITY_TEXT_COLORS[selectedAmenity.type]}`} />;
                    })()}
                  </div>
                  <div className="flex-1">
                    <DialogTitle className="text-xl mb-1">
                      {selectedAmenity.amenity.name}
                    </DialogTitle>
                    <Badge variant="secondary">
                      {getAmenityTypeLabel(selectedAmenity.type)}
                    </Badge>
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-4 mt-4">
                {/* Rating */}
                {selectedAmenity.amenity.rating && (
                  <div className="flex items-center gap-2 p-3 bg-accent/10 rounded-lg">
                    <Star className="h-5 w-5 fill-accent text-accent" />
                    <span className="text-lg font-bold">
                      {selectedAmenity.amenity.rating}
                    </span>
                    <span className="text-sm text-muted-foreground">Rating</span>
                  </div>
                )}

                {/* Distance */}
                <div className="flex items-center gap-3 p-3 bg-primary/10 rounded-lg">
                  <Navigation className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Distance</p>
                    <p className="font-semibold text-lg">
                      {formatAmenityDistance(selectedAmenity.amenity.distance)}
                    </p>
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                  <MapPin className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Address</p>
                    <p className="text-sm">{selectedAmenity.amenity.address}</p>
                  </div>
                </div>

                {/* Open Status */}
                {selectedAmenity.amenity.isOpen !== undefined && (
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Status</p>
                      <p
                        className={`font-semibold ${
                          selectedAmenity.amenity.isOpen
                            ? 'text-success'
                            : 'text-destructive'
                        }`}
                      >
                        {selectedAmenity.amenity.isOpen ? 'Open Now' : 'Closed'}
                      </p>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button
                    className="flex-1"
                    onClick={() => {
                      const url = getDirectionUrl(
                        latitude,
                        longitude,
                        selectedAmenity.amenity.latitude,
                        selectedAmenity.amenity.longitude
                      );
                      window.open(url, '_blank');
                    }}
                  >
                    <Navigation className="h-4 w-4 mr-2" />
                    Get Directions
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setSelectedAmenity(null)}
                  >
                    Close
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
