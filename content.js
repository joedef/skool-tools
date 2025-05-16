function findSearchBar() {
  const searchBar = document.querySelector('input[data-testid="input-component"]');
  if (!searchBar) {
    console.error('Search bar not found on the page');
    return null;
  }
  return searchBar;
}

function triggerSearch(text) {
  const searchBar = findSearchBar();
  if (!searchBar) {
    console.error('Could not find search bar');
    return;
  }

  try {
    // Focus the search bar
    searchBar.focus();
    
    // Clear any existing value
    searchBar.value = '';
    
    // Simulate typing the text character by character
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      searchBar.value += char;
      
      // Dispatch input event for each character
      const inputEvent = new Event('input', { bubbles: true });
      searchBar.dispatchEvent(inputEvent);
    }
    
    // Small delay to ensure the input is processed
    setTimeout(() => {
      // Create and dispatch all necessary events for Enter key
      const events = [
        new KeyboardEvent('keydown', {
          key: 'Enter',
          code: 'Enter',
          keyCode: 13,
          which: 13,
          bubbles: true,
          cancelable: true
        }),
        new KeyboardEvent('keypress', {
          key: 'Enter',
          code: 'Enter',
          keyCode: 13,
          which: 13,
          bubbles: true,
          cancelable: true
        }),
        new KeyboardEvent('keyup', {
          key: 'Enter',
          code: 'Enter',
          keyCode: 13,
          which: 13,
          bubbles: true,
          cancelable: true
        })
      ];

      // Dispatch all events
      events.forEach(event => {
        searchBar.dispatchEvent(event);
      });

      // Also try submitting the form if it exists
      if (searchBar.form) {
        searchBar.form.submit();
      }

      // As a last resort, try to trigger the search by dispatching a submit event
      const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
      if (searchBar.form) {
        searchBar.form.dispatchEvent(submitEvent);
      }

      // Clear the search field immediately after pressing Enter
      setTimeout(() => {
        searchBar.value = '';
        const clearInputEvent = new Event('input', { bubbles: true });
        searchBar.dispatchEvent(clearInputEvent);
      }, 50);
      
      console.log(`Successfully triggered search with: ${text}`);
    }, 100);
    
  } catch (error) {
    console.error('Error triggering search:', error);
  }
}

function triggerShooCat() {
  const searchBar = findSearchBar();
  if (!searchBar) {
    console.error('Could not find search bar');
    return;
  }

  try {
    // Set up a one-time submit handler to prevent navigation
    if (searchBar.form) {
      const preventSubmit = (e) => {
        e.preventDefault();
        searchBar.form.removeEventListener('submit', preventSubmit);
      };
      searchBar.form.addEventListener('submit', preventSubmit, { once: true });
    }

    // Type the text
    searchBar.value = "shoo cat";
    const inputEvent = new Event('input', { bubbles: true });
    searchBar.dispatchEvent(inputEvent);

    // Press Enter
    const enterEvent = new KeyboardEvent('keydown', {
      key: 'Enter',
      code: 'Enter',
      keyCode: 13,
      which: 13,
      bubbles: true,
      cancelable: true
    });
    searchBar.dispatchEvent(enterEvent);

    // Submit the form
    if (searchBar.form) {
      searchBar.form.submit();
    }

    // Clear the search field
    setTimeout(() => {
      searchBar.value = '';
      searchBar.dispatchEvent(inputEvent);
    }, 50);
  } catch (error) {
    console.error('Error triggering shoo cat:', error);
  }
}

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Received message:', request);
  
  try {
    if (request.action === "summonCat") {
      triggerSearch("let there be cat");
    } else if (request.action === "shooCat") {
      triggerShooCat();
    }
    // Send response back to popup
    sendResponse({ success: true });
  } catch (error) {
    console.error('Error handling message:', error);
    sendResponse({ success: false, error: error.message });
  }
  
  // Return true to indicate we will send a response asynchronously
  return true;
}); 