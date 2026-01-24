import { supabase } from './supabase';
import type { Property, PropertyWithDetails, Room, Amenity, Favorite, FilterOptions } from '@/types/index';

// Get user session ID from localStorage or generate new one
const getUserSessionId = (): string => {
  let sessionId = localStorage.getItem('user_session_id');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('user_session_id', sessionId);
  }
  return sessionId;
};

// Fetch all properties with optional filters and amenities
export const getProperties = async (filters?: FilterOptions): Promise<PropertyWithDetails[]> => {
  let query = supabase.from('properties').select('*').order('created_at', { ascending: false });

  if (filters?.city) {
    query = query.eq('city', filters.city);
  }
  if (filters?.locality) {
    query = query.eq('locality', filters.locality);
  }
  if (filters?.type) {
    query = query.eq('type', filters.type);
  }
  if (filters?.verified !== undefined) {
    query = query.eq('verified', filters.verified);
  }
  if (filters?.price_min !== undefined) {
    query = query.gte('price_from', filters.price_min);
  }
  if (filters?.price_max !== undefined) {
    query = query.lte('price_from', filters.price_max);
  }
  if (filters?.search) {
    query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%,locality.ilike.%${filters.search}%`);
  }
  if (filters?.suitable_for) {
    query = query.contains('suitable_for', [filters.suitable_for]);
  }

  const { data, error } = await query;
  if (error) throw error;
  
  const properties = Array.isArray(data) ? data : [];
  
  // Fetch amenities for all properties
  if (properties.length > 0) {
    const propertyIds = properties.map(p => p.id);
    const { data: amenitiesData } = await supabase
      .from('amenities')
      .select('*')
      .in('property_id', propertyIds);
    
    const amenitiesMap = new Map<string, Amenity[]>();
    if (amenitiesData) {
      amenitiesData.forEach((amenity: Amenity) => {
        if (!amenitiesMap.has(amenity.property_id)) {
          amenitiesMap.set(amenity.property_id, []);
        }
        amenitiesMap.get(amenity.property_id)!.push(amenity);
      });
    }
    
    return properties.map(property => ({
      ...property,
      amenities: amenitiesMap.get(property.id) || [],
    }));
  }
  
  return properties;
};

// Fetch single property with rooms and amenities
export const getPropertyById = async (id: string): Promise<PropertyWithDetails | null> => {
  const { data: property, error: propertyError } = await supabase
    .from('properties')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (propertyError) throw propertyError;
  if (!property) return null;

  const { data: rooms } = await supabase
    .from('rooms')
    .select('*')
    .eq('property_id', id)
    .order('price', { ascending: true });

  const { data: amenities } = await supabase
    .from('amenities')
    .select('*')
    .eq('property_id', id);

  const sessionId = getUserSessionId();
  const { data: favorite } = await supabase
    .from('favorites')
    .select('id')
    .eq('property_id', id)
    .eq('user_session_id', sessionId)
    .maybeSingle();

  return {
    ...property,
    rooms: Array.isArray(rooms) ? rooms : [],
    amenities: Array.isArray(amenities) ? amenities : [],
    is_favorite: !!favorite,
  };
};

// Get rooms for a property
export const getRoomsByPropertyId = async (propertyId: string): Promise<Room[]> => {
  const { data, error } = await supabase
    .from('rooms')
    .select('*')
    .eq('property_id', propertyId)
    .order('price', { ascending: true });

  if (error) throw error;
  return Array.isArray(data) ? data : [];
};

// Get amenities for a property
export const getAmenitiesByPropertyId = async (propertyId: string): Promise<Amenity[]> => {
  const { data, error } = await supabase
    .from('amenities')
    .select('*')
    .eq('property_id', propertyId);

  if (error) throw error;
  return Array.isArray(data) ? data : [];
};

// Add property to favorites
export const addToFavorites = async (propertyId: string): Promise<void> => {
  const sessionId = getUserSessionId();
  const { error } = await supabase
    .from('favorites')
    .insert({ property_id: propertyId, user_session_id: sessionId });

  if (error) throw error;
};

// Remove property from favorites
export const removeFromFavorites = async (propertyId: string): Promise<void> => {
  const sessionId = getUserSessionId();
  const { error } = await supabase
    .from('favorites')
    .delete()
    .eq('property_id', propertyId)
    .eq('user_session_id', sessionId);

  if (error) throw error;
};

// Check if property is favorited
export const isFavorite = async (propertyId: string): Promise<boolean> => {
  const sessionId = getUserSessionId();
  const { data } = await supabase
    .from('favorites')
    .select('id')
    .eq('property_id', propertyId)
    .eq('user_session_id', sessionId)
    .maybeSingle();

  return !!data;
};

// Get all favorite properties
export const getFavoriteProperties = async (): Promise<Property[]> => {
  const sessionId = getUserSessionId();
  const { data: favorites, error: favError } = await supabase
    .from('favorites')
    .select('property_id')
    .eq('user_session_id', sessionId);

  if (favError) throw favError;
  if (!favorites || favorites.length === 0) return [];

  const propertyIds = favorites.map(f => f.property_id);
  const { data: properties, error: propError } = await supabase
    .from('properties')
    .select('*')
    .in('id', propertyIds)
    .order('created_at', { ascending: false });

  if (propError) throw propError;
  return Array.isArray(properties) ? properties : [];
};

// Get unique localities by city
export const getLocalitiesByCity = async (city: string): Promise<string[]> => {
  const { data, error } = await supabase
    .from('properties')
    .select('locality')
    .eq('city', city);

  if (error) throw error;
  if (!data) return [];

  const uniqueLocalities = [...new Set(data.map(item => item.locality))];
  return uniqueLocalities.sort();
};

// Property Visit Management
export interface PropertyVisit {
  id: string;
  property_id: string;
  user_id: string;
  visitor_name: string;
  visitor_phone: string;
  visit_date: string;
  visit_time: string;
  message: string | null;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  created_at: string;
  updated_at: string;
}

export const createPropertyVisit = async (visit: {
  property_id: string;
  user_id: string;
  visitor_name: string;
  visitor_phone: string;
  visit_date: string;
  visit_time: string;
  message?: string | null;
}): Promise<PropertyVisit> => {
  const { data, error } = await supabase
    .from('property_visits')
    .insert({
      property_id: visit.property_id,
      user_id: visit.user_id,
      visitor_name: visit.visitor_name,
      visitor_phone: visit.visitor_phone,
      visit_date: visit.visit_date,
      visit_time: visit.visit_time,
      message: visit.message || null,
      status: 'pending'
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getUserVisits = async (userId: string): Promise<PropertyVisit[]> => {
  const { data, error } = await supabase
    .from('property_visits')
    .select('*')
    .eq('user_id', userId)
    .order('visit_date', { ascending: false });

  if (error) throw error;
  return data || [];
};

// Blog Management
export const getPublishedBlogs = async () => {
  const { data, error } = await supabase
    .from('blogs')
    .select('*')
    .eq('published', true)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return Array.isArray(data) ? data : [];
};

export const getBlogBySlug = async (slug: string) => {
  const { data, error } = await supabase
    .from('blogs')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .maybeSingle();

  if (error) throw error;
  return data;
};

// User Query Management
export const createUserQuery = async (query: {
  name: string;
  email: string;
  phone?: string;
  message: string;
  property_id?: string;
  property_name?: string;
}) => {
  const { error } = await supabase
    .from('user_queries')
    .insert({
      name: query.name,
      email: query.email,
      phone: query.phone || null,
      message: query.message,
      property_id: query.property_id || null,
      property_name: query.property_name || null,
      status: 'pending'
    });

  if (error) throw error;
  return { success: true };
};
