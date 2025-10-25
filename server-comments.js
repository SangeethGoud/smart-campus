const express = require('express');
const router = express.Router();
const { getDb } = require('./server-db');

// Get comments for an item (event, club, announcement)
router.get('/:itemType/:itemId', (req, res) => {
  const { itemType, itemId } = req.params;
  
  try {
    const db = getDb();
    const stmt = db.prepare(`
      SELECT * FROM comments 
      WHERE item_type = ? AND item_id = ? 
      ORDER BY created_at DESC
    `);
    const comments = stmt.all(itemType, itemId);
    
    res.json({ ok: true, comments });
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ ok: false, error: 'Failed to fetch comments' });
  }
});

// Add a comment
router.post('/', (req, res) => {
  const { itemType, itemId, userEmail, userName, userRole, comment } = req.body;
  
  if (!itemType || !itemId || !userEmail || !userName || !comment) {
    return res.status(400).json({ ok: false, error: 'Missing required fields' });
  }
  
  try {
    const db = getDb();
    const stmt = db.prepare(`
      INSERT INTO comments (item_type, item_id, user_email, user_name, user_role, comment)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    
    const result = stmt.run(itemType, itemId, userEmail, userName, userRole, comment);
    
    res.json({ 
      ok: true, 
      comment: {
        id: result.lastID,
        item_type: itemType,
        item_id: itemId,
        user_email: userEmail,
        user_name: userName,
        user_role: userRole,
        comment: comment,
        created_at: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ ok: false, error: 'Failed to add comment' });
  }
});

// Delete a comment (admin only)
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  
  try {
    const db = getDb();
    const stmt = db.prepare('DELETE FROM comments WHERE id = ?');
    stmt.run(id);
    
    res.json({ ok: true });
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({ ok: false, error: 'Failed to delete comment' });
  }
});

module.exports = router;
