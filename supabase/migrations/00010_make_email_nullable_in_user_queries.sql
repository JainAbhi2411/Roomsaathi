
-- Make email nullable since some forms (like Quick Listing) only collect phone numbers
ALTER TABLE user_queries 
ALTER COLUMN email DROP NOT NULL;

-- Add comment to explain the change
COMMENT ON COLUMN user_queries.email IS 'User email address (optional - some queries may only have phone contact)';
COMMENT ON COLUMN user_queries.phone IS 'User phone number (optional - some queries may only have email contact)';
