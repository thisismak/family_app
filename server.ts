import express, { Request, Response, Application } from 'express';
import { print } from 'listening-on';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import bcrypt from 'bcrypt';
import cors from 'cors';
import jwt from 'jsonwebtoken';

const app: Application = express();
const PORT = 8100;
const JWT_SECRET = 'your_jwt_secret_key'; // Replace with a secure key in production

// Middleware
app.use(cors());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: '10mb' }));

// Initialize SQLite database
async function initDb() {
  const db = await open({
    filename: './database.db',
    driver: sqlite3.Database
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS user (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL CHECK(length(username) <= 32),
      password TEXT NOT NULL,
      avatar TEXT,
      email TEXT UNIQUE
    );

    CREATE TABLE IF NOT EXISTS family (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL CHECK(length(name) <= 100),
      owner_id INTEGER NOT NULL,
      FOREIGN KEY (owner_id) REFERENCES user(id)
    );

    CREATE TABLE IF NOT EXISTS family_member (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      family_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      role TEXT NOT NULL DEFAULT 'member' CHECK(length(role) <= 20),
      FOREIGN KEY (family_id) REFERENCES family(id),
      FOREIGN KEY (user_id) REFERENCES user(id)
    );

    CREATE TABLE IF NOT EXISTS event (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      family_id INTEGER NOT NULL,
      creator_id INTEGER NOT NULL,
      title TEXT NOT NULL CHECK(length(title) <= 100),
      start_datetime TEXT NOT NULL,
      end_datetime TEXT,
      reminder_datetime TEXT,
      created_at TEXT NOT NULL,
      FOREIGN KEY (family_id) REFERENCES family(id),
      FOREIGN KEY (creator_id) REFERENCES user(id)
    );

    CREATE TABLE IF NOT EXISTS task (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      family_id INTEGER NOT NULL,
      creator_id INTEGER NOT NULL,
      assignee_id INTEGER,
      title TEXT NOT NULL CHECK(length(title) <= 100),
      description TEXT,
      due_date TEXT,
      priority TEXT NOT NULL DEFAULT 'medium' CHECK(priority IN ('low', 'medium', 'high')),
      status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending', 'completed')),
      created_at TEXT NOT NULL,
      FOREIGN KEY (family_id) REFERENCES family(id),
      FOREIGN KEY (creator_id) REFERENCES user(id),
      FOREIGN KEY (assignee_id) REFERENCES user(id)
    );

    CREATE TABLE IF NOT EXISTS message (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      family_id INTEGER NOT NULL,
      sender_id INTEGER NOT NULL,
      content TEXT NOT NULL CHECK(length(content) <= 1000),
      sent_at TEXT NOT NULL,
      FOREIGN KEY (family_id) REFERENCES family(id),
      FOREIGN KEY (sender_id) REFERENCES user(id)
    );
  `);

  return db;
}

// Authentication middleware
const authenticate = async (req: Request, res: Response, next: Function) => {
  const token = req.headers.authorization?.split(' ')[1] || req.query.token as string;
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
    (req as any).user_id = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Root route
app.get('/', (req: Request, res: Response) => {
  res.sendFile('index.html', { root: 'public' });
});

// Register
app.post('/register', async (req: Request, res: Response) => {
  const { username, email, password } = req.body;
  console.log('Registration attempt:', { username });

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }
  if (username.length < 3 || username.length > 32) {
    return res.status(400).json({ error: 'Username must be between 3 and 32 characters' });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }

  try {
    const db = await initDb();
    const existingUser = await db.get('SELECT id FROM user WHERE username = ?', [username]);
    if (existingUser) {
      return res.status(409).json({ error: 'Username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await db.run(
      'INSERT INTO user (username, password, avatar, email) VALUES (?, ?, NULL, ?)',
      [username, hashedPassword, email || null]
    );
    console.log('Registration successful:', { username });
    res.status(201).json({ message: 'Registration successful' });
  } catch (error: any) {
    console.error('Register error:', error);
    if (error.code === 'SQLITE_CONSTRAINT') {
      res.status(400).json({ error: 'Username or email already exists' });
    } else {
      res.status(500).json({ error: 'Server error' });
    }
  }
});

// Login
app.post('/login', async (req: Request, res: Response) => {
  const { username, password } = req.body;
  console.log('Login attempt:', { username });

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  try {
    const db = await initDb();
    const user = await db.get('SELECT id, username, password FROM user WHERE username = ?', [username]);
    if (!user) {
      return res.status(401).json({ error: 'Invalid username' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    const token = jwt.sign({ userId: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });
    console.log('Login successful:', { user_id: user.id });
    res.status(200).json({ token, message: 'Login successful' });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Logout
app.get('/logout', async (req: Request, res: Response) => {
  res.redirect('/'); // Client handles token removal
});

// Get user info
app.get('/user', authenticate, async (req: Request, res: Response) => {
  const user_id = (req as any).user_id;
  try {
    const db = await initDb();
    const user = await db.get('SELECT id, username, email, avatar FROM user WHERE id = ?', [user_id]);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json({ user_id: user.id, username: user.username, email: user.email, avatar: user.avatar });
  } catch (error) {
    console.error('User fetch error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update user email
app.patch('/user/email', authenticate, async (req: Request, res: Response) => {
  const user_id = (req as any).user_id;
  const { email } = req.body;

  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  try {
    const db = await initDb();
    const existingEmail = await db.get('SELECT id FROM user WHERE email = ? AND id != ?', [email, user_id]);
    if (existingEmail) {
      return res.status(409).json({ error: 'Email already in use' });
    }

    await db.run('UPDATE user SET email = ? WHERE id = ?', [email || null, user_id]);
    console.log('Email updated:', { user_id, email });
    res.status(200).json({ message: 'Email updated successfully' });
  } catch (error) {
    console.error('Update email error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create family
app.post('/family', authenticate, async (req: Request, res: Response) => {
  const user_id = (req as any).user_id;
  const { name } = req.body;

  if (!name || name.length > 100) {
    return res.status(400).json({ error: 'Family name is required and must be 100 characters or less' });
  }

  try {
    const db = await initDb();
    const existingFamily = await db.get('SELECT family_id FROM family_member WHERE user_id = ?', [user_id]);
    if (existingFamily) {
      return res.status(403).json({ error: 'User is already in a family' });
    }

    const result = await db.run('INSERT INTO family (name, owner_id) VALUES (?, ?)', [name, user_id]);
    const family_id = result.lastID;
    await db.run('INSERT INTO family_member (family_id, user_id, role) VALUES (?, ?, ?)', [family_id, user_id, 'admin']);
    res.status(200).json({ message: 'Family created', family_id });
  } catch (error) {
    console.error('Create family error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Join family
app.post('/family/join', authenticate, async (req: Request, res: Response) => {
  const user_id = (req as any).user_id;
  const { family_id } = req.body;

  if (!family_id) {
    return res.status(400).json({ error: 'Family ID is required' });
  }

  try {
    const db = await initDb();
    const family = await db.get('SELECT id FROM family WHERE id = ?', [family_id]);
    if (!family) {
      return res.status(404).json({ error: 'Family not found' });
    }

    const existingFamily = await db.get('SELECT family_id FROM family_member WHERE user_id = ?', [user_id]);
    if (existingFamily) {
      return res.status(403).json({ error: 'User is already in a family' });
    }

    await db.run('INSERT INTO family_member (family_id, user_id, role) VALUES (?, ?, ?)', [family_id, user_id, 'member']);
    res.status(200).json({ message: 'Joined family' });
  } catch (error) {
    console.error('Join family error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user's families
app.get('/my-families', authenticate, async (req: Request, res: Response) => {
  const user_id = (req as any).user_id;
  try {
    const db = await initDb();
    const families = await db.all(
      `SELECT f.id, f.name, f.owner_id, fm.role 
       FROM family f 
       LEFT JOIN family_member fm ON f.id = fm.family_id 
       WHERE f.owner_id = ? OR fm.user_id = ?`,
      [user_id, user_id]
    );
    res.status(200).json({ families });
  } catch (error) {
    console.error('Fetch families error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get family members
app.get('/family/members', authenticate, async (req: Request, res: Response) => {
  const user_id = (req as any).user_id;
  const family_id = req.query.family_id as string;

  if (!family_id) {
    return res.status(400).json({ error: 'Family ID is required' });
  }

  try {
    const db = await initDb();
    const isMember = await db.get('SELECT user_id FROM family_member WHERE family_id = ? AND user_id = ?', [family_id, user_id]);
    if (!isMember) {
      return res.status(403).json({ error: 'User is not a member of this family' });
    }

    const members = await db.all(
      `SELECT u.id AS user_id, u.username
       FROM family_member fm
       JOIN user u ON fm.user_id = u.id
       WHERE fm.family_id = ?`,
      [family_id]
    );
    res.status(200).json({ members });
  } catch (error) {
    console.error('Fetch family members error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get calendar events
app.get('/calendar', authenticate, async (req: Request, res: Response) => {
  const user_id = (req as any).user_id;
  try {
    const db = await initDb();
    const family = await db.get('SELECT family_id FROM family_member WHERE user_id = ?', [user_id]);
    if (!family) {
      return res.status(403).json({ error: 'User not in a family' });
    }

    const events = await db.all(
      'SELECT id, title, start_datetime, end_datetime, reminder_datetime, creator_id FROM event WHERE family_id = ?',
      [family.family_id]
    );
    res.status(200).json({ events });
  } catch (error) {
    console.error('Fetch calendar error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create calendar event
app.post('/calendar', authenticate, async (req: Request, res: Response) => {
  const user_id = (req as any).user_id;
  const { title, start_datetime, end_datetime, reminder_datetime } = req.body;

  if (!title || !start_datetime) {
    return res.status(400).json({ error: 'Title and start date are required' });
  }
  if (title.length > 100) {
    return res.status(400).json({ error: 'Title must be 100 characters or less' });
  }

  try {
    const db = await initDb();
    const family = await db.get('SELECT family_id FROM family_member WHERE user_id = ?', [user_id]);
    if (!family) {
      return res.status(403).json({ error: 'User not in a family' });
    }

    const created_at = new Date().toISOString();
    const result = await db.run(
      'INSERT INTO event (family_id, creator_id, title, start_datetime, end_datetime, reminder_datetime, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [family.family_id, user_id, title, start_datetime, end_datetime || null, reminder_datetime || null, created_at]
    );
    res.status(200).json({ message: 'Event created', event_id: result.lastID });
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get tasks
app.get('/tasks', authenticate, async (req: Request, res: Response) => {
  const user_id = (req as any).user_id;
  try {
    const db = await initDb();
    const family = await db.get('SELECT family_id FROM family_member WHERE user_id = ?', [user_id]);
    if (!family) {
      return res.status(403).json({ error: 'User not in a family' });
    }

    const tasks = await db.all(
      'SELECT t.id, t.title, t.description, t.due_date, t.priority, t.status, t.creator_id, t.assignee_id, u.username AS assignee_username ' +
      'FROM task t LEFT JOIN user u ON t.assignee_id = u.id WHERE t.family_id = ?',
      [family.family_id]
    );
    res.status(200).json({ tasks });
  } catch (error) {
    console.error('Fetch tasks error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create task
app.post('/tasks', authenticate, async (req: Request, res: Response) => {
  const user_id = (req as any).user_id;
  const { title, description, assignee_id, due_date, priority } = req.body;

  if (!title || title.length > 100) {
    return res.status(400).json({ error: 'Title is required and must be 100 characters or less' });
  }
  if (priority && !['low', 'medium', 'high'].includes(priority)) {
    return res.status(400).json({ error: 'Priority must be low, medium, or high' });
  }

  try {
    const db = await initDb();
    const family = await db.get('SELECT family_id FROM family_member WHERE user_id = ?', [user_id]);
    if (!family) {
      return res.status(403).json({ error: 'User not in a family' });
    }

    if (assignee_id) {
      const assignee = await db.get('SELECT user_id FROM family_member WHERE family_id = ? AND user_id = ?', [family.family_id, assignee_id]);
      if (!assignee) {
        return res.status(400).json({ error: 'Assignee is not a member of this family' });
      }
    }

    const created_at = new Date().toISOString();
    const result = await db.run(
      'INSERT INTO task (family_id, creator_id, assignee_id, title, description, due_date, priority, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [family.family_id, user_id, assignee_id || null, title, description || null, due_date || null, priority || 'medium', 'pending', created_at]
    );
    res.status(201).json({ message: 'Task created', task_id: result.lastID });
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get messages
app.get('/messages', authenticate, async (req: Request, res: Response) => {
  const user_id = (req as any).user_id;
  try {
    const db = await initDb();
    const family = await db.get('SELECT family_id FROM family_member WHERE user_id = ?', [user_id]);
    if (!family) {
      return res.status(403).json({ error: 'User not in a family' });
    }

    const messages = await db.all(
      'SELECT m.id, m.content, m.sent_at, m.sender_id, u.username AS sender_username ' +
      'FROM message m JOIN user u ON m.sender_id = u.id WHERE m.family_id = ? ORDER BY m.sent_at ASC',
      [family.family_id]
    );
    res.status(200).json({ messages });
  } catch (error) {
    console.error('Fetch messages error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create message
app.post('/messages', authenticate, async (req: Request, res: Response) => {
  const user_id = (req as any).user_id;
  const { content } = req.body;

  if (!content || content.length > 1000) {
    return res.status(400).json({ error: 'Message content is required and must be 1000 characters or less' });
  }

  try {
    const db = await initDb();
    const family = await db.get('SELECT family_id FROM family_member WHERE user_id = ?', [user_id]);
    if (!family) {
      return res.status(403).json({ error: 'User not in a family' });
    }

    const sent_at = new Date().toISOString();
    const result = await db.run(
      'INSERT INTO message (family_id, sender_id, content, sent_at) VALUES (?, ?, ?, ?)',
      [family.family_id, user_id, content, sent_at]
    );
    res.status(200).json({ message: 'Message sent', message_id: result.lastID });
  } catch (error) {
    console.error('Create message error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Start server
app.listen(PORT, () => {
  print(PORT);
});