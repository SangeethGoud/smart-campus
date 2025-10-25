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

// Get all announcements (public)
router.get('/', (req, res) => {
  const db = dbModule.connect();
  db.all(`
    SELECT a.*, u.name as author_name 
    FROM announcements a 
    LEFT JOIN users u ON a.author_id = u.id 
    ORDER BY a.created_at DESC
  `, [], (err, rows) => {
    if (err) return res.status(500).json({ error: 'db error' });
    res.json({ ok: true, announcements: rows });
  });
});

// Get announcement by ID
router.get('/:id', (req, res) => {
  const { id } = req.params;
  const db = dbModule.connect();
  db.get(`
    SELECT a.*, u.name as author_name 
    FROM announcements a 
    LEFT JOIN users u ON a.author_id = u.id 
    WHERE a.id = ?
  `, [id], (err, row) => {
    if (err) return res.status(500).json({ error: 'db error' });
    if (!row) return res.status(404).json({ error: 'announcement not found' });
    res.json({ ok: true, announcement: row });
  });
});

// Create announcement (admin/faculty only)
router.post('/', (req, res) => {
  const user = getUserFromReq(req);
  if (!user || (user.role !== 'admin' && user.role !== 'faculty')) {
    return res.status(403).json({ error: 'forbidden' });
  }

  const { title, content, priority, category } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: 'title and content required' });
  }

  const db = dbModule.connect();
  db.run(`
    INSERT INTO announcements (title, content, priority, category, author_id, created_at) 
    VALUES (?, ?, ?, ?, ?, datetime('now'))
  `, [title, content, priority || 'normal', category || 'general', user.id], function(err) {
    if (err) return res.status(500).json({ error: 'db error' });
    res.json({ ok: true, id: this.lastID });
  });
});

// Update announcement (admin/faculty only)
router.put('/:id', (req, res) => {
  const user = getUserFromReq(req);
  if (!user || (user.role !== 'admin' && user.role !== 'faculty')) {
    return res.status(403).json({ error: 'forbidden' });
  }

  const { id } = req.params;
  const { title, content, priority, category } = req.body;
  
  const db = dbModule.connect();
  db.run(`
    UPDATE announcements 
    SET title = ?, content = ?, priority = ?, category = ?, updated_at = datetime('now')
    WHERE id = ?
  `, [title, content, priority, category, id], function(err) {
    if (err) return res.status(500).json({ error: 'db error' });
    if (this.changes === 0) return res.status(404).json({ error: 'announcement not found' });
    res.json({ ok: true });
  });
});

// Delete announcement (admin only)
router.delete('/:id', (req, res) => {
  const user = getUserFromReq(req);
  if (!user || user.role !== 'admin') {
    return res.status(403).json({ error: 'forbidden' });
  }

  const { id } = req.params;
  const db = dbModule.connect();
  db.run('DELETE FROM announcements WHERE id = ?', [id], function(err) {
    if (err) return res.status(500).json({ error: 'db error' });
    if (this.changes === 0) return res.status(404).json({ error: 'announcement not found' });
    res.json({ ok: true });
  });
});

module.exports = router;
