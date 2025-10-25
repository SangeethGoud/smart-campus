const express = require('express');
const router = express.Router();
const dbModule = require('./server-db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';
const COOKIE_NAME = 'sc_token';

function verifyAdmin(req) {
  const token = req.cookies[COOKIE_NAME] || req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return null;
  try { return jwt.verify(token, JWT_SECRET); } catch { return null; }
}

router.get('/users', (req, res) => {
  const admin = verifyAdmin(req);
  if (!admin || admin.role !== 'admin') return res.status(403).json({ error: 'forbidden' });
  const db = dbModule.connect();
  db.all('SELECT id,email,role,name,created_at FROM users ORDER BY id DESC', [], (err, rows) => {
    if (err) return res.status(500).json({ error: 'db error' });
    res.json({ ok: true, users: rows });
  });
});

// create/issue user (admin only)
router.post('/users', (req, res) => {
  const admin = verifyAdmin(req);
  if (!admin || admin.role !== 'admin') return res.status(403).json({ error: 'forbidden' });
  const { email, password, role, name } = req.body;
  if (!email) return res.status(400).json({ error: 'email required' });
  const hash = bcrypt.hashSync(password || 'changeme', 10);
  const db = dbModule.connect();
  db.run('INSERT INTO users (email,password,role,name) VALUES (?,?,?,?)', [email.toLowerCase(), hash, role || 'student', name || ''], function(err) {
    if (err) return res.status(500).json({ error: 'db error', detail: err.message });
    res.json({ ok: true, id: this.lastID });
  });
});

// update role
router.put('/users/:id/role', (req, res) => {
  const admin = verifyAdmin(req);
  if (!admin || admin.role !== 'admin') return res.status(403).json({ error: 'forbidden' });
  const { id } = req.params;
  const { role } = req.body;
  const db = dbModule.connect();
  db.run('UPDATE users SET role = ? WHERE id = ?', [role, id], function(err) {
    if (err) return res.status(500).json({ error: 'db error' });
    res.json({ ok: true, changes: this.changes });
  });
});

module.exports = router;