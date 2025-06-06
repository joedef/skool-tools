# Skool Member Data Viewer Chrome Extension

A Chrome extension that intercepts and displays member data from Skool's API.

## Features

- Automatically intercepts member data from Skool's API
- Displays member information in a clean, modern interface
- Search functionality to filter members
- Real-time updates when new data is available
- Manual refresh option

## Installation

1. Clone or download this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right corner
4. Click "Load unpacked" and select the extension directory

## Usage

1. Navigate to `www.skool.com/testers/-/members`
2. Click the extension icon in your Chrome toolbar
3. The extension will automatically capture and display member data
4. Use the search box to filter members by name or email
5. Click the "Refresh Data" button to manually update the data

## Development

The extension consists of the following files:

- `manifest.json`: Extension configuration
- `background.js`: Handles network request interception
- `popup.html`: Extension popup interface
- `popup.js`: Popup functionality
- `icons/`: Extension icons

## Permissions

The extension requires the following permissions:

- `webRequest`: To intercept network requests
- `storage`: To store member data
- `activeTab`: To interact with the current tab

## License

MIT License 