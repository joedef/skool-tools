// Debug logging utility
const DEBUG = true;
function log(...args) {
  if (DEBUG) {
    console.log('%c[Skool Member Data Viewer]', 'background: #007bff; color: white; padding: 2px 4px; border-radius: 2px;', ...args);
  }
}

// Log startup
console.log('%c[Skool Member Data Viewer] Background script starting...', 'background: #007bff; color: white; padding: 2px 4px; border-radius: 2px;');

// Check if popup is open
let popupOpen = false;
chrome.runtime.onConnect.addListener(function(port) {
  if (port.name === "popup") {
    console.log('%c[Skool Member Data Viewer] Popup connected', 'background: #28a745; color: white; padding: 2px 4px; border-radius: 2px;');
    popupOpen = true;
    port.onDisconnect.addListener(function() {
      console.log('%c[Skool Member Data Viewer] Popup disconnected', 'background: #dc3545; color: white; padding: 2px 4px; border-radius: 2px;');
      popupOpen = false;
    });
  }
});

// Safe message sending function
function safeSendMessage(message) {
  return new Promise((resolve, reject) => {
    if (!popupOpen) {
      console.log('%c[Skool Member Data Viewer] Popup not open, storing message for later', 'background: #ffc107; color: black; padding: 2px 4px; border-radius: 2px;');
      // Store the message to send when popup opens
      chrome.storage.local.set({ pendingMessage: message }, () => {
        resolve();
      });
      return;
    }

    chrome.runtime.sendMessage(message, (response) => {
      if (chrome.runtime.lastError) {
        console.error('%c[Skool Member Data Viewer] Error sending message:', 'background: #dc3545; color: white; padding: 2px 4px; border-radius: 2px;', chrome.runtime.lastError);
        reject(chrome.runtime.lastError);
      } else {
        console.log('%c[Skool Member Data Viewer] Message sent successfully', 'background: #28a745; color: white; padding: 2px 4px; border-radius: 2px;');
        resolve(response);
      }
    });
  });
}

// Global variable to store all member data
let allMemberData = {
  pageProps: {
    users: [],
    totalPages: 0,
    currentPage: 0
  },
  lastUpdated: null
};

// Debounce function to prevent rapid updates
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Function to merge member data from multiple pages
function mergeMemberData(newData) {
  console.log('%c[Skool Member Data Viewer Background] Merging member data:', 'background: #17a2b8; color: white; padding: 2px 4px; border-radius: 2px;', {
    newDataTotalPages: newData?.pageProps?.totalPages,
    newDataCurrentPage: newData?.pageProps?.currentPage,
    newUsersCount: newData?.pageProps?.users?.length,
    existingUsersCount: allMemberData?.pageProps?.users?.length
  });

  if (!newData?.pageProps?.users) {
    console.log('%c[Skool Member Data Viewer Background] No users in new data', 'background: #ffc107; color: black; padding: 2px 4px; border-radius: 2px;');
    return;
  }

  // Update total pages if this is the first page
  if (newData.pageProps.currentPage === 1) {
    allMemberData.pageProps.totalPages = newData.pageProps.totalPages;
    allMemberData.pageProps.users = [];
  }

  // Process each user's metadata
  newData.pageProps.users.forEach(user => {
    // Ensure metadata exists and is an object
    if (!user.metadata) {
      user.metadata = {};
    } else if (typeof user.metadata === 'string') {
      try {
        user.metadata = JSON.parse(user.metadata);
      } catch (e) {
        console.error('%c[Skool Member Data Viewer Background] Error parsing metadata:', 'background: #dc3545; color: white; padding: 2px 4px; border-radius: 2px;', {
          userId: user.id,
          error: e.message
        });
        user.metadata = {};
      }
    }

    // Log metadata for debugging
    console.log('%c[Skool Member Data Viewer Background] User metadata:', 'background: #17a2b8; color: white; padding: 2px 4px; border-radius: 2px;', {
      userId: user.id,
      name: user.name,
      email: user.metadata?.mbme,
      lifetimeValue: user.metadata?.mbsltv,
      monthlyPayment: user.metadata?.mmbp,
      pictureProfile: user.metadata?.pictureProfile,
      pictureBubble: user.metadata?.pictureBubble,
      rawMetadata: user.metadata
    });
  });

  // Add new users to the array
  allMemberData.pageProps.users.push(...newData.pageProps.users);

  // Sort users by name
  allMemberData.pageProps.users.sort((a, b) => {
    const nameA = a.name?.toLowerCase() || '';
    const nameB = b.name?.toLowerCase() || '';
    return nameA.localeCompare(nameB);
  });

  console.log('%c[Skool Member Data Viewer Background] After merge:', 'background: #28a745; color: white; padding: 2px 4px; border-radius: 2px;', {
    totalPages: allMemberData.pageProps.totalPages,
    currentPage: newData.pageProps.currentPage,
    totalUsers: allMemberData.pageProps.users.length
  });
}

// Function to fetch all pages of member data
async function fetchAllPages(baseUrl) {
  try {
    // First, get the first page to determine total pages
    const firstPageResponse = await fetch(baseUrl, {
      credentials: 'include', // Include cookies for authentication
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!firstPageResponse.ok) {
      console.error('%c[Skool Member Data Viewer Background] Error fetching first page:', 'background: #dc3545; color: white; padding: 2px 4px; border-radius: 2px;', {
        status: firstPageResponse.status,
        statusText: firstPageResponse.statusText
      });
      return;
    }

    const firstPageData = await firstPageResponse.json();
    
    if (!firstPageData?.pageProps?.totalPages) {
      console.log('%c[Skool Member Data Viewer Background] No total pages found in first page', 'background: #dc3545; color: white; padding: 2px 4px; border-radius: 2px;');
      return;
    }

    const totalPages = firstPageData.pageProps.totalPages;
    console.log('%c[Skool Member Data Viewer Background] Found total pages:', 'background: #17a2b8; color: white; padding: 2px 4px; border-radius: 2px;', totalPages);

    // Process first page
    mergeMemberData(firstPageData);

    // Fetch remaining pages
    const pagePromises = [];
    for (let page = 2; page <= totalPages; page++) {
      // Remove any existing page parameter and add the new one
      const pageUrl = baseUrl.replace(/[?&]p=\d+/, '') + (baseUrl.includes('?') ? '&' : '?') + `p=${page}`;
      console.log('%c[Skool Member Data Viewer Background] Fetching page:', 'background: #17a2b8; color: white; padding: 2px 4px; border-radius: 2px;', page);
      
      pagePromises.push(
        fetch(pageUrl, {
          credentials: 'include', // Include cookies for authentication
          headers: {
            'Accept': 'application/json'
          }
        })
          .then(response => {
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
          })
          .then(data => {
            console.log('%c[Skool Member Data Viewer Background] Received page data:', 'background: #28a745; color: white; padding: 2px 4px; border-radius: 2px;', {
              page,
              usersCount: data?.pageProps?.users?.length
            });
            return data;
          })
          .catch(error => {
            console.error('%c[Skool Member Data Viewer Background] Error fetching page:', 'background: #dc3545; color: white; padding: 2px 4px; border-radius: 2px;', {
              page,
              error: error.message
            });
            return null;
          })
      );

      // Add a small delay between requests to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    // Wait for all pages to be fetched
    const pageResults = await Promise.all(pagePromises);
    
    // Process each page's data
    pageResults.forEach(data => {
      if (data) {
        mergeMemberData(data);
      }
    });

    // Store the complete data
    await storeAndNotify();
  } catch (error) {
    console.error('%c[Skool Member Data Viewer Background] Error in fetchAllPages:', 'background: #dc3545; color: white; padding: 2px 4px; border-radius: 2px;', error);
  }
}

// Function to store data and notify popup
const storeAndNotify = debounce(async () => {
  console.log('%c[Skool Member Data Viewer Background] Storing complete member data:', 'background: #17a2b8; color: white; padding: 2px 4px; border-radius: 2px;', {
    totalPages: allMemberData.pageProps.totalPages,
    totalUsers: allMemberData.pageProps.users.length
  });

  try {
    await chrome.storage.local.set({ memberData: allMemberData });
    console.log('%c[Skool Member Data Viewer Background] Data stored successfully', 'background: #28a745; color: white; padding: 2px 4px; border-radius: 2px;');
    
    // Notify popup of the update
    chrome.runtime.sendMessage({ type: 'dataUpdated', data: allMemberData });
  } catch (error) {
    console.error('%c[Skool Member Data Viewer Background] Error storing data:', 'background: #dc3545; color: white; padding: 2px 4px; border-radius: 2px;', error);
  }
}, 1000);

// Listen for network requests
chrome.webRequest.onCompleted.addListener(
  async function(details) {
    // Check if this is a request to the members page
    if (details.url.includes('https://www.skool.com/testers/-/members')) {
      console.log('%c[Skool Member Data Viewer] Detected members page load:', 'background: #17a2b8; color: white; padding: 2px 4px; border-radius: 2px;', {
        url: details.url,
        method: details.method,
        statusCode: details.statusCode
      });

      try {
        // Add a small delay to ensure the page has loaded
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Execute content script to extract data from the page
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
          chrome.tabs.sendMessage(tabs[0].id, {action: "getMemberData"}, function(response) {
            if (chrome.runtime.lastError) {
              console.error('%c[Skool Member Data Viewer] Error:', 'background: #dc3545; color: white; padding: 2px 4px; border-radius: 2px;', chrome.runtime.lastError);
              return;
            }

            if (response && response.data) {
              // Store the data
              chrome.storage.local.set({ memberData: response.data }, function() {
                // Notify the popup
                chrome.runtime.sendMessage({
                  type: 'dataUpdate',
                  data: response.data
                });

                console.log('%c[Skool Member Data Viewer] Data captured successfully:', 'background: #28a745; color: white; padding: 2px 4px; border-radius: 2px;', {
                  totalUsers: response.data?.pageProps?.users?.length || 0
                });
              });
            } else {
              console.error('%c[Skool Member Data Viewer] No data found in page:', 'background: #dc3545; color: white; padding: 2px 4px; border-radius: 2px;');
              chrome.runtime.sendMessage({
                type: 'dataUpdate',
                error: 'No member data found on the page. Please ensure you are on the members page.'
              });
            }
          });
        });
      } catch (error) {
        console.error('%c[Skool Member Data Viewer] Error capturing data:', 'background: #dc3545; color: white; padding: 2px 4px; border-radius: 2px;', error);
        chrome.runtime.sendMessage({
          type: 'dataUpdate',
          error: 'Failed to capture member data. Please try refreshing the page.'
        });
      }
    }
  },
  {
    urls: [
      "https://www.skool.com/testers/-/members*"
    ]
  }
);

// Listen for messages from content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'getData') {
    chrome.storage.local.get(['memberData'], function(result) {
      sendResponse(result.memberData || null);
    });
    return true;
  }
});

// Log when the background script loads
console.log('%c[Skool Member Data Viewer] Background script initialized', 'background: #28a745; color: white; padding: 2px 4px; border-radius: 2px;'); 