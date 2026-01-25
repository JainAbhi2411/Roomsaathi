/**
 * Google Maps Places API Service
 * Fetches nearby amenities using Google Maps Places API (via CORS proxy or client-side)
 */

export interface NearbyAmenity {
  id: string;
  name: string;
  type: AmenityType;
  address: string;
  distance: number; // in meters
  rating?: number;
  latitude: number;
  longitude: number;
  isOpen?: boolean;
  photoUrl?: string;
}

export enum AmenityType {
  COACHING = 'coaching',
  HOSPITAL = 'hospital',
  BUS_STATION = 'bus_station',
  RAILWAY_STATION = 'railway_station',
  COLLEGE = 'college',
}

const AMENITY_TYPE_LABELS: Record<AmenityType, string> = {
  [AmenityType.COACHING]: 'Coaching Centers',
  [AmenityType.HOSPITAL]: 'Hospitals',
  [AmenityType.BUS_STATION]: 'Bus Stations',
  [AmenityType.RAILWAY_STATION]: 'Railway Stations',
  [AmenityType.COLLEGE]: 'Colleges',
};

const AMENITY_TYPE_KEYWORDS: Record<AmenityType, string[]> = {
  [AmenityType.COACHING]: ['coaching center', 'coaching institute', 'tuition center', 'academy'],
  [AmenityType.HOSPITAL]: ['hospital', 'clinic', 'medical center', 'healthcare'],
  [AmenityType.BUS_STATION]: ['bus station', 'bus stop', 'bus terminal', 'bus stand'],
  [AmenityType.RAILWAY_STATION]: ['railway station', 'train station', 'railway'],
  [AmenityType.COLLEGE]: ['college', 'university', 'institute', 'educational institution'],
};

// Google Maps Place Types mapping
const AMENITY_PLACE_TYPES: Record<AmenityType, string[]> = {
  [AmenityType.COACHING]: ['school', 'university'],
  [AmenityType.HOSPITAL]: ['hospital', 'doctor', 'health'],
  [AmenityType.BUS_STATION]: ['bus_station', 'transit_station'],
  [AmenityType.RAILWAY_STATION]: ['train_station', 'transit_station'],
  [AmenityType.COLLEGE]: ['university', 'school'],
};

// Calculate distance between two coordinates using Haversine formula
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
}

// Load Google Maps script dynamically
let googleMapsLoaded = false;
let googleMapsLoadPromise: Promise<void> | null = null;

function loadGoogleMapsScript(): Promise<void> {
  if (googleMapsLoaded) {
    return Promise.resolve();
  }

  if (googleMapsLoadPromise) {
    return googleMapsLoadPromise;
  }

  googleMapsLoadPromise = new Promise((resolve, reject) => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
      reject(new Error('Google Maps API key not configured'));
      return;
    }

    // Check if already loaded
    if (window.google?.maps?.places) {
      googleMapsLoaded = true;
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      googleMapsLoaded = true;
      resolve();
    };
    script.onerror = () => {
      reject(new Error('Failed to load Google Maps script'));
    };
    document.head.appendChild(script);
  });

  return googleMapsLoadPromise;
}

/**
 * Fetch nearby amenities using Google Maps Places API
 */
export async function fetchNearbyAmenities(
  latitude: number,
  longitude: number,
  amenityType: AmenityType,
  radius = 5000 // 5km radius
): Promise<NearbyAmenity[]> {
  try {
    // Load Google Maps script
    await loadGoogleMapsScript();

    return new Promise((resolve) => {
      const location = new google.maps.LatLng(latitude, longitude);
      const map = new google.maps.Map(document.createElement('div'));
      const service = new google.maps.places.PlacesService(map);

      const keywords = AMENITY_TYPE_KEYWORDS[amenityType];
      const placeTypes = AMENITY_PLACE_TYPES[amenityType];

      // Use nearbySearch for better results
      const request: google.maps.places.PlaceSearchRequest = {
        location,
        radius,
        keyword: keywords[0],
        type: placeTypes[0] as any,
      };

      service.nearbySearch(request, (results, status) => {
        if (status !== google.maps.places.PlacesServiceStatus.OK || !results) {
          console.warn(`No results for ${amenityType}:`, status);
          resolve([]);
          return;
        }

        const amenities: NearbyAmenity[] = results
          .slice(0, 10)
          .map((place) => {
            const placeLat = place.geometry?.location?.lat() || 0;
            const placeLng = place.geometry?.location?.lng() || 0;
            const distance = calculateDistance(latitude, longitude, placeLat, placeLng);

            return {
              id: place.place_id || '',
              name: place.name || '',
              type: amenityType,
              address: place.vicinity || '',
              distance: Math.round(distance),
              rating: place.rating,
              latitude: placeLat,
              longitude: placeLng,
              isOpen: place.opening_hours?.isOpen?.(),
              photoUrl: place.photos?.[0]?.getUrl({ maxWidth: 400 }),
            };
          })
          .sort((a, b) => a.distance - b.distance);

        resolve(amenities);
      });
    });
  } catch (error) {
    console.error('Error fetching nearby amenities:', error);
    return [];
  }
}

/**
 * Fetch all types of nearby amenities
 */
export async function fetchAllNearbyAmenities(
  latitude: number,
  longitude: number,
  radius = 5000
): Promise<Record<AmenityType, NearbyAmenity[]>> {
  const results: Record<AmenityType, NearbyAmenity[]> = {
    [AmenityType.COACHING]: [],
    [AmenityType.HOSPITAL]: [],
    [AmenityType.BUS_STATION]: [],
    [AmenityType.RAILWAY_STATION]: [],
    [AmenityType.COLLEGE]: [],
  };

  // Fetch all amenity types in parallel
  const promises = Object.values(AmenityType).map(async (type) => {
    const amenities = await fetchNearbyAmenities(latitude, longitude, type, radius);
    results[type] = amenities;
  });

  await Promise.all(promises);

  return results;
}

/**
 * Format distance for display
 */
export function formatAmenityDistance(meters: number): string {
  if (meters < 1000) {
    return `${meters}m`;
  }
  return `${(meters / 1000).toFixed(1)}km`;
}

/**
 * Get label for amenity type
 */
export function getAmenityTypeLabel(type: AmenityType): string {
  return AMENITY_TYPE_LABELS[type];
}

/**
 * Get Google Maps direction URL
 */
export function getDirectionUrl(
  fromLat: number,
  fromLng: number,
  toLat: number,
  toLng: number
): string {
  return `https://www.google.com/maps/dir/?api=1&origin=${fromLat},${fromLng}&destination=${toLat},${toLng}`;
}
