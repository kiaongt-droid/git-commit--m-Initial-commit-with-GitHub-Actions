// Auth configuration
const API_URL = 'http://localhost:5000/api';
let authToken = localStorage.getItem('mfhub-auth-token');
let currentUserId = localStorage.getItem('mfhub-user-id');

// UI elements
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const switchToSignupBtn = document.getElementById('switchToSignup');
const switchToLoginBtn = document.getElementById('switchToLogin');
const loginEmail = document.getElementById('loginEmail');
const loginPassword = document.getElementById('loginPassword');
const signupName = document.getElementById('signupName');
const signupEmail = document.getElementById('signupEmail');
const signupPassword = document.getElementById('signupPassword');
const loginError = document.getElementById('loginError');
const signupError = document.getElementById('signupError');
const documentForm = document.getElementById('documentForm');
const docFileInput = document.getElementById('docFileInput');
const documentList = document.getElementById('documentList');
const profilesList = document.getElementById('profilesList');

// Switch between login and signup
switchToSignupBtn?.addEventListener('click', () => {
  document.getElementById('auth-login').classList.remove('active');
  document.getElementById('auth-signup').classList.add('active');
});

switchToLoginBtn?.addEventListener('click', () => {
  document.getElementById('auth-signup').classList.remove('active');
  document.getElementById('auth-login').classList.add('active');
});

// Login
loginForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  loginError.textContent = '';

  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: loginEmail.value,
        password: loginPassword.value,
      }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Login failed');

    authToken = data.token;
    currentUserId = data.userId;
    localStorage.setItem('mfhub-auth-token', authToken);
    localStorage.setItem('mfhub-user-id', currentUserId);

    showAppPages();
  } catch (error) {
    loginError.textContent = error.message;
  }
});

// Sign up
signupForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  signupError.textContent = '';

  try {
    const response = await fetch(`${API_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: signupEmail.value,
        password: signupPassword.value,
        name: signupName.value,
      }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Signup failed');

    authToken = data.token;
    currentUserId = data.userId;
    localStorage.setItem('mfhub-auth-token', authToken);
    localStorage.setItem('mfhub-user-id', currentUserId);

    showAppPages();
  } catch (error) {
    signupError.textContent = error.message;
  }
});

// Show app pages after auth
function showAppPages() {
  document.getElementById('auth-login').classList.remove('active');
  document.getElementById('auth-signup').classList.remove('active');
  document.getElementById('dashboard').classList.add('active');
}

// Document upload
documentForm?.addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData();
  formData.append('file', docFileInput.files[0]);

  try {
    const response = await fetch(`${API_URL}/files/upload`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${authToken}` },
      body: formData,
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Upload failed');

    loadDocuments();
    documentForm.reset();
  } catch (error) {
    alert('Upload failed: ' + error.message);
  }
});

// Load user documents
async function loadDocuments() {
  try {
    const response = await fetch(`${API_URL}/files`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });

    const files = await response.json();
    documentList.innerHTML = '';

    if (!files.length) {
      documentList.innerHTML = '<p class="empty-state">No documents yet.</p>';
      return;
    }

    files.forEach(file => {
      const item = document.createElement('div');
      item.className = 'document-item';
      item.innerHTML = `
        <div>
          <strong>${file.originalName}</strong>
          <p>${(file.fileSize / 1024).toFixed(2)} KB • ${new Date(file.uploadedAt).toLocaleDateString()}</p>
        </div>
        <div class="doc-actions">
          <a href="${API_URL}/files/download/${file._id}" class="btn-download">Download</a>
          <button class="btn-delete" onclick="deleteDocument('${file._id}')">Delete</button>
        </div>
      `;
      documentList.appendChild(item);
    });
  } catch (error) {
    console.error('Failed to load documents:', error);
  }
}

// Delete document
async function deleteDocument(fileId) {
  if (!confirm('Delete this file?')) return;

  try {
    const response = await fetch(`${API_URL}/files/${fileId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${authToken}` },
    });

    if (!response.ok) throw new Error('Delete failed');
    loadDocuments();
  } catch (error) {
    alert('Delete failed: ' + error.message);
  }
}

// Load all user profiles
async function loadAllProfiles() {
  try {
    const response = await fetch(`${API_URL}/profiles/all`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });

    const profiles = await response.json();
    profilesList.innerHTML = '';

    if (!profiles.length) {
      profilesList.innerHTML = '<p class="empty-state">No profiles available.</p>';
      return;
    }

    profiles.forEach(profile => {
      const card = document.createElement('div');
      card.className = 'profile-card-grid';
      card.innerHTML = `
        <div class="card">
          <h3>${profile.name || 'User'}</h3>
          <p><strong>Age:</strong> ${profile.age || '—'}</p>
          <p><strong>Height:</strong> ${profile.height || '—'}</p>
          <p><strong>Weight:</strong> ${profile.weight || '—'}</p>
          <p><strong>Waist:</strong> ${profile.waist || '—'}</p>
        </div>
      `;
      profilesList.appendChild(card);
    });
  } catch (error) {
    console.error('Failed to load profiles:', error);
    profilesList.innerHTML = '<p class="error-state">Failed to load profiles.</p>';
  }
}

// Check if user is authenticated
if (authToken) {
  showAppPages();
  loadDocuments();
} else {
  document.getElementById('auth-login').classList.add('active');
}
