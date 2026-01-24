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
  description: string;
  verified: boolean;
  images: string[];
  contact_phone?: string;
  contact_email?: string;
  owner_name?: string;
  owner_details?: string;
  availability_status: string;
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

export interface Favorite {
  id: string;
  property_id: string;
  user_session_id: string;
  created_at: string;
}

export interface PropertyWithDetails extends Property {
  rooms?: Room[];
  amenities?: Amenity[];
  is_favorite?: boolean;
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
  gender?: string;
  food_included?: boolean;
}

