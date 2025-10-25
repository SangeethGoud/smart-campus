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

// Get user's notifications
router.get('/', (req, res) => {
  const user = getUserFromReq(req);
  if (!user) return res.status(401).json({ error: 'authentication required' });

  const db = dbModule.connect();
  db.all(`
    SELECT * FROM notifications 
    WHERE user_id = ? 
    ORDER BY created_at DESC
  `, [user.id], (err, rows) => {
    if (err) return res.status(500).json({ error: 'db error' });
    res.json({ ok: true, notifications: rows });
  });
});

// Get unread notifications count
router.get('/unread-count', (req, res) => {
  const user = getUserFromReq(req);
  if (!user) return res.status(401).json({ error: 'authentication required' });

  const db = dbModule.connect();
  db.get(`
    SELECT COUNT(*) as count 
    FROM notifications 
    WHERE user_id = ? AND is_read = 0
  `, [user.id], (err, row) => {
    if (err) return res.status(500).json({ error: 'db error' });
    res.json({ ok: true, count: row.count });
  });
});

// Mark notification as read
router.put('/:id/read', (req, res) => {
  const user = getUserFromReq(req);
  if (!user) return res.status(401).json({ error: 'authentication required' });

  const { id } = req.params;
  const db = dbModule.connect();
  db.run(`
    UPDATE notifications 
    SET is_read = 1, read_at = datetime('now') 
    WHERE id = ? AND user_id = ?
  `, [id, user.id], function(err) {
    if (err) return res.status(500).json({ error: 'db error' });
    if (this.changes === 0) return res.status(404).json({ error: 'notification not found' });
    res.json({ ok: true });
  });
});

// Mark all notifications as read
router.put('/mark-all-read', (req, res) => {
  const user = getUserFromReq(req);
  if (!user) return res.status(401).json({ error: 'authentication required' });

  const db = dbModule.connect();
  db.run(`
    UPDATE notifications 
    SET is_read = 1, read_at = datetime('now') 
    WHERE user_id = ? AND is_read = 0
  `, [user.id], function(err) {
    if (err) return res.status(500).json({ error: 'db error' });
    res.json({ ok: true, updated: this.changes });
  });
});

// Delete notification
router.delete('/:id', (req, res) => {
  const user = getUserFromReq(req);
  if (!user) return res.status(401).json({ error: 'authentication required' });

  const { id } = req.params;
  const db = dbModule.connect();
  db.run('DELETE FROM notifications WHERE id = ? AND user_id = ?', [id, user.id], function(err) {
    if (err) return res.status(500).json({ error: 'db error' });
    if (this.changes === 0) return res.status(404).json({ error: 'notification not found' });
    res.json({ ok: true });
  });
});

// Create notification (admin/faculty only)
router.post('/', (req, res) => {
  const user = getUserFromReq(req);
  if (!user || (user.role !== 'admin' && user.role !== 'faculty')) {
    return res.status(403).json({ error: 'forbidden' });
  }

  const { title, message, type, target_users } = req.body;
  if (!title || !message) {
    return res.status(400).json({ error: 'title and message required' });
  }

  const db = dbModule.connect();
  
  // If target_users is specified, send to specific users
  if (target_users && target_users.length > 0) {
    const stmt = db.prepare('INSERT INTO notifications (user_id, title, message, type, created_at) VALUES (?, ?, ?, ?, datetime("now"))');
    target_users.forEach(targetUserId => {
      stmt.run(targetUserId, title, message, type || 'info');
    });
    stmt.finalize();
    res.json({ ok: true, sent_to: target_users.length });
  } else {
    // Send to all users
    db.all('SELECT id FROM users', [], (err, users) => {
      if (err) return res.status(500).json({ error: 'db error' });
      
      const stmt = db.prepare('INSERT INTO notifications (user_id, title, message, type, created_at) VALUES (?, ?, ?, ?, datetime("now"))');
      users.forEach(u => {
        stmt.run(u.id, title, message, type || 'info');
      });
      stmt.finalize();
      res.json({ ok: true, sent_to: users.length });
    });
  }
});

// Get notification by ID
router.get('/:id', (req, res) => {
  const user = getUserFromReq(req);
  if (!user) return res.status(401).json({ error: 'authentication required' });

  const { id } = req.params;
  const db = dbModule.connect();
  db.get(`
    SELECT * FROM notifications 
    WHERE id = ? AND user_id = ?
  `, [id, user.id], (err, row) => {
    if (err) return res.status(500).json({ error: 'db error' });
    if (!row) return res.status(404).json({ error: 'notification not found' });
    res.json({ ok: true, notification: row });
  });
});

module.exports = router;
