//
// ==========================================
// AUTHENTICATION LOGIC
// ==========================================

// Demo credentials
const demoUsers = {
    student: {
        email: 'student@klh.edu',
        password: 'student123',
        role: 'student',
        name: 'John Doe',
        id: 'STU001'
    },
    faculty: {
        email: 'faculty@klh.edu',
        password: 'faculty123',
        role: 'faculty',
        name: 'Dr. Sarah Smith',
        id: 'FAC001'
    },
    admin: {
        email: 'admin@klh.edu',
        password: 'admin123',
        role: 'admin',
        name: 'Admin User',
        id: 'ADM001'
    }
};

// Store current user in session
let currentUser = null;

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Check if already logged in
    checkAuth();
    
    // Role selector
    const roleButtons = document.querySelectorAll('.role-btn');
    roleButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            roleButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Password toggle
    const togglePassword = document.querySelector('.toggle-password');
    if (togglePassword) {
        togglePassword.addEventListener('click', function() {
            const passwordInput = document.getElementById('password');
            const icon = this.querySelector('i');
            
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                passwordInput.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    }
    
    // Login form submission
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
});

// Handle login
function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const activeRole = document.querySelector('.role-btn.active').dataset.role;
    
    // Check credentials
    const user = Object.values(demoUsers).find(u => 
        u.email === email && 
        u.password === password && 
        u.role === activeRole
    );
    
    if (user) {
        // Store user in sessionStorage
        sessionStorage.setItem('currentUser', JSON.stringify(user));
        
        // Store role in localStorage for persistent login
        localStorage.setItem('sc_role', user.role);
        localStorage.setItem('sc_user_email', user.email);
        
        // Show success message
        showNotification('Login successful! Redirecting...', 'success');
        
        // Redirect to appropriate dashboard
        setTimeout(() => {
            switch(user.role) {
                case 'student':
                    window.location.href = 'dashboard-student.html';
                    break;
                case 'faculty':
                    window.location.href = 'dashboard-faculty.html';
                    break;
                case 'admin':
                    window.location.href = 'dashboard-admin.html';
                    break;
            }
        }, 1000);
    } else {
        showNotification('Invalid credentials! Please try again.', 'error');
    }
}

// Check if user is authenticated
function checkAuth() {
    const user = sessionStorage.getItem('currentUser');
    if (user) {
        currentUser = JSON.parse(user);
        return true;
    }
    return false;
}

// Logout function
function logout() {
    sessionStorage.removeItem('currentUser');
    localStorage.removeItem('sc_role');
    localStorage.removeItem('sc_user_email');
  // After logout, return user to the home page
  window.location.href = 'index.html';
}

// Show notification
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Add to body
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Get current user
function getCurrentUser() {
    if (!currentUser) {
        const user = sessionStorage.getItem('currentUser');
        if (user) {
            currentUser = JSON.parse(user);
        }
    }
    return currentUser;
}

// Simple demo auth + link protection + UI toggles
(function () {
  'use strict';

  const DEMO = {
    student: { email: 'student@klh.edu', pass: 'student123', url: 'dashboard-student.html' },
    faculty: { email: 'faculty@klh.edu', pass: 'faculty123', url: 'dashboard-faculty.html' },
    admin:   { email: 'admin@klh.edu',   pass: 'admin123',   url: 'dashboard-admin.html' }
  };

  const storageKey = 'sc_role';

  function isLoggedIn() {
    return !!localStorage.getItem(storageKey);
  }

  function logout(redirect = 'index.html') {
    localStorage.removeItem(storageKey);
    localStorage.removeItem('sc_user_email');
    // reload to update UI / redirect to home
    window.location.href = redirect;
  }

  function applyUiForAuth() {
    const logged = isLoggedIn();
    // add body class for theme adjustments
    if (logged) document.body.classList.add('sc-logged-in', 'sc-dark-theme');
    else document.body.classList.remove('sc-logged-in');

    // hide or adapt Login buttons/links
    document.querySelectorAll('.btn-login, a[href="login.html"]').forEach(el => {
      const onHome = /(?:\/(?:index.html)?$)|(?:index.html$)/.test(window.location.pathname);
      if (isLoggedIn()) {
        // If we're on the home page, keep the link as a Login link (do not switch to Logout there)
        if (el.tagName === 'A' && el.getAttribute('href') === 'login.html') {
          if (onHome) {
            // ensure it stays as a normal login link
            el.textContent = el.dataset.origText || 'Login';
            el.href = 'login.html';
          } else {
            // replace login links that are in headers on other pages with logout behaviour
            el.textContent = 'Logout';
            el.href = '#';
            el.addEventListener('click', (ev) => { ev.preventDefault(); logout(); });
          }
        } else {
          // hide other login buttons when logged in
          el.style.display = 'none';
        }
      } else {
        // not logged in: ensure login links visible and functional
        if (el.tagName === 'A') {
          el.textContent = el.dataset.origText || el.textContent;
          el.href = 'login.html';
        } else {
          el.style.display = '';
        }
      }
    });
  }

  // Protect navigation: if not logged in and clicking a protected target, redirect to login with next param
  function shouldProtect(href) {
    if (!href) return false;
    if (href.startsWith('#')) return false;
    if (/^https?:\/\//.test(href)) return false;
    if (href.endsWith('.css') || href.endsWith('.js')) return false;
    const protectedList = [
      'dashboard-', 'dashboard-student.html','dashboard-faculty.html','dashboard-admin.html',
      'events.html','clubs.html','lost-found.html','announcements.html','feedback.html',
      'resources.html','profile.html'
    ];
    return protectedList.some(p => href.includes(p));
  }

  function installNavGuard() {
    document.addEventListener('click', function (e) {
      const a = e.target.closest('a');
      if (!a) return;
      const href = a.getAttribute('href');
      if (!href) return;
      if (!isLoggedIn() && shouldProtect(href)) {
        e.preventDefault();
        // redirect to login with next param
        const next = encodeURIComponent(href);
        window.location.href = 'login.html?next=' + next;
      }
    }, true);
  }

  // On login page: wire demo form automatic redirect if next param exists
  function handleLoginPage() {
    const loc = window.location;
    if (!loc.pathname.endsWith('login.html')) return;
    const form = document.getElementById('login-form');
    if (!form) return;

    // restore role buttons toggle display (if present)
    const roleBtns = document.querySelectorAll('.role-btn');
    roleBtns.forEach(b => b.addEventListener('click', () => {
      roleBtns.forEach(x => x.classList.remove('active'));
      b.classList.add('active');
    }));

    // existing toggle-password button: ensure it toggles password input
    const toggleBtn = document.querySelector('.toggle-password');
    const pwd = document.getElementById('password');
    if (toggleBtn && pwd) {
      toggleBtn.addEventListener('click', function () {
        pwd.type = pwd.type === 'password' ? 'text' : 'password';
      });
    }

    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      const email = (form.email?.value || '').trim().toLowerCase();
      const password = form.password?.value || '';
      // match demo creds
      const matched = Object.keys(DEMO).find(r => DEMO[r].email === email && DEMO[r].pass === password);
      if (matched) {
        localStorage.setItem(storageKey, matched);
        localStorage.setItem('sc_user_email', email);
        // redirect to next param or to role dashboard
        const params = new URLSearchParams(location.search);
        const next = params.get('next');
        const safeNext = next && !next.includes('login.html') ? decodeURIComponent(next) : DEMO[matched].url;
        window.location.href = safeNext || DEMO[matched].url;
        return;
      }
      // fallback: allow role-button selected -> redirect if matches that role's creds
      const selectedRole = document.querySelector('.role-btn.active')?.dataset?.role;
      if (selectedRole && DEMO[selectedRole].email === email && DEMO[selectedRole].pass === password) {
        localStorage.setItem(storageKey, selectedRole);
        localStorage.setItem('sc_user_email', email);
        window.location.href = DEMO[selectedRole].url;
        return;
      }
      alert('Invalid demo credentials. Use the demo credentials listed on the page.');
    });
  }

  // Expose logout to global for manual use
  window.scAuth = {
    logout
  };

  // init on DOM ready
  document.addEventListener('DOMContentLoaded', function () {
    applyUiForAuth();
    installNavGuard();
    handleLoginPage();
  });

})();

// client auth helper — checks /api/auth/me, protects links and toggles login UI
(function () {
  'use strict';
  const API_BASE = ''; // same host as frontend; change if backend hosted elsewhere
  async function fetchMe() {
    try {
      const res = await fetch(API_BASE + '/api/auth/me', { credentials: 'include' });
      return await res.json();
    } catch { return { logged: false }; }
  }

  function shouldProtect(href) {
    if (!href) return false;
    if (href.startsWith('#')) return false;
    if (/^https?:\/\//.test(href)) return false;
    const protectedList = [
      'dashboard-', 'dashboard-student.html','dashboard-faculty.html','dashboard-admin.html',
      'events.html','clubs.html','lost-found.html','announcements.html','feedback.html',
      'resources.html','profile.html'
    ];
    return protectedList.some(p => href.includes(p));
  }

  async function installGuard() {
    const me = await fetchMe();
    const logged = me.logged === true;
    if (logged) {
      document.body.classList.add('sc-logged-in', 'sc-dark-theme');
      document.querySelectorAll('a[href="login.html"]').forEach(a => {
        a.dataset.origText = a.textContent;
        a.textContent = 'Logout';
        a.href = '#';
        a.addEventListener('click', async (ev) => {
          ev.preventDefault();
          await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
          // After API logout, redirect to home page
          window.location.href = 'index.html';
        });
      });
    }

    document.addEventListener('click', function (e) {
      const a = e.target.closest('a');
      if (!a) return;
      const href = a.getAttribute('href');
      if (!href) return;
      if (!logged && shouldProtect(href)) {
        e.preventDefault();
        const next = encodeURIComponent(href);
        window.location.href = 'login.html?next=' + next;
      }
    }, true);
  }

  // login page helper: used by api-login.js (but keep for role toggles/password)
  function initLoginUi() {
    document.querySelectorAll('.role-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.role-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });
    const toggle = document.querySelector('.toggle-password');
    const pwd = document.getElementById('password');
    toggle?.addEventListener('click', () => {
      if (!pwd) return;
      pwd.type = pwd.type === 'password' ? 'text' : 'password';
      toggle.querySelector('i')?.classList.toggle('fa-eye-slash');
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    installGuard();
    initLoginUi();
  });

  window.scAuthClient = { fetchMe };
})();

// Export functions
window.auth = {
    checkAuth,
    logout,
    getCurrentUser,
    showNotification
};

