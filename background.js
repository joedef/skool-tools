chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension installed');
});

chrome.action.onClicked.addListener((tab) => {
  chrome.identity.getAuthToken({interactive: true}, function(token) {
    if (chrome.runtime.lastError) {
      console.error(chrome.runtime.lastError);
      return;
    }
    fetch('https://sheets.googleapis.com/v4/spreadsheets/1DQEEC2pECKPIiw9FnhXZX9V9uGku4YtU6nKlgxTQywU/values/Sheet1!A1:D5', {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    }).then(response => response.json())
      .then(data => console.log(data))
      .catch(err => console.error(err));
  });
});