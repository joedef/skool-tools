// Check if we've already initialized
if (window.skoolCatInitialized) {
  console.log('Skool Cat script already initialized, skipping');
} else {
  console.log('Initializing Skool Cat script');
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
      console.log('Set search value');
      
      // Create and dispatch a more complete input event
      const inputEvent = new InputEvent('input', {
        bubbles: true,
        cancelable: true,
        data: "let there be cat",
        inputType: "insertText",
        composed: true
      });
      searchBar.dispatchEvent(inputEvent);
      console.log('Dispatched input event');

      // Also dispatch a change event
      const changeEvent = new Event('change', {
        bubbles: true,
        cancelable: true
      });
      searchBar.dispatchEvent(changeEvent);
      console.log('Dispatched change event');
      
      // Wait before triggering search
      setTimeout(() => {
        console.log('Triggering search');
        
        // Try to find the form
        const form = searchBar.closest('form');
        if (form) {
          console.log('Found form, attempting form submission');
          
          // Create and dispatch submit event
          const submitEvent = new Event('submit', {
            bubbles: true,
            cancelable: true
          });
          form.dispatchEvent(submitEvent);
          
          // Also try direct form submission
          form.submit();
        }

        // Try pressing Enter as well
        const enterEvent = new KeyboardEvent('keydown', {
          key: 'Enter',
          code: 'Enter',
          keyCode: 13,
          which: 13,
          bubbles: true,
          cancelable: true,
          composed: true
        });
        searchBar.dispatchEvent(enterEvent);

        // Clear the search field after a longer delay
        setTimeout(() => {
          console.log('Clearing search field');
          searchBar.value = '';
          const clearInputEvent = new Event('input', { bubbles: true });
          searchBar.dispatchEvent(clearInputEvent);
        }, 500);

        // Wait for the cat to appear and then try to activate it
        setTimeout(() => {
          console.log('Attempting to select metal music');
          
          // Create a more complete click event
          const clickEvent = new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: window,
            composed: true
          });
          
          // Try to find and click the metal music option
          const metalOption = document.querySelector('div.styled__SkoolCatOption-sc-cfkgeq-2');
          if (metalOption) {
            console.log('Found metal music option, attempting to click');
            metalOption.dispatchEvent(clickEvent);
          } else {
            console.log('Metal music option not found');
          }
        }, 1500); // Wait 1.5 seconds for the cat to appear
      }, 1000); // Wait 1 second before triggering search
      
    } catch (error) {
      console.error('Error triggering summon cat:', error);
    }
  }

  // Create the message listener
  const messageListener = function(request, sender, sendResponse) {
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

  // Store the listener reference
  window.skoolCatMessageListener = messageListener;

  // Add the message listener
  chrome.runtime.onMessage.addListener(messageListener);
  
  console.log('Skool Cat script initialization complete');
} 