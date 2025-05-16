// Check if we've already initialized
if (window.skoolCatInitialized) {
  console.log('Skool Cat script already initialized, skipping');
} else {
  window.skoolCatInitialized = true;

  function findSearchBar() {
    const searchBar = document.querySelector('input[data-testid="input-component"]');
    if (!searchBar) {
      console.error('Search bar not found on the page');
      return null;
    }
    return searchBar;
  }

  function triggerShooCat() {
    const searchBar = findSearchBar();
    if (!searchBar) {
      console.error('Could not find search bar');
      return;
    }

    try {
      console.log('Starting shoo cat trigger');
      
      // Focus the search bar
      searchBar.focus();
      console.log('Search bar focused');
      
      // Clear any existing value
      searchBar.value = '';
      
      // Set the value directly
      searchBar.value = "shoo cat";
      
      // Dispatch input event
      const inputEvent = new Event('input', { bubbles: true });
      searchBar.dispatchEvent(inputEvent);
      console.log('Dispatched input event');
      
      // Small delay to ensure the input is processed
      setTimeout(() => {
        console.log('Triggering search');
        
        // Try to find the form
        const form = searchBar.closest('form');
        if (form) {
          // Create and dispatch submit event
          const submitEvent = new Event('submit', {
            bubbles: true,
            cancelable: true
          });
          form.dispatchEvent(submitEvent);
          
          // Also try direct form submission
          form.submit();
        }

        // Also try pressing Enter as a fallback
        const enterEvent = new KeyboardEvent('keydown', {
          key: 'Enter',
          code: 'Enter',
          keyCode: 13,
          which: 13,
          bubbles: true,
          cancelable: true
        });
        searchBar.dispatchEvent(enterEvent);

        // Clear the search field after submission
        setTimeout(() => {
          console.log('Clearing search field');
          searchBar.value = '';
          searchBar.dispatchEvent(inputEvent);
        }, 100);
        
        console.log('Successfully triggered shoo cat');
      }, 100);
      
    } catch (error) {
      console.error('Error triggering shoo cat:', error);
    }
  }

  function triggerSummonCat() {
    const searchBar = findSearchBar();
    if (!searchBar) {
      console.error('Could not find search bar');
      return;
    }

    try {
      console.log('Starting summon cat trigger');
      
      // Focus the search bar
      searchBar.focus();
      console.log('Search bar focused');
      
      // Clear any existing value
      searchBar.value = '';
      
      // Set the value directly
      searchBar.value = "let there be cat";
      
      // Dispatch input event
      const inputEvent = new Event('input', { bubbles: true });
      searchBar.dispatchEvent(inputEvent);
      console.log('Dispatched input event');
      
      // Small delay to ensure the input is processed
      setTimeout(() => {
        console.log('Triggering search');
        
        // Try to find the form
        const form = searchBar.closest('form');
        if (form) {
          // Create and dispatch submit event
          const submitEvent = new Event('submit', {
            bubbles: true,
            cancelable: true
          });
          form.dispatchEvent(submitEvent);
          
          // Also try direct form submission
          form.submit();
        }

        // Also try pressing Enter as a fallback
        const enterEvent = new KeyboardEvent('keydown', {
          key: 'Enter',
          code: 'Enter',
          keyCode: 13,
          which: 13,
          bubbles: true,
          cancelable: true
        });
        searchBar.dispatchEvent(enterEvent);

        // Clear the search field after submission
        setTimeout(() => {
          console.log('Clearing search field');
          searchBar.value = '';
          searchBar.dispatchEvent(inputEvent);
        }, 100);
        
        console.log('Successfully triggered summon cat');
      }, 100);
      
    } catch (error) {
      console.error('Error triggering summon cat:', error);
    }
  }

  // Remove any existing message listeners
  if (window.skoolCatMessageListener) {
    chrome.runtime.onMessage.removeListener(window.skoolCatMessageListener);
  }

  // Create and store the message listener
  window.skoolCatMessageListener = function(request, sender, sendResponse) {
    console.log('Received message:', request);
    
    try {
      if (request.action === "summonCat") {
        console.log('Triggering summon cat');
        triggerSummonCat();
      } else if (request.action === "shooCat") {
        console.log('Triggering shoo cat');
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
  };

  // Add the message listener
  chrome.runtime.onMessage.addListener(window.skoolCatMessageListener);
} 