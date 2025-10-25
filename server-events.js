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

// Get all events
router.get('/', (req, res) => {
  const db = dbModule.connect();
  db.all(`
    SELECT e.*, u.name as organizer_name 
    FROM events e 
    LEFT JOIN users u ON e.organizer_id = u.id 
    ORDER BY e.start_date ASC
  `, [], (err, rows) => {
    if (err) return res.status(500).json({ error: 'db error' });
    res.json({ ok: true, events: rows });
  });
});

// Get event by ID
router.get('/:id', (req, res) => {
  const { id } = req.params;
  const db = dbModule.connect();
  db.get(`
    SELECT e.*, u.name as organizer_name 
    FROM events e 
    LEFT JOIN users u ON e.organizer_id = u.id 
    WHERE e.id = ?
  `, [id], (err, row) => {
    if (err) return res.status(500).json({ error: 'db error' });
    if (!row) return res.status(404).json({ error: 'event not found' });
    res.json({ ok: true, event: row });
  });
});

// Create event (admin/faculty only)
router.post('/', (req, res) => {
  const user = getUserFromReq(req);
  if (!user || (user.role !== 'admin' && user.role !== 'faculty')) {
    return res.status(403).json({ error: 'forbidden' });
  }

  const { title, description, start_date, end_date, location, category, max_attendees } = req.body;
  if (!title || !start_date) {
    return res.status(400).json({ error: 'title and start_date required' });
  }

  const db = dbModule.connect();
  db.run(`
    INSERT INTO events (title, description, start_date, end_date, location, category, max_attendees, organizer_id, created_at) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
  `, [title, description, start_date, end_date, location, category || 'general', max_attendees, user.id], function(err) {
    if (err) return res.status(500).json({ error: 'db error' });
    res.json({ ok: true, id: this.lastID });
  });
});

// Update event (admin/faculty only)
router.put('/:id', (req, res) => {
  const user = getUserFromReq(req);
  if (!user || (user.role !== 'admin' && user.role !== 'faculty')) {
    return res.status(403).json({ error: 'forbidden' });
  }

  const { id } = req.params;
  const { title, description, start_date, end_date, location, category, max_attendees } = req.body;
  
  const db = dbModule.connect();
  db.run(`
    UPDATE events 
    SET title = ?, description = ?, start_date = ?, end_date = ?, location = ?, category = ?, max_attendees = ?, updated_at = datetime('now')
    WHERE id = ?
  `, [title, description, start_date, end_date, location, category, max_attendees, id], function(err) {
    if (err) return res.status(500).json({ error: 'db error' });
    if (this.changes === 0) return res.status(404).json({ error: 'event not found' });
    res.json({ ok: true });
  });
});

// Delete event (admin only)
router.delete('/:id', (req, res) => {
  const user = getUserFromReq(req);
  if (!user || user.role !== 'admin') {
    return res.status(403).json({ error: 'forbidden' });
  }

  const { id } = req.params;
  const db = dbModule.connect();
  db.run('DELETE FROM events WHERE id = ?', [id], function(err) {
    if (err) return res.status(500).json({ error: 'db error' });
    if (this.changes === 0) return res.status(404).json({ error: 'event not found' });
    res.json({ ok: true });
  });
});

// Register for event (authenticated users)
router.post('/:id/register', (req, res) => {
  const user = getUserFromReq(req);
  if (!user) return res.status(401).json({ error: 'authentication required' });

  const { id } = req.params;
  const db = dbModule.connect();
  
  // Check if already registered
  db.get('SELECT id FROM event_registrations WHERE event_id = ? AND user_id = ?', [id, user.id], (err, row) => {
    if (err) return res.status(500).json({ error: 'db error' });
    if (row) return res.status(400).json({ error: 'already registered' });

    // Register for event
    db.run('INSERT INTO event_registrations (event_id, user_id, registered_at) VALUES (?, ?, datetime("now"))', [id, user.id], function(err) {
      if (err) return res.status(500).json({ error: 'db error' });
      res.json({ ok: true, id: this.lastID });
    });
  });
});

// Get event registrations (admin/faculty only)
router.get('/:id/registrations', (req, res) => {
  const user = getUserFromReq(req);
  if (!user || (user.role !== 'admin' && user.role !== 'faculty')) {
    return res.status(403).json({ error: 'forbidden' });
  }

  const { id } = req.params;
  const db = dbModule.connect();
  db.all(`
    SELECT er.*, u.name, u.email 
    FROM event_registrations er 
    JOIN users u ON er.user_id = u.id 
    WHERE er.event_id = ?
    ORDER BY er.registered_at DESC
  `, [id], (err, rows) => {
    if (err) return res.status(500).json({ error: 'db error' });
    res.json({ ok: true, registrations: rows });
  });
});

module.exports = router;
