import { supabase } from './supabase';
import type { AdminLoginResponse, UserQuery, DashboardStats, PropertyVisit } from '@/types/admin';
import type { Property, Blog, PropertyPolicy } from '@/types/index';

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
    const [propertiesCount, blogsCount, queriesCount, pendingQueriesCount, visitsCount, pendingVisitsCount] = await Promise.all([
      supabase.from('properties').select('id', { count: 'exact', head: true }),
      supabase.from('blogs').select('id', { count: 'exact', head: true }),
      supabase.from('user_queries').select('id', { count: 'exact', head: true }),
      supabase.from('user_queries').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
      supabase.from('property_visits').select('id', { count: 'exact', head: true }),
      supabase.from('property_visits').select('id', { count: 'exact', head: true }).eq('status', 'pending')
    ]);

    return {
      totalProperties: propertiesCount.count || 0,
      totalBlogs: blogsCount.count || 0,
      totalQueries: queriesCount.count || 0,
      pendingQueries: pendingQueriesCount.count || 0,
      totalVisits: visitsCount.count || 0,
      pendingVisits: pendingVisitsCount.count || 0
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return {
      totalProperties: 0,
      totalBlogs: 0,
      totalQueries: 0,
      pendingQueries: 0,
      totalVisits: 0,
      pendingVisits: 0
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

export async function createProperty(property: Omit<Property, 'id' | 'created_at' | 'updated_at'>): Promise<{ success: boolean; error?: string; data?: Property }> {
  try {
    const { data, error } = await supabase
      .from('properties')
      .insert([property])
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
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

// Property Policies Management
export async function createPropertyPolicy(policy: Omit<PropertyPolicy, 'id' | 'created_at' | 'updated_at'>): Promise<{ success: boolean; error?: string; data?: PropertyPolicy }> {
  try {
    const { data, error } = await supabase
      .from('property_policies')
      .insert([policy])
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error: any) {
    console.error('Error creating policy:', error);
    return { success: false, error: error.message };
  }
}

export async function updatePropertyPolicy(id: string, policy: Partial<PropertyPolicy>): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('property_policies')
      .update({ ...policy, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) throw error;
    return { success: true };
  } catch (error: any) {
    console.error('Error updating policy:', error);
    return { success: false, error: error.message };
  }
}

export async function deletePropertyPolicy(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('property_policies')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { success: true };
  } catch (error: any) {
    console.error('Error deleting policy:', error);
    return { success: false, error: error.message };
  }
}

export async function bulkCreatePropertyPolicies(policies: Omit<PropertyPolicy, 'id' | 'created_at' | 'updated_at'>[]): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('property_policies')
      .insert(policies);

    if (error) throw error;
    return { success: true };
  } catch (error: any) {
    console.error('Error creating policies:', error);
    return { success: false, error: error.message };
  }
}

export async function bulkDeletePropertyPolicies(propertyId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('property_policies')
      .delete()
      .eq('property_id', propertyId);

    if (error) throw error;
    return { success: true };
  } catch (error: any) {
    console.error('Error deleting policies:', error);
    return { success: false, error: error.message };
  }
}

// Visit Management
export async function getAllVisits(): Promise<PropertyVisit[]> {
  try {
    const { data, error } = await supabase
      .from('property_visits')
      .select(`
        *,
        property:properties!property_visits_property_id_fkey (
          id,
          name,
          type,
          city,
          locality
        ),
        user:profiles!property_visits_user_id_fkey (
          id,
          email
        )
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error fetching visits:', error);
    return [];
  }
}

export async function updateVisitStatus(
  visitId: string,
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('property_visits')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', visitId);

    if (error) throw error;
    return { success: true };
  } catch (error: any) {
    console.error('Error updating visit status:', error);
    return { success: false, error: error.message };
  }
}

export async function deleteVisit(visitId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('property_visits')
      .delete()
      .eq('id', visitId);

    if (error) throw error;
    return { success: true };
  } catch (error: any) {
    console.error('Error deleting visit:', error);
    return { success: false, error: error.message };
  }
}