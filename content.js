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

  // Function to check if cat is present
  function isCatPresent() {
    return !!document.querySelector('div.styled__SkoolCatDropdown-sc-cfkgeq-0');
  }

  // Create and manage the toggle component
  function createToggle() {
    console.log('Creating toggle component...');
    
    // Remove any existing toggle
    const existingToggle = document.getElementById('skool-cat-toggle');
    if (existingToggle) {
      console.log('Removing existing toggle');
      existingToggle.remove();
    }

    // Find the target element to position relative to
    const targetElement = document.querySelector('div[data-testid="input-component"]');
    if (!targetElement) {
      console.error('Could not find target element for toggle positioning');
      return;
    }

    // Create the toggle container
    const toggle = document.createElement('div');
    toggle.id = 'skool-cat-toggle';
    toggle.style.cssText = `
      position: absolute;
      background: white;
      border-radius: 25px;
      padding: 8px 16px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.2);
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
      transition: all 0.3s ease;
      z-index: 999999;
      font-family: Arial, sans-serif;
      font-size: 14px;
      color: #333;
      border: 1px solid #e0e0e0;
      user-select: none;
      right: -180px;
      top: 50%;
      transform: translateY(-50%);
    `;

    // Create the icon
    const icon = document.createElement('div');
    icon.style.cssText = `
      width: 24px;
      height: 24px;
      background: #f0f0f0;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
      font-size: 16px;
    `;

    // Create the text
    const text = document.createElement('span');
    text.style.cssText = `
      padding-right: 8px;
      white-space: nowrap;
    `;

    // Add hover effect
    toggle.addEventListener('mouseover', () => {
      toggle.style.transform = 'translateY(-50%) scale(1.05)';
      toggle.style.boxShadow = '0 4px 15px rgba(0,0,0,0.3)';
    });

    toggle.addEventListener('mouseout', () => {
      toggle.style.transform = 'translateY(-50%) scale(1)';
      toggle.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
    });

    // Add click handler
    toggle.addEventListener('click', () => {
      console.log('Toggle clicked, cat present:', isCatPresent());
      if (isCatPresent()) {
        triggerShooCat();
      } else {
        triggerSummonCat();
      }
    });

    // Function to update toggle state
    function updateToggleState() {
      const catPresent = isCatPresent();
      console.log('Updating toggle state, cat present:', catPresent);
      if (catPresent) {
        toggle.style.background = '#ffebee';
        icon.style.background = '#ffcdd2';
        text.textContent = 'Shoo Cat';
        icon.innerHTML = '🐱';
      } else {
        toggle.style.background = '#e8f5e9';
        icon.style.background = '#c8e6c9';
        text.textContent = 'Summon Cat';
        icon.innerHTML = '✨';
      }
    }

    // Add elements to toggle
    toggle.appendChild(icon);
    toggle.appendChild(text);

    // Create a container for the toggle
    const container = document.createElement('div');
    container.style.cssText = `
      position: relative;
      display: inline-block;
    `;

    // Add the toggle to the container
    container.appendChild(toggle);

    // Insert the container after the target element
    targetElement.parentNode.insertBefore(container, targetElement.nextSibling);

    console.log('Toggle added to document');

    // Initial state
    updateToggleState();

    // Set up observer to watch for cat presence changes with debounce
    let debounceTimer;
    const observer = new MutationObserver((mutations) => {
      // Only process mutations that might affect the cat's presence
      const relevantMutations = mutations.filter(mutation => {
        return mutation.target.classList?.contains('styled__SkoolCatDropdown-sc-cfkgeq-0') ||
               mutation.addedNodes.length > 0 ||
               mutation.removedNodes.length > 0;
      });

      if (relevantMutations.length > 0) {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
          updateToggleState();
        }, 100); // 100ms debounce
      }
    });

    // Only observe the body for changes to the cat dropdown
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class']
    });

    return toggle;
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

  // Create the toggle immediately
  console.log('Creating toggle immediately...');
  createToggle();
  
  console.log('Skool Cat script initialization complete');
} 