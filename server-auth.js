const express = require('express');
const router = express.Router();
const dbModule = require('./server-db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';
const COOKIE_NAME = 'sc_token';
const COOKIE_OPTS = { httpOnly: true, sameSite: 'lax' };

function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '8h' });
}
function verifyToken(token) {
  try { return jwt.verify(token, JWT_SECRET); } catch { return null; }
}

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'email/password required' });

  const db = dbModule.connect();
  db.get('SELECT id,email,password,role,name FROM users WHERE lower(email)=lower(?)', [email], (err, user) => {
    if (err) return res.status(500).json({ error: 'db error' });
    if (!user) return res.status(401).json({ error: 'invalid credentials' });
    if (!bcrypt.compareSync(password, user.password)) return res.status(401).json({ error: 'invalid credentials' });

    const token = signToken({ id: user.id, role: user.role, email: user.email, name: user.name });
    res.cookie(COOKIE_NAME, token, COOKIE_OPTS);
    res.json({ ok: true, role: user.role, redirect: roleToDashboard(user.role) });
  });
});

router.post('/logout', (req, res) => {
  res.clearCookie(COOKIE_NAME);
  res.json({ ok: true });
});

router.get('/me', (req, res) => {
  const token = req.cookies[COOKIE_NAME] || req.header('Authorization')?.replace('Bearer ', '');
  const payload = verifyToken(token);
  if (!payload) return res.json({ logged: false });
  res.json({ logged: true, user: payload });
});

function roleToDashboard(role) {
  if (role === 'student') return 'dashboard-student.html';
  if (role === 'faculty') return 'dashboard-faculty.html';
  if (role === 'admin') return 'dashboard-admin.html';
  return 'index.html';
}

module.exports = router;