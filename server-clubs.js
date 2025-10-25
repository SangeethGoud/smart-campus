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

// Get all clubs
router.get('/', (req, res) => {
  const db = dbModule.connect();
  db.all(`
    SELECT c.*, u.name as president_name,
           (SELECT COUNT(*) FROM club_memberships WHERE club_id = c.id) as member_count
    FROM clubs c 
    LEFT JOIN users u ON c.president_id = u.id 
    ORDER BY c.name ASC
  `, [], (err, rows) => {
    if (err) return res.status(500).json({ error: 'db error' });
    res.json({ ok: true, clubs: rows });
  });
});

// Get club by ID
router.get('/:id', (req, res) => {
  const { id } = req.params;
  const db = dbModule.connect();
  db.get(`
    SELECT c.*, u.name as president_name,
           (SELECT COUNT(*) FROM club_memberships WHERE club_id = c.id) as member_count
    FROM clubs c 
    LEFT JOIN users u ON c.president_id = u.id 
    WHERE c.id = ?
  `, [id], (err, row) => {
    if (err) return res.status(500).json({ error: 'db error' });
    if (!row) return res.status(404).json({ error: 'club not found' });
    res.json({ ok: true, club: row });
  });
});

// Create club (admin/faculty only)
router.post('/', (req, res) => {
  const user = getUserFromReq(req);
  if (!user || (user.role !== 'admin' && user.role !== 'faculty')) {
    return res.status(403).json({ error: 'forbidden' });
  }

  const { name, description, category, president_id } = req.body;
  if (!name || !description) {
    return res.status(400).json({ error: 'name and description required' });
  }

  const db = dbModule.connect();
  db.run(`
    INSERT INTO clubs (name, description, category, president_id, created_at) 
    VALUES (?, ?, ?, ?, datetime('now'))
  `, [name, description, category || 'general', president_id || user.id], function(err) {
    if (err) return res.status(500).json({ error: 'db error' });
    res.json({ ok: true, id: this.lastID });
  });
});

// Update club (admin/faculty only)
router.put('/:id', (req, res) => {
  const user = getUserFromReq(req);
  if (!user || (user.role !== 'admin' && user.role !== 'faculty')) {
    return res.status(403).json({ error: 'forbidden' });
  }

  const { id } = req.params;
  const { name, description, category, president_id } = req.body;
  
  const db = dbModule.connect();
  db.run(`
    UPDATE clubs 
    SET name = ?, description = ?, category = ?, president_id = ?, updated_at = datetime('now')
    WHERE id = ?
  `, [name, description, category, president_id, id], function(err) {
    if (err) return res.status(500).json({ error: 'db error' });
    if (this.changes === 0) return res.status(404).json({ error: 'club not found' });
    res.json({ ok: true });
  });
});

// Delete club (admin only)
router.delete('/:id', (req, res) => {
  const user = getUserFromReq(req);
  if (!user || user.role !== 'admin') {
    return res.status(403).json({ error: 'forbidden' });
  }

  const { id } = req.params;
  const db = dbModule.connect();
  db.run('DELETE FROM clubs WHERE id = ?', [id], function(err) {
    if (err) return res.status(500).json({ error: 'db error' });
    if (this.changes === 0) return res.status(404).json({ error: 'club not found' });
    res.json({ ok: true });
  });
});

// Join club (authenticated users)
router.post('/:id/join', (req, res) => {
  const user = getUserFromReq(req);
  if (!user) return res.status(401).json({ error: 'authentication required' });

  const { id } = req.params;
  const db = dbModule.connect();
  
  // Check if already a member
  db.get('SELECT id FROM club_memberships WHERE club_id = ? AND user_id = ?', [id, user.id], (err, row) => {
    if (err) return res.status(500).json({ error: 'db error' });
    if (row) return res.status(400).json({ error: 'already a member' });

    // Join club
    db.run('INSERT INTO club_memberships (club_id, user_id, joined_at) VALUES (?, ?, datetime("now"))', [id, user.id], function(err) {
      if (err) return res.status(500).json({ error: 'db error' });
      res.json({ ok: true, id: this.lastID });
    });
  });
});

// Leave club (authenticated users)
router.delete('/:id/leave', (req, res) => {
  const user = getUserFromReq(req);
  if (!user) return res.status(401).json({ error: 'authentication required' });

  const { id } = req.params;
  const db = dbModule.connect();
  db.run('DELETE FROM club_memberships WHERE club_id = ? AND user_id = ?', [id, user.id], function(err) {
    if (err) return res.status(500).json({ error: 'db error' });
    if (this.changes === 0) return res.status(404).json({ error: 'not a member' });
    res.json({ ok: true });
  });
});

// Get club members (admin/faculty only)
router.get('/:id/members', (req, res) => {
  const user = getUserFromReq(req);
  if (!user || (user.role !== 'admin' && user.role !== 'faculty')) {
    return res.status(403).json({ error: 'forbidden' });
  }

  const { id } = req.params;
  const db = dbModule.connect();
  db.all(`
    SELECT cm.*, u.name, u.email, u.role 
    FROM club_memberships cm 
    JOIN users u ON cm.user_id = u.id 
    WHERE cm.club_id = ?
    ORDER BY cm.joined_at DESC
  `, [id], (err, rows) => {
    if (err) return res.status(500).json({ error: 'db error' });
    res.json({ ok: true, members: rows });
  });
});

// Get user's clubs
router.get('/user/my-clubs', (req, res) => {
  const user = getUserFromReq(req);
  if (!user) return res.status(401).json({ error: 'authentication required' });

  const db = dbModule.connect();
  db.all(`
    SELECT c.*, cm.joined_at, u.name as president_name
    FROM club_memberships cm 
    JOIN clubs c ON cm.club_id = c.id 
    LEFT JOIN users u ON c.president_id = u.id
    WHERE cm.user_id = ?
    ORDER BY cm.joined_at DESC
  `, [user.id], (err, rows) => {
    if (err) return res.status(500).json({ error: 'db error' });
    res.json({ ok: true, clubs: rows });
  });
});

module.exports = router;
