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
}
