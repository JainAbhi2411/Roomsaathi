# RoomSaathi Property Listing Website Requirements Document

## 1. Application Overview

### 1.1 Application Name
RoomSaathi\n
### 1.2 Application Description
RoomSaathi is a comprehensive full-stack property listing website that enables users to browse and discover various types of accommodation properties including PG, flats, apartments, rooms, and hostels. The platform features creative UI/UX with rich animations and multiple interactive sections, primarily operating in Sikar, Jaipur, and Kota cities.\n
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
\n### 2.2 Property Type Classifications
- For Girls
- For Boys
- For Family\n- For Bachelors\n- For Students

## 3. Core Features and Functionality

### 3.1 User Authentication System
- **Login with Mobile Number and OTP Verification:**
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
    - User enters mobile number
    - System sends OTP to the provided mobile number via configured SMS provider
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
\n### 3.4 Dedicated Property Browse Page
- Create a separate dedicated page for browsing all properties
- Display all property listings with preview cards
- Show property thumbnail images with auto slider functionality for multiple property images
- Display basic details and pricing on listing cards
- **Display Amenities on Property Cards:**
  - Show key amenities with icons on each property card (e.g., WiFi, AC, Parking, Meals)\n  - Display 3-5 most important amenities for quick reference
  - Use compact icon representation to maintain card design\n- **Display Accommodation Type on Property Cards:**
  - Show accommodation type badge (PG/Flat/Apartment/Room/Hostel)\n  - Display gender preference indicator (Male/Female/Co-ed)
  - Show furnishing status (Fully Furnished/Semi-Furnished/Unfurnished)
  - **Display property type classification badge (For Girls/For Boys/For Family/For Bachelors/For Students)**
- Support infinite scroll or pagination for property listings
- Provide comprehensive search and filter functionalities on this page
- Include sorting options (by price, date added, popularity, etc.)
- Display active filters with option to clear individual or all filters
- Show total count of properties matching current filters
- Quick view option for property details without leaving the browse page
- Map view toggle to see properties on an interactive map
- List/Grid view toggle for different browsing preferences
\n#### 3.4.1 Advanced Filter Options
- Comprehensive filter panel with the following options:
  - Property Type: Multi-select checkboxes for PG, Flats, Apartments, Rooms, Hostels, Short Term Stays
  - **Property Type Classification: Multi-select checkboxes for For Girls, For Boys, For Family, For Bachelors, For Students**
  - RoomSaathi Verified: Toggle filter for verified properties only
  - Price Range: Dual slider with min/max input fields for custom range selection
  - City: Dropdown selector for Sikar, Jaipur, Kota
  - Locality: Dynamic dropdown based on selected city with multi-select capability
  - Amenities: Multi-select checkboxes including:\n    - WiFi
    - AC
    - Parking
    - Laundry
    - Meals
    - Security
    - Power Backup
    - Water Supply
    - Gym
    - Common Area
  - Room Type: Single, Double, Triple, Shared
  - Gender Preference: Male, Female, Co-ed
  - Availability: Immediate, Within 1 week, Within 1 month, Custom date\n  - Furnishing: Fully Furnished, Semi-Furnished, Unfurnished
  - Property Age: New (0-1 year), Recent (1-3 years), Established (3+ years)
  - Distance from Landmark: Radius filter with slider (1km, 2km, 5km, 10km)
- Filter panel should be collapsible/expandable with smooth animation
- Display active filter count badge\n- Clear All Filters button prominently displayed
- Apply Filters button for mobile view
- Save Filter Preset option for future use
\n#### 3.4.2 Real-Time Search Functionality
- Instant search results as user types in search bar
- Search across multiple parameters:\n  - Property name
  - Locality name
  - Landmark names
  - Property features
  - Amenities\n  - Property type classifications (For Girls, For Boys, For Family, For Bachelors, For Students)
- Display search suggestions dropdown with autocomplete
- Highlight matching text in search results
- Show recent searches for quick access
- Display search result count in real-time
- Debounced search to optimize performance
- Clear search button (X icon) in search bar
- Search history with option to clear

#### 3.4.3 Sticky Search Bar on Scroll
- Search bar becomes sticky and fixed to top of page when user scrolls down
- Smooth transition animation when search bar becomes sticky
- Compact sticky version with essential search and filter controls
- Maintains full functionality in sticky mode
- Quick filter chips displayed in sticky bar for active filters
- Expand button to show full filter panel from sticky bar
- Sticky bar should have subtle shadow for depth perception
- Responsive behavior: on mobile, sticky bar should be optimized for smaller screens

#### 3.4.4 Contextual Filtering Throughout Navigation
- Enable filtering and browsing from any section of the main screen
- When user selects a category from Browse by Category section, automatically navigate to Browse Property page with that category pre-filtered
- When user selects a city from Cities We Serve section, navigate to Browse Property page with that city pre-selected
- When user clicks on a locality from Popular Localities section, navigate to Browse Property page with that locality pre-filtered
- When user clicks RoomSaathi Verified from navigation, navigate to Browse Property page with verified filter applied
- **When user selects a property type classification (For Girls/For Boys/For Family/For Bachelors/For Students), navigate to Browse Property page with that classification pre-filtered**
- Preserve filter context when navigating back from property detail page
- URL parameters should reflect active filters for shareable links
- Breadcrumb navigation showing active filter path
- Smooth transition animations when applying contextual filters

#### 3.4.5 Perfect Search on Each Parameter
- Property Type Search: Exact match and partial match support
- **Property Type Classification Search: Exact match for For Girls, For Boys, For Family, For Bachelors, For Students**
- Location Search: City, locality, and landmark-based search with fuzzy matching
- Price Search: Range-based search with flexible min/max inputs
- Amenities Search: Multi-criteria matching (AND/OR logic options)
- Keyword Search: Full-text search across property descriptions
- Combined Search: Support for multiple simultaneous search parameters
- Search ranking algorithm prioritizing:\n  - Exact matches
  - RoomSaathi Verified properties\n  - Recently added properties
  - Properties with complete information
- Search result sorting options:
  - Relevance (default)
  - Price: Low to High
  - Price: High to Low
  - Newest First
  - Most Popular
  - Distance (when location is specified)
- No results found state with suggestions:\n  - Relax some filters\n  - Try different keywords
  - Browse all properties
  - Contact support for assistance

### 3.5 Browse by Category Section
- Split layout design with left and right sections
- Left side:\n  - Display category images with cutout design effect
  - Implement hover effects on category images
  - Show category icons for selection
  - Categories include: PG, Flats, Apartments, Rooms, Hostels, RoomSaathi Verified, Short Term Stays
  - **Add property type classification options: For Girls, For Boys, For Family, For Bachelors, For Students**
  - On category click, navigate to Browse Property page with selected category pre-filtered
- Right side:\n  - Display property cards with small and minimal design
  - **Show amenities icons on property cards** (3-5 key amenities)
  - **Display accommodation type badge** on each property card
  - **Display property type classification badge** (For Girls/For Boys/For Family/For Bachelors/For Students)
  - Arrange property cards in column-wise layout
  - Enable vertical scrolling for property cards within the column
  - Update property cards dynamically based on category selection from left side
\n### 3.6 Student Information Section
- Split layout design with left and right sections\n- Left side:
  - Display informational content about RoomSaathi services for students
  - Include text describing benefits and features
- Right side:
  - Display images of students in accommodation settings
  - Show student lifestyle and accommodation experiences
\n### 3.7 What RoomSaathi Students Get Section
- Split layout design with left and right sections\n- Left side:
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
\n### 3.8 Search and Filter System (on Browse Page)
- City Selector: Dropdown menu with options for Sikar, Jaipur, and Kota
- Locality Selector: Dropdown menu for specific localities within selected city
- Filter by property type (PG, Flat, Apartment, Room, Hostel, Short Term Stays)
- **Filter by property type classification (For Girls, For Boys, For Family, For Bachelors, For Students)**
- Filter by RoomSaathi Verified properties
- Filter by price range with slider or input fields
- Filter by amenities with checkbox options
- **Filter by accommodation type** (PG/Flat/Apartment/Room/Hostel)\n- **Filter by gender preference** (Male/Female/Co-ed)
- **Filter by furnishing status** (Fully Furnished/Semi-Furnished/Unfurnished)
- Search by property name or keywords with autocomplete
- Advanced search options with multiple criteria
- Save search preferences for future visits
- Recent searches display\n\n### 3.9 Property Detail Page
Each property should display complete information with the following advanced layout:
\n**Left Side:**
- Property images gallery with multiple high-quality images
- Image slider/carousel functionality\n- Thumbnail navigation for quick image browsing
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
  - **Property type classification (For Girls/For Boys/For Family/For Bachelors/For Students)**\n  - RoomSaathi Verified badge (if applicable)
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
  - Gender preference (Male/Female/Co-ed)\n  - Furnishing status (Fully Furnished/Semi-Furnished/Unfurnished)
  - Property age (New/Recent/Established)
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
    - Power Backup\n    - Water Supply (24/7)
    - Gym/Fitness Center
    - Common Area/Lounge
    - TV/Entertainment
    - Refrigerator
    - Microwave/Kitchen Access
    - Washing Machine\n    - Geyser/Hot Water
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
    - Room type (Single/Double/Triple/Shared)
    - Total seats in the room
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
  - **Show amenities and accommodation type on similar property cards**
  - **Display property type classification badge on similar property cards**
  - Quick navigation to similar property detail pages
\n### 3.10 User Actions\n- Login with mobile number and OTP verification
- Browse all properties on dedicated browse page
- View detailed property information including room details and images
- **Watch property videos in the property detail page**
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
- Filter properties by amenities, accommodation type, and property type classification\n\n### 3.11 Property Comparison
- Allow users to select multiple properties for side-by-side comparison
- Compare key features, amenities, pricing, and locations
- **Include accommodation type comparison** (furnishing, gender preference, property age)
- **Include property type classification comparison** (For Girls/For Boys/For Family/For Bachelors/For Students)
- **Display amenities comparison** with visual indicators for available/not available
- Visual comparison interface with clear distinctions\n\n### 3.12 Reviews and Ratings
- Display user reviews and ratings for properties
- Show overall rating scores\n- Filter reviews by rating level\n- Display review highlights\n\n### 3.13 Featured Properties Section
- Showcase premium or featured listings
- Highlight RoomSaathi Verified properties\n- **Display key amenities on featured property cards**
- **Show accommodation type badges on featured properties**
- **Display property type classification badges on featured properties**
\n### 3.14 Cities We Serve Section
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

### 3.17 Why Choose RoomSaathi Section
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
- Feature 1: In-App Quick Listing
  - Description of quick listing functionality
  - Mobile app images showing the quick listing interface
- Feature 2: Listing with Management Software
  - Description of management software capabilities
  - Mobile app images demonstrating management software features
- Additional owner features with relevant descriptions and visual demonstrations
- Use split layout or card-based design to present features effectively

### 3.22 Blog Section
- Create a dedicated blog page with complete blog functionality
- Blog Listing Page:
  - Display blog posts in a grid or card layout
  - Each blog card should include:
    - Featured image
    - Blog title\n    - Brief excerpt or summary
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
  - RoomSaathi Verified Properties
  - For Property Owners
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
  - Click outside modal (on backdrop) to close
  - Press ESC key to close modal
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
  - **Terms and Conditions:** General terms of use, user obligations, platform rules\n  - **Service Terms:** Service-specific terms, usage guidelines, limitations
  - **Privacy Policy:** Data collection, usage, storage, and protection practices
  - **Guest Refund Policy:** Refund eligibility, process, timelines, and conditions
  - **Non Discrimination Policy:** Equal opportunity statement, anti-discrimination commitment
  - **Booking Policy:** Booking process, confirmation, modifications, and cancellations
\n## 4. Design Requirements

### 4.1 UI/UX Style\n- Creative and modern design approach
- Smooth animations and transitions throughout the website
- Use of creative fonts and typography
- Thoughtful color scheme that reflects the brand identity
- Incorporate relevant property and accommodation-related images for enhanced visual appeal
- Consistent visual hierarchy across all sections
- Responsive design for all device sizes
- Small and minimal design for property cards in Browse by Category section
- **Clear visual representation of amenities with icons throughout the website**
- **Consistent accommodation type badges and indicators across all property displays**
- **Consistent property type classification badges (For Girls/For Boys/For Family/For Bachelors/For Students) across all property displays**
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
- OTP input field animations\n- Schedule Visit form animations
- **Amenity icon hover effects and tooltips**
- **Accommodation type badge animations on property cards**
- **Property type classification badge animations on property cards**
- **Video player loading animations and smooth transitions between media items**
- **Legal policy modal animations:**
  - Backdrop fade-in effect (0.3s)\n  - Modal slide-down from top with bounce effect (0.5s)
  - Scale animation from 0.9 to 1.0\n  - Smooth fade-out and slide-up when closing
  - Creative transition effects for opening and closing

### 4.4 Images and Visual Content
- High-quality property images throughout the website
- Hero section images: hostels, PG accommodations, and students in accommodation settings
- Lifestyle images depicting accommodation experiences
- City-specific imagery for location sections
- Icons for amenities and features
- **Comprehensive amenity icon set with consistent design style**
- **Accommodation type visual indicators and badges**
- **Property type classification visual indicators and badges (For Girls/For Boys/For Family/For Bachelors/For Students)**
- Infographics for statistics and processes
- Background images with overlay effects where appropriate
- Category images with cutout design for Browse by Category section
- Student images for Student Information Section
- Feature-specific images for What RoomSaathi Students Get section
- Mobile app images for Owner Features section showing in-app quick listing and management software interfaces
- Blog featured images for each blog post
- Author avatars for blog posts
- Team photos for About Us section
- Office location images\n- Timeline images for Our Story section
- Testimonial photos for success stories
- High-quality city images for Cities We Serve section with consistent aspect ratios
- Room-specific images for each room type
- Floor plan visual diagrams\n- Amenity icons for room furnishings
- 360-degree room view images (if available)
- **Property video content stored in database and displayed in property detail page**
\n## 5. Primary Operating Locations
- Sikar\n- Jaipur
- Kota

## 6. Reference Files
1. Logo image: Use the uploaded logo file for branding throughout the website