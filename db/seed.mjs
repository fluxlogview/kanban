const DAY = 86400000;

function offsetDateKey(days) {
  const date = new Date();
  date.setHours(12, 0, 0, 0);
  date.setDate(date.getDate() + days);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function hoursAgo(hours) {
  return Date.now() - hours * 3600000;
}

export const MEMBERS = [
  { id: 'ana', name: 'Ana Souza', initials: 'AS', color: '#7b68ee' },
  { id: 'bruno', name: 'Bruno Lima', initials: 'BL', color: '#3e8ef7' },
  { id: 'carla', name: 'Carla Mendes', initials: 'CM', color: '#f2994a' },
  { id: 'diego', name: 'Diego Alves', initials: 'DA', color: '#27ae60' }
];

export const TASKS = [
  {
    id: 'sample-home-wireframe',
    number: 101,
    title: 'Criar wireframe da nova home',
    description: 'Mapear a hierarquia das seções, os componentes principais e os estados responsivos da nova página inicial.',
    statusId: 'todo',
    priority: 'high',
    dueDate: offsetDateKey(3),
    tags: ['design', 'site'],
    assigneeId: 'ana'
  },
  {
    id: 'sample-about-copy',
    number: 102,
    title: 'Revisar textos da página Sobre',
    description: 'Ajustar o tom de voz e revisar a história da empresa antes da publicação.',
    statusId: 'todo',
    priority: 'normal',
    dueDate: offsetDateKey(5),
    tags: ['conteúdo', 'UX writing'],
    assigneeId: 'carla'
  },
  {
    id: 'sample-contact-form',
    number: 103,
    title: 'Configurar formulário de contato',
    description: 'Integrar validação, estados de envio e mensagens de sucesso.',
    statusId: 'todo',
    priority: 'normal',
    dueDate: '',
    tags: ['desenvolvimento'],
    assigneeId: 'bruno'
  },
  {
    id: 'sample-services-page',
    number: 104,
    title: 'Desenvolver página de serviços',
    description: 'Implementar o layout aprovado com componentes reutilizáveis e animações de entrada.',
    statusId: 'doing',
    priority: 'urgent',
    dueDate: offsetDateKey(1),
    tags: ['desenvolvimento', 'site'],
    assigneeId: 'bruno'
  },
  {
    id: 'sample-blog-identity',
    number: 105,
    title: 'Criar identidade visual do blog',
    description: 'Definir tipografia, capas e elementos gráficos para os artigos.',
    statusId: 'doing',
    priority: 'high',
    dueDate: offsetDateKey(2),
    tags: ['design', 'branding'],
    assigneeId: 'ana'
  },
  {
    id: 'sample-seo',
    number: 106,
    title: 'Validar SEO das páginas principais',
    description: 'Conferir títulos, descrições, dados estruturados e links internos.',
    statusId: 'doing',
    priority: 'normal',
    dueDate: offsetDateKey(-1),
    tags: ['SEO', 'conteúdo'],
    assigneeId: 'diego'
  },
  {
    id: 'sample-information-architecture',
    number: 107,
    title: 'Definir arquitetura de informação',
    description: 'Organizar as páginas e os fluxos de navegação do novo site.',
    statusId: 'done',
    priority: 'high',
    dueDate: offsetDateKey(-3),
    tags: ['planejamento', 'UX'],
    assigneeId: 'ana'
  },
  {
    id: 'sample-palette',
    number: 108,
    title: 'Aprovar paleta de cores',
    description: 'Validar contraste e acessibilidade da paleta principal.',
    statusId: 'done',
    priority: 'normal',
    dueDate: offsetDateKey(-4),
    tags: ['design', 'branding'],
    assigneeId: 'carla'
  }
];

export const DOCUMENTS = [
  {
    id: 'doc-briefing',
    title: 'Briefing do novo site',
    content:
      'Objetivo: reposicionar a marca e facilitar o contato comercial.\n\nPúblico: pequenas e médias empresas.\nEntregáveis: home, serviços, sobre, blog e contato.\nPrazo geral: fim do trimestre.',
    createdAt: hoursAgo(52),
    updatedAt: hoursAgo(3)
  },
  {
    id: 'doc-brand-guide',
    title: 'Guia rápido de marca',
    content:
      'Tom de voz: claro, próximo e consultivo.\n\nCores principais: roxo, azul e neutros claros.\nTipografia: Inter para interface e títulos.\nEvitar excesso de texto e jargões técnicos.',
    createdAt: hoursAgo(120),
    updatedAt: hoursAgo(28)
  },
  {
    id: 'doc-launch-checklist',
    title: 'Checklist de lançamento',
    content:
      '1. Revisar conteúdo e links.\n2. Validar SEO e acessibilidade.\n3. Testar formulário de contato.\n4. Configurar analytics.\n5. Publicar e monitorar erros.',
    createdAt: hoursAgo(30),
    updatedAt: hoursAgo(7)
  }
];

export const GOALS = [
  {
    id: 'goal-launch',
    title: 'Lançar o novo site',
    description: 'Colocar todas as páginas principais no ar com conteúdo revisado.',
    progress: 65,
    dueDate: offsetDateKey(21),
    createdAt: hoursAgo(200),
    updatedAt: hoursAgo(5)
  },
  {
    id: 'goal-conversion',
    title: 'Aumentar conversão do formulário',
    description: 'Elevar a taxa de envio do formulário de contato em 20%.',
    progress: 40,
    dueDate: offsetDateKey(45),
    createdAt: hoursAgo(190),
    updatedAt: hoursAgo(16)
  },
  {
    id: 'goal-performance',
    title: 'Melhorar performance',
    description: 'Manter as páginas principais acima de 90 no Lighthouse.',
    progress: 80,
    dueDate: offsetDateKey(14),
    createdAt: hoursAgo(180),
    updatedAt: hoursAgo(9)
  }
];

export const NOTIFICATIONS = [
  {
    id: 'notification-seo',
    message: 'A tarefa “Validar SEO das páginas principais” está atrasada.',
    kind: 'warning',
    taskId: 'sample-seo',
    isRead: 0,
    createdAt: hoursAgo(2)
  },
  {
    id: 'notification-mention',
    message: 'Carla Mendes mencionou você em “Revisar textos da página Sobre”.',
    kind: 'info',
    taskId: 'sample-about-copy',
    isRead: 0,
    createdAt: hoursAgo(5)
  },
  {
    id: 'notification-done',
    message: 'Ana Souza concluiu “Definir arquitetura de informação”.',
    kind: 'success',
    taskId: 'sample-information-architecture',
    isRead: 1,
    createdAt: hoursAgo(26)
  },
  {
    id: 'notification-goal',
    message: 'A meta “Melhorar performance” chegou a 80%.',
    kind: 'success',
    taskId: null,
    isRead: 1,
    createdAt: hoursAgo(48)
  }
];

export function seedDatabase(db) {
  const existing = db.prepare('SELECT COUNT(*) AS count FROM tasks').get().count;
  if (existing > 0) return false;

  const now = Date.now();
  const insertMember = db.prepare(
    'INSERT INTO members (id, name, initials, color, created_at) VALUES (?, ?, ?, ?, ?)'
  );
  const insertTask = db.prepare(`
    INSERT INTO tasks (id, number, title, description, status_id, priority, due_date, assignee_id, position, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const insertTag = db.prepare('INSERT INTO task_tags (task_id, tag, position) VALUES (?, ?, ?)');
  const insertDoc = db.prepare(
    'INSERT INTO documents (id, title, content, created_at, updated_at) VALUES (?, ?, ?, ?, ?)'
  );
  const insertGoal = db.prepare(`
    INSERT INTO goals (id, title, description, progress, due_date, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  const insertNotification = db.prepare(`
    INSERT INTO notifications (id, message, kind, task_id, is_read, created_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  const insertSetting = db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)');

  db.exec('BEGIN');
  try {
    MEMBERS.forEach((member) => insertMember.run(member.id, member.name, member.initials, member.color, now));
    TASKS.forEach((task, index) => {
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
        now - (TASKS.length - index) * 3600000
      );
      task.tags.forEach((tag, tagIndex) => insertTag.run(task.id, tag, tagIndex));
    });
    DOCUMENTS.forEach((doc) => insertDoc.run(doc.id, doc.title, doc.content, doc.createdAt, doc.updatedAt));
    GOALS.forEach((goal) =>
      insertGoal.run(goal.id, goal.title, goal.description, goal.progress, goal.dueDate, goal.createdAt, goal.updatedAt)
    );
    NOTIFICATIONS.forEach((item) =>
      insertNotification.run(item.id, item.message, item.kind, item.taskId, item.isRead, item.createdAt)
    );

    const defaultSettings = {
      theme: 'light',
      favorite: false,
      sidebar_collapsed: false,
      profile_name: 'Meu perfil',
      workspace_name: 'Meu Workspace',
      compact_cards: false,
      show_tags: true,
      show_due_dates: true
    };
    Object.entries(defaultSettings).forEach(([key, value]) => insertSetting.run(key, JSON.stringify(value)));
    insertSetting.run('seeded_at', JSON.stringify(new Date().toISOString()));
    insertSetting.run('schema_version', JSON.stringify(2));
    db.exec('COMMIT');
    return true;
  } catch (error) {
    db.exec('ROLLBACK');
    throw error;
  }
}
