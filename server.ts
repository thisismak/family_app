import express, { Request, Response, Application, NextFunction } from 'express';
import { print } from 'listening-on';
import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import bcrypt from 'bcrypt';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import path from 'path';
import dotenv from 'dotenv';
import morgan from 'morgan';

// Load environment variables
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 8100;
const JWT_SECRET = process.env.JWT_SECRET; // 移除後備值

if (!JWT_SECRET) {
  console.error('Error: JWT_SECRET is not defined in .env');
  process.exit(1); // 退出以強制配置
}

console.log(`JWT_SECRET loaded (length: ${JWT_SECRET.length})`);

// Extend Request interface for type safety
interface AuthRequest extends Request {
  user?: { userId: number; username: string };
}

// Middleware
app.use(morgan('dev')); // Request logging
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: '10mb' }));

// Initialize SQLite database (singleton)
let db: Database | null = null;
async function initDb(): Promise<Database> {
  if (db) return db;
  try {
    db = await open({
      filename: './database.db',
      driver: sqlite3.Database,
    });
    console.log('Database connected');
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
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
}

// Authentication middleware
const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number; username: string };
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({ success: false, error: 'Invalid token' });
  }
};

// Consistent response format
const sendResponse = (res: Response, status: number, success: boolean, data?: any, error?: string) => {
  res.status(status).json({ success, data, error });
};

// Health check
app.get('/health', async (req: Request, res: Response) => {
  try {
    const db = await initDb();
    await db.get('SELECT 1');
    sendResponse(res, 200, true, { status: 'healthy' });
  } catch (error) {
    console.error('Health check error:', error);
    sendResponse(res, 500, false, null, 'Database unavailable');
  }
});

// Root route
app.get('/', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'), (err) => {
    if (err) {
      console.error('Error serving index.html:', err);
      sendResponse(res, 500, false, null, 'Failed to load page');
    }
  });
});

// Register
app.post('/register', async (req: Request, res: Response) => {
  const { username, email, password } = req.body;
  console.log('Registration attempt:', { username });

  if (!username || !password) {
    return sendResponse(res, 400, false, null, 'Username and password are required');
  }
  if (username.length < 3 || username.length > 32) {
    return sendResponse(res, 400, false, null, 'Username must be between 3 and 32 characters');
  }
  if (password.length < 6) {
    return sendResponse(res, 400, false, null, 'Password must be at least 6 characters');
  }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return sendResponse(res, 400, false, null, 'Invalid email format');
  }

  try {
    const db = await initDb();
    const existingUser = await db.get('SELECT id FROM user WHERE username = ? OR email = ?', [username, email || null]);
    if (existingUser) {
      return sendResponse(res, 409, false, null, 'Username or email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await db.run(
      'INSERT INTO user (username, password, avatar, email) VALUES (?, ?, NULL, ?)',
      [username, hashedPassword, email || null]
    );
    console.log('Registration successful:', { username });
    sendResponse(res, 201, true, { message: 'Registration successful' });
  } catch (error: any) {
    console.error('Register error:', error);
    sendResponse(res, 500, false, null, 'Server error');
  }
});

// Login
app.post('/login', async (req: Request, res: Response) => {
  const { username, password } = req.body;
  console.log('Login attempt:', { username });
  if (!username || !password) {
    return sendResponse(res, 400, false, null, 'Username and password are required');
  }
  try {
    const db = await initDb();
    const user = await db.get('SELECT id, username, password FROM user WHERE username = ?', [username]);
    if (!user) {
      return sendResponse(res, 401, false, null, 'Invalid username');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return sendResponse(res, 401, false, null, 'Invalid password');
    }
    const token = jwt.sign({ userId: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });
    console.log('Login successful:', { user_id: user.id });
    sendResponse(res, 200, true, { token, message: 'Login successful' }); // 使用 data.token
  } catch (error) {
    console.error('Login error:', error);
    sendResponse(res, 500, false, null, 'Server error');
  }
});

// Logout
app.post('/logout', (req: Request, res: Response) => {
  console.log('Logout requested');
  sendResponse(res, 200, true, { message: 'Logout successful' });
});

// Get user info
app.get('/user', authenticate, async (req: AuthRequest, res: Response) => {
  const user_id = req.user!.userId;
  try {
    const db = await initDb();
    const user = await db.get('SELECT id, username, email, avatar FROM user WHERE id = ?', [user_id]);
    if (!user) {
      return sendResponse(res, 404, false, null, 'User not found');
    }
    sendResponse(res, 200, true, { user_id: user.id, username: user.username, email: user.email, avatar: user.avatar });
  } catch (error) {
    console.error('User fetch error:', error);
    sendResponse(res, 500, false, null, 'Server error');
  }
});

// Update user email
app.patch('/user/email', authenticate, async (req: AuthRequest, res: Response) => {
  const user_id = req.user!.userId;
  const { email } = req.body;

  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return sendResponse(res, 400, false, null, 'Invalid email format');
  }

  try {
    const db = await initDb();
    const existingEmail = await db.get('SELECT id FROM user WHERE email = ? AND id != ?', [email, user_id]);
    if (existingEmail) {
      return sendResponse(res, 409, false, null, 'Email already in use');
    }

    await db.run('UPDATE user SET email = ? WHERE id = ?', [email || null, user_id]);
    console.log('Email updated:', { user_id, email });
    sendResponse(res, 200, true, { message: 'Email updated successfully' });
  } catch (error) {
    console.error('Update email error:', error);
    sendResponse(res, 500, false, null, 'Server error');
  }
});

// Create family
app.post('/family', authenticate, async (req: AuthRequest, res: Response) => {
  const user_id = req.user!.userId;
  const { name } = req.body;

  if (!name || name.length > 100) {
    return sendResponse(res, 400, false, null, 'Family name is required and must be 100 characters or less');
  }

  try {
    const db = await initDb();
    const existingFamily = await db.get('SELECT family_id FROM family_member WHERE user_id = ?', [user_id]);
    if (existingFamily) {
      return sendResponse(res, 403, false, null, 'User is already in a family');
    }

    const result = await db.run('INSERT INTO family (name, owner_id) VALUES (?, ?)', [name, user_id]);
    const family_id = result.lastID;
    await db.run('INSERT INTO family_member (family_id, user_id, role) VALUES (?, ?, ?)', [family_id, user_id, 'admin']);
    sendResponse(res, 201, true, { message: 'Family created', family_id });
  } catch (error) {
    console.error('Create family error:', error);
    sendResponse(res, 500, false, null, 'Server error');
  }
});

// Join family
app.post('/family/join', authenticate, async (req: AuthRequest, res: Response) => {
  const user_id = req.user!.userId;
  const { family_id } = req.body;

  if (!family_id) {
    return sendResponse(res, 400, false, null, 'Family ID is required');
  }

  try {
    const db = await initDb();
    const family = await db.get('SELECT id FROM family WHERE id = ?', [family_id]);
    if (!family) {
      return sendResponse(res, 404, false, null, 'Family not found');
    }

    const existingFamily = await db.get('SELECT family_id FROM family_member WHERE user_id = ?', [user_id]);
    if (existingFamily) {
      return sendResponse(res, 403, false, null, 'User is already in a family');
    }

    await db.run('INSERT INTO family_member (family_id, user_id, role) VALUES (?, ?, ?)', [family_id, user_id, 'member']);
    sendResponse(res, 200, true, { message: 'Joined family' });
  } catch (error) {
    console.error('Join family error:', error);
    sendResponse(res, 500, false, null, 'Server error');
  }
});

// Get user's families
app.get('/my-families', authenticate, async (req: AuthRequest, res: Response) => {
  const user_id = req.user!.userId;
  try {
    const db = await initDb();
    const families = await db.all(
      `SELECT f.id, f.name, f.owner_id, fm.role 
       FROM family f 
       LEFT JOIN family_member fm ON f.id = fm.family_id 
       WHERE f.owner_id = ? OR fm.user_id = ?`,
      [user_id, user_id]
    );
    sendResponse(res, 200, true, { families });
  } catch (error) {
    console.error('Fetch families error:', error);
    sendResponse(res, 500, false, null, 'Server error');
  }
});

// Get family members
app.get('/family/members', authenticate, async (req: AuthRequest, res: Response) => {
  const user_id = req.user!.userId;
  const family_id = req.query.family_id as string;

  if (!family_id) {
    return sendResponse(res, 400, false, null, 'Family ID is required');
  }

  try {
    const db = await initDb();
    const isMember = await db.get('SELECT user_id FROM family_member WHERE family_id = ? AND user_id = ?', [family_id, user_id]);
    if (!isMember) {
      return sendResponse(res, 403, false, null, 'User is not a member of this family');
    }

    const members = await db.all(
      `SELECT u.id AS user_id, u.username
       FROM family_member fm
       JOIN user u ON fm.user_id = u.id
       WHERE fm.family_id = ?`,
      [family_id]
    );
    sendResponse(res, 200, true, { members });
  } catch (error) {
    console.error('Fetch family members error:', error);
    sendResponse(res, 500, false, null, 'Server error');
  }
});

// Get calendar events
app.get('/calendar', authenticate, async (req: AuthRequest, res: Response) => {
  const user_id = req.user!.userId;
  try {
    const db = await initDb();
    const family = await db.get('SELECT family_id FROM family_member WHERE user_id = ?', [user_id]);
    if (!family) {
      return sendResponse(res, 403, false, null, 'User not in a family');
    }

    const events = await db.all(
      'SELECT id, title, start_datetime, end_datetime, reminder_datetime, creator_id FROM event WHERE family_id = ?',
      [family.family_id]
    );
    sendResponse(res, 200, true, { events });
  } catch (error) {
    console.error('Fetch calendar error:', error);
    sendResponse(res, 500, false, null, 'Server error');
  }
});

// Create calendar event
app.post('/calendar', authenticate, async (req: AuthRequest, res: Response) => {
  const user_id = req.user!.userId;
  const { title, start_datetime, end_datetime, reminder_datetime } = req.body;

  if (!title || !start_datetime) {
    return sendResponse(res, 400, false, null, 'Title and start date are required');
  }
  if (title.length > 100) {
    return sendResponse(res, 400, false, null, 'Title must be 100 characters or less');
  }

  try {
    const db = await initDb();
    const family = await db.get('SELECT family_id FROM family_member WHERE user_id = ?', [user_id]);
    if (!family) {
      return sendResponse(res, 403, false, null, 'User not in a family');
    }

    const created_at = new Date().toISOString();
    const result = await db.run(
      'INSERT INTO event (family_id, creator_id, title, start_datetime, end_datetime, reminder_datetime, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [family.family_id, user_id, title, start_datetime, end_datetime || null, reminder_datetime || null, created_at]
    );
    sendResponse(res, 201, true, { message: 'Event created', event_id: result.lastID });
  } catch (error) {
    console.error('Create event error:', error);
    sendResponse(res, 500, false, null, 'Server error');
  }
});

// Get tasks
app.get('/tasks', authenticate, async (req: AuthRequest, res: Response) => {
  const user_id = req.user!.userId;
  try {
    const db = await initDb();
    const family = await db.get('SELECT family_id FROM family_member WHERE user_id = ?', [user_id]);
    if (!family) {
      return sendResponse(res, 403, false, null, 'User not in a family');
    }

    const tasks = await db.all(
      'SELECT t.id, t.title, t.description, t.due_date, t.priority, t.status, t.creator_id, t.assignee_id, u.username AS assignee_username ' +
      'FROM task t LEFT JOIN user u ON t.assignee_id = u.id WHERE t.family_id = ?',
      [family.family_id]
    );
    sendResponse(res, 200, true, { tasks });
  } catch (error) {
    console.error('Fetch tasks error:', error);
    sendResponse(res, 500, false, null, 'Server error');
  }
});

// Create task
app.post('/tasks', authenticate, async (req: AuthRequest, res: Response) => {
  const user_id = req.user!.userId;
  const { title, description, assignee_id, due_date, priority } = req.body;

  if (!title || title.length > 100) {
    return sendResponse(res, 400, false, null, 'Title is required and must be 100 characters or less');
  }
  if (priority && !['low', 'medium', 'high'].includes(priority)) {
    return sendResponse(res, 400, false, null, 'Priority must be low, medium, or high');
  }

  try {
    const db = await initDb();
    const family = await db.get('SELECT family_id FROM family_member WHERE user_id = ?', [user_id]);
    if (!family) {
      return sendResponse(res, 403, false, null, 'User not in a family');
    }

    if (assignee_id) {
      const assignee = await db.get('SELECT user_id FROM family_member WHERE family_id = ? AND user_id = ?', [family.family_id, assignee_id]);
      if (!assignee) {
        return sendResponse(res, 400, false, null, 'Assignee is not a member of this family');
      }
    }

    const created_at = new Date().toISOString();
    const result = await db.run(
      'INSERT INTO task (family_id, creator_id, assignee_id, title, description, due_date, priority, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [family.family_id, user_id, assignee_id || null, title, description || null, due_date || null, priority || 'medium', 'pending', created_at]
    );
    sendResponse(res, 201, true, { message: 'Task created', task_id: result.lastID });
  } catch (error) {
    console.error('Create task error:', error);
    sendResponse(res, 500, false, null, 'Server error');
  }
});

// Update task status
app.patch('/tasks/:id', authenticate, async (req: AuthRequest, res: Response) => {
  const user_id = req.user!.userId;
  const task_id = parseInt(req.params.id);
  const { status } = req.body;

  if (!status || !['pending', 'completed'].includes(status)) {
    return sendResponse(res, 400, false, null, 'Status must be pending or completed');
  }

  try {
    const db = await initDb();
    const family = await db.get('SELECT family_id FROM family_member WHERE user_id = ?', [user_id]);
    if (!family) {
      return sendResponse(res, 403, false, null, 'User not in a family');
    }

    const task = await db.get('SELECT id FROM task WHERE id = ? AND family_id = ?', [task_id, family.family_id]);
    if (!task) {
      return sendResponse(res, 404, false, null, 'Task not found');
    }

    await db.run('UPDATE task SET status = ? WHERE id = ?', [status, task_id]);
    sendResponse(res, 200, true, { message: 'Task status updated' });
  } catch (error) {
    console.error('Update task error:', error);
    sendResponse(res, 500, false, null, 'Server error');
  }
});

// Get messages
app.get('/messages', authenticate, async (req: AuthRequest, res: Response) => {
  const user_id = req.user!.userId;
  try {
    const db = await initDb();
    const family = await db.get('SELECT family_id FROM family_member WHERE user_id = ?', [user_id]);
    if (!family) {
      return sendResponse(res, 403, false, null, 'User not in a family');
    }

    const messages = await db.all(
      'SELECT m.id, m.content, m.sent_at, m.sender_id, u.username AS sender_username ' +
      'FROM message m JOIN user u ON m.sender_id = u.id WHERE m.family_id = ? ORDER BY m.sent_at ASC',
      [family.family_id]
    );
    sendResponse(res, 200, true, { messages });
  } catch (error) {
    console.error('Fetch messages error:', error);
    sendResponse(res, 500, false, null, 'Server error');
  }
});

// Create message
app.post('/messages', authenticate, async (req: AuthRequest, res: Response) => {
  const user_id = req.user!.userId;
  const { content } = req.body;

  if (!content || content.length > 1000) {
    return sendResponse(res, 400, false, null, 'Message content is required and must be 1000 characters or less');
  }

  try {
    const db = await initDb();
    const family = await db.get('SELECT family_id FROM family_member WHERE user_id = ?', [user_id]);
    if (!family) {
      return sendResponse(res, 403, false, null, 'User not in a family');
    }

    const sent_at = new Date().toISOString();
    const result = await db.run(
      'INSERT INTO message (family_id, sender_id, content, sent_at) VALUES (?, ?, ?, ?)',
      [family.family_id, user_id, content, sent_at]
    );
    sendResponse(res, 201, true, { message: 'Message sent', message_id: result.lastID });
  } catch (error) {
    console.error('Create message error:', error);
    sendResponse(res, 500, false, null, 'Server error');
  }
});

// Start server
async function startServer() {
  try {
    await initDb();
    app.listen(PORT, () => {
      print(PORT);
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();