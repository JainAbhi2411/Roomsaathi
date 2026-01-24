-- Add accommodation_type column to properties table
ALTER TABLE properties 
ADD COLUMN accommodation_type TEXT;

-- Add comment to describe the column
COMMENT ON COLUMN properties.accommodation_type IS 'Type of accommodation: Single Room, Double Sharing, Triple Sharing, Four Sharing, Dormitory, Studio Apartment, 1 BHK, 2 BHK, 3 BHK';

-- Update existing properties with default accommodation types based on property type
UPDATE properties 
SET accommodation_type = CASE 
  WHEN type = 'PG' THEN 'Double Sharing'
  WHEN type = 'Flat' THEN '2 BHK'
  WHEN type = 'Apartment' THEN '2 BHK'
  WHEN type = 'Room' THEN 'Single Room'
  WHEN type = 'Hostel' THEN 'Dormitory'
  WHEN type = 'Short Term Stay' THEN 'Studio Apartment'
  ELSE 'Double Sharing'
END
WHERE accommodation_type IS NULL;