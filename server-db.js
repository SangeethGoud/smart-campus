const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const DB_PATH = path.join(__dirname, 'data', 'database.sqlite');
let db; // singleton DB instance

function init() {
  if (db) return; // already initialized

  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  db = new sqlite3.Database(DB_PATH, (err) => {
    if (err) {
      console.error('Failed to open DB:', err);
      return;
    }
    console.log('SQLite DB opened at', DB_PATH);
  });

  db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE,
      password TEXT,
      role TEXT,
      name TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
    db.run(`CREATE TABLE IF NOT EXISTS feedback (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      email TEXT,
      category TEXT,
      message TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
    db.run(`CREATE TABLE IF NOT EXISTS lost_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      item TEXT,
      location TEXT,
      description TEXT,
      status TEXT DEFAULT 'reported',
      reporter_email TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Announcements table
    db.run(`CREATE TABLE IF NOT EXISTS announcements (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      priority TEXT DEFAULT 'normal',
      category TEXT DEFAULT 'general',
      author_id INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME,
      FOREIGN KEY (author_id) REFERENCES users(id)
    )`);

    // Events table
    db.run(`CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      start_date DATETIME NOT NULL,
      end_date DATETIME,
      location TEXT,
      category TEXT DEFAULT 'general',
      max_attendees INTEGER,
      organizer_id INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME,
      FOREIGN KEY (organizer_id) REFERENCES users(id)
    )`);

    // Event registrations table
    db.run(`CREATE TABLE IF NOT EXISTS event_registrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      event_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      registered_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (event_id) REFERENCES events(id),
      FOREIGN KEY (user_id) REFERENCES users(id),
      UNIQUE(event_id, user_id)
    )`);

    // Clubs table
    db.run(`CREATE TABLE IF NOT EXISTS clubs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      category TEXT DEFAULT 'general',
      president_id INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME,
      FOREIGN KEY (president_id) REFERENCES users(id)
    )`);

    // Club memberships table
    db.run(`CREATE TABLE IF NOT EXISTS club_memberships (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      club_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (club_id) REFERENCES clubs(id),
      FOREIGN KEY (user_id) REFERENCES users(id),
      UNIQUE(club_id, user_id)
    )`);

    // Resources table
    db.run(`CREATE TABLE IF NOT EXISTS resources (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      category TEXT DEFAULT 'general',
      file_url TEXT,
      file_type TEXT,
      file_size INTEGER,
      download_count INTEGER DEFAULT 0,
      uploader_id INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME,
      FOREIGN KEY (uploader_id) REFERENCES users(id)
    )`);

    // Notifications table
    db.run(`CREATE TABLE IF NOT EXISTS notifications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_email TEXT NOT NULL,
      type TEXT DEFAULT 'info',
      message TEXT NOT NULL,
      is_read INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      read_at DATETIME
    )`);

    // Requests table (for event/club creation requests)
    db.run(`CREATE TABLE IF NOT EXISTS requests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT NOT NULL,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      date TEXT,
      requestedBy TEXT NOT NULL,
      status TEXT DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME
    )`);

    // Comments table (for events, clubs, announcements)
    db.run(`CREATE TABLE IF NOT EXISTS comments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      item_type TEXT NOT NULL,
      item_id INTEGER NOT NULL,
      user_email TEXT NOT NULL,
      user_name TEXT NOT NULL,
      user_role TEXT NOT NULL,
      comment TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // seed demo users if none exist
    db.get(`SELECT COUNT(1) as c FROM users`, (err, row) => {
      if (!err && row && row.c === 0) {
        const bcrypt = require('bcryptjs');
        const users = [
          { email: 'student@klh.edu', pass: 'student123', role: 'student', name: 'Demo Student' },
          { email: 'faculty@klh.edu', pass: 'faculty123', role: 'faculty', name: 'Demo Faculty' },
          { email: 'admin@klh.edu',   pass: 'admin123',   role: 'admin',   name: 'Demo Admin' }
        ];
        const stmt = db.prepare(`INSERT OR IGNORE INTO users (email,password,role,name) VALUES (?,?,?,?)`);
        users.forEach(u => {
          const hash = bcrypt.hashSync(u.pass, 10);
          stmt.run(u.email.toLowerCase(), hash, u.role, u.name);
        });
        stmt.finalize();
      }
    });
  });
}

// returns the singleton DB (initializes if needed)
function connect() {
  if (!db) init();
  return db;
}

function getDb() {
  if (!db) init();
  return db;
}

module.exports = { init, connect, getDb };