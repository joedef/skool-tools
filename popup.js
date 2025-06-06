// Debug logging utility
const DEBUG = true;
function log(...args) {
  if (DEBUG) {
    console.log('%c[Skool Member Data Viewer Popup]', 'background: #6f42c1; color: white; padding: 2px 4px; border-radius: 2px;', ...args);
  }
}

// Log startup
console.log('%c[Skool Member Data Viewer Popup] Script starting...', 'background: #6f42c1; color: white; padding: 2px 4px; border-radius: 2px;');

// DOM Elements
const memberList = document.getElementById('memberList');
const searchInput = document.getElementById('searchInput');
const refreshBtn = document.getElementById('refreshBtn');
const lastUpdated = document.getElementById('lastUpdated');

// State
let memberData = null;
let port = null;

// Modal handling
let currentMember = null;

// Add these variables at the top with other state variables
let currentSort = 'name-asc';
let currentFilter = 'all';

// Initialize connection with background script
function initializeConnection() {
  console.log('%c[Skool Member Data Viewer Popup] Initializing connection with background script', 'background: #6f42c1; color: white; padding: 2px 4px; border-radius: 2px;');
  port = chrome.runtime.connect({ name: "popup" });
  
  port.onDisconnect.addListener(() => {
    console.log('%c[Skool Member Data Viewer Popup] Disconnected from background script', 'background: #dc3545; color: white; padding: 2px 4px; border-radius: 2px;');
    port = null;
  });
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
  console.log('%c[Skool Member Data Viewer Popup] Initializing event listeners', 'background: #17a2b8; color: white; padding: 2px 4px; border-radius: 2px;');
  
  // Search input handler
  const searchInput = document.getElementById('searchInput');
  searchInput.addEventListener('input', function() {
    console.log('%c[Skool Member Data Viewer Popup] Search input changed:', 'background: #17a2b8; color: white; padding: 2px 4px; border-radius: 2px;', this.value);
    renderMemberList();
  });

  // Modal close button handler
  const modalClose = document.getElementById('modalClose');
  modalClose.addEventListener('click', function() {
    console.log('%c[Skool Member Data Viewer Popup] Closing modal', 'background: #17a2b8; color: white; padding: 2px 4px; border-radius: 2px;');
    closeMemberModal();
  });

  // Close modal when clicking outside
  const modalOverlay = document.getElementById('memberModal');
  modalOverlay.addEventListener('click', function(event) {
    if (event.target === modalOverlay) {
      console.log('%c[Skool Member Data Viewer Popup] Closing modal (outside click)', 'background: #17a2b8; color: white; padding: 2px 4px; border-radius: 2px;');
      closeMemberModal();
    }
  });

  // Initialize connection with background script
  chrome.runtime.sendMessage({ type: 'getData' }, (response) => {
    console.log('%c[Skool Member Data Viewer Popup] Received response from background:', 'background: #17a2b8; color: white; padding: 2px 4px; border-radius: 2px;', response);
    
    if (chrome.runtime.lastError) {
      console.error('%c[Skool Member Data Viewer Popup] Error receiving data:', 'background: #dc3545; color: white; padding: 2px 4px; border-radius: 2px;', chrome.runtime.lastError);
      showError('Error communicating with extension: ' + chrome.runtime.lastError.message);
      return;
    }

    if (!response) {
      console.log('%c[Skool Member Data Viewer Popup] No data available yet', 'background: #ffc107; color: black; padding: 2px 4px; border-radius: 2px;');
      showError('No member data available yet. Please visit the members page first.');
      return;
    }

    memberData = response;
    console.log('%c[Skool Member Data Viewer Popup] Data loaded:', 'background: #28a745; color: white; padding: 2px 4px; border-radius: 2px;', {
      hasData: !!memberData,
      totalPages: memberData?.pageProps?.totalPages,
      totalUsers: memberData?.pageProps?.users?.length
    });
    renderMemberList();
  });

  // Add sort select listener
  const sortSelect = document.getElementById('sortSelect');
  sortSelect.addEventListener('change', (e) => {
    currentSort = e.target.value;
    renderMemberList();
  });

  // Add filter button listeners
  const filterButtons = document.querySelectorAll('.filter-button');
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Update active state
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      
      // Update filter and re-render
      currentFilter = button.dataset.filter;
      renderMemberList();
    });
  });
});

// Load data from storage
function loadData() {
  console.log('%c[Skool Member Data Viewer Popup] Requesting data from background script...', 'background: #6f42c1; color: white; padding: 2px 4px; border-radius: 2px;');
  chrome.runtime.sendMessage({ type: 'getData' }, (response) => {
    console.log('%c[Skool Member Data Viewer Popup] Received response from background:', 'background: #17a2b8; color: white; padding: 2px 4px; border-radius: 2px;', response);
    
    if (chrome.runtime.lastError) {
      console.error('%c[Skool Member Data Viewer Popup] Error receiving data:', 'background: #dc3545; color: white; padding: 2px 4px; border-radius: 2px;', chrome.runtime.lastError);
      showError('Error communicating with extension: ' + chrome.runtime.lastError.message);
      return;
    }

    if (!response) {
      console.log('%c[Skool Member Data Viewer Popup] No data available yet', 'background: #ffc107; color: black; padding: 2px 4px; border-radius: 2px;');
      showError('No member data available yet. Please visit the members page first.');
      return;
    }

    memberData = response;
    console.log('%c[Skool Member Data Viewer Popup] Data loaded:', 'background: #28a745; color: white; padding: 2px 4px; border-radius: 2px;', {
      hasData: !!memberData,
      totalPages: memberData?.pageProps?.totalPages,
      totalUsers: memberData?.pageProps?.users?.length
    });
    renderMemberList();
  });
}

// Show error message
function showError(message) {
  console.error('%c[Skool Member Data Viewer Popup] Showing error:', 'background: #dc3545; color: white; padding: 2px 4px; border-radius: 2px;', message);
  memberList.innerHTML = `
    <div class="error-message">
      <div class="error-icon">⚠️</div>
      <div class="error-text">${message}</div>
      <button class="retry-button" id="errorRetryButton">Retry</button>
    </div>
  `;
  // Add event listener to the retry button
  document.getElementById('errorRetryButton')?.addEventListener('click', loadData);
}

// Handle data updates
function handleDataUpdate(data) {
  console.log('%c[Skool Member Data Viewer Popup] Data received from background:', 'background: #28a745; color: white; padding: 2px 4px; border-radius: 2px;', data);
  
  // Log the full data structure for debugging
  console.log('%c[Skool Member Data Viewer Popup] Full data structure:', 'background: #17a2b8; color: white; padding: 2px 4px; border-radius: 2px;', {
    hasData: !!data,
    dataType: typeof data,
    isObject: data instanceof Object,
    keys: data ? Object.keys(data) : []
  });

  if (data?.error) {
    console.error('%c[Skool Member Data Viewer Popup] Error in data:', 'background: #dc3545; color: white; padding: 2px 4px; border-radius: 2px;', data.error);
    showError(data.error);
    return;
  }

  // Update timestamp if available
  if (data?.timestamp) {
    const date = new Date(data.timestamp);
    console.log('%c[Skool Member Data Viewer Popup] Updated timestamp:', 'background: #28a745; color: white; padding: 2px 4px; border-radius: 2px;', date.toLocaleString());
    lastUpdated.textContent = `Last updated: ${date.toLocaleString()}`;
  }

  // Display all data
  displayAllData(data);
}

// Display all received data
function displayAllData(data) {
  if (!data) {
    memberList.innerHTML = `
      <div class="no-data-message">
        <div class="no-data-icon">📭</div>
        <div class="no-data-title">No Data Available</div>
        <div class="no-data-description">
          No data has been received from the background script.
        </div>
        <button class="retry-button" id="retryButton">Try Again</button>
      </div>
    `;
    // Add event listener to the retry button
    document.getElementById('retryButton')?.addEventListener('click', loadData);
    return;
  }

  // Create a formatted display of all data
  const formattedData = Object.entries(data).map(([key, value]) => {
    let displayValue = value;
    if (typeof value === 'object' && value !== null) {
      try {
        displayValue = JSON.stringify(value, null, 2);
      } catch (e) {
        displayValue = '[Complex Object]';
      }
    }
    return `
      <div class="data-item">
        <div class="data-key">${key}</div>
        <pre class="data-value">${displayValue}</pre>
      </div>
    `;
  }).join('');

  memberList.innerHTML = `
    <div class="data-container">
      <div class="data-header">Raw Data from Background Script</div>
      ${formattedData}
    </div>
  `;
}

// Set up event listeners
function setupEventListeners() {
  console.log('%c[Skool Member Data Viewer Popup] Setting up event listeners', 'background: #6f42c1; color: white; padding: 2px 4px; border-radius: 2px;');
  
  const searchInput = document.getElementById('searchInput');
  const refreshButton = document.getElementById('refreshButton');
  
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      console.log('%c[Skool Member Data Viewer Popup] Search input changed:', 'background: #6f42c1; color: white; padding: 2px 4px; border-radius: 2px;', e.target.value);
      renderMemberList(e.target.value);
    });
  } else {
    console.error('%c[Skool Member Data Viewer Popup] Search input element not found', 'background: #dc3545; color: white; padding: 2px 4px; border-radius: 2px;');
  }

  if (refreshButton) {
    refreshButton.addEventListener('click', () => {
      console.log('%c[Skool Member Data Viewer Popup] Manual refresh requested', 'background: #6f42c1; color: white; padding: 2px 4px; border-radius: 2px;');
      loadData();
    });
  } else {
    console.error('%c[Skool Member Data Viewer Popup] Refresh button element not found', 'background: #dc3545; color: white; padding: 2px 4px; border-radius: 2px;');
  }

  // Add modal close button listener
  document.getElementById('modalClose').addEventListener('click', closeMemberModal);

  // Add click outside modal to close
  document.getElementById('memberModal').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) {
      closeMemberModal();
    }
  });

  // Add click handler to member items
  document.getElementById('memberList').addEventListener('click', (e) => {
    const memberItem = e.target.closest('.member-item');
    if (memberItem) {
      const memberId = memberItem.dataset.memberId;
      const member = memberData.pageProps?.users?.find(m => m.id === memberId);
      if (member) {
        showMemberModal(member);
      }
    }
  });
}

// Update last updated timestamp
function updateLastUpdated(timestamp) {
  if (timestamp) {
    const date = new Date(timestamp);
    lastUpdated.textContent = `Last updated: ${date.toLocaleString()}`;
    console.log('%c[Skool Member Data Viewer Popup] Updated timestamp:', 'background: #6f42c1; color: white; padding: 2px 4px; border-radius: 2px;', date.toLocaleString());
  }
}

// Utility functions for data parsing
function parseNestedJson(jsonString, defaultValue = {}) {
  if (!jsonString) return defaultValue;
  try {
    return JSON.parse(jsonString);
  } catch (e) {
    console.error('Error parsing JSON string:', e);
    return defaultValue;
  }
}

function formatTimestamp(timestamp) {
  if (!timestamp) return 'N/A';
  try {
    // Handle both ISO string and Unix timestamp formats
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) {
      // If it's a Unix timestamp in nanoseconds, convert to milliseconds
      const milliseconds = Math.floor(Number(timestamp) / 1000000);
      return new Date(milliseconds).toLocaleString();
    }
    return date.toLocaleString();
  } catch (e) {
    console.error('Error formatting timestamp:', e);
    return 'Invalid date';
  }
}

function formatSocialLinks(metadata) {
  if (!metadata) return '';
  
  const links = [];
  if (metadata.linkWebsite) links.push(`<a href="${metadata.linkWebsite}" target="_blank" class="social-link">Website</a>`);
  if (metadata.linkTwitter) links.push(`<a href="${metadata.linkTwitter}" target="_blank" class="social-link">Twitter</a>`);
  if (metadata.linkInstagram) links.push(`<a href="${metadata.linkInstagram}" target="_blank" class="social-link">Instagram</a>`);
  if (metadata.linkLinkedin) links.push(`<a href="${metadata.linkLinkedin}" target="_blank" class="social-link">LinkedIn</a>`);
  if (metadata.linkYoutube) links.push(`<a href="${metadata.linkYoutube}" target="_blank" class="social-link">YouTube</a>`);
  if (metadata.linkFacebook) links.push(`<a href="${metadata.linkFacebook}" target="_blank" class="social-link">Facebook</a>`);
  
  return links.length > 0 ? `<div class="social-links">${links.join('')}</div>` : '';
}

// Add these functions after the existing utility functions
function sortMembers(members, sortBy) {
  return [...members].sort((a, b) => {
    const [field, direction] = sortBy.split('-');
    const multiplier = direction === 'asc' ? 1 : -1;

    switch (field) {
      case 'name':
        return multiplier * (a.name || '').localeCompare(b.name || '');
      
      case 'lifetime':
        const aValue = Number(a.member?.metadata?.mbsltv || 0);
        const bValue = Number(b.member?.metadata?.mbsltv || 0);
        return multiplier * (aValue - bValue);
      
      case 'points':
        const aPoints = Number(parseNestedJson(a.metadata?.spData)?.pts || 0);
        const bPoints = Number(parseNestedJson(b.metadata?.spData)?.pts || 0);
        return multiplier * (aPoints - bPoints);
      
      case 'level':
        const aLevel = Number(parseNestedJson(a.metadata?.spData)?.lv || 0);
        const bLevel = Number(parseNestedJson(b.metadata?.spData)?.lv || 0);
        return multiplier * (aLevel - bLevel);
      
      case 'joined':
        // For recently joined, filter to last 7 days first
        if (direction === 'desc') {
          const sevenDaysAgo = new Date();
          sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
          
          const aDate = new Date(a.member?.createdAt);
          const bDate = new Date(b.member?.createdAt);
          
          // If either date is invalid, put it at the end
          if (isNaN(aDate.getTime())) return 1;
          if (isNaN(bDate.getTime())) return -1;
          
          // If either date is older than 7 days, put it at the end
          if (aDate < sevenDaysAgo) return 1;
          if (bDate < sevenDaysAgo) return -1;
          
          // Sort by most recent first
          return bDate - aDate;
        } else {
          // For oldest members, just sort by date
          const aDate = new Date(a.member?.createdAt);
          const bDate = new Date(b.member?.createdAt);
          
          // If either date is invalid, put it at the end
          if (isNaN(aDate.getTime())) return 1;
          if (isNaN(bDate.getTime())) return -1;
          
          return multiplier * (aDate - bDate);
        }
      
      default:
        return 0;
    }
  });
}

function filterMembers(members, filter) {
  if (filter === 'all') return members;

  return members.filter(member => {
    switch (filter) {
      case 'has-payment':
        return member.member?.metadata?.mmbp !== undefined;
      
      case 'has-bio':
        return Boolean(member.metadata?.bio);
      
      case 'has-location':
        return Boolean(member.metadata?.location);
      
      case 'has-links':
        const metadata = member.metadata || {};
        return Boolean(
          metadata.linkWebsite ||
          metadata.linkTwitter ||
          metadata.linkInstagram ||
          metadata.linkLinkedin ||
          metadata.linkYoutube ||
          metadata.linkFacebook
        );
      
      default:
        return true;
    }
  });
}

// Update the renderMemberList function
function renderMemberList(searchTerm = '') {
  console.log('%c[Skool Member Data Viewer Popup] Starting renderMemberList', 'background: #17a2b8; color: white; padding: 2px 4px; border-radius: 2px;');
  
  const currentSearchTerm = searchInput.value.toLowerCase();
  const users = memberData?.pageProps?.users || [];
  
  if (users.length === 0) {
    console.log('%c[Skool Member Data Viewer Popup] No users in data array', 'background: #ffc107; color: black; padding: 2px 4px; border-radius: 2px;');
    memberList.innerHTML = `
      <div class="no-data-message">
        <div class="no-data-icon">📋</div>
        <h3>No Member Data Available</h3>
        <p>Please visit the Skool members page to capture member data.</p>
        <button id="refreshBtn" class="refresh-button">Refresh Data</button>
      </div>
    `;
    document.getElementById('memberCount').textContent = '0';
    
    // Add click handler for refresh button
    document.getElementById('refreshBtn').addEventListener('click', () => {
      chrome.runtime.sendMessage({ action: 'refreshData' });
    });
    return;
  }

  let filteredUsers = users.filter(user => {
    const name = user.name?.toLowerCase() || '';
    const bio = user.bio?.toLowerCase() || '';
    const location = user.location?.toLowerCase() || '';
    const email = user.member?.metadata?.mbme?.toLowerCase() || '';
    const myersBriggs = user.metadata?.myersBriggs?.toLowerCase() || '';
    return name.includes(currentSearchTerm) || 
           bio.includes(currentSearchTerm) || 
           location.includes(currentSearchTerm) ||
           email.includes(currentSearchTerm) ||
           myersBriggs.includes(currentSearchTerm);
  });

  filteredUsers = filterMembers(filteredUsers, currentFilter);
  filteredUsers = sortMembers(filteredUsers, currentSort);

  // Update the member count
  document.getElementById('memberCount').textContent = filteredUsers.length;

  memberList.innerHTML = filteredUsers.map(user => {
    // Parse metadata if it's a string
    const metadata = typeof user.metadata === 'string' ? parseNestedJson(user.metadata) : user.metadata;
    const memberMetadata = user.member?.metadata || {};
    
    // Get avatar URL from metadata
    const avatarUrl = metadata?.pictureProfile || metadata?.pictureBubble || user.avatar || 'https://via.placeholder.com/64';
    
    // Parse monthly payment if it's a string
    let monthlyPayment = 'N/A';
    if (memberMetadata.mmbp) {
      try {
        const paymentData = typeof memberMetadata.mmbp === 'string' ? 
          JSON.parse(memberMetadata.mmbp) : memberMetadata.mmbp;
        monthlyPayment = `$${(Number(paymentData.amount) / 100).toFixed(2)}/${paymentData.recurring_interval}`;
      } catch (e) {
        console.error('Error parsing monthly payment:', e);
      }
    }
    
    // Format lifetime value
    const lifetimeValue = memberMetadata.mbsltv ? `$${(Number(memberMetadata.mbsltv) / 100).toFixed(2)}` : 'N/A';

    // Parse spData if it's a string
    let spData = {};
    if (metadata?.spData) {
      try {
        spData = typeof metadata.spData === 'string' ? 
          JSON.parse(metadata.spData) : metadata.spData;
      } catch (e) {
        console.error('Error parsing spData:', e);
      }
    }
    
    return `
      <div class="member-card">
        <div class="member-header">
          <img src="${avatarUrl}" alt="${user.name}" class="member-avatar" onerror="this.src='https://via.placeholder.com/64'">
          <div class="member-info">
            <h3 class="member-name">${user.name}</h3>
            ${memberMetadata.mbme ? `<div class="member-email">${memberMetadata.mbme}</div>` : ''}
            ${metadata?.bio ? `<div class="member-bio">${metadata.bio}</div>` : ''}
            ${metadata?.actStatus ? `<div class="member-status">${metadata.actStatus}</div>` : ''}
          </div>
        </div>
        <div class="info-grid">
          ${user.location ? `
            <div class="info-item">
              <span class="info-label">Location</span>
              <span class="info-value">${user.location}</span>
            </div>
          ` : ''}
          ${metadata?.myersBriggs ? `
            <div class="info-item">
              <span class="info-label">Myers-Briggs</span>
              <span class="info-value">${metadata.myersBriggs}</span>
            </div>
          ` : ''}
          <div class="info-item">
            <span class="info-label">Lifetime Value</span>
            <span class="info-value">${lifetimeValue}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Monthly Payment</span>
            <span class="info-value">${monthlyPayment}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Points</span>
            <span class="info-value">${spData.pts || 'N/A'}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Level</span>
            <span class="info-value">${spData.lv || 'N/A'}</span>
          </div>
        </div>
        <div class="timeline">
          ${user.member?.createdAt ? `
            <div class="timeline-item">
              <div class="timeline-date">${formatTimestamp(user.member.createdAt)}</div>
              <div class="timeline-content">Member joined</div>
            </div>
          ` : ''}
          ${user.member?.approvedAt ? `
            <div class="timeline-item">
              <div class="timeline-date">${formatTimestamp(user.member.approvedAt)}</div>
              <div class="timeline-content">Member approved</div>
            </div>
          ` : ''}
          ${user.member?.lastOffline ? `
            <div class="timeline-item">
              <div class="timeline-date">${formatTimestamp(user.member.lastOffline)}</div>
              <div class="timeline-content">Last seen</div>
            </div>
          ` : ''}
          ${user.member?.metadata?.removedAt ? `
            <div class="timeline-item">
              <div class="timeline-date">${formatTimestamp(user.member.metadata.removedAt)}</div>
              <div class="timeline-content">Member removed</div>
            </div>
          ` : ''}
        </div>
        ${formatSocialLinks(metadata)}
      </div>
    `;
  }).join('');
}

// Remove the modal-related code since we're not using it anymore
function closeMemberModal() {
  // This function is no longer needed
}

function showMemberModal(member) {
  // This function is no longer needed
}

// Listen for updates from background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('%c[Skool Member Data Viewer Popup] Received message:', 'background: #17a2b8; color: white; padding: 2px 4px; border-radius: 2px;', message);
  
  if (message.type === 'dataUpdate') {
    if (message.error) {
      console.error('%c[Skool Member Data Viewer Popup] Error:', 'background: #dc3545; color: white; padding: 2px 4px; border-radius: 2px;', message.error);
      memberList.innerHTML = `
        <div class="error-message">
          <div class="error-icon">⚠️</div>
          <h3>Error Loading Data</h3>
          <p>${message.error}</p>
          <button id="refreshBtn" class="refresh-button">Try Again</button>
        </div>
      `;
      document.getElementById('memberCount').textContent = '0';
      
      // Add click handler for refresh button
      document.getElementById('refreshBtn').addEventListener('click', () => {
        chrome.runtime.sendMessage({ action: 'refreshData' });
      });
      return;
    }
    
    memberData = message.data;
    renderMemberList();
  }
  sendResponse({ received: true });
  return true;
}); 