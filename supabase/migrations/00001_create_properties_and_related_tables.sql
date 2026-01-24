-- Create properties table
CREATE TABLE properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('PG', 'Flat', 'Apartment', 'Room', 'Hostel', 'Short Term Stay')),
  city TEXT NOT NULL CHECK (city IN ('Sikar', 'Jaipur', 'Kota')),
  locality TEXT NOT NULL,
  address TEXT NOT NULL,
  price_from INTEGER NOT NULL,
  price_to INTEGER,
  description TEXT NOT NULL,
  verified BOOLEAN DEFAULT false,
  images TEXT[] DEFAULT '{}',
  contact_phone TEXT,
  contact_email TEXT,
  owner_name TEXT,
  owner_details TEXT,
  availability_status TEXT DEFAULT 'Available',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create rooms table
CREATE TABLE rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  room_type TEXT NOT NULL,
  price INTEGER NOT NULL,
  description TEXT,
  images TEXT[] DEFAULT '{}',
  specifications JSONB DEFAULT '{}',
  available BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create amenities table
CREATE TABLE amenities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  amenity_name TEXT NOT NULL,
  amenity_icon TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create favorites table
CREATE TABLE favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  user_session_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(property_id, user_session_id)
);

-- Create image storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('app-95k1uup5tz41_property_images', 'app-95k1uup5tz41_property_images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for public access
CREATE POLICY "Public read access"
ON storage.objects FOR SELECT
USING (bucket_id = 'app-95k1uup5tz41_property_images');

CREATE POLICY "Public upload access"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'app-95k1uup5tz41_property_images');

-- RLS policies for properties (public read)
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read properties" ON properties FOR SELECT USING (true);

-- RLS policies for rooms (public read)
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read rooms" ON rooms FOR SELECT USING (true);

-- RLS policies for amenities (public read)
ALTER TABLE amenities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read amenities" ON amenities FOR SELECT USING (true);

-- RLS policies for favorites (public access)
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read favorites" ON favorites FOR SELECT USING (true);
CREATE POLICY "Public insert favorites" ON favorites FOR INSERT WITH CHECK (true);
CREATE POLICY "Public delete favorites" ON favorites FOR DELETE USING (true);

-- Create indexes for better performance
CREATE INDEX idx_properties_city ON properties(city);
CREATE INDEX idx_properties_type ON properties(type);
CREATE INDEX idx_properties_verified ON properties(verified);
CREATE INDEX idx_rooms_property_id ON rooms(property_id);
CREATE INDEX idx_amenities_property_id ON amenities(property_id);
CREATE INDEX idx_favorites_property_id ON favorites(property_id);
CREATE INDEX idx_favorites_user_session_id ON favorites(user_session_id);