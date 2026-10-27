import { DatabaseSync } from 'node:sqlite';
import { mkdirSync, readFileSync, rmSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { seedDatabase } from './seed.mjs';

const MODULE_DIR = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(MODULE_DIR, '..');
const SCHEMA_PATH = path.join(MODULE_DIR, 'schema.sql');
export const DEFAULT_DB_PATH = process.env.KANBAN_DB_PATH || path.join(ROOT_DIR, 'data', 'kanban.db');

const STATUS_IDS = new Set(['todo', 'doing', 'done']);
const PRIORITIES = new Set(['urgent', 'high', 'normal', 'low']);
const VIEW_TYPES = new Set(['board', 'list', 'calendar', 'timeline']);
const INVITE_ROLES = new Set(['viewer', 'commenter', 'editor', 'admin']);

let database = null;
let activeDbPath = DEFAULT_DB_PATH;

export function openDatabase(dbPath = DEFAULT_DB_PATH, options = {}) {
  const { reset = false, seed = true } = options;
  if (reset) {
    closeDatabase();
    for (const suffix of ['', '-wal', '-shm']) {
      rmSync(`${dbPath}${suffix}`, { force: true });
    }
  }

  mkdirSync(path.dirname(dbPath), { recursive: true });
  const db = new DatabaseSync(dbPath);
  activeDbPath = dbPath;
  db.exec('PRAGMA foreign_keys = ON;');
  db.exec('PRAGMA busy_timeout = 5000;');
  db.exec(readFileSync(SCHEMA_PATH, 'utf8'));
  const memberColumns = db.prepare('PRAGMA table_info(members)').all();
  if (!memberColumns.some((column) => column.name === 'role')) {
    db.exec("ALTER TABLE members ADD COLUMN role TEXT NOT NULL DEFAULT 'editor'");
  }
  if (seed) seedDatabase(db);
  database = db;
  return db;
}

export function getDatabase() {
  if (!database) return openDatabase();
  return database;
}

export function closeDatabase() {
  if (!database) return;
  database.close();
  database = null;
}

function parseJson(value, fallback) {
  if (typeof value !== 'string') return fallback;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

function readSetting(db, key, fallback) {
  const row = db.prepare('SELECT value FROM settings WHERE key = ?').get(key);
  return row ? parseJson(row.value, fallback) : fallback;
}

function settingText(value, fallback = '') {
  return typeof value === 'string' && value.trim() ? value.trim() : fallback;
}

function settingBool(value, fallback = false) {
  return typeof value === 'boolean' ? value : fallback;
}

function safeInt(value, fallback = 0, min = 0, max = Number.MAX_SAFE_INTEGER) {
  const number = Number(value);
  if (!Number.isFinite(number)) return fallback;
  return Math.min(max, Math.max(min, Math.round(number)));
}

function safeDate(value) {
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : '';
}

function safeText(value, maxLength) {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : '';
}

function listMembers(db) {
  return db
    .prepare('SELECT id, name, initials, color, role FROM members ORDER BY created_at, name')
    .all()
    .map((member) => ({ ...member }));
}

function listTasks(db) {
  const members = new Set(listMembers(db).map((member) => member.id));
  const tagsByTask = new Map();
  db.prepare('SELECT task_id, tag FROM task_tags ORDER BY task_id, position').all().forEach((row) => {
    if (!tagsByTask.has(row.task_id)) tagsByTask.set(row.task_id, []);
    tagsByTask.get(row.task_id).push(row.tag);
  });

  return db
    .prepare('SELECT * FROM tasks ORDER BY position, created_at DESC')
    .all()
    .map((row) => ({
      id: row.id,
      number: row.number,
      title: row.title,
      description: row.description,
      statusId: row.status_id,
      priority: row.priority,
      dueDate: row.due_date,
      tags: tagsByTask.get(row.id) || [],
      assigneeId: members.has(row.assignee_id) ? row.assignee_id : '',
      createdAt: row.created_at
    }));
}

function listDocuments(db) {
  return db
    .prepare('SELECT * FROM documents ORDER BY updated_at DESC')
    .all()
    .map((row) => ({
      id: row.id,
      title: row.title,
      content: row.content,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    }));
}

function listGoals(db) {
  return db
    .prepare('SELECT * FROM goals ORDER BY created_at DESC')
    .all()
    .map((row) => ({
      id: row.id,
      title: row.title,
      description: row.description,
      progress: row.progress,
      dueDate: row.due_date,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    }));
}

function listNotifications(db) {
  return db
    .prepare('SELECT * FROM notifications ORDER BY created_at DESC')
    .all()
    .map((row) => ({
      id: row.id,
      message: row.message,
      kind: row.kind,
      taskId: row.task_id || '',
      read: Boolean(row.is_read),
      createdAt: row.created_at
    }));
}

function listInvites(db) {
  return db
    .prepare('SELECT * FROM invites ORDER BY created_at DESC')
    .all()
    .map((row) => ({
      id: row.id,
      email: row.email,
      role: row.role,
      status: row.status,
      createdAt: row.created_at
    }));
}

function listViews(db) {
  return db
    .prepare('SELECT * FROM custom_views ORDER BY created_at')
    .all()
    .map((row) => ({ id: row.id, name: row.name, type: row.type, createdAt: row.created_at }));
}

function listSpaces(db) {
  return db
    .prepare('SELECT * FROM spaces ORDER BY created_at')
    .all()
    .map((row) => ({ id: row.id, name: row.name, color: row.color, createdAt: row.created_at }));
}

export function readState(db = getDatabase()) {
  return {
    version: 2,
    theme: readSetting(db, 'theme', 'light') === 'dark' ? 'dark' : 'light',
    sidebarCollapsed: Boolean(readSetting(db, 'sidebar_collapsed', false)),
    favorite: Boolean(readSetting(db, 'favorite', false)),
    settings: {
      displayName: settingText(readSetting(db, 'profile_name', 'Meu perfil'), 'Meu perfil'),
      workspaceName: settingText(readSetting(db, 'workspace_name', 'Meu Workspace'), 'Meu Workspace'),
      compactCards: Boolean(readSetting(db, 'compact_cards', false)),
      showTags: Boolean(readSetting(db, 'show_tags', true)),
      showDueDates: Boolean(readSetting(db, 'show_due_dates', true))
    },
    members: listMembers(db),
    tasks: listTasks(db),
    documents: listDocuments(db),
    goals: listGoals(db),
    notifications: listNotifications(db),
    invites: listInvites(db),
    spaces: listSpaces(db),
    customViews: listViews(db)
  };
}

function sanitizeTask(task, fallbackNumber, index) {
  if (!task || typeof task !== 'object') return null;
  const title = safeText(task.title, 140);
  if (!title) return null;
  const statusId = STATUS_IDS.has(task.statusId) ? task.statusId : 'todo';
  const priority = PRIORITIES.has(task.priority) ? task.priority : 'normal';
  const tags = Array.isArray(task.tags)
    ? [...new Set(task.tags.map((tag) => safeText(tag, 26)).filter(Boolean))].slice(0, 6)
    : [];

  return {
    id: settingText(task.id, `task-${index + 1}`),
    number: safeInt(task.number, fallbackNumber, 1),
    title,
    description: typeof task.description === 'string' ? task.description.slice(0, 1200) : '',
    statusId,
    priority,
    dueDate: safeDate(task.dueDate),
    tags,
    assigneeId: settingText(task.assigneeId),
    createdAt: safeInt(task.createdAt, Date.now())
  };
}

function sanitizeList(list, sanitizer) {
  if (!Array.isArray(list)) return [];
  const seen = new Set();
  return list
    .map(sanitizer)
    .filter((item) => {
      if (!item || seen.has(item.id)) return false;
      seen.add(item.id);
      return true;
    });
}

export function writeState(payload, db = getDatabase()) {
  if (!payload || typeof payload !== 'object') throw new Error('Estado inválido.');
  const existingMembers = listMembers(db);
  let members = sanitizeList(payload.members, (member, index) => {
    const name = safeText(member?.name, 60);
    if (!name) return null;
    const initials =
      safeText(member.initials, 3).toUpperCase() ||
      name
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part.charAt(0).toUpperCase())
        .join('');
    return {
      id: settingText(member.id, `member-${index + 1}`),
      name,
      initials,
      color: /^#[0-9a-f]{6}$/i.test(member.color || '') ? member.color : '#7b68ee',
      role: INVITE_ROLES.has(member.role) ? member.role : 'editor',
      createdAt: safeInt(member.createdAt, Date.now())
    };
  });
  if (!members.length) members = existingMembers.map((member) => ({ ...member, createdAt: Date.now() }));
  const memberIds = new Set(members.map((member) => member.id));
  let nextNumber = 101;
  const tasks = sanitizeList(payload.tasks, (task, index) => {
    const clean = sanitizeTask(task, nextNumber, index);
    if (!clean) return null;
    nextNumber = Math.max(nextNumber, clean.number + 1);
    if (!memberIds.has(clean.assigneeId)) clean.assigneeId = '';
    return clean;
  });

  const documents = sanitizeList(payload.documents, (doc, index) => {
    const title = safeText(doc?.title, 120);
    if (!title) return null;
    return {
      id: settingText(doc.id, `doc-${index + 1}`),
      title,
      content: typeof doc.content === 'string' ? doc.content.slice(0, 20000) : '',
      createdAt: safeInt(doc.createdAt, Date.now()),
      updatedAt: safeInt(doc.updatedAt, Date.now())
    };
  });

  const goals = sanitizeList(payload.goals, (goal, index) => {
    const title = safeText(goal?.title, 120);
    if (!title) return null;
    return {
      id: settingText(goal.id, `goal-${index + 1}`),
      title,
      description: typeof goal.description === 'string' ? goal.description.slice(0, 600) : '',
      progress: safeInt(goal.progress, 0, 0, 100),
      dueDate: safeDate(goal.dueDate),
      createdAt: safeInt(goal.createdAt, Date.now()),
      updatedAt: safeInt(goal.updatedAt, Date.now())
    };
  });

  const taskIds = new Set(tasks.map((task) => task.id));
  const notifications = sanitizeList(payload.notifications, (item, index) => {
    const message = safeText(item?.message, 240);
    if (!message) return null;
    return {
      id: settingText(item.id, `notification-${index + 1}`),
      message,
      kind: ['info', 'warning', 'success', 'danger'].includes(item.kind) ? item.kind : 'info',
      taskId: taskIds.has(item.taskId) ? item.taskId : '',
      read: Boolean(item.read),
      createdAt: safeInt(item.createdAt, Date.now())
    };
  });

  const invites = sanitizeList(payload.invites, (invite, index) => {
    const email = safeText(invite?.email, 180).toLowerCase();
    if (!email || !email.includes('@')) return null;
    return {
      id: settingText(invite.id, `invite-${index + 1}`),
      email,
      role: INVITE_ROLES.has(invite.role) ? invite.role : 'editor',
      status: ['pending', 'accepted', 'revoked'].includes(invite.status) ? invite.status : 'pending',
      createdAt: safeInt(invite.createdAt, Date.now())
    };
  });

  const customViews = sanitizeList(payload.customViews, (view, index) => {
    const name = safeText(view?.name, 40);
    if (!name || !VIEW_TYPES.has(view.type)) return null;
    return {
      id: settingText(view.id, `view-${index + 1}`),
      name,
      type: view.type,
      createdAt: safeInt(view.createdAt, Date.now())
    };
  });

  const spaces = sanitizeList(payload.spaces, (space, index) => {
    const name = safeText(space?.name, 40);
    if (!name) return null;
    return {
      id: settingText(space.id, `space-${index + 1}`),
      name,
      color: /^#[0-9a-f]{6}$/i.test(space.color || '') ? space.color : '#7b68ee',
      createdAt: safeInt(space.createdAt, Date.now())
    };
  });

  const settings = payload.settings || {};
  const values = {
    theme: payload.theme === 'dark' ? 'dark' : 'light',
    favorite: Boolean(payload.favorite),
    sidebar_collapsed: Boolean(payload.sidebarCollapsed),
    profile_name: settingText(settings.displayName, 'Meu perfil'),
    workspace_name: settingText(settings.workspaceName, 'Meu Workspace'),
    compact_cards: settingBool(settings.compactCards, false),
    show_tags: settingBool(settings.showTags, true),
    show_due_dates: settingBool(settings.showDueDates, true)
  };

  db.exec('BEGIN IMMEDIATE');
  try {
    db.prepare('DELETE FROM notifications').run();
    db.prepare('DELETE FROM task_tags').run();
    db.prepare('DELETE FROM tasks').run();
    db.prepare('DELETE FROM documents').run();
    db.prepare('DELETE FROM goals').run();
    db.prepare('DELETE FROM invites').run();
    db.prepare('DELETE FROM custom_views').run();
    db.prepare('DELETE FROM spaces').run();
    db.prepare('DELETE FROM members').run();

    const insertMember = db.prepare(
      'INSERT INTO members (id, name, initials, color, role, created_at) VALUES (?, ?, ?, ?, ?, ?)'
    );
    members.forEach((member) =>
      insertMember.run(member.id, member.name, member.initials, member.color, member.role, member.createdAt)
    );

    const insertTask = db.prepare(`
      INSERT INTO tasks (id, number, title, description, status_id, priority, due_date, assignee_id, position, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const insertTag = db.prepare('INSERT INTO task_tags (task_id, tag, position) VALUES (?, ?, ?)');
    tasks.forEach((task, index) => {
      insertTask.run(
        task.id,
        task.number,
        task.title,
        task.description,
        task.statusId,
        task.priority,
        task.dueDate,
        task.assigneeId || null,
        index,
        task.createdAt
      );
      task.tags.forEach((tag, tagIndex) => insertTag.run(task.id, tag, tagIndex));
    });

    const insertDocument = db.prepare(
      'INSERT INTO documents (id, title, content, created_at, updated_at) VALUES (?, ?, ?, ?, ?)'
    );
    documents.forEach((doc) => insertDocument.run(doc.id, doc.title, doc.content, doc.createdAt, doc.updatedAt));

    const insertGoal = db.prepare(`
      INSERT INTO goals (id, title, description, progress, due_date, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    goals.forEach((goal) =>
      insertGoal.run(goal.id, goal.title, goal.description, goal.progress, goal.dueDate, goal.createdAt, goal.updatedAt)
    );

    const insertNotification = db.prepare(`
      INSERT INTO notifications (id, message, kind, task_id, is_read, created_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    notifications.forEach((item) =>
      insertNotification.run(item.id, item.message, item.kind, item.taskId || null, item.read ? 1 : 0, item.createdAt)
    );

    const insertInvite = db.prepare(
      'INSERT INTO invites (id, email, role, status, created_at) VALUES (?, ?, ?, ?, ?)'
    );
    invites.forEach((invite) =>
      insertInvite.run(invite.id, invite.email, invite.role, invite.status, invite.createdAt)
    );

    const insertView = db.prepare(
      'INSERT INTO custom_views (id, name, type, created_at) VALUES (?, ?, ?, ?)'
    );
    customViews.forEach((view) => insertView.run(view.id, view.name, view.type, view.createdAt));

    const insertSpace = db.prepare(
      'INSERT INTO spaces (id, name, color, created_at) VALUES (?, ?, ?, ?)'
    );
    spaces.forEach((space) => insertSpace.run(space.id, space.name, space.color, space.createdAt));

    const insertSetting = db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)');
    Object.entries(values).forEach(([key, value]) => insertSetting.run(key, JSON.stringify(value)));
    insertSetting.run('schema_version', JSON.stringify(2));
    insertSetting.run('updated_at', JSON.stringify(new Date().toISOString()));
    db.exec('COMMIT');
  } catch (error) {
    db.exec('ROLLBACK');
    throw error;
  }

  return readState(db);
}

export function resetDatabase(dbPath = DEFAULT_DB_PATH) {
  closeDatabase();
  return openDatabase(dbPath, { reset: true, seed: true });
}

export function databaseInfo() {
  const db = getDatabase();
  const count = (table) => db.prepare(`SELECT COUNT(*) AS count FROM ${table}`).get().count;
  return {
    path: activeDbPath,
    engine: 'SQLite',
    version: db.prepare('SELECT sqlite_version() AS version').get().version,
    counts: {
      members: count('members'),
      tasks: count('tasks'),
      documents: count('documents'),
      goals: count('goals'),
      notifications: count('notifications'),
      invites: count('invites'),
      customViews: count('custom_views'),
      spaces: count('spaces')
    }
  };
}
