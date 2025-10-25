const express = require('express');
const router = express.Router();
const db = require('./server-db');

// Get all pending requests
function getRequests(req, res) {
  try {
    const stmt = db.getDb().prepare(`
      SELECT * FROM requests 
      WHERE status = 'pending' 
      ORDER BY created_at DESC
    `);
    const requests = stmt.all();
    
    res.json({ ok: true, requests });
  } catch (error) {
    console.error('Error fetching requests:', error);
    res.status(500).json({ ok: false, error: 'Failed to fetch requests' });
  }
}

// Create a new request
function createRequest(req, res) {
  try {
    const { type, name, description, date, requestedBy } = req.body;
    
    if (!type || !name || !description || !requestedBy) {
      return res.status(400).json({ ok: false, error: 'Missing required fields' });
    }
    
    const stmt = db.getDb().prepare(`
      INSERT INTO requests (type, name, description, date, requestedBy, status, created_at)
      VALUES (?, ?, ?, ?, ?, 'pending', datetime('now'))
    `);
    
    const result = stmt.run(type, name, description, date || null, requestedBy);
    
    res.json({ 
      ok: true, 
      message: 'Request created successfully',
      requestId: result.lastInsertRowid
    });
  } catch (error) {
    console.error('Error creating request:', error);
    res.status(500).json({ ok: false, error: 'Failed to create request' });
  }
}

// Approve a request
function approveRequest(req, res) {
  try {
    const { id } = req.params;
    const { userEmail, type } = req.body;
    
    // Update request status
    const stmt = db.getDb().prepare(`
      UPDATE requests 
      SET status = 'approved', updated_at = datetime('now')
      WHERE id = ?
    `);
    stmt.run(id);
    
    // Create notification for user
    const notifStmt = db.getDb().prepare(`
      INSERT INTO notifications (user_email, type, message, created_at)
      VALUES (?, 'success', ?, datetime('now'))
    `);
    notifStmt.run(
      userEmail, 
      `Your ${type} creation request has been approved! You can now create the ${type}.`
    );
    
    res.json({ ok: true, message: 'Request approved' });
  } catch (error) {
    console.error('Error approving request:', error);
    res.status(500).json({ ok: false, error: 'Failed to approve request' });
  }
}

// Reject a request
function rejectRequest(req, res) {
  try {
    const { id } = req.params;
    const { userEmail } = req.body;
    
    // Update request status
    const stmt = db.getDb().prepare(`
      UPDATE requests 
      SET status = 'rejected', updated_at = datetime('now')
      WHERE id = ?
    `);
    stmt.run(id);
    
    // Create notification for user
    const notifStmt = db.getDb().prepare(`
      INSERT INTO notifications (user_email, type, message, created_at)
      VALUES (?, 'error', ?, datetime('now'))
    `);
    notifStmt.run(
      userEmail, 
      'Your creation request has been rejected by admin.'
    );
    
    res.json({ ok: true, message: 'Request rejected' });
  } catch (error) {
    console.error('Error rejecting request:', error);
    res.status(500).json({ ok: false, error: 'Failed to reject request' });
  }
}

// Get user notifications
function getUserNotifications(req, res) {
  try {
    const userEmail = req.query.email || req.cookies.user_email;
    
    if (!userEmail) {
      return res.status(400).json({ ok: false, error: 'User email required' });
    }
    
    const stmt = db.getDb().prepare(`
      SELECT * FROM notifications 
      WHERE user_email = ? 
      ORDER BY created_at DESC 
      LIMIT 20
    `);
    const notifications = stmt.all(userEmail);
    
    res.json({ ok: true, notifications });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ ok: false, error: 'Failed to fetch notifications' });
  }
}

// Routes
router.get('/', getRequests);
router.post('/', createRequest);
router.post('/:id/approve', approveRequest);
router.post('/:id/reject', rejectRequest);
router.get('/notifications', getUserNotifications);

module.exports = router;
