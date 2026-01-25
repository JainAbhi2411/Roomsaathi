import { useEffect, useState } from 'react';
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
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
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
  [AmenityType.COACHING]: 'bg-blue-500',
  [AmenityType.HOSPITAL]: 'bg-red-500',
  [AmenityType.BUS_STATION]: 'bg-green-500',
  [AmenityType.RAILWAY_STATION]: 'bg-purple-500',
  [AmenityType.COLLEGE]: 'bg-orange-500',
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

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">Neighborhood Amenities</h2>
          <p className="text-muted-foreground">
            Discover important places near this property
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-32 bg-muted" />
              </CardHeader>
              <CardContent className="space-y-3">
                <Skeleton className="h-4 w-full bg-muted" />
                <Skeleton className="h-4 w-3/4 bg-muted" />
              </CardContent>
            </Card>
          ))}
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
  const hasAmenities = Object.values(amenities).some((list) => list.length > 0);

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
        <h2 className="text-2xl font-bold mb-2">Neighborhood Amenities</h2>
        <p className="text-muted-foreground">
          Important places within {radius / 1000}km from this property
        </p>
      </div>

      <div className="space-y-8">
        {Object.entries(amenities).map(([type, list]) => {
          if (list.length === 0) return null;

          const amenityType = type as AmenityType;
          const Icon = AMENITY_ICONS[amenityType];
          const colorClass = AMENITY_COLORS[amenityType];

          return (
            <div key={type} className="space-y-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${colorClass} text-white`}>
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-semibold">
                  {getAmenityTypeLabel(amenityType)}
                </h3>
                <Badge variant="secondary">{list.length} found</Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {list.slice(0, 6).map((amenity) => (
                  <Card key={amenity.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle className="text-base line-clamp-2">
                          {amenity.name}
                        </CardTitle>
                        {amenity.rating && (
                          <div className="flex items-center gap-1 text-sm text-yellow-600 shrink-0">
                            <Star className="h-4 w-4 fill-current" />
                            <span className="font-medium">{amenity.rating}</span>
                          </div>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-start gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
                        <span className="line-clamp-2">{amenity.address}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Navigation className="h-4 w-4 text-primary" />
                          <span className="text-sm font-medium">
                            {formatAmenityDistance(amenity.distance)}
                          </span>
                        </div>

                        {amenity.isOpen !== undefined && (
                          <div className="flex items-center gap-1 text-xs">
                            <Clock className="h-3 w-3" />
                            <span
                              className={
                                amenity.isOpen ? 'text-green-600' : 'text-red-600'
                              }
                            >
                              {amenity.isOpen ? 'Open' : 'Closed'}
                            </span>
                          </div>
                        )}
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => {
                          const url = getDirectionUrl(
                            latitude,
                            longitude,
                            amenity.latitude,
                            amenity.longitude
                          );
                          window.open(url, '_blank');
                        }}
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Get Directions
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
