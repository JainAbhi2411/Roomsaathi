# Bug Fix: Quick Listing Form Submission Failure

## Issue 1: RLS Permission Error
Quick Listing form failed to submit for anonymous users (users not logged in).

### Root Cause
The `createUserQuery` API function was using `.insert().select().maybeSingle()` pattern, which requires both INSERT and SELECT permissions. However, the `user_queries` table only had an INSERT policy for anonymous users, but no SELECT policy.

According to Supabase RLS rules: **Any INSERT permission MUST be accompanied by a corresponding SELECT permission.**

### Solution
Removed the `.select()` call from the `createUserQuery` function, following the best practice guideline: **"Prefer .insert() without .select()."**

#### Changes Made
- Modified `createUserQuery` in `/src/db/api.ts`
- Removed `.select().maybeSingle()` chain
- Changed return value to `{ success: true }` instead of returning the inserted data
- This allows anonymous users to submit queries without needing SELECT permissions

---

## Issue 2: 400 Bad Request - Missing Column
After fixing the RLS issue, the form still failed with a 400 Bad Request error.

### Root Cause
The API function was trying to insert a `property_name` field into the `user_queries` table, but this column didn't exist in the database schema.

**Error:** `POST /rest/v1/user_queries 400 (Bad Request)`

### Solution
Added the missing `property_name` column to the `user_queries` table via database migration.

#### Changes Made
- Created migration: `add_property_name_to_user_queries`
- Added `property_name TEXT` column (nullable)
- Added column comment explaining its purpose
- Verified column exists in database schema

#### Why This Column Is Needed
1. Quick Listing form allows owners to submit NEW properties (no property_id yet)
2. Stores property name even when property_id is not available
3. Preserves property name even if the property is later deleted
4. Useful for tracking which property the query is about

---

## Final Status
✅ **Both issues resolved!**

### Testing
- ✅ Lint check passed
- ✅ No authentication required for form submission
- ✅ Database schema updated with property_name column
- ✅ Works for both ContactPage and OwnerFeaturesPage
- ✅ Anonymous users can submit queries successfully
