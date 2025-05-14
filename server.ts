import express, { Request, Response, Application, RequestHandler } from 'express';
import { print } from 'listening-on';
import { randomUUID } from 'node:crypto';
import sqlite3 from 'sqlite3';
import bcrypt from 'bcrypt';
import cors from 'cors';

// Interfaces
interface User {
  id: number;
  username: string;
  password: string;
  avatar: string | null;
  email: string | null;
}

interface Session {
  id: number;
  token: string;
  user_id: number;
}

// Initialize SQLite database
const db = new sqlite3.Database('db.sqlite3', (err) => {
  if (err) {
    console.error('Database connection error:', err.message);
  } else {
    console.log('Connected to SQLite database');
  }
});

// Create Express app
const server: Application = express();

// Middleware
server.use(cors()); // Enable CORS for cross-origin requests
server.use(express.static('public'));
server.use(express.urlencoded({ extended: true }));
server.use(express.json({ limit: '10mb' }));

// Root route to serve index.html
server.get('/', (req: Request, res: Response) => {
  res.sendFile('index.html', { root: 'public' });
});

// Authentication middleware
const authenticate: RequestHandler = (req: Request, res: Response, next: Function) => {
  const token = req.headers.authorization || (req.query.token as string) || '';
  db.get('SELECT user_id FROM session WHERE token = ?', [token], (err, session: Session | undefined) => {
    if (err) {
      console.error('Database error in authenticate:', err.message, err.stack);
      res.status(500).json({ error: 'Server error' });
      return;
    }
    if (!session) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    (req as any).user_id = session.user_id;
    next();
  });
};

// Handle user registration
const registerHandler: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  const { username, email, password } = req.body;
  console.log('Registration attempt:', { username });

  if (!username) {
    res.status(400).json({ error: 'Username is required' });
    return;
  }
  if (!password) {
    res.status(400).json({ error: 'Password is required' });
    return;
  }
  if (username.length < 3 || username.length > 32) {
    res.status(400).json({ error: 'Username must be between 3 and 32 characters' });
    return;
  }
  if (password.length < 6) {
    res.status(400).json({ error: 'Password must be at least 6 characters' });
    return;
  }

  db.get('SELECT id FROM user WHERE username = ?', [username], async (err, row: User | undefined) => {
    if (err) {
      console.error('Database error in register:', err.message, err.stack);
      res.status(500).json({ error: 'Server error' });
      return;
    }
    if (row) {
      res.status(409).json({ error: 'Username already exists' });
      return;
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      db.run(
        'INSERT INTO user (username, password, avatar, email) VALUES (?, ?, NULL, ?)',
        [username, hashedPassword, email || null],
        function (err) {
          if (err) {
            console.error('Insert user error:', err.message, err.stack);
            res.status(500).json({ error: 'Server error' });
            return;
          }
          console.log('Registration successful:', { id: this.lastID, username });
          res.status(200).json({ message: 'Registration successful' });
        }
      );
    } catch (hashErr) {
      console.error('Password hashing error:', hashErr);
      res.status(500).json({ error: 'Server error' });
    }
  });
};

server.post('/register', registerHandler);

// Handle user login
const loginHandler: RequestHandler = (req: Request, res: Response): void => {
  const { username, password } = req.body;
  console.log('Login attempt:', { username });

  if (!username) {
    console.log('Missing username');
    res.status(400).json({ error: 'Username is required' });
    return;
  }
  if (!password) {
    console.log('Missing password');
    res.status(400).json({ error: 'Password is required' });
    return;
  }

  db.get('SELECT id, username, password FROM user WHERE username = ?', [username], async (err, user: User | undefined) => {
    if (err) {
      console.error('Database error in login:', err.message, err.stack);
      res.status(500).json({ error: 'Server error' });
      return;
    }
    if (!user) {
      console.log('User not found:', username);
      res.status(401).json({ error: 'Invalid username' });
      return;
    }

    try {
      console.log('Comparing passwords for:', username);
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        console.log('Invalid password for:', username);
        res.status(401).json({ error: 'Invalid password' });
        return;
      }

      const token = randomUUID();
      db.run('INSERT INTO session (token, user_id) VALUES (?, ?)', [token, user.id], (err) => {
        if (err) {
          console.error('Insert session error:', err.message, err.stack);
          res.status(500).json({ error: 'Server error' });
          return;
        }
        console.log('Login successful:', { user_id: user.id, token });
        res.status(200).json({ token });
      });
    } catch (hashErr) {
      console.error('Password verification error:', hashErr);
      res.status(500).json({ error: 'Server error' });
    }
  });
};

server.post('/login', loginHandler);

// Handle user logout
const logoutHandler: RequestHandler = (req: Request, res: Response): void => {
  const token = req.query.token as string;
  db.run('DELETE FROM session WHERE token = ?', [token], (err) => {
    if (err) {
      console.error('Delete session error:', err.message, err.stack);
    }
    res.redirect('/');
  });
};

server.get('/logout', logoutHandler);

// Get user info
const userHandler: RequestHandler = (req: Request, res: Response): void => {
  const user_id = (req as any).user_id;
  db.get('SELECT username, email FROM user WHERE id = ?', [user_id], (err, user: User | undefined) => {
    if (err) {
      console.error('Database error in user:', err.message, err.stack);
      res.status(500).json({ error: 'Server error' });
      return;
    }
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    res.status(200).json({ username: user.username, email: user.email });
  });
};

server.get('/user', authenticate, userHandler);

// Update user email
const updateEmailHandler: RequestHandler = (req: Request, res: Response): void => {
  const user_id = (req as any).user_id;
  const { email } = req.body;

  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    res.status(400).json({ error: 'Invalid email format' });
    return;
  }

  db.get('SELECT id FROM user WHERE email = ? AND id != ?', [email, user_id], (err, row: User | undefined) => {
    if (err) {
      console.error('Database error in email check:', err.message, err.stack);
      res.status(500).json({ error: 'Server error' });
      return;
    }
    if (row) {
      res.status(409).json({ error: 'Email already in use' });
      return;
    }

    db.run('UPDATE user SET email = ? WHERE id = ?', [email || null, user_id], function (err) {
      if (err) {
        console.error('Update email error:', err.message, err.stack);
        res.status(500).json({ error: 'Server error' });
        return;
      }
      console.log('Email updated:', { user_id, email: email || null, rowsAffected: this.changes });
      res.status(200).json({ message: 'Email updated successfully' });
    });
  });
};

server.patch('/user/email', authenticate, updateEmailHandler);

// Handle family creation
const createFamilyHandler: RequestHandler = (req: Request, res: Response): void => {
  const user_id = (req as any).user_id;
  const { name } = req.body;

  if (!name) {
    res.status(400).json({ error: 'Family name is required' });
    return;
  }
  if (name.length > 100) {
    res.status(400).json({ error: 'Family name must be 100 characters or less' });
    return;
  }

  db.get(
    'SELECT family_id FROM family_member WHERE user_id = ?',
    [user_id],
    (err, row: { family_id: number } | undefined) => {
      if (err) {
        console.error('Database error in create family:', err.message, err.stack);
        res.status(500).json({ error: 'Server error' });
        return;
      }
      if (row) {
        res.status(403).json({ error: 'User is already in a family' });
        return;
      }

      db.run(
        'INSERT INTO family (name, owner_id) VALUES (?, ?)',
        [name, user_id],
        function (err) {
          if (err) {
            console.error('Insert family error:', err.message, err.stack);
            res.status(500).json({ error: 'Server error' });
            return;
          }
          const family_id = this.lastID;
          db.run(
            'INSERT INTO family_member (family_id, user_id, role) VALUES (?, ?, ?)',
            [family_id, user_id, 'admin'],
            (err) => {
              if (err) {
                console.error('Insert family_member error:', err.message, err.stack);
                res.status(500).json({ error: 'Server error' });
                return;
              }
              res.status(200).json({ message: 'Family created', family_id });
            }
          );
        }
      );
    }
  );
};

server.post('/family', authenticate, createFamilyHandler);

// Handle joining a family
const joinFamilyHandler: RequestHandler = (req: Request, res: Response): void => {
  const user_id = (req as any).user_id;
  const { family_id } = req.body;

  if (!family_id) {
    res.status(400).json({ error: 'Family ID is required' });
    return;
  }

  db.get(
    'SELECT id FROM family WHERE id = ?',
    [family_id],
    (err, row: { id: number } | undefined) => {
      if (err) {
        console.error('Database error in join family:', err.message, err.stack);
        res.status(500).json({ error: 'Server error' });
        return;
      }
      if (!row) {
        res.status(404).json({ error: 'Family not found' });
        return;
      }

      db.get(
        'SELECT family_id FROM family_member WHERE user_id = ?',
        [user_id],
        (err, row: { family_id: number } | undefined) => {
          if (err) {
            console.error('Database error in join family:', err.message, err.stack);
            res.status(500).json({ error: 'Server error' });
            return;
          }
          if (row) {
            res.status(403).json({ error: 'User is already in a family' });
            return;
          }

          db.run(
            'INSERT INTO family_member (family_id, user_id, role) VALUES (?, ?, ?)',
            [family_id, user_id, 'member'],
            (err) => {
              if (err) {
                console.error('Insert family_member error:', err.message, err.stack);
                res.status(500).json({ error: 'Server error' });
                return;
              }
              res.status(200).json({ message: 'Joined family' });
            }
          );
        }
      );
    }
  );
};

server.post('/family/join', authenticate, joinFamilyHandler);

// Handle retrieving user's families
const myFamiliesHandler: RequestHandler = (req: Request, res: Response): void => {
  const user_id = (req as any).user_id;

  db.all(
    `SELECT f.id, f.name, f.owner_id, fm.role 
     FROM family f 
     LEFT JOIN family_member fm ON f.id = fm.family_id 
     WHERE f.owner_id = ? OR fm.user_id = ?`,
    [user_id, user_id],
    (err, families: any[]) => {
      if (err) {
        console.error('Database error in my-families:', err.message, err.stack);
        res.status(500).json({ error: 'Server error' });
        return;
      }
      res.status(200).json({ families });
    }
  );
};

server.get('/my-families', authenticate, myFamiliesHandler);

// Handle calendar events (GET)
const calendarHandler: RequestHandler = (req: Request, res: Response): void => {
  const user_id = (req as any).user_id;

  db.get(
    'SELECT family_id FROM family_member WHERE user_id = ?',
    [user_id],
    (err, row: { family_id: number } | undefined) => {
      if (err) {
        console.error('Database error in calendar:', err.message, err.stack);
        res.status(500).json({ error: 'Server error' });
        return;
      }
      if (!row) {
        res.status(403).json({ error: 'User not in a family' });
        return;
      }

      db.all(
        'SELECT id, title, start_datetime, end_datetime, reminder_datetime, creator_id FROM event WHERE family_id = ?',
        [row.family_id],
        (err, events: any[]) => {
          if (err) {
            console.error('Database error in calendar:', err.message, err.stack);
            res.status(500).json({ error: 'Server error' });
            return;
          }
          res.status(200).json({ events });
        }
      );
    }
  );
};

server.get('/calendar', authenticate, calendarHandler);

// Handle calendar events (POST)
const createEventHandler: RequestHandler = (req: Request, res: Response): void => {
  const user_id = (req as any).user_id;
  const { title, start_datetime, end_datetime, reminder_datetime } = req.body;

  if (!title || !start_datetime) {
    res.status(400).json({ error: 'Title and start date are required' });
    return;
  }
  if (title.length > 100) {
    res.status(400).json({ error: 'Title must be 100 characters or less' });
    return;
  }

  db.get(
    'SELECT family_id FROM family_member WHERE user_id = ?',
    [user_id],
    (err, row: { family_id: number } | undefined) => {
      if (err) {
        console.error('Database error in create event:', err.message, err.stack);
        res.status(500).json({ error: 'Server error' });
        return;
      }
      if (!row) {
        res.status(403).json({ error: 'User not in a family' });
        return;
      }

      const created_at = new Date().toISOString();
      db.run(
        'INSERT INTO event (family_id, creator_id, title, start_datetime, end_datetime, reminder_datetime, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [row.family_id, user_id, title, start_datetime, end_datetime || null, reminder_datetime || null, created_at],
        function (err) {
          if (err) {
            console.error('Insert event error:', err.message, err.stack);
            res.status(500).json({ error: 'Server error' });
            return;
          }
          res.status(200).json({ message: 'Event created', event_id: this.lastID });
        }
      );
    }
  );
};

server.post('/calendar', authenticate, createEventHandler);

// Handle tasks (GET)
const tasksHandler: RequestHandler = (req: Request, res: Response): void => {
  const user_id = (req as any).user_id;

  db.get(
    'SELECT family_id FROM family_member WHERE user_id = ?',
    [user_id],
    (err, row: { family_id: number } | undefined) => {
      if (err) {
        console.error('Database error in tasks:', err.message, err.stack);
        res.status(500).json({ error: 'Server error' });
        return;
      }
      if (!row) {
        res.status(403).json({ error: 'User not in a family' });
        return;
      }

      db.all(
        'SELECT t.id, t.title, t.description, t.due_date, t.priority, t.status, t.creator_id, t.assignee_id, u.username AS assignee_username ' +
        'FROM task t LEFT JOIN user u ON t.assignee_id = u.id WHERE t.family_id = ?',
        [row.family_id],
        (err, tasks: any[]) => {
          if (err) {
            console.error('Database error in tasks:', err.message, err.stack);
            res.status(500).json({ error: 'Server error' });
            return;
          }
          res.status(200).json({ tasks });
        }
      );
    }
  );
};

server.get('/tasks', authenticate, tasksHandler);

// Handle tasks (POST)
const createTaskHandler: RequestHandler = (req: Request, res: Response): void => {
  const user_id = (req as any).user_id;
  const { title, description, assignee_id, due_date, priority, status } = req.body;

  if (!title) {
    res.status(400).json({ error: 'Title is required' });
    return;
  }
  if (title.length > 100) {
    res.status(400).json({ error: 'Title must be 100 characters or less' });
    return;
  }
  if (priority && !['low', 'medium', 'high'].includes(priority)) {
    res.status(400).json({ error: 'Invalid priority' });
    return;
  }
  if (status && !['pending', 'completed'].includes(status)) {
    res.status(400).json({ error: 'Invalid status' });
    return;
  }

  db.get(
    'SELECT family_id FROM family_member WHERE user_id = ?',
    [user_id],
    (err, row: { family_id: number } | undefined) => {
      if (err) {
        console.error('Database error in create task:', err.message, err.stack);
        res.status(500).json({ error: 'Server error' });
        return;
      }
      if (!row) {
        res.status(403).json({ error: 'User not in a family' });
        return;
      }

      if (assignee_id) {
        db.get(
          'SELECT user_id FROM family_member WHERE family_id = ? AND user_id = ?',
          [row.family_id, assignee_id],
          (err, assignee: { user_id: number } | undefined) => {
            if (err) {
              console.error('Database error in assignee check:', err.message, err.stack);
              res.status(500).json({ error: 'Server error' });
              return;
            }
            if (!assignee) {
              res.status(400).json({ error: 'Assignee not in family' });
              return;
            }
            insertTask(row.family_id);
          }
        );
      } else {
        insertTask(row.family_id);
      }

      function insertTask(family_id: number) {
        const created_at = new Date().toISOString();
        db.run(
          'INSERT INTO task (family_id, creator_id, assignee_id, title, description, due_date, priority, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
          [family_id, user_id, assignee_id || null, title, description || null, due_date || null, priority || 'medium', status || 'pending', created_at],
          function (err) {
            if (err) {
              console.error('Insert task error:', err.message, err.stack);
              res.status(500).json({ error: 'Server error' });
              return;
            }
            res.status(200).json({ message: 'Task created', task_id: this.lastID });
          }
        );
      }
    }
  );
};

server.post('/tasks', authenticate, createTaskHandler);

// Handle messages (GET)
const messagesHandler: RequestHandler = (req: Request, res: Response): void => {
  const user_id = (req as any).user_id;

  db.get(
    'SELECT family_id FROM family_member WHERE user_id = ?',
    [user_id],
    (err, row: { family_id: number } | undefined) => {
      if (err) {
        console.error('Database error in messages:', err.message, err.stack);
        res.status(500).json({ error: 'Server error' });
        return;
      }
      if (!row) {
        res.status(403).json({ error: 'User not in a family' });
        return;
      }

      db.all(
        'SELECT m.id, m.content, m.sent_at, m.sender_id, u.username AS sender_username ' +
        'FROM message m JOIN user u ON m.sender_id = u.id WHERE m.family_id = ? ORDER BY m.sent_at ASC',
        [row.family_id],
        (err, messages: any[]) => {
          if (err) {
            console.error('Database error in messages:', err.message, err.stack);
            res.status(500).json({ error: 'Server error' });
            return;
          }
          res.status(200).json({ messages });
        }
      );
    }
  );
};

server.get('/messages', authenticate, messagesHandler);

// Handle messages (POST)
const createMessageHandler: RequestHandler = (req: Request, res: Response): void => {
  const user_id = (req as any).user_id;
  const { content } = req.body;

  if (!content) {
    res.status(400).json({ error: 'Message content is required' });
    return;
  }
  if (content.length > 1000) {
    res.status(400).json({ error: 'Message must be 1000 characters or less' });
    return;
  }

  db.get(
    'SELECT family_id FROM family_member WHERE user_id = ?',
    [user_id],
    (err, row: { family_id: number } | undefined) => {
      if (err) {
        console.error('Database error in create message:', err.message, err.stack);
        res.status(500).json({ error: 'Server error' });
        return;
      }
      if (!row) {
        res.status(403).json({ error: 'User not in a family' });
        return;
      }

      const sent_at = new Date().toISOString();
      db.run(
        'INSERT INTO message (family_id, sender_id, content, sent_at) VALUES (?, ?, ?, ?)',
        [row.family_id, user_id, content, sent_at],
        function (err) {
          if (err) {
            console.error('Insert message error:', err.message, err.stack);
            res.status(500).json({ error: 'Server error' });
            return;
          }
          res.status(200).json({ message: 'Message sent', message_id: this.lastID });
        }
      );
    }
  );
};

server.post('/messages', authenticate, createMessageHandler);

// Start server
server.listen(8100, () => {
  print(8100);
});