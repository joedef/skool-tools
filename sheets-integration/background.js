chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension installed');
});

chrome.action.onClicked.addListener((tab) => {
  chrome.identity.getAuthToken({interactive: true}, function(token) {
    if (chrome.runtime.lastError) {
      console.error(chrome.runtime.lastError);
      return;
    }
    fetch('https://sheets.googleapis.com/v4/spreadsheets/399031351453-8afsc1ih5cerfrpic8jbu5ljt0vl34b3.apps.googleusercontent.com/values/Sheet1!A1:D5', {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    }).then(response => response.json())
      .then(data => console.log(data))
      .catch(err => console.error(err));
  });
});