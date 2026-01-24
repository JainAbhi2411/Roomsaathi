-- Create blogs table
CREATE TABLE IF NOT EXISTS public.blogs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  excerpt text,
  content text NOT NULL,
  category text NOT NULL,
  author_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  author_name text NOT NULL,
  image_url text,
  read_time int DEFAULT 5,
  published boolean DEFAULT false,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_blogs_published ON public.blogs(published);
CREATE INDEX IF NOT EXISTS idx_blogs_category ON public.blogs(category);
CREATE INDEX IF NOT EXISTS idx_blogs_created_at ON public.blogs(created_at DESC);

-- Enable RLS
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can view published blogs" ON public.blogs;
DROP POLICY IF EXISTS "Admins can manage all blogs" ON public.blogs;

-- Blogs policies
CREATE POLICY "Anyone can view published blogs" ON public.blogs
  FOR SELECT USING (published = true OR public.is_admin(auth.uid()));

CREATE POLICY "Admins can manage all blogs" ON public.blogs
  FOR ALL TO authenticated USING (public.is_admin(auth.uid()));