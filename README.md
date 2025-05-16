# Skool Cat Toggle Chrome Extension

A simple Chrome extension that allows you to toggle the Skool cat on and off using the search bar.

## Installation

1. Download or clone this repository
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode" in the top right corner
4. Click "Load unpacked" and select the directory containing these files

## Usage

1. Click the extension icon in your Chrome toolbar
2. Use the "Summon Cat" button to show the cat
3. Use the "Shoo Cat" button to hide the cat

## How it Works

The extension interacts with Skool's search bar to:
- Show the cat by entering "let there be cat"
- Hide the cat by entering "shoo cat"

## Files

- `manifest.json`: Extension configuration
- `popup.html`: Extension popup interface
- `popup.js`: Popup button handlers
- `content.js`: Main functionality for interacting with Skool's website
