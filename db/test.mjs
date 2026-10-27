import assert from 'node:assert/strict';
import { rmSync } from 'node:fs';
import {
  DEFAULT_DB_PATH,
  closeDatabase,
  databaseInfo,
  openDatabase,
  readState,
  writeState
} from './database.mjs';

const testPath = process.env.KANBAN_DB_PATH || DEFAULT_DB_PATH.replace(/\.db$/, '.test.db');
for (const suffix of ['', '-wal', '-shm']) rmSync(`${testPath}${suffix}`, { force: true });

const db = openDatabase(testPath, { reset: true, seed: true });
let state = readState(db);

assert.equal(state.tasks.length, 8, 'deve iniciar com 8 tarefas');
assert.equal(state.documents.length, 3, 'deve iniciar com 3 documentos');
assert.equal(state.goals.length, 3, 'deve iniciar com 3 metas');
assert.equal(state.notifications.filter((item) => !item.read).length, 2, 'deve ter 2 notificações não lidas');
assert.equal(state.members.length, 4, 'deve ter 4 membros');
assert.ok(state.tasks.every((task) => Array.isArray(task.tags)), 'tarefas devem conter etiquetas');

state = writeState(
  {
    ...state,
    theme: 'dark',
    settings: { ...state.settings, displayName: 'Teste Local' },
    tasks: [
      ...state.tasks,
      {
        id: 'task-test',
        number: 999,
        title: 'Tarefa criada pelo teste',
        description: 'Round-trip SQLite',
        statusId: 'doing',
        priority: 'urgent',
        dueDate: '2026-12-31',
        tags: ['teste', 'sqlite'],
        assigneeId: 'ana',
        createdAt: Date.now()
      }
    ]
  },
  db
);

assert.equal(state.tasks.length, 9, 'deve salvar nova tarefa');
assert.equal(state.theme, 'dark', 'deve salvar tema');
assert.equal(state.settings.displayName, 'Teste Local', 'deve salvar configurações');
assert.deepEqual(
  state.tasks.find((task) => task.id === 'task-test').tags,
  ['teste', 'sqlite'],
  'deve salvar etiquetas'
);

state = writeState(
  {
    ...state,
    members: state.members.map((member) =>
      member.id === 'ana' ? { ...member, name: 'Ana Teste', role: 'admin' } : member
    )
  },
  db
);
assert.equal(state.members.find((member) => member.id === 'ana').name, 'Ana Teste', 'deve salvar nome do membro');
assert.equal(state.members.find((member) => member.id === 'ana').role, 'admin', 'deve salvar permissão do membro');

const info = databaseInfo();
assert.equal(info.engine, 'SQLite');
assert.ok(info.counts.tasks >= 9);

closeDatabase();
for (const suffix of ['', '-wal', '-shm']) rmSync(`${testPath}${suffix}`, { force: true });
console.log('Banco local validado com sucesso.');
console.log(JSON.stringify(info.counts, null, 2));
