// Tab switching
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById(`${tab.dataset.tab}-sheets`).classList.add('active');
  });
});

// Get auth token
async function getAuthToken() {
  return new Promise((resolve, reject) => {
    chrome.identity.getAuthToken({interactive: true}, function(token) {
      if (chrome.runtime.lastError) {
        console.error('Auth error:', chrome.runtime.lastError);
        reject(chrome.runtime.lastError);
        return;
      }
      if (!token) {
        console.error('No token received');
        reject(new Error('No auth token received'));
        return;
      }
      console.log('Got auth token:', token.substring(0, 10) + '...');
      resolve(token);
    });
  });
}

// Helper function to format date as MM/DD/YYYY
function formatDate(date) {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
}

// Helper function to get today's sheet name
function getTodaySheetName() {
  return `Skool Sheet ${formatDate(new Date())}`;
}

// Helper function to get storage key for today's sheet
function getTodayStorageKey() {
  return `sheet_${formatDate(new Date())}`;
}

// Get user's email
async function getUserEmail(token) {
  const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
    headers: {
      'Authorization': 'Bearer ' + token
    }
  });
  
  if (!response.ok) {
    throw new Error('Failed to get user info');
  }
  
  const data = await response.json();
  return data.email;
}

// Fetch user's spreadsheets
async function fetchSpreadsheets(token) {
  try {
    console.log('Fetching spreadsheets with token:', token.substring(0, 10) + '...');
    
    // First, verify the token is valid
    const verifyResponse = await fetch('https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=' + token);
    if (!verifyResponse.ok) {
      throw new Error('Invalid token');
    }

    // Get user's email
    const userEmail = await getUserEmail(token);
    console.log('User email:', userEmail);
    
    // Get today's sheet name
    const todaySheetName = getTodaySheetName();
    console.log('Looking for sheet:', todaySheetName);
    
    // Try to find today's sheet first
    const searchResponse = await fetch(`https://www.googleapis.com/drive/v3/files?q=mimeType='application/vnd.google-apps.spreadsheet' and name='${todaySheetName}'&fields=files(id,name,createdTime)`, {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    });

    if (searchResponse.ok) {
      const searchData = await searchResponse.json();
      if (searchData.files && searchData.files.length > 0) {
        console.log('Found existing sheet for today:', searchData.files[0]);
        return searchData.files;
      }
    }

    // If we couldn't find today's sheet, try to list all Skool Sheets
    const response = await fetch('https://www.googleapis.com/drive/v3/files?q=mimeType=\'application/vnd.google-apps.spreadsheet\' and name contains \'Skool Sheet\'&fields=files(id,name,createdTime)&orderBy=createdTime desc', {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    });

    if (!response.ok) {
      console.log('Could not list sheets, creating a new one');
      // If we can't list sheets, just create a new one
      return await createNewSheet(token, userEmail);
    }

    const data = await response.json();
    console.log('Fetched all spreadsheets:', data);

    // Check if any of the existing sheets match today's name
    if (data.files && data.files.length > 0) {
      const todaySheet = data.files.find(sheet => sheet.name === todaySheetName);
      if (todaySheet) {
        console.log('Found today\'s sheet in full list:', todaySheet);
        return [todaySheet];
      }
    }

    // If we still haven't found today's sheet, create a new one
    console.log('No existing sheet found for today, creating new one');
    return await createNewSheet(token, userEmail);
  } catch (error) {
    console.error('Error in fetchSpreadsheets:', error);
    throw error;
  }
}

// Create a new sheet
async function createNewSheet(token, userEmail) {
  const todaySheetName = getTodaySheetName();
  console.log('Creating new sheet:', todaySheetName);
  
  const createResponse = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      properties: {
        title: todaySheetName
      }
    })
  });

  if (!createResponse.ok) {
    const errorText = await createResponse.text();
    console.error('Sheets API response:', {
      status: createResponse.status,
      statusText: createResponse.statusText,
      body: errorText
    });
    throw new Error(`Failed to create sheet: ${createResponse.status} ${createResponse.statusText}`);
  }

  const newSheet = await createResponse.json();
  console.log('Created new sheet:', newSheet);

  return [{
    id: newSheet.spreadsheetId,
    name: newSheet.properties.title,
    createdTime: new Date().toISOString()
  }];
}

// Fetch sheet details
async function fetchSheetDetails(token, spreadsheetId) {
  const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}?fields=sheets.properties`, {
    headers: {
      'Authorization': 'Bearer ' + token
    }
  });

  if (!response.ok) {
    throw new Error('Failed to fetch sheet details');
  }

  const data = await response.json();
  return data.sheets;
}

// Load spreadsheets into select
async function loadSpreadsheets() {
  try {
    console.log('Starting to load spreadsheets...');
    const token = await getAuthToken();
    console.log('Got token, fetching spreadsheets...');
    
    // Get today's sheet name
    const todaySheetName = getTodaySheetName();
    console.log('Looking for today\'s sheet:', todaySheetName);
    
    // Check if we have today's sheet in storage
    const todayKey = getTodayStorageKey();
    const storedData = await new Promise(resolve => {
      chrome.storage.local.get(todayKey, resolve);
    });

    let spreadsheets = [];
    
    if (storedData[todayKey]) {
      console.log('Found today\'s sheet in storage:', storedData[todayKey]);
      spreadsheets = [storedData[todayKey]];
    } else {
      // If not in storage, create a new sheet
      console.log('No sheet found in storage, creating new one');
      spreadsheets = await createNewSheet(token);
      
      // Store the new sheet info
      await new Promise(resolve => {
        chrome.storage.local.set({ [todayKey]: spreadsheets[0] }, resolve);
      });
    }
    
    console.log('Final spreadsheets to display:', spreadsheets);
    
    const select = document.getElementById('sheetSelect');
    select.innerHTML = '';
    
    spreadsheets.forEach(sheet => {
      const option = document.createElement('option');
      option.value = sheet.id;
      option.textContent = sheet.name;
      select.appendChild(option);
    });

    // Load details for the first sheet
    if (spreadsheets.length > 0) {
      console.log('Loading details for first sheet:', spreadsheets[0].id);
      await loadSheetDetails(spreadsheets[0].id);
    }
  } catch (error) {
    console.error('Error loading spreadsheets:', error);
    showStatus(`Error loading spreadsheets: ${error.message}. Please check the console for details.`, 'error');
  }
}

// Load sheet details
async function loadSheetDetails(spreadsheetId) {
  try {
    const token = await getAuthToken();
    const sheets = await fetchSheetDetails(token, spreadsheetId);
    const userEmail = await getUserEmail(token);
    
    const detailsDiv = document.getElementById('sheetDetails');
    const infoDiv = document.getElementById('sheetInfo');
    
    if (sheets && sheets.length > 0) {
      const sheetList = sheets.map(sheet => 
        `${sheet.properties.title} (${sheet.properties.gridProperties.rowCount} rows × ${sheet.properties.gridProperties.columnCount} columns)`
      ).join('<br>');
      
      detailsDiv.innerHTML = `
        ${sheetList}
        <br><br>
        <small>Your email: ${userEmail}</small>
      `;
      infoDiv.style.display = 'block';
    } else {
      infoDiv.style.display = 'none';
    }
  } catch (error) {
    console.error('Error loading sheet details:', error);
    showStatus('Error loading sheet details: ' + error.message, 'error');
  }
}

// Create new sheet
document.getElementById('createSheet').addEventListener('click', async () => {
  try {
    const sheetName = document.getElementById('sheetName').value.trim();
    const data = document.getElementById('newData').value.trim();
    const statusDiv = document.getElementById('status');

    if (!sheetName) {
      showStatus('Please enter a sheet name', 'error');
      return;
    }

    if (!data) {
      showStatus('Please enter some data', 'error');
      return;
    }

    // Parse CSV data
    const rows = data.split('\n').map(row => row.split(',').map(cell => cell.trim()));
    
    const token = await getAuthToken();

    // Create a new spreadsheet
    const createResponse = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        properties: {
          title: sheetName
        }
      })
    });

    if (!createResponse.ok) {
      throw new Error('Failed to create spreadsheet');
    }

    const spreadsheet = await createResponse.json();
    const spreadsheetId = spreadsheet.spreadsheetId;

    // Write data to the first sheet
    const updateResponse = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Sheet1!A1:${getColumnLetter(rows[0].length)}${rows.length}?valueInputOption=RAW`, {
      method: 'PUT',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        values: rows
      })
    });

    if (!updateResponse.ok) {
      throw new Error('Failed to write data to spreadsheet');
    }

    // Get the spreadsheet URL
    const spreadsheetUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}`;
    
    showStatus(`Sheet created successfully! <a href="${spreadsheetUrl}" target="_blank">Open Sheet</a>`, 'success');
    
    // Refresh the spreadsheet list
    await loadSpreadsheets();
    
  } catch (error) {
    console.error('Error:', error);
    showStatus('Error: ' + error.message, 'error');
  }
});

// Append to existing sheet
document.getElementById('appendToSheet').addEventListener('click', async () => {
  try {
    const spreadsheetId = document.getElementById('sheetSelect').value;
    const data = document.getElementById('appendData').value.trim();

    if (!spreadsheetId) {
      showStatus('Please select a spreadsheet', 'error');
      return;
    }

    if (!data) {
      showStatus('Please enter some data to append', 'error');
      return;
    }

    // Parse CSV data
    const rows = data.split('\n').map(row => row.split(',').map(cell => cell.trim()));
    
    const token = await getAuthToken();

    // Append data to the first sheet
    const appendResponse = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Sheet1!A:${getColumnLetter(rows[0].length)}:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`, {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        values: rows
      })
    });

    if (!appendResponse.ok) {
      throw new Error('Failed to append data to spreadsheet');
    }

    showStatus('Data appended successfully!', 'success');
    
    // Clear the input
    document.getElementById('appendData').value = '';
    
    // Refresh sheet details
    await loadSheetDetails(spreadsheetId);
    
  } catch (error) {
    console.error('Error:', error);
    showStatus('Error: ' + error.message, 'error');
  }
});

// Load sheet details when selection changes
document.getElementById('sheetSelect').addEventListener('change', async (e) => {
  if (e.target.value) {
    await loadSheetDetails(e.target.value);
  }
});

// Helper functions
function showStatus(message, type) {
  const statusDiv = document.getElementById('status');
  statusDiv.innerHTML = message;
  statusDiv.className = type;
  statusDiv.style.display = 'block';
}

function getColumnLetter(columnNumber) {
  let temp, letter = '';
  while (columnNumber > 0) {
    temp = (columnNumber - 1) % 26;
    letter = String.fromCharCode(temp + 65) + letter;
    columnNumber = (columnNumber - temp - 1) / 26;
  }
  return letter;
}

// Load spreadsheets when popup opens
document.addEventListener('DOMContentLoaded', loadSpreadsheets);