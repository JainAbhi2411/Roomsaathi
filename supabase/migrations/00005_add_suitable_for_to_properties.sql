-- Add suitable_for column to properties table
ALTER TABLE properties 
ADD COLUMN suitable_for TEXT[];

-- Add comment to describe the column
COMMENT ON COLUMN properties.suitable_for IS 'Who the property is suitable for: Boys, Girls, Family, Bachelors, Students';

-- Update existing properties with default suitable_for values based on property type
UPDATE properties 
SET suitable_for = CASE 
  WHEN type = 'PG' AND name ILIKE '%girls%' THEN ARRAY['Girls', 'Students']
  WHEN type = 'PG' AND name ILIKE '%boys%' THEN ARRAY['Boys', 'Students']
  WHEN type = 'PG' THEN ARRAY['Boys', 'Girls', 'Students']
  WHEN type = 'Hostel' THEN ARRAY['Students', 'Bachelors']
  WHEN type = 'Flat' OR type = 'Apartment' THEN ARRAY['Family', 'Bachelors']
  WHEN type = 'Room' THEN ARRAY['Boys', 'Girls', 'Students', 'Bachelors']
  WHEN type = 'Short Term Stay' THEN ARRAY['Family', 'Bachelors', 'Students']
  ELSE ARRAY['Boys', 'Girls', 'Family', 'Bachelors', 'Students']
END
WHERE suitable_for IS NULL;

-- Create an index for better query performance
CREATE INDEX idx_properties_suitable_for ON properties USING GIN (suitable_for);