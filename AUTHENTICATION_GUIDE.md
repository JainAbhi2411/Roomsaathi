# RoomSaathi Authentication System Guide

## Overview
RoomSaathi uses **Email OTP Authentication** instead of Phone SMS authentication to avoid SMS provider configuration requirements. This provides a seamless, secure authentication experience without needing external SMS services like Twilio.

## Why Email OTP Instead of Phone SMS?

### The Problem with Phone SMS
- **SMS Provider Required**: Phone authentication requires configuring an SMS provider (Twilio, MessageBird, etc.)
- **Additional Costs**: SMS services charge per message sent
- **Configuration Complexity**: Requires API keys, webhooks, and provider-specific setup
- **Development Limitations**: SMS providers often don't work in development environments
- **Error**: "Unable to get SMS provider" occurs when no SMS service is configured

### The Email OTP Solution
✅ **Works Out of the Box**: Supabase email authentication is pre-configured and ready to use  
✅ **No Additional Setup**: No external services or API keys needed  
✅ **Free**: Email delivery is included with Supabase  
✅ **Reliable**: Email delivery is more reliable than SMS in many regions  
✅ **Development Friendly**: Works perfectly in development and production  
✅ **Same Security**: OTP via email provides the same security level as SMS  

## Authentication Flow

### 1. User Registration/Login
```
User visits property page → Clicks "Schedule Visit" → Redirected to /login
```

### 2. Login Page - Step 1: Enter Details
User provides:
- **Email Address** (Required) - Used for authentication
- **Name** (Optional) - Stored in profile for personalization
- **Phone Number** (Optional) - Stored in profile for contact purposes

### 3. Login Page - Step 2: Verify OTP
- 6-digit OTP sent to user's email
- User enters OTP from email
- System verifies OTP and creates/logs in user
- User redirected back to previous page

### 4. Profile Creation
- Automatic profile creation via database trigger
- First user becomes admin automatically
- Subsequent users get regular user role
- Profile stores: email, phone, name, role

### 5. Schedule Visit
- User is now authenticated
- Schedule Visit dialog opens
- Name and phone auto-filled from profile
- User selects date and time
- Visit booking saved to database

## Database Schema

### Profiles Table
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT,
  phone TEXT,
  name TEXT,
  role user_role DEFAULT 'user',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Property Visits Table
```sql
CREATE TABLE property_visits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES properties(id),
  user_id UUID REFERENCES profiles(id),
  visitor_name TEXT NOT NULL,
  visitor_phone TEXT NOT NULL,
  visit_date DATE NOT NULL,
  visit_time TIME NOT NULL,
  message TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Security Features

### Row Level Security (RLS)
All tables have RLS enabled with policies:

**Profiles:**
- Admins: Full access to all profiles
- Users: Can view and edit their own profile only
- Role field protected: Users cannot change their own role

**Property Visits:**
- Admins: Full access to all visits
- Users: Can create, view, and update their own visits only

### Authentication Security
- JWT-based authentication tokens
- OTP expires after 60 seconds
- Email verification required
- Secure password hashing (if password auth added later)
- HTTPS enforced in production

## User Experience

### For First-Time Users
1. Click "Schedule Visit" on any property
2. Redirected to login page
3. Enter email (and optionally name/phone)
4. Receive OTP in email within seconds
5. Enter OTP to verify
6. Automatically logged in
7. Redirected back to property page
8. Schedule visit dialog opens with pre-filled info

### For Returning Users
1. Already logged in (session persists)
2. Click "Schedule Visit"
3. Dialog opens immediately with pre-filled info
4. Select date/time and submit

### Account Management
- View account details in header dropdown
- Access "My Favorites" to see saved properties
- Access "My Visits" to see scheduled visits
- Logout button to sign out

## Email Configuration

### Development Environment
Supabase provides a development email service that:
- Sends emails to any address
- Shows OTP in Supabase dashboard
- Works without additional configuration

### Production Environment
For production, you can:
1. **Use Supabase Default** (Recommended for MVP)
   - Works out of the box
   - Limited to 3 emails per hour per user
   - Good for initial launch

2. **Configure Custom SMTP** (For Scale)
   - Use SendGrid, AWS SES, or Mailgun
   - Higher sending limits
   - Custom email templates
   - Better deliverability

## Testing the Authentication

### Test User Flow
1. Open the application
2. Navigate to any property details page
3. Click "Schedule Visit" button
4. You'll be redirected to login page
5. Enter your email address (use a real email you can access)
6. Optionally enter name and phone
7. Click "Send OTP"
8. Check your email inbox (and spam folder)
9. Copy the 6-digit OTP from email
10. Enter OTP in the verification page
11. Click "Verify & Login"
12. You'll be redirected back to the property page
13. Schedule Visit dialog will open
14. Your name and phone will be pre-filled
15. Select a date and time
16. Submit the visit request

### Checking OTP in Development
If you don't receive the email, check:
1. Supabase Dashboard → Authentication → Users
2. Look for recent authentication attempts
3. OTP may be visible in logs

## Admin Features

### First User Becomes Admin
The first user to register automatically receives admin role via database trigger:
```sql
CASE WHEN user_count = 0 THEN 'admin'::user_role ELSE 'user'::user_role END
```

### Admin Capabilities
- View all user profiles
- View all property visits
- Manage property listings
- Access admin dashboard (if implemented)

## Troubleshooting

### "Unable to get SMS provider" Error
✅ **SOLVED**: We switched from phone SMS to email OTP, so this error no longer occurs.

### Email Not Received
1. Check spam/junk folder
2. Wait 1-2 minutes (email delivery can be delayed)
3. Try resending OTP
4. Verify email address is correct
5. Check Supabase dashboard for authentication logs

### OTP Invalid or Expired
- OTP expires after 60 seconds
- Request a new OTP by clicking "Resend"
- Ensure you're entering the most recent OTP

### Cannot Login
1. Verify email address is correct
2. Check internet connection
3. Clear browser cache and cookies
4. Try a different browser
5. Check browser console for errors

## API Reference

### AuthContext Methods

#### signInWithEmail(email, phone?, name?)
Sends OTP to user's email address.
```typescript
const { error } = await signInWithEmail(
  'user@example.com',
  '9876543210',  // optional
  'John Doe'     // optional
);
```

#### verifyOtp(email, otp)
Verifies the OTP and logs in the user.
```typescript
const { error } = await verifyOtp('user@example.com', '123456');
```

#### signOut()
Signs out the current user.
```typescript
await signOut();
```

#### refreshProfile()
Refreshes the user's profile data.
```typescript
await refreshProfile();
```

### Database API Methods

#### createPropertyVisit(visit)
Creates a new property visit booking.
```typescript
await createPropertyVisit({
  property_id: 'uuid',
  user_id: 'uuid',
  visitor_name: 'John Doe',
  visitor_phone: '9876543210',
  visit_date: '2026-02-01',
  visit_time: '14:00',
  message: 'Looking forward to visiting'
});
```

#### getUserVisits(userId)
Fetches all visits for a specific user.
```typescript
const visits = await getUserVisits('user-uuid');
```

## Future Enhancements

### Potential Additions
1. **Social Login**: Add Google/Facebook OAuth
2. **Password Authentication**: Allow email + password login
3. **Two-Factor Authentication**: Add extra security layer
4. **Email Templates**: Custom branded emails
5. **SMS Notifications**: Send visit confirmations via SMS
6. **Calendar Integration**: Add visits to Google Calendar
7. **Visit Reminders**: Email reminders before scheduled visits
8. **Visit History**: Track completed visits
9. **Rating System**: Rate properties after visit
10. **Admin Dashboard**: Manage all visits and users

## Support

For issues or questions:
- Email: support@roomsaathi.com
- Check browser console for error messages
- Review Supabase dashboard logs
- Verify all environment variables are set

## Summary

✅ Email OTP authentication is fully functional  
✅ No SMS provider configuration needed  
✅ Works in development and production  
✅ Secure with RLS policies  
✅ Seamless user experience  
✅ Auto-filled visit booking forms  
✅ Admin role for first user  
✅ Complete authentication flow implemented  

The authentication system is production-ready and provides a smooth, secure experience for RoomSaathi users!
