import { supabase } from './supabase';
import type { Property, PropertyWithDetails, Room, Amenity, PropertyPolicy, Favorite, FilterOptions, MessCenter, ChatbotFeedback } from '@/types/index';

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
  let query = supabase.from('properties').select('*').eq('published', true).order('created_at', { ascending: false });

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

  const { data: policies } = await supabase
    .from('property_policies')
    .select('*')
    .eq('property_id', id)
    .order('display_order', { ascending: true });

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
    policies: Array.isArray(policies) ? policies : [],
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

// Get policies for a property
export const getPoliciesByPropertyId = async (propertyId: string): Promise<PropertyPolicy[]> => {
  const { data, error } = await supabase
    .from('property_policies')
    .select('*')
    .eq('property_id', propertyId)
    .order('display_order', { ascending: true });

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

export const getBlogById = async (id: string) => {
  const { data, error } = await supabase
    .from('blogs')
    .select('*')
    .eq('id', id)
    .eq('published', true)
    .maybeSingle();

  if (error) throw error;
  return data;
};

// User Query Management
export const createUserQuery = async (query: {
  name: string;
  email?: string | null;
  phone?: string;
  message: string;
  property_id?: string;
  property_name?: string;
  query_type?: 'property' | 'mess_booking' | 'general';
  mess_center_id?: string;
  mess_center_name?: string;
}) => {
  const { error } = await supabase
    .from('user_queries')
    .insert({
      name: query.name,
      email: query.email || null,
      phone: query.phone || null,
      message: query.message,
      property_id: query.property_id || null,
      property_name: query.property_name || null,
      query_type: query.query_type || 'property',
      mess_center_id: query.mess_center_id || null,
      mess_center_name: query.mess_center_name || null,
      status: 'pending'
    });

  if (error) throw error;
  return { success: true };
};

// Create mess booking query
export const createMessBookingQuery = async (query: {
  name: string;
  email?: string | null;
  phone: string;
  message: string;
  mess_center_id: string;
  mess_center_name: string;
}) => {
  return createUserQuery({
    ...query,
    query_type: 'mess_booking'
  });
};

// Calculate distance between two coordinates using Haversine formula
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// Get nearby mess centers for a property
export const getNearbyMessCenters = async (propertyId: string, maxDistance: number = 5): Promise<MessCenter[]> => {
  // First get the property location
  const { data: property, error: propertyError } = await supabase
    .from('properties')
    .select('latitude, longitude, city')
    .eq('id', propertyId)
    .maybeSingle();

  if (propertyError) throw propertyError;
  if (!property || !property.latitude || !property.longitude) return [];

  // Get all mess centers in the same city
  const { data: messCenters, error: messError } = await supabase
    .from('mess_centers')
    .select('*')
    .eq('city', property.city)
    .order('rating', { ascending: false });

  if (messError) throw messError;
  if (!messCenters) return [];

  // Calculate distance for each mess center and filter by maxDistance
  const messCentersWithDistance = messCenters
    .map(mess => ({
      ...mess,
      distance: calculateDistance(
        property.latitude,
        property.longitude,
        mess.latitude,
        mess.longitude
      )
    }))
    .filter(mess => mess.distance <= maxDistance)
    .sort((a, b) => a.distance - b.distance);

  return messCentersWithDistance;
};

// Get mess center by ID
export const getMessCenterById = async (id: string): Promise<MessCenter | null> => {
  const { data, error } = await supabase
    .from('mess_centers')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;
  return data;
};

// Get all mess centers with optional filters
export const getMessCenters = async (filters?: {
  city?: string;
  locality?: string;
  verified?: boolean;
}): Promise<MessCenter[]> => {
  let query = supabase.from('mess_centers').select('*').order('rating', { ascending: false });

  if (filters?.city) {
    query = query.eq('city', filters.city);
  }
  if (filters?.locality) {
    query = query.eq('locality', filters.locality);
  }
  if (filters?.verified !== undefined) {
    query = query.eq('verified', filters.verified);
  }

  const { data, error } = await query;
  if (error) throw error;
  return Array.isArray(data) ? data : [];
};

// Validate and apply coupon
export const validateCoupon = async (code: string, messId: string, amount: number, city: string) => {
  const { data, error } = await supabase
    .from('mess_coupons')
    .select('*')
    .eq('code', code.toUpperCase())
    .eq('active', true)
    .lte('valid_from', new Date().toISOString())
    .gte('valid_to', new Date().toISOString())
    .maybeSingle();

  if (error) throw error;
  if (!data) {
    throw new Error('Invalid or expired coupon code');
  }

  // Check if coupon is applicable to the city
  if (data.applicable_cities && data.applicable_cities.length > 0 && !data.applicable_cities.includes(city)) {
    throw new Error('Coupon not applicable for this city');
  }

  // Check minimum booking amount
  if (amount < data.min_booking_amount) {
    throw new Error(`Minimum booking amount of ₹${data.min_booking_amount} required`);
  }

  // Check usage limit
  if (data.usage_limit && data.used_count >= data.usage_limit) {
    throw new Error('Coupon usage limit reached');
  }

  // Calculate discount
  let discountAmount = 0;
  if (data.discount_type === 'percentage') {
    discountAmount = (amount * data.discount_value) / 100;
    if (data.max_discount && discountAmount > data.max_discount) {
      discountAmount = data.max_discount;
    }
  } else {
    discountAmount = data.discount_value;
  }

  return {
    coupon: data,
    discountAmount: Math.min(discountAmount, amount)
  };
};

// Create mess booking
export const createMessBooking = async (booking: {
  mess_id: string;
  coupon_id?: string;
  user_name: string;
  user_email?: string;
  user_phone: string;
  meal_plan: string;
  start_date: string;
  end_date?: string;
  total_amount: number;
  discount_amount: number;
  final_amount: number;
}) => {
  const sessionId = getUserSessionId();
  const { data: { user } } = await supabase.auth.getUser();

  const bookingData = {
    ...booking,
    user_id: user?.id,
    user_session_id: sessionId,
    status: 'pending'
  };

  const { data, error } = await supabase
    .from('mess_bookings')
    .insert(bookingData)
    .select()
    .single();

  if (error) throw error;

  // Update coupon usage count if coupon was used
  if (booking.coupon_id) {
    await supabase.rpc('increment_coupon_usage', { coupon_id: booking.coupon_id });
  }

  return data;
};

// Get user's mess bookings
export const getUserMessBookings = async (): Promise<any[]> => {
  const sessionId = getUserSessionId();
  const { data: { user } } = await supabase.auth.getUser();

  let query = supabase
    .from('mess_bookings')
    .select(`
      *,
      mess_center:mess_centers!mess_bookings_mess_id_fkey(*),
      coupon:mess_coupons!mess_bookings_coupon_id_fkey(*)
    `)
    .order('created_at', { ascending: false });

  if (user) {
    query = query.eq('user_id', user.id);
  } else {
    query = query.eq('user_session_id', sessionId);
  }

  const { data, error } = await query;
  if (error) throw error;
  return Array.isArray(data) ? data : [];
};

// Get active coupons
export const getActiveCoupons = async (city?: string) => {
  let query = supabase
    .from('mess_coupons')
    .select('*')
    .eq('active', true)
    .lte('valid_from', new Date().toISOString())
    .gte('valid_to', new Date().toISOString())
    .order('discount_value', { ascending: false });

  const { data, error } = await query;
  if (error) throw error;
  
  let coupons = Array.isArray(data) ? data : [];
  
  // Filter by city if provided
  if (city) {
    coupons = coupons.filter(coupon => 
      !coupon.applicable_cities || 
      coupon.applicable_cities.length === 0 || 
      coupon.applicable_cities.includes(city)
    );
  }
  
  return coupons;
};

// Chatbot Feedback APIs
export const submitChatbotFeedback = async (feedback: {
  name: string;
  email: string;
  phone?: string;
  looking_for: string;
  problem: string;
}): Promise<ChatbotFeedback> => {
  const { data, error } = await supabase
    .from('chatbot_feedback')
    .insert([feedback])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getChatbotFeedbacks = async (): Promise<ChatbotFeedback[]> => {
  const { data, error } = await supabase
    .from('chatbot_feedback')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return Array.isArray(data) ? data : [];
};

export const updateChatbotFeedbackStatus = async (
  id: string,
  status: 'new' | 'read' | 'resolved',
  admin_notes?: string
): Promise<void> => {
  const updateData: { status: string; admin_notes?: string; updated_at: string } = {
    status,
    updated_at: new Date().toISOString(),
  };

  if (admin_notes !== undefined) {
    updateData.admin_notes = admin_notes;
  }

  const { error } = await supabase
    .from('chatbot_feedback')
    .update(updateData)
    .eq('id', id);

  if (error) throw error;
};

export const deleteChatbotFeedback = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('chatbot_feedback')
    .delete()
    .eq('id', id);

  if (error) throw error;
};
