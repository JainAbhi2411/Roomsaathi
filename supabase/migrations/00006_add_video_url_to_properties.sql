-- Add video_url column to properties table
ALTER TABLE properties 
ADD COLUMN video_url TEXT;

-- Add comment to describe the column
COMMENT ON COLUMN properties.video_url IS 'URL to property video tour (YouTube, Vimeo, or direct video link)';

-- Add some sample video URLs to existing properties for demonstration
UPDATE properties 
SET video_url = CASE 
  WHEN type = 'PG' THEN 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
  WHEN type = 'Apartment' THEN 'https://www.youtube.com/watch?v=ScMzIvxBSi4'
  WHEN type = 'Flat' THEN 'https://www.youtube.com/watch?v=jfKfPfyJRdk'
  WHEN type = 'Hostel' THEN 'https://www.youtube.com/watch?v=ZXsQAXx_ao0'
  ELSE NULL
END
WHERE id IN (
  SELECT id FROM properties ORDER BY created_at DESC LIMIT 8
);