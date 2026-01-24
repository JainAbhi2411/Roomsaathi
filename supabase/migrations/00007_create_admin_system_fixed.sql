-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create user_queries table
CREATE TABLE IF NOT EXISTS user_queries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT NOT NULL,
  property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'resolved', 'closed')),
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);
CREATE INDEX IF NOT EXISTS idx_user_queries_status ON user_queries(status);
CREATE INDEX IF NOT EXISTS idx_user_queries_created_at ON user_queries(created_at DESC);

-- Enable RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_queries ENABLE ROW LEVEL SECURITY;

-- RLS Policies for admin_users (no public access)
DROP POLICY IF EXISTS "Admin users are private" ON admin_users;
CREATE POLICY "Admin users are private" ON admin_users FOR SELECT USING (false);

-- RLS Policies for user_queries
-- Anyone can insert queries (contact form)
DROP POLICY IF EXISTS "Anyone can submit queries" ON user_queries;
CREATE POLICY "Anyone can submit queries" ON user_queries FOR INSERT WITH CHECK (true);

-- Only service role can manage queries
DROP POLICY IF EXISTS "Service role can manage queries" ON user_queries;
CREATE POLICY "Service role can manage queries" ON user_queries FOR ALL USING (auth.role() = 'service_role');

-- Update properties RLS for admin management
DROP POLICY IF EXISTS "Anyone can view properties" ON properties;
DROP POLICY IF EXISTS "Anyone can view published properties" ON properties;
DROP POLICY IF EXISTS "Service role can manage properties" ON properties;
CREATE POLICY "Anyone can view published properties" ON properties FOR SELECT USING (true);
CREATE POLICY "Service role can manage properties" ON properties FOR ALL USING (auth.role() = 'service_role');

-- Create admin authentication function
CREATE OR REPLACE FUNCTION admin_login(login_email TEXT, login_password TEXT)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  admin_record RECORD;
  result JSON;
BEGIN
  -- Find admin by email
  SELECT id, email, name, role, password_hash
  INTO admin_record
  FROM admin_users
  WHERE email = login_email;
  
  -- Check if admin exists
  IF NOT FOUND THEN
    RETURN json_build_object(
      'success', false,
      'message', 'Invalid credentials'
    );
  END IF;
  
  -- Verify password (in production, use proper password hashing like bcrypt)
  -- For now, we'll do simple comparison (MUST be replaced with proper hashing)
  IF admin_record.password_hash = login_password THEN
    RETURN json_build_object(
      'success', true,
      'admin', json_build_object(
        'id', admin_record.id,
        'email', admin_record.email,
        'name', admin_record.name,
        'role', admin_record.role
      )
    );
  ELSE
    RETURN json_build_object(
      'success', false,
      'message', 'Invalid credentials'
    );
  END IF;
END;
$$;

-- Insert default admin user (password: admin123 - CHANGE IN PRODUCTION!)
INSERT INTO admin_users (email, password_hash, name, role)
VALUES ('admin@roomsaathi.com', 'admin123', 'RoomSaathi Admin', 'super_admin')
ON CONFLICT (email) DO NOTHING;