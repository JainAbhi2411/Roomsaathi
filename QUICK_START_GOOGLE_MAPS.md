# Quick Start: Add Your Google Maps API Key

## Step 1: Get Your API Key
1. Visit: https://console.cloud.google.com/google/maps-apis
2. Create/select a project
3. Enable "Maps JavaScript API"
4. Go to Credentials → Create API Key
5. Copy your API key

## Step 2: Add to Your Project
Open the `.env` file and replace:
```
VITE_GOOGLE_MAPS_API_KEY=YOUR_GOOGLE_MAPS_API_KEY
```

With your actual key:
```
VITE_GOOGLE_MAPS_API_KEY=AIzaSyC1234567890abcdefghijklmnopqrstuv
```

## Step 3: Restart Server
```bash
npm run dev
```

## Step 4: Test
Navigate to any property details page and you should see the map!

---

**Need Help?** Check `GOOGLE_MAPS_SETUP.md` for detailed instructions.

**Security Tip:** Always restrict your API key to your domain in Google Cloud Console!
