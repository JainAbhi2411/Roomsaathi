import { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { MapPin, Navigation, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { MessCenter } from '@/types/index';

interface MessMapViewProps {
  mess: MessCenter | null;
  propertyLocation: { latitude: number; longitude: number; name: string } | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function MessMapView({ 
  mess, 
  propertyLocation,
  open, 
  onOpenChange 
}: MessMapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open || !mess || !propertyLocation || !mapRef.current) return;

    // Initialize map with Google Maps or fallback to static map
    initializeMap();
  }, [open, mess, propertyLocation]);

  const initializeMap = () => {
    // This is a placeholder for map initialization
    // In production, you would integrate with Google Maps API or similar
    console.log('Map initialized with:', { mess, propertyLocation });
  };

  if (!mess || !propertyLocation) return null;

  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${propertyLocation.latitude},${propertyLocation.longitude}&destination=${mess.latitude},${mess.longitude}&travelmode=walking`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Route to {mess.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Route Info */}
          <div className="grid md:grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
            <div>
              <p className="text-sm text-muted-foreground mb-1">From</p>
              <p className="font-medium">{propertyLocation.name}</p>
              <p className="text-sm text-muted-foreground">
                {propertyLocation.latitude.toFixed(6)}, {propertyLocation.longitude.toFixed(6)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">To</p>
              <p className="font-medium">{mess.name}</p>
              <p className="text-sm text-muted-foreground">
                {mess.locality}, {mess.city}
              </p>
            </div>
          </div>

          {/* Distance Badge */}
          {mess.distance !== undefined && (
            <div className="flex items-center justify-center gap-2">
              <Badge variant="secondary" className="text-base py-2 px-4">
                <Navigation className="w-4 h-4 mr-2" />
                Distance: {mess.distance.toFixed(2)} km
              </Badge>
              <Badge variant="secondary" className="text-base py-2 px-4">
                ~{Math.round(mess.distance * 12)} min walk
              </Badge>
            </div>
          )}

          {/* Map Container */}
          <div 
            ref={mapRef}
            className="w-full h-96 bg-muted rounded-lg overflow-hidden relative"
          >
            {/* Static Map Placeholder with embedded Google Maps */}
            <iframe
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              src={`https://www.google.com/maps/embed/v1/directions?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&origin=${propertyLocation.latitude},${propertyLocation.longitude}&destination=${mess.latitude},${mess.longitude}&mode=walking`}
              title="Route Map"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              className="flex-1"
              asChild
            >
              <a 
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Navigation className="w-4 h-4 mr-2" />
                Open in Google Maps
              </a>
            </Button>
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Close
            </Button>
          </div>

          {/* Additional Info */}
          <div className="text-sm text-muted-foreground text-center">
            <p>Walking directions from {propertyLocation.name} to {mess.name}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
