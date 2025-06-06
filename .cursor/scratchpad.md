# Skool Member Data Chrome Extension

## Background and Motivation
- Create a Chrome extension to intercept and display member data from Skool's API
- Target URL: https://www.skool.com/_next/data/1749157501358/testers/-/members.json
- Need to handle pagination with &p={pageNumber} parameter
- Data will be displayed in the extension popup

## Key Challenges and Analysis
1. Network Request Interception
   - Need to use Chrome's webRequest API to intercept specific network calls
   - Must handle both initial load and pagination requests
   - Need to ensure we don't interfere with normal page functionality

2. Data Management
   - Need to store and organize potentially large amounts of member data
   - Should implement efficient data structures for quick access
   - Consider using Chrome's storage API for persistence

3. UI/UX Considerations
   - Create a clean, intuitive interface for viewing member data
   - Implement search/filter functionality
   - Show loading states during data fetching
   - Handle error cases gracefully

## High-level Task Breakdown

### Phase 1: Basic Extension Setup ✓
1. Create manifest.json with necessary permissions ✓
   - [x] Add webRequest permission
   - [x] Add storage permission
   - [x] Configure popup and background scripts
   - [x] Set up content security policy

2. Create basic extension structure ✓
   - [x] Set up popup HTML/CSS
   - [x] Create background script
   - [x] Add basic styling

### Phase 2: Network Request Handling ✓
1. Implement request interception ✓
   - [x] Set up webRequest listener
   - [x] Filter for target URL pattern
   - [x] Extract and parse JSON response
   - [x] Store data in Chrome storage

2. Handle pagination ✓
   - [x] Detect pagination parameters
   - [x] Implement pagination logic
   - [x] Merge data from multiple pages

### Phase 3: Data Display ✓
1. Create data display interface ✓
   - [x] Design member list view
   - [x] Implement basic filtering
   - [x] Add search functionality
   - [x] Create detailed member view

2. Add data management features ✓
   - [x] Implement data refresh
   - [x] Add export functionality
   - [x] Create data visualization

## Data Structure Details
The member data follows this structure:
```json
{
    "users": [
        {
            "id": string,
            "name": string,
            "metadata": {
                "bio": string,
                "chatRequest": number,
                "lastOffline": number,
                "location": string,
                "pictureBubble": string,
                "pictureProfile": string,
                "spData": string, // JSON string containing points, level, etc.
                "linkFacebook": string,
                "linkInstagram": string,
                "linkLinkedin": string,
                "linkTwitter": string,
                "linkWebsite": string,
                "linkYoutube": string
            },
            "createdAt": string,
            "updatedAt": string,
            "email": string,
            "firstName": string,
            "lastName": string,
            "member": {
                "id": string,
                "metadata": {
                    "mbme": string,
                    "mbscpe": number,
                    "mbsltv": number,
                    "mmbp": string, // JSON string containing billing info
                    "msbs": string,
                    "numGenericPosts": number,
                    "numRequests": number,
                    "onPc": number,
                    "onVw": number,
                    "requestedAt": number
                },
                "createdAt": string,
                "updatedAt": string,
                "userId": string,
                "groupId": string,
                "role": string,
                "searchAnswer": string,
                "approvedAt": string,
                "lastOffline": string,
                "billingProductId": string,
                "pricing": object
            }
        }
    ]
}
```

### Phase 4: Data Processing and Display Enhancement
1. Implement Data Parsing
   - [ ] Parse nested JSON strings (spData, mmbp)
   - [ ] Format timestamps for display
   - [ ] Handle missing or null values gracefully

2. Enhanced Member Display
   - [ ] Add detailed member profile view
   - [ ] Display social media links
   - [ ] Show member statistics (points, level, etc.)
   - [ ] Add member activity timeline

3. Data Export Features
   - [ ] Export to CSV with all fields
   - [ ] Export to JSON with formatted data
   - [ ] Add selective field export

## Project Status Board
- [x] Phase 1: Basic Extension Setup
- [x] Phase 2: Network Request Handling
- [x] Phase 3: Data Display
- [ ] Phase 4: Data Processing and Display Enhancement

## Executor's Feedback or Assistance Requests
Ready to begin implementing Phase 4 tasks. Would like to confirm:
1. Should we implement all data fields in the display, or focus on specific ones?
2. What format would be most useful for data export?
3. Should we add any specific filtering or sorting capabilities for the enhanced display?

## Lessons
1. Chrome extensions require specific permissions in manifest.json for network request interception
2. Using Chrome's storage API for data persistence is more reliable than in-memory storage
3. The webRequest API requires careful URL pattern matching to avoid interfering with other requests 