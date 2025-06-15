import express, { Request, Response, Application, NextFunction } from 'express';
import { print } from 'listening-on';
import { randomUUID } from 'node:crypto';
import bcrypt from 'bcrypt';
import cors from 'cors';
import dotenv from 'dotenv';
import { AppDataSource } from './ormconfig';
import { User } from './src/entities/User';
import { Session } from './src/entities/Session';
import { Family } from './src/entities/Family';
import { FamilyMember } from './src/entities/FamilyMember';
import { Event } from './src/entities/Event';
import { Task } from './src/entities/Task';
import { Message } from './src/entities/Message';
import { Not } from 'typeorm';

// Load environment variables
dotenv.config();

// Initialize Express app
const server: Application = express();

// Middleware
server.use(cors());
server.use(express.static('public'));
server.use(express.urlencoded({ extended: true }));
server.use(express.json({ limit: '10mb' }));

// Initialize TypeORM
AppDataSource.initialize()
  .then(() => console.log('TypeORM connected to SQLite database'))
  .catch((err) => console.error('TypeORM initialization error:', err));

// Root route to serve index.html
server.get('/', (req: Request, res: Response) => {
  res.sendFile('index.html', { root: 'public' });
});

// Authentication middleware
const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization || (req.query.token as string) || '';
  try {
    const session = await AppDataSource.getRepository(Session).findOneBy({ token });
    if (!session) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    (req as any).user_id = session.user_id;
    next();
  } catch (err) {
    console.error('Authentication error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Handle user registration
const registerHandler = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;
  console.log('Registration attempt:', { username });

  if (!username) return res.status(400).json({ error: 'Username is required' });
  if (!password) return res.status(400).json({ error: 'Password is required' });
  if (username.length < 3 || username.length > 32) {
    return res.status(400).json({ error: 'Username must be between 3 and 32 characters' });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }

  try {
    const userRepository = AppDataSource.getRepository(User);
    const existingUser = await userRepository.findOneBy({ username });
    if (existingUser) {
      return res.status(409).json({ error: 'Username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User();
    user.username = username;
    user.password = hashedPassword;
    user.email = email || null;
    user.avatar = null;
    await userRepository.save(user);

    console.log('Registration successful:', { id: user.id, username });
    res.status(200).json({ message: 'Registration successful' });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

server.post('/register', registerHandler);

// Handle user login
const loginHandler = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  console.log('Login attempt:', { username });

  if (!username) return res.status(400).json({ error: 'Username is required' });
  if (!password) return res.status(400).json({ error: 'Password is required' });

  try {
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOneBy({ username });
    if (!user) {
      console.log('User not found:', username);
      return res.status(401).json({ error: 'Invalid username' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Invalid password for:', username);
      return res.status(401).json({ error: 'Invalid password' });
    }

    const sessionRepository = AppDataSource.getRepository(Session);
    const token = randomUUID();
    const session = new Session();
    session.token = token;
    session.user_id = user.id;
    session.expires = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days
    await sessionRepository.save(session);

    console.log('Login successful:', { user_id: user.id, token });
    res.status(200).json({ token });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

server.post('/login', loginHandler);

// Handle user logout
const logoutHandler = async (req: Request, res: Response) => {
  const token = req.query.token as string;
  try {
    await AppDataSource.getRepository(Session).delete({ token });
    res.redirect('/');
  } catch (err) {
    console.error('Logout error:', err);
    res.redirect('/');
  }
};

server.get('/logout', logoutHandler);

// Get user info
const userHandler = async (req: Request, res: Response) => {
  const user_id = (req as any).user_id;
  try {
    const user = await AppDataSource.getRepository(User).findOne({
      where: { id: user_id },
      select: ['id', 'username', 'email', 'avatar'],
    });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json({ user_id: user.id, username: user.username, email: user.email, avatar: user.avatar });
  } catch (err) {
    console.error('User info error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

server.get('/user', authenticate, userHandler);

// Update user email
const updateEmailHandler = async (req: Request, res: Response) => {
  const user_id = (req as any).user_id;
  const { email } = req.body;

  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  try {
    const userRepository = AppDataSource.getRepository(User);
    const existingEmail = await userRepository.findOneBy({ email, id: Not(user_id) });
    if (existingEmail) {
      return res.status(409).json({ error: 'Email already in use' });
    }

    await userRepository.update({ id: user_id }, { email: email || null });
    console.log('Email updated:', { user_id, email: email || null });
    res.status(200).json({ message: 'Email updated successfully' });
  } catch (err) {
    console.error('Update email error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

server.patch('/user/email', authenticate, updateEmailHandler);

// Handle family creation
const createFamilyHandler = async (req: Request, res: Response) => {
  const user_id = (req as any).user_id;
  const { name } = req.body;

  if (!name) return res.status(400).json({ error: 'Family name is required' });
  if (name.length > 100) return res.status(400).json({ error: 'Family name must be 100 characters or less' });

  try {
    const familyMemberRepository = AppDataSource.getRepository(FamilyMember);
    const existingMembership = await familyMemberRepository.findOneBy({ user_id });
    if (existingMembership) {
      return res.status(403).json({ error: 'User is already in a family' });
    }

    const familyRepository = AppDataSource.getRepository(Family);
    const family = new Family();
    family.name = name;
    family.owner_id = user_id;
    await familyRepository.save(family);

    const familyMember = new FamilyMember();
    familyMember.family_id = family.id;
    familyMember.user_id = user_id;
    familyMember.role = 'admin';
    await familyMemberRepository.save(familyMember);

    res.status(200).json({ message: 'Family created', family_id: family.id });
  } catch (err) {
    console.error('Create family error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

server.post('/family', authenticate, createFamilyHandler);

// Handle joining a family
const joinFamilyHandler = async (req: Request, res: Response) => {
  const user_id = (req as any).user_id;
  const { family_id } = req.body;

  if (!family_id) return res.status(400).json({ error: 'Family ID is required' });

  try {
    const familyRepository = AppDataSource.getRepository(Family);
    const family = await familyRepository.findOneBy({ id: family_id });
    if (!family) {
      return res.status(404).json({ error: 'Family not found' });
    }

    const familyMemberRepository = AppDataSource.getRepository(FamilyMember);
    const existingMembership = await familyMemberRepository.findOneBy({ user_id });
    if (existingMembership) {
      return res.status(403).json({ error: 'User is already in a family' });
    }

    const familyMember = new FamilyMember();
    familyMember.family_id = family_id;
    familyMember.user_id = user_id;
    familyMember.role = 'member';
    await familyMemberRepository.save(familyMember);

    res.status(200).json({ message: 'Joined family' });
  } catch (err) {
    console.error('Join family error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

server.post('/family/join', authenticate, joinFamilyHandler);

// Handle retrieving user's families
const myFamiliesHandler = async (req: Request, res: Response) => {
  const user_id = (req as any).user_id;

  try {
    const families = await AppDataSource.getRepository(Family)
      .createQueryBuilder('family')
      .leftJoinAndSelect('family.members', 'family_member')
      .where('family.owner_id = :user_id OR family_member.user_id = :user_id', { user_id })
      .select(['family.id', 'family.name', 'family.owner_id', 'family_member.role'])
      .getMany();

    res.status(200).json({ families });
  } catch (err) {
    console.error('My families error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

server.get('/my-families', authenticate, myFamiliesHandler);

// Handle retrieving family members
const familyMembersHandler = async (req: Request, res: Response) => {
  const user_id = (req as any).user_id;
  const family_id = req.query.family_id as string;

  if (!family_id) return res.status(400).json({ error: 'Family ID is required' });

  try {
    const familyMemberRepository = AppDataSource.getRepository(FamilyMember);
    const isMember = await familyMemberRepository.findOneBy({ family_id: parseInt(family_id), user_id });
    if (!isMember) {
      return res.status(403).json({ error: 'User is not a member of this family' });
    }

    const members = await familyMemberRepository
      .createQueryBuilder('family_member')
      .leftJoinAndSelect('family_member.user', 'user')
      .where('family_member.family_id = :family_id', { family_id })
      .select(['family_member.user_id', 'user.username'])
      .getMany();

    res.status(200).json({ members: members.map((m) => ({ user_id: m.user_id, username: m.user.username })) });
  } catch (err) {
    console.error('Family members error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

server.get('/family/members', authenticate, familyMembersHandler);

// Handle calendar events (GET)
const calendarHandler = async (req: Request, res: Response) => {
  const user_id = (req as any).user_id;

  try {
    const familyMember = await AppDataSource.getRepository(FamilyMember).findOneBy({ user_id });
    if (!familyMember) {
      return res.status(403).json({ error: 'User not in a family' });
    }

    const events = await AppDataSource.getRepository(Event).find({
      where: { family_id: familyMember.family_id },
      select: ['id', 'title', 'start_datetime', 'end_datetime', 'reminder_datetime', 'creator_id'],
    });

    res.status(200).json({ events });
  } catch (err) {
    console.error('Calendar error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

server.get('/calendar', authenticate, calendarHandler);

// Handle calendar events (POST)
const createEventHandler = async (req: Request, res: Response) => {
  const user_id = (req as any).user_id;
  const { title, start_datetime, end_datetime, reminder_datetime } = req.body;

  if (!title || !start_datetime) return res.status(400).json({ error: 'Title and start date are required' });
  if (title.length > 100) return res.status(400).json({ error: 'Title must be 100 characters or less' });

  try {
    const familyMember = await AppDataSource.getRepository(FamilyMember).findOneBy({ user_id });
    if (!familyMember) {
      return res.status(403).json({ error: 'User not in a family' });
    }

    const event = new Event();
    event.family_id = familyMember.family_id;
    event.creator_id = user_id;
    event.title = title;
    event.start_datetime = start_datetime;
    event.end_datetime = end_datetime || null;
    event.reminder_datetime = reminder_datetime || null;
    event.created_at = new Date().toISOString();
    await AppDataSource.getRepository(Event).save(event);

    res.status(200).json({ message: 'Event created', event_id: event.id });
  } catch (err) {
    console.error('Create event error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

server.post('/calendar', authenticate, createEventHandler);

// Handle tasks (GET)
const tasksHandler = async (req: Request, res: Response) => {
  const user_id = (req as any).user_id;

  try {
    const familyMember = await AppDataSource.getRepository(FamilyMember).findOneBy({ user_id });
    if (!familyMember) {
      return res.status(403).json({ error: 'User not in a family' });
    }

    const tasks = await AppDataSource.getRepository(Task)
      .createQueryBuilder('task')
      .leftJoinAndSelect('task.assignee', 'user')
      .where('task.family_id = :family_id', { family_id: familyMember.family_id })
      .select([
        'task.id',
        'task.title',
        'task.description',
        'task.due_date',
        'task.priority',
        'task.status',
        'task.creator_id',
        'task.assignee_id',
        'user.username',
      ])
      .getMany();

    res.status(200).json({ tasks: tasks.map((t) => ({ ...t, assignee_username: t.assignee?.username })) });
  } catch (err) {
    console.error('Tasks error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

server.get('/tasks', authenticate, tasksHandler);

// Handle tasks (POST)
const createTaskHandler = async (req: Request, res: Response) => {
  const user_id = (req as any).user_id;
  const { title, description, assignee_id, due_date, priority } = req.body;

  if (!title) return res.status(400).json({ error: 'Title is required' });
  if (title.length > 255) return res.status(400).json({ error: 'Title must be 255 characters or less' });
  if (priority && !['low', 'medium', 'high'].includes(priority)) {
    return res.status(400).json({ error: 'Priority must be low, medium, or high' });
  }

  try {
    const familyMemberRepository = AppDataSource.getRepository(FamilyMember);
    const familyMember = await familyMemberRepository.findOneBy({ user_id });
    if (!familyMember) {
      return res.status(403).json({ error: 'User not in a family' });
    }

    if (assignee_id) {
      const assignee = await familyMemberRepository.findOneBy({
        family_id: familyMember.family_id,
        user_id: assignee_id,
      });
      if (!assignee) {
        return res.status(400).json({ error: 'Assignee is not a member of this family' });
      }
    }

    const task = new Task();
    task.family_id = familyMember.family_id;
    task.creator_id = user_id;
    task.assignee_id = assignee_id || null;
    task.title = title;
    task.description = description || null;
    task.due_date = due_date || null;
    task.priority = priority || 'medium';
    task.status = 'pending';
    await AppDataSource.getRepository(Task).save(task);

    console.log('Task created:', { task_id: task.id, title, family_id: task.family_id });
    res.status(201).json({ message: 'Task created', task_id: task.id });
  } catch (err) {
    console.error('Create task error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

server.post('/tasks', authenticate, createTaskHandler);

// Handle messages (GET)
const messagesHandler = async (req: Request, res: Response) => {
  const user_id = (req as any).user_id;

  try {
    const familyMember = await AppDataSource.getRepository(FamilyMember).findOneBy({ user_id });
    if (!familyMember) {
      return res.status(403).json({ error: 'User not in a family' });
    }

    const messages = await AppDataSource.getRepository(Message)
      .createQueryBuilder('message')
      .leftJoinAndSelect('message.sender', 'user')
      .where('message.family_id = :family_id', { family_id: familyMember.family_id })
      .select(['message.id', 'message.content', 'message.sent_at', 'message.sender_id', 'user.username'])
      .orderBy('message.sent_at', 'ASC')
      .getMany();

    res.status(200).json({ messages: messages.map((m) => ({ ...m, sender_username: m.sender.username })) });
  } catch (err) {
    console.error('Messages error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

server.get('/messages', authenticate, messagesHandler);

// Handle messages (POST)
const createMessageHandler = async (req: Request, res: Response) => {
  const user_id = (req as any).user_id;
  const { content } = req.body;

  if (!content) return res.status(400).json({ error: 'Message content is required' });
  if (content.length > 1000) return res.status(400).json({ error: 'Message must be 1000 characters or less' });

  try {
    const familyMember = await AppDataSource.getRepository(FamilyMember).findOneBy({ user_id });
    if (!familyMember) {
      return res.status(403).json({ error: 'User not in a family' });
    }

    const message = new Message();
    message.family_id = familyMember.family_id;
    message.sender_id = user_id;
    message.content = content;
    message.sent_at = new Date().toISOString();
    await AppDataSource.getRepository(Message).save(message);

    res.status(200).json({ message: 'Message sent', message_id: message.id });
  } catch (err) {
    console.error('Create message error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

server.post('/messages', authenticate, createMessageHandler);

// Start server
const port = parseInt(process.env.PORT || '8100');
server.listen(port, () => {
  print(port);
});