
-- Add property_name column to user_queries table
ALTER TABLE user_queries 
ADD COLUMN IF NOT EXISTS property_name TEXT;

-- Add comment to explain the column
COMMENT ON COLUMN user_queries.property_name IS 'Name of the property being inquired about (useful when property_id is not available or property is deleted)';
