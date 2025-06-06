// Function to extract data from the page
function extractMemberData() {
  try {
    // Method 1: Look for __NEXT_DATA__
    const nextDataScript = document.getElementById('__NEXT_DATA__');
    if (nextDataScript) {
      const nextData = JSON.parse(nextDataScript.textContent);
      if (nextData.props?.pageProps?.users) {
        return nextData.props;
      }
    }

    // Method 2: Look for window.__INITIAL_STATE__
    const scripts = document.getElementsByTagName('script');
    for (const script of scripts) {
      if (script.textContent.includes('window.__INITIAL_STATE__')) {
        const match = script.textContent.match(/window\.__INITIAL_STATE__\s*=\s*({.*?});/s);
        if (match) {
          const state = JSON.parse(match[1]);
          if (state.pageProps?.users) {
            return state;
          }
        }
      }
    }

    // Method 3: Look for data in the page content
    const memberElements = document.querySelectorAll('[data-member-id]');
    if (memberElements.length > 0) {
      const users = Array.from(memberElements).map(el => {
        const memberId = el.getAttribute('data-member-id');
        const name = el.querySelector('.member-name')?.textContent;
        const bio = el.querySelector('.member-bio')?.textContent;
        const location = el.querySelector('.member-location')?.textContent;
        return { id: memberId, name, bio, location };
      });
      return { pageProps: { users } };
    }

    return null;
  } catch (error) {
    console.error('%c[Skool Member Data Viewer Content] Error extracting data:', 'background: #dc3545; color: white; padding: 2px 4px; border-radius: 2px;', error);
    return null;
  }
}

// Function to wait for data to be available
function waitForData(maxAttempts = 10, interval = 1000) {
  return new Promise((resolve, reject) => {
    let attempts = 0;
    
    const checkData = () => {
      attempts++;
      const data = extractMemberData();
      
      if (data) {
        console.log('%c[Skool Member Data Viewer Content] Found member data:', 'background: #28a745; color: white; padding: 2px 4px; border-radius: 2px;', {
          totalUsers: data.pageProps?.users?.length || 0,
          attempt: attempts
        });
        resolve(data);
      } else if (attempts >= maxAttempts) {
        console.error('%c[Skool Member Data Viewer Content] No data found after maximum attempts:', 'background: #dc3545; color: white; padding: 2px 4px; border-radius: 2px;', {
          attempts,
          interval
        });
        reject(new Error('No data found after maximum attempts'));
      } else {
        setTimeout(checkData, interval);
      }
    };
    
    checkData();
  });
}

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "getMemberData") {
    console.log('%c[Skool Member Data Viewer Content] Received request for member data', 'background: #17a2b8; color: white; padding: 2px 4px; border-radius: 2px;');
    
    // Wait for data to be available
    waitForData()
      .then(data => {
        console.log('%c[Skool Member Data Viewer Content] Sending data to background:', 'background: #28a745; color: white; padding: 2px 4px; border-radius: 2px;', {
          totalUsers: data.pageProps?.users?.length || 0
        });
        sendResponse({ data });
      })
      .catch(error => {
        console.error('%c[Skool Member Data Viewer Content] Error:', 'background: #dc3545; color: white; padding: 2px 4px; border-radius: 2px;', error);
        sendResponse({ error: 'Failed to extract member data from page' });
      });
    
    return true; // Keep the message channel open for the async response
  }
}); 