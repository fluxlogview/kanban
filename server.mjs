import { createServer } from 'node:http';
import { createReadStream, existsSync, statSync } from 'node:fs';
import { randomUUID } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  databaseInfo,
  getDatabase,
  readState,
  resetDatabase,
  writeState
} from './db/database.mjs';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const HOST = process.env.HOST || '127.0.0.1';
const PORT = Number(process.env.PORT) || 3000;
const MAX_BODY = 2 * 1024 * 1024;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8'
};

const BLOCKED_PREFIXES = ['/data/', '/db/', '/node_modules/', '/.git/'];
const BLOCKED_FILES = new Set(['/package.json', '/package-lock.json', '/server.mjs']);

function json(res, status, data) {
  const body = JSON.stringify(data);
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(body),
    'Cache-Control': 'no-store',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS'
  });
  res.end(body);
}

function error(res, status, message) {
  json(res, status, { error: message });
}

async function readJson(req) {
  const chunks = [];
  let size = 0;
  for await (const chunk of req) {
    size += chunk.length;
    if (size > MAX_BODY) throw new Error('Corpo da requisição muito grande.');
    chunks.push(chunk);
  }
  if (!chunks.length) return {};
  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8'));
  } catch {
    throw new Error('JSON inválido.');
  }
}

function nextTaskNumber(tasks) {
  return tasks.reduce((max, task) => Math.max(max, Number(task.number) || 100), 100) + 1;
}

function findById(collection, id) {
  return collection.find((item) => item.id === id);
}

async function handleApi(req, res, url) {
  const { pathname } = url;
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS'
    });
    res.end();
    return true;
  }

  if (pathname === '/api/health' && req.method === 'GET') {
    json(res, 200, { ok: true, database: databaseInfo(), now: new Date().toISOString() });
    return true;
  }

  if (pathname === '/api/state' && req.method === 'GET') {
    json(res, 200, readState());
    return true;
  }

  if (pathname === '/api/state' && req.method === 'PUT') {
    const body = await readJson(req);
    json(res, 200, writeState(body));
    return true;
  }

  if (pathname === '/api/dev/reset' && req.method === 'POST') {
    resetDatabase();
    json(res, 200, { ok: true, state: readState(), database: databaseInfo() });
    return true;
  }

  if (pathname === '/api/members' && req.method === 'GET') {
    json(res, 200, readState().members);
    return true;
  }

  if (pathname === '/api/tasks' && req.method === 'GET') {
    json(res, 200, readState().tasks);
    return true;
  }

  if (pathname === '/api/tasks' && req.method === 'POST') {
    const body = await readJson(req);
    if (!body.title || !String(body.title).trim()) return error(res, 400, 'Informe o título da tarefa.');
    const state = readState();
    const task = {
      id: randomUUID(),
      number: nextTaskNumber(state.tasks),
      title: String(body.title).trim(),
      description: String(body.description || ''),
      statusId: ['todo', 'doing', 'done'].includes(body.statusId) ? body.statusId : 'todo',
      priority: ['urgent', 'high', 'normal', 'low'].includes(body.priority) ? body.priority : 'normal',
      dueDate: body.dueDate || '',
      tags: Array.isArray(body.tags) ? body.tags : [],
      assigneeId: body.assigneeId || '',
      createdAt: Date.now()
    };
    const next = writeState({ ...state, tasks: [task, ...state.tasks] });
    json(res, 201, findById(next.tasks, task.id));
    return true;
  }

  const taskMatch = pathname.match(/^\/api\/tasks\/([^/]+)$/);
  if (taskMatch) {
    const id = decodeURIComponent(taskMatch[1]);
    const state = readState();
    const task = findById(state.tasks, id);
    if (!task) return error(res, 404, 'Tarefa não encontrada.');

    if (req.method === 'GET') {
      json(res, 200, task);
      return true;
    }

    if (req.method === 'PATCH') {
      const body = await readJson(req);
      Object.assign(task, body, { id: task.id, number: task.number });
      const next = writeState(state);
      json(res, 200, findById(next.tasks, id));
      return true;
    }

    if (req.method === 'DELETE') {
      writeState({ ...state, tasks: state.tasks.filter((item) => item.id !== id) });
      json(res, 200, { ok: true });
      return true;
    }
  }

  if (pathname === '/api/documents' && req.method === 'GET') {
    json(res, 200, readState().documents);
    return true;
  }

  if (pathname === '/api/documents' && req.method === 'POST') {
    const body = await readJson(req);
    if (!body.title || !String(body.title).trim()) return error(res, 400, 'Informe o título do documento.');
    const state = readState();
    const now = Date.now();
    const document = {
      id: randomUUID(),
      title: String(body.title).trim(),
      content: String(body.content || ''),
      createdAt: now,
      updatedAt: now
    };
    const next = writeState({ ...state, documents: [document, ...state.documents] });
    json(res, 201, findById(next.documents, document.id));
    return true;
  }

  const documentMatch = pathname.match(/^\/api\/documents\/([^/]+)$/);
  if (documentMatch) {
    const id = decodeURIComponent(documentMatch[1]);
    const state = readState();
    const document = findById(state.documents, id);
    if (!document) return error(res, 404, 'Documento não encontrado.');

    if (req.method === 'GET') {
      json(res, 200, document);
      return true;
    }

    if (req.method === 'PATCH') {
      const body = await readJson(req);
      Object.assign(document, body, { id: document.id, updatedAt: Date.now() });
      const next = writeState(state);
      json(res, 200, findById(next.documents, id));
      return true;
    }

    if (req.method === 'DELETE') {
      writeState({ ...state, documents: state.documents.filter((item) => item.id !== id) });
      json(res, 200, { ok: true });
      return true;
    }
  }

  if (pathname === '/api/goals' && req.method === 'GET') {
    json(res, 200, readState().goals);
    return true;
  }

  if (pathname === '/api/goals' && req.method === 'POST') {
    const body = await readJson(req);
    if (!body.title || !String(body.title).trim()) return error(res, 400, 'Informe o título da meta.');
    const state = readState();
    const now = Date.now();
    const progress = Math.min(100, Math.max(0, Math.round(Number(body.progress) || 0)));
    const goal = {
      id: randomUUID(),
      title: String(body.title).trim(),
      description: String(body.description || ''),
      progress,
      dueDate: body.dueDate || '',
      createdAt: now,
      updatedAt: now
    };
    const next = writeState({ ...state, goals: [goal, ...state.goals] });
    json(res, 201, findById(next.goals, goal.id));
    return true;
  }

  const goalMatch = pathname.match(/^\/api\/goals\/([^/]+)$/);
  if (goalMatch) {
    const id = decodeURIComponent(goalMatch[1]);
    const state = readState();
    const goal = findById(state.goals, id);
    if (!goal) return error(res, 404, 'Meta não encontrada.');

    if (req.method === 'GET') {
      json(res, 200, goal);
      return true;
    }

    if (req.method === 'PATCH') {
      const body = await readJson(req);
      Object.assign(goal, body, { id: goal.id, updatedAt: Date.now() });
      const next = writeState(state);
      json(res, 200, findById(next.goals, id));
      return true;
    }

    if (req.method === 'DELETE') {
      writeState({ ...state, goals: state.goals.filter((item) => item.id !== id) });
      json(res, 200, { ok: true });
      return true;
    }
  }

  if (pathname === '/api/notifications' && req.method === 'GET') {
    json(res, 200, readState().notifications);
    return true;
  }

  if (pathname === '/api/notifications/read-all' && req.method === 'POST') {
    const state = readState();
    const next = writeState({
      ...state,
      notifications: state.notifications.map((item) => ({ ...item, read: true }))
    });
    json(res, 200, next.notifications);
    return true;
  }

  const notificationMatch = pathname.match(/^\/api\/notifications\/([^/]+)$/);
  if (notificationMatch) {
    const id = decodeURIComponent(notificationMatch[1]);
    const state = readState();
    const notification = findById(state.notifications, id);
    if (!notification) return error(res, 404, 'Notificação não encontrada.');
    if (req.method === 'PATCH') {
      const body = await readJson(req);
      Object.assign(notification, body, { id: notification.id });
      const next = writeState(state);
      json(res, 200, findById(next.notifications, id));
      return true;
    }
    if (req.method === 'DELETE') {
      writeState({ ...state, notifications: state.notifications.filter((item) => item.id !== id) });
      json(res, 200, { ok: true });
      return true;
    }
  }

  if (pathname === '/api/invites' && req.method === 'GET') {
    json(res, 200, readState().invites);
    return true;
  }

  if (pathname === '/api/invites' && req.method === 'POST') {
    const body = await readJson(req);
    const email = String(body.email || '').trim().toLowerCase();
    if (!email || !email.includes('@')) return error(res, 400, 'Informe um e-mail válido.');
    const state = readState();
    if (state.invites.some((invite) => invite.email === email)) {
      return error(res, 409, 'Este e-mail já possui um convite pendente.');
    }
    const invite = {
      id: randomUUID(),
      email,
      role: ['viewer', 'commenter', 'editor', 'admin'].includes(body.role) ? body.role : 'editor',
      status: 'pending',
      createdAt: Date.now()
    };
    const next = writeState({ ...state, invites: [invite, ...state.invites] });
    json(res, 201, findById(next.invites, invite.id));
    return true;
  }

  const inviteMatch = pathname.match(/^\/api\/invites\/([^/]+)$/);
  if (inviteMatch && req.method === 'DELETE') {
    const id = decodeURIComponent(inviteMatch[1]);
    const state = readState();
    if (!findById(state.invites, id)) return error(res, 404, 'Convite não encontrado.');
    writeState({ ...state, invites: state.invites.filter((item) => item.id !== id) });
    json(res, 200, { ok: true });
    return true;
  }

  if (pathname === '/api/views' && req.method === 'GET') {
    json(res, 200, readState().customViews);
    return true;
  }

  if (pathname === '/api/views' && req.method === 'POST') {
    const body = await readJson(req);
    const name = String(body.name || '').trim();
    if (!name) return error(res, 400, 'Informe o nome da visualização.');
    if (!['board', 'list', 'calendar', 'timeline'].includes(body.type)) {
      return error(res, 400, 'Tipo de visualização inválido.');
    }
    const state = readState();
    const view = { id: randomUUID(), name, type: body.type, createdAt: Date.now() };
    const next = writeState({ ...state, customViews: [...state.customViews, view] });
    json(res, 201, findById(next.customViews, view.id));
    return true;
  }

  const viewMatch = pathname.match(/^\/api\/views\/([^/]+)$/);
  if (viewMatch && req.method === 'DELETE') {
    const id = decodeURIComponent(viewMatch[1]);
    const state = readState();
    if (!findById(state.customViews, id)) return error(res, 404, 'Visualização não encontrada.');
    writeState({ ...state, customViews: state.customViews.filter((item) => item.id !== id) });
    json(res, 200, { ok: true });
    return true;
  }

  if (pathname === '/api/spaces' && req.method === 'GET') {
    json(res, 200, readState().spaces);
    return true;
  }

  if (pathname === '/api/spaces' && req.method === 'POST') {
    const body = await readJson(req);
    const name = String(body.name || '').trim();
    if (!name) return error(res, 400, 'Informe o nome do espaço.');
    const state = readState();
    const space = {
      id: randomUUID(),
      name,
      color: /^#[0-9a-f]{6}$/i.test(body.color || '') ? body.color : '#7b68ee',
      createdAt: Date.now()
    };
    const next = writeState({ ...state, spaces: [...state.spaces, space] });
    json(res, 201, findById(next.spaces, space.id));
    return true;
  }

  const spaceMatch = pathname.match(/^\/api\/spaces\/([^/]+)$/);
  if (spaceMatch && req.method === 'DELETE') {
    const id = decodeURIComponent(spaceMatch[1]);
    const state = readState();
    if (!findById(state.spaces, id)) return error(res, 404, 'Espaço não encontrado.');
    writeState({ ...state, spaces: state.spaces.filter((item) => item.id !== id) });
    json(res, 200, { ok: true });
    return true;
  }

  return false;
}

function serveStatic(req, res, url) {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    error(res, 405, 'Método não permitido.');
    return;
  }

  let pathname;
  try {
    pathname = decodeURIComponent(url.pathname);
  } catch {
    error(res, 400, 'Caminho inválido.');
    return;
  }

  if (
    BLOCKED_FILES.has(pathname) ||
    BLOCKED_PREFIXES.some((prefix) => pathname.startsWith(prefix)) ||
    pathname.includes('..')
  ) {
    error(res, 404, 'Arquivo não encontrado.');
    return;
  }

  const relative = pathname === '/' ? 'index.html' : pathname.replace(/^\/+/, '');
  const filePath = path.resolve(ROOT, relative);
  if (!filePath.startsWith(`${ROOT}${path.sep}`) || !existsSync(filePath)) {
    error(res, 404, 'Arquivo não encontrado.');
    return;
  }

  const stats = statSync(filePath);
  if (!stats.isFile()) {
    error(res, 404, 'Arquivo não encontrado.');
    return;
  }

  res.writeHead(200, {
    'Content-Type': MIME_TYPES[path.extname(filePath).toLowerCase()] || 'application/octet-stream',
    'Content-Length': stats.size,
    'Cache-Control': 'no-cache'
  });
  if (req.method === 'HEAD') {
    res.end();
    return;
  }
  createReadStream(filePath).pipe(res);
}

getDatabase();

const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host || `${HOST}:${PORT}`}`);
    if (url.pathname.startsWith('/api/')) {
      const handled = await handleApi(req, res, url);
      if (!handled) error(res, 404, 'Rota de API não encontrada.');
      return;
    }
    serveStatic(req, res, url);
  } catch (caught) {
    console.error(caught);
    if (!res.headersSent) error(res, 500, caught.message || 'Erro interno do servidor.');
    else res.end();
  }
});

server.listen(PORT, HOST, () => {
  const info = databaseInfo();
  console.log(`Kanban local: http://${HOST}:${PORT}`);
  console.log(`SQLite: ${info.path}`);
  console.log(`Tarefas: ${info.counts.tasks} | Documentos: ${info.counts.documents} | Metas: ${info.counts.goals}`);
});

function shutdown() {
  server.close(() => {
    import('./db/database.mjs').then(({ closeDatabase }) => {
      closeDatabase();
      process.exit(0);
    });
  });
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
