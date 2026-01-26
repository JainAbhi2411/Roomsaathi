export interface Admin {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'super_admin';
}

export interface AdminLoginResponse {
  success: boolean;
  admin?: Admin;
  message?: string;
}

export interface UserQuery {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  property_id?: string;
  property_name?: string;
  query_type?: 'property' | 'mess_booking' | 'general';
  mess_center_id?: string;
  mess_center_name?: string;
  status: 'pending' | 'in_progress' | 'resolved' | 'closed';
  admin_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface DashboardStats {
  totalProperties: number;
  totalBlogs: number;
  pendingQueries: number;
  totalQueries: number;
  totalVisits: number;
  pendingVisits: number;
}

export interface PropertyVisit {
  id: string;
  property_id: string;
  user_id: string;
  visitor_name: string;
  visitor_phone: string;
  visit_date: string;
  visit_time: string;
  message?: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  created_at: string;
  updated_at: string;
  property?: {
    id: string;
    name: string;
    type: string;
    city: string;
    locality: string;
  };
  user?: {
    id: string;
    email: string;
  };
}
