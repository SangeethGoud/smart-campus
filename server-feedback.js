const express = require('express');
const router = express.Router();
const dbModule = require('./server-db');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';
const COOKIE_NAME = 'sc_token';

function getUserFromReq(req) {
  const token = req.cookies[COOKIE_NAME] || req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return null;
  try { return jwt.verify(token, JWT_SECRET); } catch { return null; }
}

router.post('/', (req, res) => {
  const user = getUserFromReq(req);
  const { category, message, email } = req.body;
  const db = dbModule.connect();
  db.run(`INSERT INTO feedback (user_id,email,category,message) VALUES (?,?,?,?)`,
    [user?.id || null, email || (user && user.email) || null, category || 'General', message || ''],
    function(err) {
      if (err) return res.status(500).json({ error: 'db error' });
      res.json({ ok: true, id: this.lastID });
    });
});

router.get('/', (req, res) => {
  const user = getUserFromReq(req);
  if (!user || user.role !== 'admin') return res.status(403).json({ error: 'forbidden' });
  const db = dbModule.connect();
  db.all(`SELECT * FROM feedback ORDER BY created_at DESC`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: 'db error' });
    res.json({ ok: true, feedback: rows });
  });
});

module.exports = router;