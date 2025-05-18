async function sendMessageToTab(action) {
  try {
    const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
    
    if (!tab) {
      console.error('No active tab found');
      return;
    }

    // Check if we're on skool.com
    if (!tab.url.includes('skool.com')) {
      alert('Please navigate to skool.com to use this extension');
      return;
    }

    // Function to inject content script and send message
    const injectAndSendMessage = async () => {
      try {
        // Inject the content script
        await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          files: ['content.js']
        });

        // Wait a short moment for the script to initialize
        await new Promise(resolve => setTimeout(resolve, 100));

        // Send the message
        await chrome.tabs.sendMessage(tab.id, { action });
        console.log('Message sent successfully:', action);
      } catch (error) {
        console.error('Error in injectAndSendMessage:', error);
        throw error;
      }
    };

    // Try up to 3 times with increasing delays
    let attempts = 0;
    const maxAttempts = 3;
    
    while (attempts < maxAttempts) {
      try {
        await injectAndSendMessage();
        return; // Success, exit the function
      } catch (error) {
        attempts++;
        if (attempts === maxAttempts) {
          throw error; // Rethrow if we're out of attempts
        }
        // Wait longer between each retry
        await new Promise(resolve => setTimeout(resolve, 500 * attempts));
      }
    }
  } catch (error) {
    console.error('Error:', error);
    alert('An error occurred. Please make sure you are on skool.com and try again.');
  }
}

// Add loading state to buttons
function setButtonLoading(buttonId, isLoading) {
  const button = document.getElementById(buttonId);
  if (button) {
    button.disabled = isLoading;
    button.textContent = isLoading ? 'Loading...' : buttonId === 'summonCat' ? 'Summon Cat' : 'Shoo Cat';
  }
}

document.getElementById('summonCat').addEventListener('click', async () => {
  setButtonLoading('summonCat', true);
  try {
    await sendMessageToTab('summonCat');
  } finally {
    setButtonLoading('summonCat', false);
  }
});

document.getElementById('shooCat').addEventListener('click', async () => {
  setButtonLoading('shooCat', true);
  try {
    await sendMessageToTab('shooCat');
  } finally {
    setButtonLoading('shooCat', false);
  }
}); 