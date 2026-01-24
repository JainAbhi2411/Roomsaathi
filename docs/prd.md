# RoomSaathi Property Listing Website Requirements Document

## 1. Application Overview

### 1.1 Application Name
RoomSaathi\n
### 1.2 Application Description
RoomSaathi is a comprehensive full-stack property listing website that enables users to browse and discover various types of accommodation properties including PG, flats, apartments, rooms, and hostels. The platform features creative UI/UX with rich animations and multiple interactive sections, primarily operating in Sikar, Jaipur, and Kota cities. The platform includes a dedicated admin panel for managing properties, blogs, and user queries with real-time updates to the website.

### 1.3 Logo
Use the uploaded logo image with a creative hanging animation effect - the logo should appear as if hanging from a string with subtle swinging motion.\n
## 2. Property Categories

### 2.1 Main Categories
- PG (Paying Guest)
- Flats
- Apartments
- Rooms
- Hostels
- RoomSaathi Verified (special verified properties category)
- Short Term Stays

### 2.2 Property Type Classifications
- For Girls
- For Boys
- For Family\n- For Bachelors\n- For Students

## 3. Core Features and Functionality

### 3.1 User Authentication System
- **Login with Mobile Number and OTP Verification (Users Only):**
  - All login functionality is exclusively for regular users (property seekers)
  - Property owners do not have login access to the platform
  - Users must login using their mobile number\n  - OTP (One-Time Password) verification system for secure authentication
  - **SMS Provider Configuration:**
    - Integrate with a reliable SMS gateway service for OTP delivery
    - Recommended SMS providers: Twilio, AWS SNS, MSG91, or Firebase Authentication
    - Configure SMS provider API credentials in the application settings
    - Implement fallback mechanism in case primary SMS provider fails
    - Add proper error handling for SMS delivery failures with user-friendly messages
    - Display alternative contact options if SMS delivery fails (e.g., Contact Support)
    - Log SMS delivery status for debugging and monitoring purposes
  - Login flow:
    - User enters mobile number\n    - System sends OTP to the provided mobile number via configured SMS provider
    - Display loading state while OTP is being sent
    - Show success message when OTP is sent successfully
    - Show error message with retry option if OTP sending fails
    - User enters received OTP for verification
    - Upon successful verification, user is logged in\n  - Login button in header navigation (right side)
  - After successful login, display user profile icon or name instead of Login button
  - Logout functionality available in user profile dropdown
  - Session management to keep users logged in\n  - Auto-logout after session expiry with option to re-login
  - **Error Handling for SMS Provider:**
    - Display clear error message: Unable to send OTP. Please try again or contact support.\n    - Provide Retry button for users to request OTP again
    - Implement rate limiting to prevent SMS spam
    - Add Contact Support button in error state for immediate assistance
    - Log all SMS provider errors for technical team review

### 3.2 Header Navigation
- Left side: Logo with hanging animation effect
- Left side navigation items:
  - RoomSaathi Properties: On click, display RoomSaathi Verified properties
  - For Owner: On click, show Learn More button that navigates to dedicated Owner Features section
- Right side navigation items:
  - Support: On click, display dropdown menu with transition effect showing:\n    - WhatsApp Support
    - Contact Support
    - Call\n    - Help Center
    - How to Use
  - List Your Property\n  - Login button (when user is not logged in)
  - User profile icon/name (when user is logged in) with dropdown menu:\n    - My Profile
    - My Scheduled Visits
    - Saved Properties
    - Logout\n
### 3.3 Animated Home Screen
- Hero section with split layout: one side featuring animated images that transition with a hanging hook effect, displaying images of hostels, PG accommodations, and students
- Images should appear as if hanging from a hook and smoothly transition between different property types and student lifestyle scenes
- Animated text elements introducing RoomSaathi's value proposition
- Call-to-action buttons for browsing properties or getting started
- Smooth scroll animations as users navigate down the page
\n### 3.4 Global Search Context Management System
\n#### 3.4.1 Search Context Persistence
- **Unified Search State Management:**
  - Implement centralized search context that persists across all pages
  - Store active search parameters in application state (Redux, Context API, or similar)
  - Preserve search context when navigating between pages
  - URL parameters reflect active search state for shareable links
  - Browser back/forward buttons maintain search context

- **Search Context Parameters:**
  - Search query text
  - Selected city\n  - Selected locality
  - Property type filters
  - Property type classification filters
  - Price range\n  - Amenities filters
  - Room type filters
  - All other active filters
  - Sort order
  - View mode (list/grid/map)
\n#### 3.4.2 Home Page Search Integration
- **Hero Section Search Bar:**
  - Prominent search bar in hero section\n  - Real-time search suggestions as user types
  - Search across: property names, localities, landmarks, amenities, property classifications
  - Quick filter chips below search bar for common searches:\n    - Property types (PG, Flats, Apartments, etc.)
    - Cities (Sikar, Jaipur, Kota)
    - Property classifications (For Girls, For Boys, etc.)
  - On search submission or filter selection:\n    - Navigate to Browse Property page
    - Apply search query and filters automatically
    - Display results matching search context
    - Show active search context at top of Browse Property page

- **Cities We Serve Section Integration:**
  - Each city card (Sikar, Jaipur, Kota) is clickable
  - On city card click:\n    - Navigate to Browse Property page
    - Automatically apply city filter
    - Display all properties in selected city
    - Show city name in active filters
    - Update URL with city parameter
  - Explore City button on each card triggers same behavior
  - City selection persists when user applies additional filters

- **Browse by Category Section Integration:**
  - Each category (PG, Flats, Apartments, Rooms, Hostels, RoomSaathi Verified, Short Term Stays) is clickable
  - Each property classification (For Girls, For Boys, For Family, For Bachelors, For Students) is clickable
  - On category/classification click:
    - Navigate to Browse Property page
    - Automatically apply selected category/classification filter
    - Display matching properties
    - Show active filter in filter panel
    - Update URL with category/classification parameter
  - Category selection can be combined with other filters

- **Popular Localities Section Integration:**
  - Each locality card is clickable
  - On locality click:
    - Navigate to Browse Property page
    - Automatically apply locality filter
    - Pre-select corresponding city
    - Display properties in selected locality
    - Show locality and city in active filters
    - Update URL with locality and city parameters
\n#### 3.4.3 Browse Property Page Search Context Handling
- **Search Context Application:**
  - On page load, check for search context from:\n    - URL parameters (highest priority)
    - Application state (from navigation)
    - Session storage (for page refresh)
  - Apply all active filters automatically
  - Display search results matching context
  - Show active search context summary at top of page

- **Active Search Context Display:**
  - Prominent banner showing current search context:\n    - Search query (if any)
    - Selected city
    - Selected locality (if any)
    - Active category filters
    - Active classification filters\n    - Other active filters count
  - Clear individual filter buttons (X icon on each)
  - Clear All Filters button
  - Edit Search button to modify search query
\n- **Filter Panel Synchronization:**
  - Filter panel reflects all active filters from search context
  - Pre-check checkboxes for active filters
  - Pre-fill price range sliders\n  - Pre-select dropdowns (city, locality)\n  - Highlight active filter sections
  - Show filter count badges
\n- **Search Bar on Browse Property Page:**
  - Search bar pre-filled with search query from context
  - Modify search query updates results in real-time
  - Search suggestions based on current filter context
  - Debounced search for performance

#### 3.4.4 Cross-Page Search Context Flow Examples

**Example 1: City Selection from Home**
1. User on Home page\n2. User clicks Explore Sikar in Cities We Serve section
3. Navigate to Browse Property page
4. Automatically apply City = Sikar filter
5. Display all Sikar properties\n6. Show Sikar in active filters
7. URL: /browse?city=sikar\n8. User can add more filters (property type, price, etc.)
9. All filters work together with city context
\n**Example 2: Category Selection from Home**
1. User on Home page
2. User clicks PG category in Browse by Category section
3. Navigate to Browse Property page
4. Automatically apply Property Type = PG filter
5. Display all PG properties across all cities
6. Show PG in active filters
7. URL: /browse?type=pg
8. User can add city filter to narrow down\n9. Combined filters: PG properties in selected city

**Example 3: Combined Search from Home**
1. User on Home page
2. User types hostels for girls in search bar
3. User selects Jaipur from city quick filter
4. Navigate to Browse Property page
5. Automatically apply:\n   - Search query = hostels for girls
   - City = Jaipur
   - Property Type = Hostels (detected from query)
   - Classification = For Girls (detected from query)
6. Display matching results
7. Show all active filters
8. URL: /browse?q=hostels+for+girls&city=jaipur&type=hostels&classification=for-girls

**Example 4: Locality Selection from Home**
1. User on Home page
2. User clicks Vaishali Nagar locality in Popular Localities section
3. Navigate to Browse Property page
4. Automatically apply:\n   - City = Jaipur (parent city of Vaishali Nagar)\n   - Locality = Vaishali Nagar
5. Display properties in Vaishali Nagar, Jaipur
6. Show both city and locality in active filters
7. URL: /browse?city=jaipur&locality=vaishali-nagar

#### 3.4.5 Advanced Search Context Features

- **Search Context Persistence:**
  - Save search context to session storage
  - Restore context on page refresh
  - Maintain context when navigating to property details and back
  - Clear context only when user explicitly clears filters or starts new search

- **Smart Search Query Parsing:**
  - Detect property types from search query (pg, flat, apartment, room, hostel)
  - Detect classifications from query (for girls, for boys, for family, for students, for bachelors)
  - Detect city names from query (sikar, jaipur, kota)
  - Detect locality names from query\n  - Detect amenities from query (wifi, ac, parking, meals, etc.)
  - Auto-apply detected filters while preserving search query

- **Search Context Sharing:**
  - Generate shareable URLs with complete search context
  - Copy link button to share current search results
  - Social sharing with search context preserved
  - QR code generation for search context (optional)

- **Search History:**
  - Store recent searches in local storage
  - Display recent searches in search dropdown
  - Quick access to previous search contexts
  - Clear search history option

- **Saved Searches (Logged-in Users):**
  - Save current search context with custom name
  - Access saved searches from user profile
  - Receive notifications for new properties matching saved searches
  - Edit or delete saved searches

### 3.5 Dedicated Property Browse Page with Advanced Filtering

#### 3.5.1 Page Layout and Structure
- Create a separate dedicated page for browsing all properties
- Display all property listings with preview cards
- Show property thumbnail images with auto slider functionality for multiple property images
- Display basic details and pricing on listing cards
- **Display Amenities on Property Cards:**
  - Show key amenities with icons on each property card (e.g., WiFi, AC, Parking, Meals)\n  - Display 3-5 most important amenities for quick reference
  - Use compact icon representation to maintain card design
- **Display Accommodation Type on Property Cards:**
  - Show accommodation type badge (PG/Flat/Apartment/Room/Hostel)
  - Display gender preference indicator (Male/Female/Co-ed)
  - Show furnishing status (Fully Furnished/Semi-Furnished/Unfurnished)
  - Display property type classification badge (For Girls/For Boys/For Family/For Bachelors/For Students)
- Support infinite scroll or pagination for property listings
- Include sorting options (by price, date added, popularity, relevance, distance)
- Display active filters with option to clear individual or all filters
- Show total count of properties matching current filters
- Quick view option for property details without leaving the browse page
- Map view toggle to see properties on an interactive map
- List/Grid view toggle for different browsing preferences
- **Real-time property updates: New properties added by admin appear immediately without page refresh**

#### 3.5.2 Advanced Filter System

**Filter Panel Design:**
- Collapsible/expandable filter panel with smooth animation
- Sticky filter panel option for easy access while scrolling
- Mobile: Bottom sheet or slide-in panel for filters
- Desktop: Left sidebar filter panel\n- Filter sections organized in accordion format
- Each filter section can be expanded/collapsed independently
- Active filter count badge on each section
- Apply Filters button for mobile (filters apply in real-time on desktop)
- Reset Filters button to clear all selections
\n**Comprehensive Filter Options:**
\n1. **Property Type Filter:**
   - Multi-select checkboxes\n   - Options: PG, Flats, Apartments, Rooms, Hostels, Short Term Stays
   - Select All / Deselect All options
   - Show property count for each type

2. **Property Type Classification Filter:**
   - Multi-select checkboxes
   - Options: For Girls, For Boys, For Family, For Bachelors, For Students
   - Visual icons for each classification
   - Show property count for each classification
\n3. **RoomSaathi Verified Filter:**
   - Toggle switch for verified properties only
   - Show verified property count
   - Highlight verified badge\n
4. **Location Filters:**
   - **City Filter:**
     - Dropdown or radio buttons
     - Options: Sikar, Jaipur, Kota, All Cities
     - Show property count per city
   - **Locality Filter:**
     - Multi-select dropdown (searchable)
     - Dynamic options based on selected city
     - Show property count per locality
     - Recent localities at top\n     - Popular localities highlighted
   - **Distance from Landmark:**
     - Radius slider (1km, 2km, 5km, 10km, 15km, 20km+)
     - Landmark search input
     - Show properties within selected radius
\n5. **Price Range Filter:**
   - Dual-handle range slider
   - Min and max input fields for custom values
   - Preset price ranges (quick select buttons):
     - Under ₹5,000
     - ₹5,000 - ₹10,000
     - ₹10,000 - ₹15,000
     - ₹15,000 - ₹20,000
     - Above ₹20,000
   - Show property count for each range
   - Currency symbol display

6. **Amenities Filter:**
   - Multi-select checkboxes with icons
   - Organized in categories:\n     - **Basic:** WiFi, AC, Power Backup, Water Supply\n     - **Safety:** Security, CCTV, Fire Safety\n     - **Services:** Laundry, Meals, Housekeeping\n     - **Facilities:** Parking, Gym, Common Area, Elevator
   - Search amenities input
   - Show property count for each amenity
   - Popular amenities at top
   - Select All / Deselect All per category

7. **Room Type Filter:**
   - Multi-select checkboxes
   - Options: Single, Double, Triple, Shared, Any
   - Show property count for each room type
   - Visual icons for room types
\n8. **Gender Preference Filter:**
   - Radio buttons or checkboxes
   - Options: Male, Female, Co-ed, Any
   - Show property count for each preference
\n9. **Availability Filter:**
   - Radio buttons or dropdown
   - Options:\n     - Immediate (available now)
     - Within 1 week
     - Within 1 month
     - Custom date (date picker)
     - Any\n   - Show property count for each option

10. **Furnishing Filter:**
    - Multi-select checkboxes
    - Options: Fully Furnished, Semi-Furnished, Unfurnished, Any
    - Show property count for each option
\n11. **Property Age Filter:**
    - Radio buttons or checkboxes
    - Options:\n      - New (0-1 year)
      - Recent (1-3 years)
      - Established (3-5 years)
      - Old (5+ years)
      - Any
    - Show property count for each range

12. **Additional Filters:**
    - **Meals Included:** Yes/No/Optional
    - **Parking Available:** Yes/No\n    - **Pet Friendly:** Yes/No
    - **Smoking Allowed:** Yes/No
    - **Visitor Policy:** Allowed/Restricted/Not Allowed
    - **Lock-in Period:** No lock-in, 3 months, 6 months, 1 year\n\n**Filter Interaction Features:**
- Real-time filter application (results update as filters change)
- Filter dependency handling (locality options change based on city)\n- Smart filter suggestions based on search query
- Filter validation (prevent invalid combinations)
- Filter conflict resolution (show warnings for conflicting filters)
- Filter presets:\n  - Save current filter combination
  - Quick access to saved filter presets
  - Popular filter combinations suggested
- Filter analytics:\n  - Track most used filters
  - Suggest relevant filters based on user behavior
\n#### 3.5.3 Real-Time Search Functionality

**Search Bar Features:**
- Prominent search bar at top of Browse Property page
- Sticky search bar that remains visible while scrolling
- Search icon and clear button (X icon)
- Placeholder text with search suggestions
- Character count indicator for long queries
\n**Search Capabilities:**
- **Multi-Parameter Search:**
  - Property name\n  - Locality name
  - Landmark names
  - Property features and descriptions
  - Amenities
  - Property type classifications
  - Owner/manager names
  - Address components
\n- **Intelligent Search Features:**
  - Fuzzy matching for typos and variations
  - Synonym recognition (e.g., hostel = PG, flat = apartment)
  - Partial word matching
  - Case-insensitive search
  - Special character handling
  - Multi-language support (English, Hindi)\n
- **Search Suggestions:**
  - Autocomplete dropdown as user types
  - Categorized suggestions:\n     - Properties\n     - Localities
     - Landmarks
     - Amenities\n     - Popular searches
  - Highlight matching text in suggestions
  - Keyboard navigation (arrow keys, enter)
  - Click or tap to select suggestion

- **Search Results:**
  - Instant results as user types (debounced)
  - Display result count in real-time
  - Highlight matching keywords in results
  - Sort by relevance by default
  - No results state with helpful suggestions:\n    - Check spelling
    - Try different keywords
    - Broaden search criteria
    - Browse all properties
    - Contact support

- **Search History:**
  - Store recent searches (last 10)\n  - Display in dropdown when search bar is focused
  - Clear individual or all history items
  - Click to re-run previous search
\n- **Search Performance:**
  - Debounced search (300ms delay)
  - Cancel previous requests on new input
  - Loading indicator during search
  - Optimized database queries
  - Caching for common searches

#### 3.5.4 Sticky Search Bar on Scroll

**Sticky Behavior:**
- Search bar becomes fixed to top when user scrolls past hero section
- Smooth transition animation (slide down with fade-in)
- Compact sticky version with essential controls
- Maintains full search and filter functionality
- Subtle shadow for depth perception
- Z-index management to stay above content

**Sticky Bar Components:**
- Search input field (slightly smaller)\n- Active filter chips (scrollable horizontally)
- Filter panel toggle button
- Sort dropdown\n- View mode toggle (list/grid/map)
- Results count\n- Clear all filters button
\n**Sticky Bar Features:**
- Quick filter chips for active filters:\n  - Display up to 5 active filters
  - Show +N more if more filters active
  - Click chip to remove individual filter
  - Horizontal scroll for many filters
- Expand button to show full filter panel
- Collapse button to hide filter panel
- Responsive behavior:\n  - Desktop: Full width with all controls
  - Tablet: Compact with essential controls\n  - Mobile: Minimal with filter button and search\n
**Animation Details:**
- Trigger point: 200px scroll from top
- Transition duration: 300ms
- Easing: ease-in-out
- Transform: translateY(-100%) to translateY(0)
- Opacity: 0 to 1\n- Box shadow: none to subtle shadow

#### 3.5.5 Contextual Filtering Throughout Navigation

**Navigation Context Preservation:**
- Maintain filter context when navigating between pages
- Preserve scroll position when returning to browse page
- Breadcrumb navigation showing filter path
- Back button behavior respects filter context

**Contextual Filter Application:**
\n1. **From Browse by Category Section:**
   - Click category → Navigate to Browse Property page
   - Auto-apply category filter
   - Show category in active filters
   - URL parameter: ?type=category_name
\n2. **From Cities We Serve Section:**
   - Click city → Navigate to Browse Property page
   - Auto-apply city filter
   - Show city in active filters
   - URL parameter: ?city=city_name

3. **From Popular Localities Section:**
   - Click locality → Navigate to Browse Property page
   - Auto-apply locality and parent city filters
   - Show both in active filters
   - URL parameters: ?city=city_name&locality=locality_name
\n4. **From RoomSaathi Verified Navigation:**
   - Click RoomSaathi Verified → Navigate to Browse Property page
   - Auto-apply verified filter
   - Show verified badge in active filters
   - URL parameter: ?verified=true

5. **From Property Classification Selection:**
   - Click classification → Navigate to Browse Property page
   - Auto-apply classification filter\n   - Show classification in active filters
   - URL parameter: ?classification=classification_name

**Filter Context Features:**
- URL parameters reflect all active filters
- Shareable URLs with complete filter state
- Browser back/forward maintains filter state
- Page refresh preserves filter context
- Deep linking support for specific filter combinations

**Breadcrumb Navigation:**
- Show filter path: Home > Browse > [Active Filters]\n- Click breadcrumb to remove filters progressively
- Visual hierarchy of applied filters
- Mobile: Collapsible breadcrumb\n
#### 3.5.6 Perfect Search on Each Parameter

**Search Ranking Algorithm:**
- **Priority Levels:**
  1. Exact matches (highest priority)
  2. RoomSaathi Verified properties
  3. Recently added properties (last 7 days)
  4. Properties with complete information
  5. Properties with high ratings
  6. Properties with more images
  7. Partial matches\n
**Parameter-Specific Search:**
\n1. **Property Type Search:**
   - Exact match: PG, Flat, Apartment, Room, Hostel\n   - Partial match: P matches PG, Ap matches Apartment
   - Synonym support: Hostel = PG, Flat = Apartment
\n2. **Property Classification Search:**
   - Exact match: For Girls, For Boys, For Family, For Bachelors, For Students
   - Keyword detection: girls, boys, family, bachelor, student
   - Gender-specific keywords: male, female, co-ed

3. **Location Search:**
   - City exact match: Sikar, Jaipur, Kota\n   - Locality fuzzy match with typo tolerance
   - Landmark proximity search
   - Address component matching
   - Pincode search support

4. **Price Search:**
   - Range-based search with flexible inputs
   - Support for approximate values (around 10000)
   - Currency symbol handling (₹, Rs, INR)
   - Price comparison operators (under, above, between)

5. **Amenities Search:**
   - Multi-criteria matching\n   - AND logic: properties with all specified amenities
   - OR logic: properties with any specified amenities
   - Amenity synonym support (wifi = internet, ac = air conditioning)
\n6. **Keyword Search:**
   - Full-text search across property descriptions
   - Title and description weighted differently
   - Tag-based search\n   - Feature-based search
\n**Combined Search:**
- Support multiple simultaneous search parameters
- Intelligent parameter detection from natural language
- Example: affordable pg for girls in jaipur with wifi
  - Detects: Property Type = PG, Classification = For Girls, City = Jaipur, Amenity = WiFi, Price = Low
- Combine filters with AND logic by default
- Option to switch to OR logic for specific filters

**Search Result Sorting:**
- **Relevance (Default):**
  - Based on ranking algorithm
  - Considers all priority factors
  - Personalized based on user behavior (if logged in)
\n- **Price: Low to High:**
  - Sort by minimum rent
  - Consider per-seat pricing
  - Show price range on cards

- **Price: High to Low:**
  - Sort by maximum rent
  - Useful for premium property search
\n- **Newest First:**
  - Sort by date added
  - Show New badge on recent properties

- **Most Popular:**
  - Based on views, saves, and bookings
  - Show popularity indicator

- **Distance:**
  - Available when location is specified
  - Sort by proximity to landmark or user location
  - Show distance on cards

- **Rating:**
  - Sort by average user rating
  - Show rating stars on cards

**No Results Found State:**
- Friendly message: No properties found matching your criteria
- Helpful suggestions:\n  - Relax some filters (show which filters to remove)
  - Try different keywords (suggest alternatives)
  - Browse all properties (link to unfiltered view)
  - Expand search to nearby localities
  - Contact support for personalized assistance
- Show similar properties based on partial match
- Save search option to get notified when matching properties are added

#### 3.5.7 Filter and Search Performance Optimization

**Performance Features:**
- Lazy loading for property cards
- Virtual scrolling for large result sets
- Image lazy loading with placeholders
- Debounced search and filter inputs
- Cached filter results
- Optimized database queries with indexes
- Progressive loading (load visible cards first)
- Prefetch next page of results

**User Experience Enhancements:**
- Loading skeletons during search
- Smooth transitions between filter states
- Instant feedback on filter changes
- Progress indicator for long operations
- Error handling with retry options
- Offline support for cached results

### 3.6 Browse by Category Section
- Split layout design with left and right sections
- Left side:\n  - Display category images with cutout design effect
  - Implement hover effects on category images
  - Show category icons for selection
  - Categories include: PG, Flats, Apartments, Rooms, Hostels, RoomSaathi Verified, Short Term Stays
  - Add property type classification options: For Girls, For Boys, For Family, For Bachelors, For Students
  - On category click, navigate to Browse Property page with selected category pre-filtered
- Right side:
  - Display property cards with small and minimal design
  - Show amenities icons on property cards (3-5 key amenities)
  - Display accommodation type badge on each property card
  - Display property type classification badge (For Girls/For Boys/For Family/For Bachelors/For Students)
  - Arrange property cards in column-wise layout
  - Enable vertical scrolling for property cards within the column
  - Update property cards dynamically based on category selection from left side
  - Real-time updates: Property cards refresh automatically when admin adds/updates properties

### 3.7 Student Information Section
- Split layout design with left and right sections\n- Left side:
  - Display informational content about RoomSaathi services for students
  - Include text describing benefits and features
- Right side:
  - Display images of students in accommodation settings
  - Show student lifestyle and accommodation experiences
\n### 3.8 What RoomSaathi Students Get Section
- Split layout design with left and right sections
- Left side:
  - Display 4 to 5 key features and benefits for students that impress and attract them
  - Include benefits such as:
    - Welcome kits upon booking
    - Special student discounts and offers
    - Verified property guarantee
    - 24/7 customer support
    - Move-in assistance
    - Community events and networking opportunities
    - Flexible booking options
    - Property maintenance support
  - Implement auto slide functionality to cycle through features
  - Each feature should include title and description
- Right side:
  - Display relevant images corresponding to the features
  - Images should change in sync with the auto sliding features
\n### 3.9 Property Detail Page
Each property should display complete information with the following advanced layout:\n\n**Left Side:**
- Property images gallery with multiple high-quality images
- Image slider/carousel functionality
- Thumbnail navigation for quick image browsing
- Full-screen image view option
- **Property Video Gallery:**
  - Display property video URLs stored in database
  - Video player with standard controls (play, pause, volume, fullscreen)
  - Support for multiple video formats\n  - Video thumbnail preview before playing
  - Option to view videos in fullscreen mode
  - Video gallery navigation if multiple videos are available
  - Smooth transition between images and videos in the media gallery
  - Video loading indicator
  - Fallback message if video fails to load

**Right Side:**
\n- **Neighborhood Highlights:**
  - Nearby landmarks and facilities
  - Distance to key locations (colleges, hospitals, markets, etc.)
  - Transportation connectivity information
  - Area description and locality benefits
\n- **Property Details:**
  - Property name\n  - Property type and category
  - Property type classification (For Girls/For Boys/For Family/For Bachelors/For Students)
  - RoomSaathi Verified badge (if applicable)
  - Complete address\n  - Location (city and locality)
  - Detailed description
  - Property owner/manager details
  - Availability status
\n- **Google Map Integration:**
  - Display interactive Google Map showing the exact property location
  - Google Maps API Key: AIzaSyDWxlGHqTSpDoWE66rhv9tEC3ZgSs0PZCQ
  - Map should display a marker at the property's precise location
  - Map features:
    - Zoom in/out controls
    - Street view option (if available)
    - Satellite view toggle
    - Full-screen map view option
    - Nearby landmarks and points of interest visible on the map
    - Distance calculation from user's current location (optional)
  - Map should be responsive and work seamlessly on all devices
  - Display property address below or above the map for reference
  - Get Directions button that opens the location in Google Maps app or browser

- **Accommodation Type:**
  - Type of accommodation (PG/Flat/Apartment/Room/Hostel)
  - Gender preference (Male/Female/Co-ed)
  - Furnishing status (Fully Furnished/Semi-Furnished/Unfurnished)\n  - Property age (New/Recent/Established)
  - Total number of floors
  - Total number of rooms
  - Occupancy type options available (Single/Double/Triple/Shared)
\n- **Amenities with Icons:**
  - Display complete list of available amenities with corresponding icons
  - Each amenity should have a clear icon representation
  - Amenities include:
    - WiFi
    - AC
    - Parking
    - Laundry
    - Meals (Breakfast/Lunch/Dinner options)
    - Security (CCTV/Security Guard)
    - Power Backup
    - Water Supply (24/7)
    - Gym/Fitness Center
    - Common Area/Lounge
    - TV/Entertainment
    - Refrigerator
    - Microwave/Kitchen Access
    - Washing Machine
    - Geyser/Hot Water
    - Elevator/Lift
    - Balcony\n    - Garden/Terrace Access
    - Study Room
    - Housekeeping\n    - Intercom
    - Fire Safety Equipment
  - Use visual grid or card layout for amenity display
  - Highlight premium or unique amenities
  - Group amenities by category (Basic, Safety, Entertainment, Kitchen, etc.)
\n- **Rooms Visual Layout:**
  - Interactive visual representation of property floor plan
  - Display floor-wise breakdown:\n    - Floor number (Ground Floor, First Floor, Second Floor, etc.)\n    - Number of rooms on each floor
    - Visual floor map showing room positions
  - For each room, display:
    - Room number or identifier
    - Room type (Single/Double/Triple/Shared)\n    - Total seats in the room
    - Available seats (real-time availability)
    - Room size (in sq ft)
    - Attached/Common bathroom indicator
  - Room-specific amenities and furnishings with icons:\n    - Bed (Single/Double/Bunk)
    - Almirah/Wardrobe
    - Study Table
    - Chair\n    - Shoe Rack
    - Fan/AC
    - Window\n    - Balcony access
    - Power outlets
    - Reading light
    - Mattress type
  - Visual design approach:\n    - Use floor plan view with clickable room sections
    - Color-coded availability status (Available/Occupied/Reserved)
    - Hover effect to show quick room details
    - Click on room to expand detailed view with images and amenities
  - Room images gallery for each room type
  - 360-degree room view option (if available)

- **Rent Details:**
  - Comprehensive pricing breakdown by room type:\n    - Single Sharing: Price per month per seat
    - Double Sharing: Price per month per seat
    - Triple Sharing: Price per month per seat
    - Any other sharing options with respective per-seat pricing
  - Additional charges breakdown:
    - Security deposit amount
    - Maintenance charges
    - Electricity charges (included/extra)
    - Water charges (included/extra)
    - WiFi charges (included/extra)
    - Meal charges (if applicable)
    - Parking charges (if applicable)
  - Short term stay pricing:\n    - Per day rate for short term stays
    - Minimum stay duration for short term\n    - Short term availability indicator
    - Separate pricing for different room types on per-day basis
  - Pricing comparison table for easy understanding
  - Discount information (if any)
  - Seasonal pricing variations (if applicable)

- **Things You Should Know:**
  - Important property rules and regulations
  - Check-in/Check-out timings
  - Guest policy\n  - Smoking/Drinking policy
  - Pet policy
  - Noise restrictions
  - Visitor timings
  - Lock-in period (if any)
  - Notice period for vacating\n  - Property maintenance schedule
  - Emergency contact information
  - Still Confused? Send Query button:\n    - Prominent button for users to ask specific questions
    - Opens query form or chat interface
    - Quick response commitment display

- **Payment Policies:**
  - Accepted payment methods (Cash/Card/UPI/Net Banking/Wallet)
  - Payment schedule (Monthly/Quarterly/Advance)
  - Due date for monthly payments
  - Late payment penalties
  - Security deposit refund policy
  - Advance payment requirements
  - Payment receipt and invoice details
  - Auto-debit facility availability
  - Payment gateway security information

- **Cancellation Policies:**
  - Booking cancellation terms
  - Refund policy with timeline:\n    - Full refund conditions
    - Partial refund conditions
    - No refund conditions
  - Cancellation charges breakdown
  - Notice period required for cancellation
  - Security deposit refund timeline
  - Cancellation process steps
  - Force majeure clause
  - Dispute resolution process
\n- **Short Term Stay Availability:**
  - Clear indicator if property accepts short term stays
  - Minimum stay duration (1 day, 3 days, 1 week, etc.)
  - Maximum short term stay duration
  - Per day pricing for short term stays
  - Short term availability calendar
  - Booking process for short term stays
  - Short term stay specific policies
  - Advance booking requirements
  - Check-in/Check-out flexibility for short stays

- **Action Buttons:**
  - **Schedule Visit button:**
    - User must be logged in to schedule a visit
    - If user is not logged in, clicking this button will prompt login with mobile number and OTP verification
    - After successful login, open Schedule Visit form with:\n      - Date picker for selecting visit date
      - Time picker for selecting visit time
      - Name field (auto-filled from user profile)
      - Phone number field (auto-filled from user profile)
      - Additional notes or requirements field (optional)
      - Submit button to confirm visit scheduling
    - Upon successful submission, display confirmation message with visit details
    - Send confirmation notification to user's mobile number
    - User can view and manage scheduled visits in their profile section
  - See Rooms button: Navigate to detailed room information section or modal
  - Contact Owner button\n  - Share Property button
  - Save to Favorites button (requires login)
  - Send Query button (for Things You Should Know section)
\n**Additional Sections on Property Detail Page:**
- Virtual tour option (if available)
- Reviews and Ratings section
- Similar Properties section:\n  - Display 3-4 similar properties based on location, price range, and property type
  - Property cards with basic information and images
  - Show amenities and accommodation type on similar property cards
  - Display property type classification badge on similar property cards
  - Quick navigation to similar property detail pages
  - Real-time updates: Similar properties refresh when admin updates related properties
\n### 3.10 User Actions\n- Login with mobile number and OTP verification
- Browse all properties on dedicated browse page
- View detailed property information including room details and images
- Watch property videos in the property detail page
- Filter and search properties with advanced options including amenities, accommodation type, and property type classification
- Save favorite properties (requires login)
- Contact property owners\n- Share property listings\n- Compare multiple properties
- Schedule property visits (requires login):\n  - Select date and time for visit
  - Name and phone number auto-filled from user profile
  - View and manage scheduled visits in user profile\n- Read and view property reviews\n- Send queries about specific properties
- View floor plans and room layouts
- Check short term stay availability
- Review payment and cancellation policies
- View property location on Google Map
- Get directions to property location
- Filter properties by amenities, accommodation type, and property type classification
\n### 3.11 Property Comparison\n- Allow users to select multiple properties for side-by-side comparison
- Compare key features, amenities, pricing, and locations
- Include accommodation type comparison (furnishing, gender preference, property age)
- Include property type classification comparison (For Girls/For Boys/For Family/For Bachelors/For Students)
- Display amenities comparison with visual indicators for available/not available
- Visual comparison interface with clear distinctions\n\n### 3.12 Reviews and Ratings
- Display user reviews and ratings for properties
- Show overall rating scores\n- Filter reviews by rating level\n- Display review highlights\n\n### 3.13 Featured Properties Section
- Showcase premium or featured listings
- Highlight RoomSaathi Verified properties\n- Display key amenities on featured property cards
- Show accommodation type badges on featured properties
- Display property type classification badges on featured properties\n- Real-time updates: Featured properties refresh when admin updates them

### 3.14 Cities We Serve Section
- Display the three primary operating cities: Sikar, Jaipur, and Kota
- Perfect UI/UX design with consistent visual treatment for all cities
- Each city card should have:
  - Same size dimensions for uniformity
  - High-quality city image or illustration
  - City name prominently displayed
  - Number of available properties in that city
  - Brief description or tagline for each city
  - View Properties button/link
- Responsive design ensuring:\n  - Desktop: Three cards displayed in a single row with equal spacing
  - Tablet: Three cards in a row or two rows depending on screen size, maintaining equal sizing
  - Mobile: Single column layout with cards stacked vertically, each card maintaining same dimensions
- Visual consistency:\n  - Uniform card heights and widths
  - Consistent padding and margins
  - Same typography style and size across all cards
  - Matching color scheme and hover effects
  - Equal image aspect ratios
- Interactive elements:
  - Smooth hover effects with subtle scale or shadow changes
  - Click on any city card to navigate to Browse Property page with that city pre-filtered
  - Animated transitions when hovering or clicking
- Additional features:
  - Property count badge on each city card
  - Popular localities preview for each city (optional)
  - City-specific statistics or highlights
\n### 3.15 City Guides Section
- Provide information about Sikar, Jaipur, and Kota\n- Highlight popular localities in each city
- Display area-specific property statistics
- Include city-specific accommodation tips
\n### 3.16 Testimonials Section
- Display user testimonials and success stories
- Include photos or avatars of satisfied users
- Animated carousel for testimonial display
\n### 3.17 Why Choose RoomSaathi Section
- Highlight unique value propositions
- Display key benefits and features
- Include statistics (number of properties, satisfied users, etc.)
- Use icons and visual elements to enhance presentation

### 3.18 How It Works Section
- Step-by-step guide on using the platform
- Visual representation of the property search and booking process
- Clear call-to-action at each step
\n### 3.19 Popular Localities Section
- Display trending or popular localities in each city
- Show number of available properties per locality
- Quick access links to locality-specific listings
- On click, navigate to Browse Property page with selected locality pre-filtered

### 3.20 Property Owner Section
- Information for property owners wanting to list their properties
- Benefits of listing on RoomSaathi\n- Call-to-action for property listing
- Display functionalities provided for owners: management software, website listing services, etc.

### 3.21 Owner Features Section
- Dedicated section accessible via Learn More button from For Owner navigation item
- Display comprehensive owner features with informational content and images
\n**Feature 1: In-App Quick Listing**
- **Interactive Banner with Transition and Effects:**
  - Display an attractive banner with smooth transition animations
  - Banner should have creative opening effect (fade-in, slide-in, or scale animation)
  - Professional design showcasing quick listing benefits
\n- **Owner Details Form:**
  - Form fields within the banner:\n    - Name (text input field)
    - Phone Number (text input field with validation)
    - Submit button
  - Form validation:\n    - Ensure name is not empty
    - Validate phone number format (10 digits)
    - Display error messages for invalid inputs
  - Form styling:
    - Clean and modern input fields
    - Clear labels and placeholders
    - Responsive design for all devices

- **On Submit Actions:**
  - Display success message: Our team will contact you soon about your listing
  - Success message should appear with smooth animation
  - Automatically send WhatsApp message to the owner's provided phone number
  - WhatsApp message content:
    - Greeting message\n    - Google Form link containing all property listing fields
    - Instructions to fill the form
  - Google Form should include comprehensive property listing fields:\n    - Property basic information\n    - Location details
    - Property type and classification
    - Room details and pricing
    - Amenities\n    - Images upload option
    - Contact information
    - Any additional requirements
  - After successful submission, clear the form fields
  - Option to submit another listing request

- **Mobile App Images:**
  - Display mobile app interface images showing the quick listing feature
  - Showcase how owners can list properties through the mobile app
  - Use carousel or slider to show multiple app screens
\n**Feature 2: Listing with Management Software**
- **Interactive Banner with Transition:**
  - Display an attractive banner with smooth transition animations
  - Banner should have creative opening effect similar to Quick Listing banner
  - Professional design highlighting management software benefits

- **Management Software Details:**
  - Comprehensive description of management software features:\n    - Property management capabilities
    - Tenant management\n    - Rent collection and tracking
    - Maintenance request handling
    - Financial reporting
    - Automated notifications
    - Dashboard analytics
    - Multi-property management
  - Benefits of using the management software:
    - Streamlined operations
    - Time-saving automation
    - Better tenant communication
    - Financial transparency
    - Real-time updates
    - Mobile accessibility
\n- **Mobile App Showcase:**
  - Display mobile app images demonstrating management software interface
  - Show key features through app screenshots:\n    - Dashboard view
    - Property listing management
    - Tenant management screen
    - Financial reports
    - Notification center
  - Use carousel or slider for multiple app screens
  - Highlight mobile app availability for iOS and Android

- **Software Access Link:**
  - Prominent button or link to access the management software
  - Link: https://rosamanage.netlify.app/
  - Button text: Access Management Software or Try Now
  - Button should have hover effect and smooth transition
  - Opens in new tab when clicked
  - Display software logo or icon alongside the link

- **Call-to-Action:**
  - Encourage owners to try the management software
  - Display contact information for software support
  - Option to request a demo or tutorial
\n**Additional Owner Features:**
- Display other owner features with relevant descriptions and visual demonstrations
- Use split layout or card-based design to present features effectively
- Maintain consistent design language across all feature sections
\n### 3.22 Blog Section
- Create a dedicated blog page with complete blog functionality
- Blog posts can only be created and published by RoomSaathi admin through the admin panel
- Real-time blog updates: New blog posts published by admin appear on the website immediately without page refresh
- Blog Listing Page:
  - Display blog posts in a grid or card layout
  - Each blog card should include:
    - Featured image
    - Blog title
    - Brief excerpt or summary
    - Author name and avatar
    - Publication date
    - Category tags
    - Read time estimate
    - Read More button
  - Implement pagination or infinite scroll for blog listings
  - Filter blogs by categories (Accommodation Tips, City Guides, Student Life, Property Hunting, etc.)
  - Search functionality for blog posts
  - Featured or trending blog posts section at the top
  - Recent posts sidebar widget
  - Popular posts section
  - Automatic refresh when admin publishes new blog posts
- Individual Blog Post Page:
  - Full blog post content with rich text formatting
  - Hero image at the top
  - Author bio section with photo and description
  - Publication date and last updated date
  - Social sharing buttons
  - Related blog posts section at the bottom
  - Comments section for user engagement
  - Table of contents for longer articles
  - Estimated reading time
  - Category and tag display
- Blog Categories:
  - Accommodation Tips\n  - City Guides (Sikar, Jaipur, Kota)
  - Student Life
  - Property Hunting Tips
  - RoomSaathi Updates
  - Locality Spotlights
- Blog UI/UX Features:
  - Clean and readable typography
  - Responsive image galleries within blog posts
  - Smooth transitions and hover effects on blog cards
  - Breadcrumb navigation
  - Newsletter subscription prompt within blog posts
  - Related articles recommendation engine
\n### 3.23 About Us Section
- Create a comprehensive About Us page with the following elements:
- Company Introduction:\n  - RoomSaathi's mission and vision statement
  - Core values and principles
  - What makes RoomSaathi unique in the accommodation marketplace
- Team Section:
  - Founder and leadership team profiles with photos
  - Key team members with their roles and brief bios
  - Team photos showcasing company culture
- Company Milestones:
  - Timeline of key achievements and growth
  - Number of properties listed
  - Number of satisfied users
  - Cities covered and expansion plans
- Why We Started:
  - Story behind the founding of RoomSaathi
  - Problem statement that RoomSaathi aims to solve
  - Impact on students and property owners
- Our Commitment:
  - Quality assurance and verification process
  - Customer support commitment
  - Transparency and trust-building measures
- Visual Elements:
  - Office photos from Sikar, Jaipur, and Kota locations
  - Team collaboration images
  - Infographics showing company statistics
  - Video introduction (optional)

### 3.24 Our Story Section
- Create a dedicated Our Story page with narrative storytelling:\n- The Beginning:
  - How RoomSaathi was conceived
  - Initial challenges faced by founders
  - First property listing and user experience
- Growth Journey:
  - Expansion from one city to three (Sikar, Jaipur, Kota)
  - Key partnerships and collaborations
  - Technology evolution and platform improvements
- Student Success Stories:
  - Real testimonials and case studies
  - How RoomSaathi helped students find their ideal accommodation
  - Photos and quotes from satisfied users
- Property Owner Success Stories:
  - How property owners benefited from listing on RoomSaathi
  - Increased occupancy rates and better tenant management
  - Testimonials from property owners
- Future Vision:
  - Plans for expansion to more cities
  - Upcoming features and improvements
  - Long-term goals and aspirations
- Visual Storytelling:
  - Timeline visualization with images
  - Before and after comparisons
  - Photo galleries documenting the journey
  - Video testimonials (optional)

### 3.25 FAQ Section
- Create a comprehensive FAQ page with the following structure:
- Categorized FAQ sections:
  - General Questions about RoomSaathi
  - Searching and Browsing Properties
  - Property Details and Verification
  - Contacting Property Owners
  - RoomSaathi Verified Properties\n  - For Property Owners
  - Safety and Security
  - Policies and Terms
- FAQ Format:
  - Expandable/collapsible accordion interface for each question
  - Clear question headings
  - Detailed answers with helpful information
  - Links to related resources or pages where applicable
- Common Questions to Include:
  - What is RoomSaathi?
  - How do I search for properties?
  - What does RoomSaathi Verified mean?
  - How can I contact a property owner?
  - Is there any booking fee?
  - How do I list my property on RoomSaathi?
  - What are the benefits of listing on RoomSaathi?
  - How does the verification process work?
  - What cities does RoomSaathi operate in?
  - How can I contact RoomSaathi support?
- Search Functionality:
  - Search bar to quickly find specific questions
  - Suggested questions based on search input
- Additional Features:
  - Still have questions section with contact form
  - Link to contact support\n  - Popular questions highlighted at the top
  - Recently updated FAQs indicator

### 3.26 Contact Section
- Contact form for inquiries\n- Display contact information (email, phone)\n- Office locations in Sikar, Jaipur, and Kota
- Social media links\n\n### 3.27 Newsletter Subscription
- Email subscription form for updates and offers
- Promotional messaging about benefits of subscribing
\n### 3.28 Footer Section
- Professional footer design with comprehensive link structure
- Organized into multiple columns with the following categories:
\n**Company**
- About Us
- Our Story
- Community
\n**Resources**
- Blogs
- FAQs
- City Guides
\n**Legal**
- Terms and Conditions
- Service Terms
- Privacy Policy
- Guest Refund Policy
- Non Discrimination Policy
- Booking Policy

**Contact & Social**
- Contact information
- Social media links
- Newsletter subscription
\n**Additional Footer Elements**
- RoomSaathi logo
- Copyright information
- Operating cities: Sikar, Jaipur, Kota
- Quick links to property categories
\n### 3.29 Legal Policy Modals
- Create interactive modal system for all legal policy documents
- **Modal Trigger Behavior:**
  - All legal policy links in footer (Terms and Conditions, Service Terms, Privacy Policy, Guest Refund Policy, Non Discrimination Policy, Booking Policy) should open modals on click
  - Modal should appear above the page content like a banner with creative transition effect
  - Implement smooth fade-in and slide-down animation when modal opens
  - Add backdrop overlay with semi-transparent dark background
  - Modal should be centered on screen with appropriate padding
\n- **Modal Design and Features:**
  - Creative opening animation:\n    - Fade-in effect for backdrop (0.3s duration)
    - Slide-down from top with bounce effect for modal content (0.5s duration)
    - Scale animation starting from 0.9 to 1.0 for smooth appearance
  - Modal header:\n    - Policy title prominently displayed
    - Close button (X icon) in top-right corner
    - Subtle shadow and border for depth
  - Modal body:
    - Scrollable content area for policy text
    - Clean typography with proper spacing
    - Section headings and subheadings for easy navigation
    - Maximum height with internal scroll for long content
  - Modal footer (optional):
    - Last updated date
    - Accept/Close button
  - Responsive design:\n    - Full-width on mobile devices with minimal side padding
    - Centered with max-width on desktop (e.g., 800px)
    - Adjust animation and positioning for different screen sizes

- **Modal Interaction:**
  - Click outside modal (on backdrop) to close\n  - Press ESC key to close modal
  - Click close button (X) to close modal
  - Smooth fade-out and slide-up animation when closing (reverse of opening animation)
  - Prevent body scroll when modal is open
  - Restore body scroll when modal is closed

- **Policy Content Structure:**
  Each policy modal should contain well-structured content with:
  - Introduction section
  - Detailed policy clauses with numbered or bulleted lists
  - Definitions and terminology
  - Rights and responsibilities\n  - Contact information for policy-related queries
  - Effective date and last updated date
\n- **Specific Policy Requirements:**
  - **Terms and Conditions:** General terms of use, user obligations, platform rules
  - **Service Terms:** Service-specific terms, usage guidelines, limitations
  - **Privacy Policy:** Data collection, usage, storage, and protection practices
  - **Guest Refund Policy:** Refund eligibility, process, timelines, and conditions
  - **Non Discrimination Policy:** Equal opportunity statement, anti-discrimination commitment
  - **Booking Policy:** Booking process, confirmation, modifications, and cancellations
\n### 3.30 Admin Panel\n- **Admin Authentication System:**
  - Create a separate API endpoint for admin login
  - Admin login credentials (username/email and password)
  - Secure authentication with JWT tokens or session management
  - Admin-only access control and authorization
  - Separate admin login page (e.g., /admin/login)
  - Password reset functionality for admin accounts
  - Role-based access control for different admin levels (if needed)

- **Admin Dashboard:**
  - Centralized dashboard for managing all RoomSaathi operations
  - Overview statistics and analytics:\n    - Total properties listed
    - Total active users
    - Total blog posts published
    - Pending user queries
    - Recent activities and updates
  - Quick access navigation to all management sections
  - Visual charts and graphs for key metrics
  - Recent activity feed\n\n- **Property Management with Real-Time Website Updates:**
  - **Property Listing Management:**
    - View all properties in a table/grid format
    - Search and filter properties by:\n      - City (Sikar, Jaipur, Kota)
      - Property type (PG, Flat, Apartment, Room, Hostel, Short Term Stays)
      - Property type classification (For Girls, For Boys, For Family, For Bachelors, For Students)
      - Verification status (Verified/Unverified)
      - Availability status\n      - Date added
    - Sort properties by various parameters
    - Bulk actions (delete, verify, feature)
  \n  - **Add New Property:**
    - Comprehensive property creation form with all fields:\n      - Basic Information: Property name, type, classification, description
      - Location: City, locality, complete address, Google Maps coordinates
      - Property Details: Number of floors, total rooms, property age, furnishing status
      - Accommodation Type: Gender preference, occupancy types available
      - Amenities: Multi-select checkboxes for all amenities
      - Room Details: Floor-wise room layout, room types, pricing, availability
      - Rent Details: Pricing breakdown by room type, additional charges, short term pricing
      - Images: Multiple image upload with drag-and-drop functionality
      - Videos: Video URL input for property videos
      - Policies: Payment policies, cancellation policies, property rules
      - Verification: RoomSaathi Verified toggle
    - Form validation and error handling
    - Image preview before upload
    - Save as draft functionality
    - Publish immediately or schedule for later
    - Real-time website update: New property appears on website immediately after publishing without requiring page refresh
  
  - **Edit Property:**
    - Edit any existing property with pre-filled form\n    - Update property information, images, videos, pricing, availability
    - Version history or change log (optional)
    - Update verification status
    - Real-time website update: Property changes reflect on website immediately after saving
  
  - **Delete Property:**
    - Soft delete with confirmation prompt
    - Option to permanently delete or archive
    - Bulk delete functionality
    - Real-time website update: Deleted property is removed from website immediately\n\n- **Blog Management with Real-Time Website Updates:**
  - **Blog Post Listing:**
    - View all blog posts in a table/grid format
    - Search and filter blogs by:
      - Category\n      - Publication status (Published/Draft)
      - Author
      - Date published
    - Sort blogs by date, views, or popularity
    - Bulk actions (delete, publish, unpublish)
  
  - **Create New Blog Post:**
    - Rich text editor for blog content creation (WYSIWYG editor)
    - Blog post fields:\n      - Title
      - Featured image upload
      - Content (rich text with formatting, images, videos, links)
      - Excerpt/Summary
      - Category selection
      - Tags\n      - Author information
      - SEO meta title and description
      - Publication date (immediate or scheduled)
    - Image upload and management within blog content
    - Preview functionality before publishing
    - Save as draft\n    - Publish or schedule for future publication
    - Real-time website update: Published blog post appears on website blog section immediately without requiring page refresh
  
  - **Edit Blog Post:**
    - Edit any existing blog post with pre-filled content
    - Update content, images, categories, tags\n    - Change publication status (publish/unpublish)
    - Version history or revision tracking (optional)
    - Real-time website update: Blog post changes reflect on website immediately after saving
  \n  - **Delete Blog Post:**
    - Soft delete with confirmation prompt
    - Option to permanently delete or archive
    - Bulk delete functionality
    - Real-time website update: Deleted blog post is removed from website immediately
  
  - **Blog Categories Management:**
    - Add, edit, delete blog categories
    - Assign categories to blog posts
\n- **User Query Management with Real-Time Updates:**
  - **View All Queries:**
    - Display all user queries in a table format
    - Query information:\n      - User name and contact details
      - Query subject/topic
      - Query message/description
      - Property related to query (if applicable)
      - Date and time submitted
      - Status (New/In Progress/Resolved)
    - Search and filter queries by:
      - Status\n      - Date range
      - Property\n      - User
    - Sort queries by date, status, priority\n    - Real-time updates: New user queries appear in admin panel immediately when submitted
  
  - **Query Details View:**
    - View full query details\n    - User information and contact details
    - Query message and context
    - Related property information (if applicable)
    - Response history (if any previous responses)
  
  - **Respond to Queries:**
    - Reply to user queries directly from admin panel
    - Send response via email or SMS
    - Mark query as resolved
    - Add internal notes for admin reference
  
  - **Query Status Management:**
    - Update query status (New/In Progress/Resolved)
    - Assign queries to specific admin team members (optional)
    - Priority marking (High/Medium/Low)
  
  - **Delete Queries:**
    - Delete resolved or spam queries
    - Bulk delete functionality
\n- **Admin Panel UI/UX:**
  - Clean and professional admin interface
  - Responsive design for desktop and tablet
  - Sidebar navigation with collapsible menu
  - Top header with admin profile and logout option
  - Breadcrumb navigation
  - Data tables with pagination and sorting
  - Form validation and error messages
  - Success/error notifications for actions
  - Loading indicators for async operations
  - Confirmation dialogs for destructive actions (delete, unpublish)
  - Real-time update indicators showing when changes are published to website

- **Admin Panel Security:**
  - Secure authentication and authorization
  - Session timeout and auto-logout
  - Activity logging for admin actions
  - IP whitelisting (optional)
  - Two-factor authentication (optional)
  - Regular security audits\n
## 4. Design Requirements

### 4.1 UI/UX Style\n- Creative and modern design approach
- Smooth animations and transitions throughout the website
- Use of creative fonts and typography
- Thoughtful color scheme that reflects the brand identity
- Incorporate relevant property and accommodation-related images for enhanced visual appeal
- Consistent visual hierarchy across all sections
- Responsive design for all device sizes
- Small and minimal design for property cards in Browse by Category section
- Clear visual representation of amenities with icons throughout the website
- Consistent accommodation type badges and indicators across all property displays
- Consistent property type classification badges (For Girls/For Boys/For Family/For Bachelors/For Students) across all property displays
\n### 4.2 Design References
- Take inspiration from orooms.in\n- Take inspiration from https://www.homversity.com/
\n### 4.3 Special Animations
- Logo hanging animation: Create a string-hanging effect with subtle swinging motion for the RoomSaathi logo
- Hero section animated images with hanging hook transition effect: Images of hostels, PG accommodations, and students should appear as if hanging from a hook and smoothly change between different scenes
- Support dropdown menu with smooth transition effect when clicked
- Auto slider for property images in listing cards
- Auto slide functionality for What RoomSaathi Students Get section features
- Smooth page transitions\n- Interactive hover effects on property cards
- Animated filter and search interactions
- Scroll-triggered animations for section reveals
- Parallax effects on hero sections
- Animated statistics counters
- Smooth carousel transitions for testimonials
- Cutout design effect with hover animations for category images in Browse by Category section
- Smooth accordion animations for FAQ section
- Fade-in animations for blog post cards
- Hover effects on blog cards with image zoom
- Sticky search bar transition animation when scrolling
- Real-time search result animations
- Filter panel expand/collapse animations
- Active filter chip animations
- Smooth hover effects on Cities We Serve cards
- Interactive floor plan animations for room layout visualization
- Hover effects on room sections in floor plan
- Smooth transitions when expanding room details
- Google Map loading animation and smooth zoom transitions
- Login modal animations with smooth fade-in effect
- OTP input field animations
- Schedule Visit form animations
- Amenity icon hover effects and tooltips
- Accommodation type badge animations on property cards
- Property type classification badge animations on property cards\n- Video player loading animations and smooth transitions between media items
- Legal policy modal animations:\n  - Backdrop fade-in effect (0.3s)
  - Modal slide-down from top with bounce effect (0.5s)
  - Scale animation from 0.9 to 1.0\n  - Smooth fade-out and slide-up when closing
  - Creative transition effects for opening and closing
- Real-time content update animations:\n  - Smooth fade-in for new properties appearing on browse page
  - Subtle highlight animation for newly added blog posts
  - Notification badge animation for new content
- Owner Features Section Animations:
  - Banner transition effects for Quick Listing feature
  - Smooth fade-in and slide-in animations for banner appearance
  - Form field focus animations
  - Success message animation after form submission
  - Banner transition effects for Management Software feature
  - Carousel/slider animations for mobile app images
  - Hover effects on Access Management Software button
\n### 4.4 Images and Visual Content
- High-quality property images throughout the website
- Hero section images: hostels, PG accommodations, and students in accommodation settings
- Lifestyle images depicting accommodation experiences
- City-specific imagery for location sections
- Icons for amenities and features
- Comprehensive amenity icon set with consistent design style
- Accommodation type visual indicators and badges
- Property type classification visual indicators and badges (For Girls/For Boys/For Family/For Bachelors/For Students)
- Infographics for statistics and processes
- Background images with overlay effects where appropriate
- Category images with cutout design for Browse by Category section
- Student images for Student Information Section
- Feature-specific images for What RoomSaathi Students Get section
- Mobile app images for Owner Features section showing:\n  - In-app quick listing interface
  - Management software features and dashboard
  - Property management screens
  - Tenant management interface
  - Financial reporting screens
  - Multiple app screens in carousel format
- Blog featured images for each blog post
- Author avatars for blog posts
- Team photos for About Us section
- Office location images\n- Timeline images for Our Story section
- Testimonial photos for success stories
- High-quality city images for Cities We Serve section with consistent aspect ratios
- Room-specific images for each room type
- Floor plan visual diagrams\n- Amenity icons for room furnishings
- 360-degree room view images (if available)
- Property video content stored in database and displayed in property detail page
\n## 5. Primary Operating Locations
- Sikar\n- Jaipur
- Kota
\n## 6. Reference Files
1. Logo image: Use the uploaded logo file for branding throughout the website
2. Management Software Link: https://rosamanage.netlify.app/