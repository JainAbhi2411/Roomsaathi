export interface Option {
  label: string;
  value: string;
  icon?: React.ComponentType<{ className?: string }>;
  withCount?: boolean;
}

export interface Property {
  id: string;
  name: string;
  type: 'PG' | 'Flat' | 'Apartment' | 'Room' | 'Hostel' | 'Short Term Stay';
  city: 'Sikar' | 'Jaipur' | 'Kota';
  locality: string;
  address: string;
  price_from: number;
  price_to?: number;
  offer_price?: number;
  description: string;
  verified: boolean;
  images: string[];
  video_url?: string;
  contact_phone?: string;
  contact_email?: string;
  owner_name?: string;
  owner_details?: string;
  availability_status: string;
  accommodation_type?: string;
  suitable_for?: string[];
  latitude?: number;
  longitude?: number;
  created_at: string;
  updated_at: string;
}

export interface Room {
  id: string;
  property_id: string;
  room_type: string;
  price: number;
  description?: string;
  images: string[];
  specifications: {
    size?: string;
    bed?: string;
    bathroom?: string;
    ac?: boolean;
    furniture?: string;
    [key: string]: string | boolean | undefined;
  };
  available: boolean;
  created_at: string;
}

export interface Amenity {
  id: string;
  property_id: string;
  amenity_name: string;
  amenity_icon?: string;
  created_at: string;
}

export interface PropertyPolicy {
  id: string;
  property_id: string;
  policy_title: string;
  policy_description: string;
  policy_icon?: string;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface Favorite {
  id: string;
  property_id: string;
  user_session_id: string;
  created_at: string;
}

export interface PropertyWithDetails extends Property {
  rooms?: Room[];
  amenities?: Amenity[];
  policies?: PropertyPolicy[];
  is_favorite?: boolean;
  distance?: number; // Distance from user location in km
}

export interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  category: string;
  author_id?: string;
  author_name: string;
  image_url?: string;
  read_time: number;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserQuery {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  property_id?: string;
  property_name?: string;
  status: 'pending' | 'in-progress' | 'resolved';
  admin_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  email?: string;
  username: string;
  role: 'user' | 'admin';
  created_at: string;
  updated_at: string;
}

export interface FilterOptions {
  city?: string;
  locality?: string;
  type?: string;
  verified?: boolean;
  price_min?: number;
  price_max?: number;
  search?: string;
  amenities?: string[];
  suitable_for?: string;
  food_included?: boolean;
}

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  created_at: string;
}

export interface MessCenter {
  id: string;
  name: string;
  description?: string;
  address: string;
  city: 'Sikar' | 'Jaipur' | 'Kota';
  locality: string;
  latitude: number;
  longitude: number;
  contact_phone?: string;
  contact_email?: string;
  images: string[];
  meal_types: string[];
  pricing: {
    breakfast?: number;
    lunch?: number;
    dinner?: number;
    snacks?: number;
    monthly?: number;
  };
  timings: {
    breakfast?: string;
    lunch?: string;
    dinner?: string;
    snacks?: string;
  };
  amenities: string[];
  rating: number;
  verified: boolean;
  distance?: number; // Distance from property in km
  created_at: string;
  updated_at: string;
}

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

