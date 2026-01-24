# 🔧 Email OTP Troubleshooting Guide

## Quick Test - Use the Test Page First!

### Step 1: Navigate to Test Page
Open your browser and go to:
```
http://localhost:5173/test-auth
```

### Step 2: Run Tests in Order
1. **Check Environment Variables** - Verify Supabase URL and API key are loaded
2. **Test Connection** - Verify Supabase client is working
3. **Send OTP** - Enter your email and send OTP
4. **Check Email** - Look in inbox AND spam folder
5. **Verify OTP** - Enter the 6-digit code

### Step 3: Check Browser Console
Open Developer Tools (F12) and check the Console tab for detailed logs.

---

## Common Issues and Solutions

### Issue 1: "Email not received"

#### Possible Causes:
1. **Email in Spam Folder** ⚠️
   - Check your spam/junk folder
   - Mark as "Not Spam" if found there

2. **Email Delivery Delay** ⏱️
   - Wait 2-3 minutes
   - Supabase free tier can have delays

3. **Rate Limiting** 🚫
   - Supabase limits: 3 emails per hour per user
   - Wait 1 hour and try again

4. **Email Provider Blocking** 📧
   - Some providers (corporate emails) block automated emails
   - Try with Gmail, Outlook, or Yahoo

#### Solutions:
```bash
✅ Use a personal email (Gmail, Outlook, Yahoo)
✅ Check spam folder immediately
✅ Wait 2-3 minutes before resending
✅ Don't request OTP more than 3 times per hour
```

---

### Issue 2: "OTP Invalid or Expired"

#### Possible Causes:
1. **OTP Expired** ⏰
   - OTPs expire after 60 seconds
   - Request a new OTP

2. **Wrong OTP** ❌
   - Double-check the 6-digit code
   - Make sure you're using the most recent OTP

3. **Email Mismatch** 📧
   - Verify you're entering the same email used to request OTP

#### Solutions:
```bash
✅ Use the OTP within 60 seconds
✅ Copy-paste the OTP to avoid typos
✅ Request a new OTP if expired
✅ Verify email address matches exactly
```

---

### Issue 3: "Error Sending OTP"

#### Check These:

1. **Environment Variables**
   ```bash
   # Check .env file has these:
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

2. **Supabase Project Status**
   - Go to https://supabase.com/dashboard
   - Check if project is active (not paused)
   - Verify email auth is enabled

3. **Network Connection**
   - Check internet connection
   - Try disabling VPN if using one
   - Check firewall settings

4. **Browser Console Errors**
   - Open DevTools (F12)
   - Check Console tab for errors
   - Look for network errors

#### Solutions:
```bash
✅ Restart development server: npm run dev
✅ Clear browser cache and cookies
✅ Try incognito/private browsing mode
✅ Check Supabase dashboard for project status
```

---

### Issue 4: "Supabase Connection Failed"

#### Diagnostic Steps:

1. **Verify Environment Variables**
   ```bash
   # In terminal:
   cat .env | grep SUPABASE
   ```

2. **Test Supabase URL**
   ```bash
   # Should return JSON response:
   curl https://your-project.supabase.co/rest/v1/
   ```

3. **Check API Key**
   - Go to Supabase Dashboard
   - Settings → API
   - Copy the `anon` `public` key
   - Update .env file

#### Solutions:
```bash
✅ Regenerate API keys in Supabase dashboard
✅ Update .env file with new keys
✅ Restart dev server: npm run dev
✅ Hard refresh browser: Ctrl+Shift+R
```

---

## Testing Checklist

### Before Testing:
- [ ] Supabase project is active (not paused)
- [ ] Environment variables are set in .env
- [ ] Development server is running
- [ ] Browser console is open (F12)

### During Testing:
- [ ] Navigate to /test-auth page
- [ ] Check environment variables load correctly
- [ ] Test Supabase connection succeeds
- [ ] Enter a valid email address
- [ ] Click "Send OTP" and wait for success message
- [ ] Check email inbox AND spam folder
- [ ] Copy 6-digit OTP from email
- [ ] Enter OTP within 60 seconds
- [ ] Click "Verify OTP"

### After Testing:
- [ ] Check browser console for any errors
- [ ] Verify success message appears
- [ ] Check if user is logged in (header shows user icon)

---

## Supabase Email Configuration

### Development Environment (Current Setup)
- **Provider**: Supabase Default Email Service
- **Limits**: 3 emails per hour per user
- **Delivery Time**: 10 seconds - 3 minutes
- **Cost**: Free
- **Reliability**: Good for development

### Production Recommendations

For production, consider upgrading to custom SMTP:

#### Option 1: SendGrid (Recommended)
```bash
# Free tier: 100 emails/day
# Paid: $19.95/month for 50k emails
# Setup: 15 minutes
# Reliability: Excellent
```

#### Option 2: AWS SES
```bash
# Cost: $0.10 per 1,000 emails
# Setup: 30 minutes
# Reliability: Excellent
# Requires AWS account
```

#### Option 3: Mailgun
```bash
# Free tier: 5,000 emails/month
# Paid: $35/month for 50k emails
# Setup: 15 minutes
# Reliability: Very good
```

### How to Configure Custom SMTP in Supabase:
1. Go to Supabase Dashboard
2. Settings → Auth → SMTP Settings
3. Enable Custom SMTP
4. Enter SMTP credentials from your provider
5. Test email delivery
6. Save settings

---

## Debug Mode

### Enable Detailed Logging

The application already has console logging enabled. Check these logs:

#### In AuthContext:
```
✅ "Sending OTP to email: user@example.com"
✅ "OTP Response: { data: {...}, error: null }"
✅ "OTP sent successfully to: user@example.com"
❌ "OTP Send Error: { message: '...' }"
```

#### In LoginPage:
```
✅ "Sending OTP to: user@example.com"
✅ "OTP sent successfully"
❌ "Failed to send OTP: { message: '...' }"
```

### How to View Logs:
1. Open browser DevTools (F12)
2. Go to Console tab
3. Clear console (trash icon)
4. Attempt to send OTP
5. Watch for log messages
6. Copy any error messages

---

## Supabase Dashboard Checks

### 1. Check Auth Settings
```
Dashboard → Authentication → Settings
✅ Enable Email provider
✅ Confirm Email: OFF (for OTP)
✅ Secure Email Change: ON
```

### 2. Check Email Templates
```
Dashboard → Authentication → Email Templates
✅ Magic Link template exists
✅ Template is enabled
✅ No syntax errors in template
```

### 3. Check Rate Limits
```
Dashboard → Authentication → Rate Limits
✅ Email OTP: 3 per hour (default)
✅ Not exceeded
```

### 4. Check Recent Auth Logs
```
Dashboard → Authentication → Logs
✅ Look for recent OTP requests
✅ Check for error messages
✅ Verify email delivery status
```

---

## Alternative Testing Methods

### Method 1: Use Supabase CLI (Advanced)
```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Check auth status
supabase projects list
```

### Method 2: Direct API Test (Advanced)
```bash
# Test OTP endpoint directly
curl -X POST 'https://your-project.supabase.co/auth/v1/otp' \
  -H "apikey: your-anon-key" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "your.email@example.com"
  }'
```

### Method 3: Use Postman/Insomnia
1. Create new POST request
2. URL: `https://your-project.supabase.co/auth/v1/otp`
3. Headers:
   - `apikey: your-anon-key`
   - `Content-Type: application/json`
4. Body:
   ```json
   {
     "email": "your.email@example.com"
   }
   ```
5. Send request
6. Check response

---

## Expected Behavior

### Successful OTP Flow:

#### Step 1: Send OTP
```
User enters: user@example.com
Console logs: "Sending OTP to email: user@example.com"
API Response: { data: {}, error: null }
Console logs: "OTP sent successfully"
Toast message: "OTP Sent Successfully! ✅"
UI: Switches to OTP input screen
```

#### Step 2: Receive Email
```
Time: 10 seconds - 3 minutes
From: noreply@mail.app.supabase.io
Subject: "Your Magic Link"
Content: 6-digit code (e.g., 123456)
```

#### Step 3: Verify OTP
```
User enters: 123456
Console logs: "Verifying OTP for: user@example.com"
API Response: { data: { user: {...}, session: {...} }, error: null }
Console logs: "OTP verified successfully"
Toast message: "Success! 🎉"
UI: Redirects to previous page
Header: Shows user icon/name
```

---

## Still Not Working?

### Contact Support:
1. **Email**: support@roomsaathi.com
2. **Include**:
   - Browser console logs (screenshot)
   - Network tab errors (screenshot)
   - Email address used (for checking)
   - Timestamp of attempt
   - Error messages received

### Check Supabase Status:
- Visit: https://status.supabase.com
- Check for ongoing incidents
- Subscribe to status updates

### Community Help:
- Supabase Discord: https://discord.supabase.com
- Supabase GitHub: https://github.com/supabase/supabase/discussions

---

## Summary

✅ **Test Page Available**: `/test-auth`  
✅ **Console Logging Enabled**: Check DevTools  
✅ **Common Issues Documented**: See above  
✅ **Supabase Dashboard Checks**: Listed above  
✅ **Alternative Testing Methods**: Available  
✅ **Expected Behavior**: Documented  

**Most Common Solution**: Check spam folder and wait 2-3 minutes! 📧⏱️

---

## Quick Reference

| Issue | Solution |
|-------|----------|
| Email not received | Check spam, wait 2-3 minutes |
| OTP expired | Request new OTP within 60 seconds |
| Rate limited | Wait 1 hour, try again |
| Connection failed | Check .env, restart server |
| Invalid OTP | Copy-paste code, verify email |

**Remember**: The test page at `/test-auth` is your best friend for debugging! 🚀
