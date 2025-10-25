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

// Get all resources
router.get('/', (req, res) => {
  const db = dbModule.connect();
  db.all(`
    SELECT r.*, u.name as uploader_name 
    FROM resources r 
    LEFT JOIN users u ON r.uploader_id = u.id 
    ORDER BY r.created_at DESC
  `, [], (err, rows) => {
    if (err) return res.status(500).json({ error: 'db error' });
    res.json({ ok: true, resources: rows });
  });
});

// Get resource by ID
router.get('/:id', (req, res) => {
  const { id } = req.params;
  const db = dbModule.connect();
  db.get(`
    SELECT r.*, u.name as uploader_name 
    FROM resources r 
    LEFT JOIN users u ON r.uploader_id = u.id 
    WHERE r.id = ?
  `, [id], (err, row) => {
    if (err) return res.status(500).json({ error: 'db error' });
    if (!row) return res.status(404).json({ error: 'resource not found' });
    res.json({ ok: true, resource: row });
  });
});

// Create resource (admin/faculty only)
router.post('/', (req, res) => {
  const user = getUserFromReq(req);
  if (!user || (user.role !== 'admin' && user.role !== 'faculty')) {
    return res.status(403).json({ error: 'forbidden' });
  }

  const { title, description, category, file_url, file_type, file_size } = req.body;
  if (!title || !description) {
    return res.status(400).json({ error: 'title and description required' });
  }

  const db = dbModule.connect();
  db.run(`
    INSERT INTO resources (title, description, category, file_url, file_type, file_size, uploader_id, created_at) 
    VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))
  `, [title, description, category || 'general', file_url, file_type, file_size, user.id], function(err) {
    if (err) return res.status(500).json({ error: 'db error' });
    res.json({ ok: true, id: this.lastID });
  });
});

// Update resource (admin/faculty only)
router.put('/:id', (req, res) => {
  const user = getUserFromReq(req);
  if (!user || (user.role !== 'admin' && user.role !== 'faculty')) {
    return res.status(403).json({ error: 'forbidden' });
  }

  const { id } = req.params;
  const { title, description, category, file_url, file_type, file_size } = req.body;
  
  const db = dbModule.connect();
  db.run(`
    UPDATE resources 
    SET title = ?, description = ?, category = ?, file_url = ?, file_type = ?, file_size = ?, updated_at = datetime('now')
    WHERE id = ?
  `, [title, description, category, file_url, file_type, file_size, id], function(err) {
    if (err) return res.status(500).json({ error: 'db error' });
    if (this.changes === 0) return res.status(404).json({ error: 'resource not found' });
    res.json({ ok: true });
  });
});

// Delete resource (admin only)
router.delete('/:id', (req, res) => {
  const user = getUserFromReq(req);
  if (!user || user.role !== 'admin') {
    return res.status(403).json({ error: 'forbidden' });
  }

  const { id } = req.params;
  const db = dbModule.connect();
  db.run('DELETE FROM resources WHERE id = ?', [id], function(err) {
    if (err) return res.status(500).json({ error: 'db error' });
    if (this.changes === 0) return res.status(404).json({ error: 'resource not found' });
    res.json({ ok: true });
  });
});

// Download resource (increment download count)
router.post('/:id/download', (req, res) => {
  const { id } = req.params;
  const db = dbModule.connect();
  
  // Increment download count
  db.run('UPDATE resources SET download_count = download_count + 1 WHERE id = ?', [id], function(err) {
    if (err) return res.status(500).json({ error: 'db error' });
    if (this.changes === 0) return res.status(404).json({ error: 'resource not found' });
    
    // Get updated resource info
    db.get('SELECT * FROM resources WHERE id = ?', [id], (err, row) => {
      if (err) return res.status(500).json({ error: 'db error' });
      res.json({ ok: true, resource: row });
    });
  });
});

// Get resources by category
router.get('/category/:category', (req, res) => {
  const { category } = req.params;
  const db = dbModule.connect();
  db.all(`
    SELECT r.*, u.name as uploader_name 
    FROM resources r 
    LEFT JOIN users u ON r.uploader_id = u.id 
    WHERE r.category = ?
    ORDER BY r.created_at DESC
  `, [category], (err, rows) => {
    if (err) return res.status(500).json({ error: 'db error' });
    res.json({ ok: true, resources: rows });
  });
});

// Search resources
router.get('/search/:query', (req, res) => {
  const { query } = req.params;
  const db = dbModule.connect();
  db.all(`
    SELECT r.*, u.name as uploader_name 
    FROM resources r 
    LEFT JOIN users u ON r.uploader_id = u.id 
    WHERE r.title LIKE ? OR r.description LIKE ?
    ORDER BY r.created_at DESC
  `, [`%${query}%`, `%${query}%`], (err, rows) => {
    if (err) return res.status(500).json({ error: 'db error' });
    res.json({ ok: true, resources: rows });
  });
});

module.exports = router;
