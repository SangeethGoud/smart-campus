// call this from login.html (include <script src="js/api-login.js"></script> just before </body>)
const API_BASE = window.SC_API_BASE || 'http://localhost:3000'; // falls back to server's default port

document.getElementById('login-form')?.addEventListener('submit', async function (e) {
  e.preventDefault();
  const form = e.target;
  const email = form.email.value.trim();
  const password = form.password.value;

  try {
    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Login failed');
    }

    // Persist role/email for UI helpers (optional but keeps demo UI consistent)
    if (data.role) {
      try {
        localStorage.setItem('sc_role', data.role);
        localStorage.setItem('sc_user_email', email);
      } catch {}
    }

    // Compute target: next param > backend-provided redirect > role map > index.html
    const params = new URLSearchParams(location.search);
    const next = params.get('next');
    const safeNext = next && !next.includes('login.html') ? decodeURIComponent(next) : null;

    const roleMap = {
      student: 'dashboard-student.html',
      faculty: 'dashboard-faculty.html',
      admin: 'dashboard-admin.html'
    };

    const target =
      safeNext ||
      data.redirect ||
      (data.role && roleMap[data.role]) ||
      'index.html';

    window.location.href = target;
    
  } catch (error) {
    console.error('Login error:', error);
    alert('Login failed: Please ensure the server is running');
  }
});