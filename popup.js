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

    // Inject the content script if it's not already injected
    try {
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['content.js']
      });
    } catch (err) {
      // Script might already be injected, which is fine
      console.log('Content script might already be injected');
    }

    // Send the message
    await chrome.tabs.sendMessage(tab.id, { action });
  } catch (error) {
    console.error('Error:', error);
    alert('An error occurred. Please make sure you are on skool.com and try again.');
  }
}

document.getElementById('summonCat').addEventListener('click', () => {
  sendMessageToTab('summonCat');
});

document.getElementById('shooCat').addEventListener('click', () => {
  sendMessageToTab('shooCat');
}); 