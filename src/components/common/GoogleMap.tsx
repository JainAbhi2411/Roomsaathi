import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Loader2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface GoogleMapProps {
  latitude: number;
  longitude: number;
  propertyName: string;
  address?: string;
  zoom?: number;
  height?: string;
  showCard?: boolean;
}

export default function GoogleMap({
  latitude,
  longitude,
  propertyName,
  address,
  zoom = 15,
  height = '400px',
  showCard = true
}: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);

  useEffect(() => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
      setError('Google Maps API key is not configured. Please add VITE_GOOGLE_MAPS_API_KEY to your .env file.');
      setIsLoading(false);
      return;
    }

    // Check if Google Maps script is already loaded
    if (window.google && window.google.maps) {
      initializeMap();
      return;
    }

    // Check if script is already being loaded
    const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
    if (existingScript) {
      // Wait for existing script to load
      existingScript.addEventListener('load', () => {
        if (window.google && window.google.maps) {
          initializeMap();
        }
      });
      return;
    }

    // Load Google Maps script
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      initializeMap();
    };
    script.onerror = () => {
      setError('Failed to load Google Maps. Please check your API key and internet connection.');
      setIsLoading(false);
    };

    document.head.appendChild(script);

    // No cleanup needed - keep script loaded for other map instances
  }, [latitude, longitude]);

  const initializeMap = () => {
    if (!mapRef.current) return;

    try {
      const position = { lat: latitude, lng: longitude };

      // Create map
      const map = new google.maps.Map(mapRef.current, {
        center: position,
        zoom: zoom,
        mapTypeControl: true,
        streetViewControl: true,
        fullscreenControl: true,
        zoomControl: true,
        mapId: 'DEMO_MAP_ID', // Required for AdvancedMarkerElement
      });

      mapInstanceRef.current = map;

      // Create marker using the standard Marker (AdvancedMarkerElement requires more setup)
      const marker = new google.maps.Marker({
        position: position,
        map: map,
        title: propertyName,
        animation: google.maps.Animation.DROP,
      });

      // Create info window
      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div style="padding: 8px; max-width: 200px;">
            <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600; color: #1a1a1a;">
              ${propertyName}
            </h3>
            ${address ? `
              <p style="margin: 0; font-size: 14px; color: #666;">
                ${address}
              </p>
            ` : ''}
            <a 
              href="https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}" 
              target="_blank"
              rel="noopener noreferrer"
              style="display: inline-block; margin-top: 8px; color: #2563eb; text-decoration: none; font-size: 14px; font-weight: 500;"
            >
              Get Directions →
            </a>
          </div>
        `
      });

      // Open info window on marker click
      marker.addListener('click', () => {
        infoWindow.open(map, marker);
      });

      // Open info window by default
      infoWindow.open(map, marker);

      setIsLoading(false);
    } catch (err) {
      console.error('Error initializing map:', err);
      setError('Failed to initialize map. Please try again later.');
      setIsLoading(false);
    }
  };

  const MapContent = () => (
    <>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/50 backdrop-blur-sm z-10">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Loading map...</p>
          </div>
        </div>
      )}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/50 backdrop-blur-sm z-10 p-4">
          <Alert variant="destructive" className="max-w-md">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      )}
      <div 
        ref={mapRef} 
        style={{ width: '100%', height: height }}
        className="rounded-lg"
      />
    </>
  );

  if (showCard) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Property Location
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <MapContent />
          </div>
          <div className="mt-4 flex items-start gap-2 p-3 bg-muted/50 rounded-lg">
            <MapPin className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-medium mb-1">{propertyName}</p>
              {address && <p className="text-muted-foreground">{address}</p>}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="relative">
      <MapContent />
    </div>
  );
}
