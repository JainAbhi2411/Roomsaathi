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

## Issue 3: Quick Listing Form - Email Field Constraint
After fixing the missing column, the Quick Listing form still failed because it was trying to create a fake email address.

### Root Cause
The Quick Listing form only collects **name** and **phone** (no email field), but the `user_queries` table had `email` as a required (NOT NULL) field. The code was creating a fake email like `9876543210@owner.roomsaathi.com` to satisfy the constraint.

### Solution
Made the `email` field nullable in the database since some forms (like Quick Listing) only collect phone numbers as the primary contact method.

#### Changes Made
- Created migration: `make_email_nullable_in_user_queries`
- Changed `email` column from `NOT NULL` to nullable
- Updated TypeScript type in `api.ts` to make email optional: `email?: string | null`
- Modified `OwnerFeaturesPage.tsx` to send `null` for email instead of fake email
- Added column comments explaining that either email or phone can be the primary contact method

#### Why This Design Is Better
1. **Flexibility**: Supports both email-based forms (Contact Page) and phone-based forms (Quick Listing)
2. **Data Integrity**: No fake/invalid email addresses in the database
3. **User Experience**: Owners can quickly submit listing requests with just name and phone
4. **Real-world Usage**: Some users prefer phone contact, others prefer email

---

## Final Status
✅ **All three issues resolved!**

### Testing
- ✅ Lint check passed
- ✅ No authentication required for form submission
- ✅ Database schema updated with property_name column
- ✅ Email field is now optional (nullable)
- ✅ Works for both ContactPage (email required) and OwnerFeaturesPage (phone only)
- ✅ Anonymous users can submit queries successfully
- ✅ No fake email addresses being created
