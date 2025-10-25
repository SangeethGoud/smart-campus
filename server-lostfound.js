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

// Report a lost/found item (authenticated or anonymous)
router.post('/report', (req, res) => {
  const user = getUserFromReq(req);
  const { item, location, description } = req.body;
  if (!item || !location) return res.status(400).json({ error: 'item and location required' });
  const db = dbModule.connect();
  db.run('INSERT INTO lost_items (item,location,description,reporter_email) VALUES (?,?,?,?)',
    [item, location, description || '', user?.email || req.body.email || null],
    function(err) {
      if (err) return res.status(500).json({ error: 'db error' });
      res.json({ ok: true, id: this.lastID });
    });
});

// List all lost items (public)
router.get('/list', (req, res) => {
  const db = dbModule.connect();
  db.all('SELECT * FROM lost_items ORDER BY created_at DESC', [], (err, rows) => {
    if (err) return res.status(500).json({ error: 'db error' });
    res.json({ ok: true, items: rows });
  });
});

module.exports = router;