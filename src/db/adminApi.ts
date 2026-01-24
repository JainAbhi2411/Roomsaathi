import { supabase } from './supabase';
import type { AdminLoginResponse, UserQuery, DashboardStats } from '@/types/admin';
import type { Property, Blog } from '@/types/index';

// Admin Authentication
export async function adminLogin(email: string, password: string): Promise<AdminLoginResponse> {
  try {
    const { data, error } = await supabase.rpc('admin_login', {
      login_email: email,
      login_password: password
    });

    if (error) throw error;
    return data as AdminLoginResponse;
  } catch (error) {
    console.error('Admin login error:', error);
    return {
      success: false,
      message: 'Login failed. Please try again.'
    };
  }
}

// Dashboard Stats
export async function getDashboardStats(): Promise<DashboardStats> {
  try {
    const [propertiesCount, blogsCount, queriesCount, pendingCount] = await Promise.all([
      supabase.from('properties').select('id', { count: 'exact', head: true }),
      supabase.from('blogs').select('id', { count: 'exact', head: true }),
      supabase.from('user_queries').select('id', { count: 'exact', head: true }),
      supabase.from('user_queries').select('id', { count: 'exact', head: true }).eq('status', 'pending')
    ]);

    return {
      totalProperties: propertiesCount.count || 0,
      totalBlogs: blogsCount.count || 0,
      totalQueries: queriesCount.count || 0,
      pendingQueries: pendingCount.count || 0
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return {
      totalProperties: 0,
      totalBlogs: 0,
      totalQueries: 0,
      pendingQueries: 0
    };
  }
}

// Property Management
export async function getAllPropertiesAdmin(): Promise<Property[]> {
  try {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error fetching properties:', error);
    return [];
  }
}

export async function createProperty(property: Omit<Property, 'id' | 'created_at' | 'updated_at'>): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('properties')
      .insert([property]);

    if (error) throw error;
    return { success: true };
  } catch (error: any) {
    console.error('Error creating property:', error);
    return { success: false, error: error.message };
  }
}

export async function updateProperty(id: string, property: Partial<Property>): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('properties')
      .update(property)
      .eq('id', id);

    if (error) throw error;
    return { success: true };
  } catch (error: any) {
    console.error('Error updating property:', error);
    return { success: false, error: error.message };
  }
}

export async function deleteProperty(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('properties')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { success: true };
  } catch (error: any) {
    console.error('Error deleting property:', error);
    return { success: false, error: error.message };
  }
}

// Blog Management
export async function getAllBlogsAdmin(): Promise<Blog[]> {
  try {
    const { data, error } = await supabase
      .from('blogs')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return [];
  }
}

export async function createBlog(blog: Omit<Blog, 'id' | 'created_at' | 'updated_at'>, adminId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('blogs')
      .insert([{ ...blog, admin_id: adminId }]);

    if (error) throw error;
    return { success: true };
  } catch (error: any) {
    console.error('Error creating blog:', error);
    return { success: false, error: error.message };
  }
}

export async function updateBlog(id: string, blog: Partial<Blog>): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('blogs')
      .update(blog)
      .eq('id', id);

    if (error) throw error;
    return { success: true };
  } catch (error: any) {
    console.error('Error updating blog:', error);
    return { success: false, error: error.message };
  }
}

export async function deleteBlog(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('blogs')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { success: true };
  } catch (error: any) {
    console.error('Error deleting blog:', error);
    return { success: false, error: error.message };
  }
}

// Query Management
export async function getAllQueries(): Promise<UserQuery[]> {
  try {
    const { data, error } = await supabase
      .from('user_queries')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error fetching queries:', error);
    return [];
  }
}

export async function updateQueryStatus(
  id: string,
  status: UserQuery['status'],
  adminNotes?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const updateData: any = { status, updated_at: new Date().toISOString() };
    if (adminNotes !== undefined) {
      updateData.admin_notes = adminNotes;
    }

    const { error } = await supabase
      .from('user_queries')
      .update(updateData)
      .eq('id', id);

    if (error) throw error;
    return { success: true };
  } catch (error: any) {
    console.error('Error updating query:', error);
    return { success: false, error: error.message };
  }
}

export async function submitUserQuery(query: Omit<UserQuery, 'id' | 'status' | 'admin_notes' | 'created_at' | 'updated_at'>): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('user_queries')
      .insert([query]);

    if (error) throw error;
    return { success: true };
  } catch (error: any) {
    console.error('Error submitting query:', error);
    return { success: false, error: error.message };
  }
}
