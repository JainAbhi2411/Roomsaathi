# Bug Fix: Quick Listing Form Submission Failure

## Issue
Quick Listing form failed to submit for anonymous users (users not logged in).

## Root Cause
The `createUserQuery` API function was using `.insert().select().maybeSingle()` pattern, which requires both INSERT and SELECT permissions. However, the `user_queries` table only had an INSERT policy for anonymous users, but no SELECT policy.

According to Supabase RLS rules: **Any INSERT permission MUST be accompanied by a corresponding SELECT permission.**

## Solution
Removed the `.select()` call from the `createUserQuery` function, following the best practice guideline: **"Prefer .insert() without .select()."**

### Changes Made
- Modified `createUserQuery` in `/src/db/api.ts`
- Removed `.select().maybeSingle()` chain
- Changed return value to `{ success: true }` instead of returning the inserted data
- This allows anonymous users to submit queries without needing SELECT permissions

## Why This Works
1. Anonymous users only need INSERT permission to submit queries
2. The form doesn't need the returned data - it just needs to know if submission succeeded
3. Follows Supabase best practices for public-facing forms
4. Reduces database query overhead

## Testing
- ✅ Lint check passed
- ✅ No authentication required for form submission
- ✅ Works for both ContactPage and OwnerFeaturesPage
