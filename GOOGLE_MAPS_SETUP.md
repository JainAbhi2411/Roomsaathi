# Google Maps Integration Guide

## Overview
The RoomSaathi application now includes Google Maps integration to display property locations on an interactive map.

## Setup Instructions

### 1. Get Your Google Maps API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to **APIs & Services** > **Library**
4. Enable the following APIs:
   - **Maps JavaScript API** (Required)
   - **Places API** (Optional, for enhanced features)
5. Go to **APIs & Services** > **Credentials**
6. Click **Create Credentials** > **API Key**
7. Copy your API key

### 2. Secure Your API Key (Important!)

1. Click on your API key to edit it
2. Under **Application restrictions**, select **HTTP referrers**
3. Add your website domains:
   ```
   http://localhost:*
   https://yourdomain.com/*
   ```
4. Under **API restrictions**, select **Restrict key**
5. Select only the APIs you enabled (Maps JavaScript API, Places API)
6. Click **Save**

### 3. Add API Key to Your Project

1. Open the `.env` file in the root directory
2. Find the line: `VITE_GOOGLE_MAPS_API_KEY=YOUR_GOOGLE_MAPS_API_KEY`
3. Replace `YOUR_GOOGLE_MAPS_API_KEY` with your actual API key:
   ```
   VITE_GOOGLE_MAPS_API_KEY=AIzaSyC1234567890abcdefghijklmnopqrstuv
   ```
4. Save the file
5. Restart your development server:
   ```bash
   npm run dev
   ```

## Features

### GoogleMap Component

The `GoogleMap` component provides the following features:

- **Interactive Map**: Fully interactive Google Map with zoom, pan, and street view
- **Property Marker**: Red marker showing the exact property location
- **Info Window**: Popup showing property name and address
- **Get Directions**: Direct link to Google Maps for navigation
- **Loading States**: Smooth loading animation while map initializes
- **Error Handling**: Clear error messages if API key is missing or invalid
- **Responsive Design**: Works perfectly on all screen sizes
- **Customizable**: Adjustable zoom level, height, and styling

### Usage Example

```tsx
import GoogleMap from '@/components/common/GoogleMap';

<GoogleMap
  latitude={27.6094}
  longitude={75.1394}
  propertyName="Sunshine PG"
  address="123 Main Street, Sikar, Rajasthan"
  zoom={16}
  height="450px"
  showCard={true}
/>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `latitude` | number | Required | Property latitude coordinate |
| `longitude` | number | Required | Property longitude coordinate |
| `propertyName` | string | Required | Name of the property |
| `address` | string | Optional | Full address of the property |
| `zoom` | number | 15 | Map zoom level (1-20) |
| `height` | string | '400px' | Height of the map container |
| `showCard` | boolean | true | Wrap map in a Card component |

## Getting Property Coordinates

### Method 1: Google Maps Website
1. Go to [Google Maps](https://www.google.com/maps)
2. Search for your property address
3. Right-click on the location
4. Click on the coordinates (e.g., "27.6094, 75.1394")
5. Coordinates are copied to clipboard

### Method 2: Google Maps URL
1. Open the property location in Google Maps
2. Look at the URL: `https://www.google.com/maps/@27.6094,75.1394,15z`
3. The numbers after `@` are latitude and longitude

### Method 3: Geocoding API (Programmatic)
You can use the Google Geocoding API to convert addresses to coordinates automatically.

## Troubleshooting

### Map Not Showing

**Problem**: Map container is empty or shows error

**Solutions**:
1. Check if API key is correctly added to `.env` file
2. Verify API key has Maps JavaScript API enabled
3. Check browser console for error messages
4. Restart development server after adding API key
5. Clear browser cache and reload

### "API Key Not Configured" Error

**Problem**: Error message about missing API key

**Solutions**:
1. Ensure `.env` file exists in root directory
2. Check that the variable name is exactly: `VITE_GOOGLE_MAPS_API_KEY`
3. Restart development server (Vite requires restart for env changes)

### "Failed to Load Google Maps" Error

**Problem**: Script loading fails

**Solutions**:
1. Check internet connection
2. Verify API key is valid (not expired or revoked)
3. Check if Maps JavaScript API is enabled in Google Cloud Console
4. Verify API key restrictions allow your domain

### Marker Not Showing

**Problem**: Map loads but no marker appears

**Solutions**:
1. Verify latitude and longitude are valid numbers
2. Check coordinates are in correct format (latitude: -90 to 90, longitude: -180 to 180)
3. Try zooming out to see if marker is outside viewport

## Billing Information

- Google Maps offers **$200 free credit per month**
- Maps JavaScript API costs: **$7 per 1,000 loads**
- With free credit, you get approximately **28,500 free map loads per month**
- For most small to medium applications, this is sufficient
- Set up billing alerts in Google Cloud Console to monitor usage

## Best Practices

1. **Always restrict your API key** to specific domains and APIs
2. **Monitor usage** in Google Cloud Console
3. **Cache coordinates** in your database instead of geocoding repeatedly
4. **Use lazy loading** for maps on pages with multiple properties
5. **Implement error boundaries** to handle API failures gracefully

## Support

For issues related to:
- **Google Maps API**: Check [Google Maps Platform Documentation](https://developers.google.com/maps/documentation)
- **Application Integration**: Contact your development team

## Example Coordinates for Testing

- **Sikar, Rajasthan**: 27.6094, 75.1394
- **Jaipur, Rajasthan**: 26.9124, 75.7873
- **Kota, Rajasthan**: 25.2138, 75.8648

## Security Notes

⚠️ **Important**: 
- Never commit your actual API key to version control
- Always use environment variables
- Set up API key restrictions in Google Cloud Console
- Monitor your API usage regularly
- Rotate API keys if compromised

---

**Last Updated**: January 2026
**Version**: 1.0.0
