'use strict';

const STORAGE_KEY = 'kanban-board-v1';
const STATIC_HOST = /(^|\.)github\.io$/i.test(window.location.hostname);

const COLUMNS = [
  { id: 'todo', label: 'A fazer', color: '#87909e' },
  { id: 'doing', label: 'Em andamento', color: '#3e8ef7' },
  { id: 'done', label: 'Concluído', color: '#27ae60' }
];

const MEMBERS = [
  { id: 'ana', name: 'Ana Souza', initials: 'AS', color: '#7b68ee' },
  { id: 'bruno', name: 'Bruno Lima', initials: 'BL', color: '#3e8ef7' },
  { id: 'carla', name: 'Carla Mendes', initials: 'CM', color: '#f2994a' },
  { id: 'diego', name: 'Diego Alves', initials: 'DA', color: '#27ae60' }
];

const PRIORITIES = {
  urgent: { label: 'Urgente', color: '#e5484d', rank: 0 },
  high: { label: 'Alta', color: '#d99a00', rank: 1 },
  normal: { label: 'Normal', color: '#3e8ef7', rank: 2 },
  low: { label: 'Baixa', color: '#87909e', rank: 3 }
};

const TAG_HUES = [255, 201, 151, 28, 331, 187, 266, 10];

const MEMBER_COLORS = ['#7b68ee', '#3e8ef7', '#f2994a', '#27ae60', '#e5484d', '#00a8b5', '#b45cf0', '#d99a00'];

const MEMBER_ROLES = {
  admin: 'Administrador',
  editor: 'Editor',
  commenter: 'Comentador',
  viewer: 'Visualizador'
};

const VIEW_META = {
  board: { label: 'Quadro', icon: 'columns' },
  list: { label: 'Lista', icon: 'list' },
  calendar: { label: 'Calendário', icon: 'calendar' },
  timeline: { label: 'Timeline', icon: 'timeline' }
};

const MODULE_META = {
  board: {
    title: 'Site institucional',
    icon: 'columns',
    breadcrumbs: ['Marketing', 'Campanhas', 'Site institucional']
  },
  home: { title: 'Início', icon: 'home', breadcrumbs: ['Meu Workspace', 'Início'] },
  inbox: { title: 'Caixa de entrada', icon: 'inbox', breadcrumbs: ['Meu Workspace', 'Caixa de entrada'] },
  everything: { title: 'Tudo', icon: 'layers', breadcrumbs: ['Meu Workspace', 'Tudo'] },
  dashboards: { title: 'Painéis', icon: 'grid', breadcrumbs: ['Meu Workspace', 'Painéis'] },
  documents: { title: 'Documentos', icon: 'file', breadcrumbs: ['Meu Workspace', 'Documentos'] },
  goals: { title: 'Metas', icon: 'target', breadcrumbs: ['Meu Workspace', 'Metas'] },
  teams: { title: 'Equipes', icon: 'users', breadcrumbs: ['Meu Workspace', 'Equipes'] },
  ai: { title: 'Assistente IA', icon: 'sparkles', breadcrumbs: ['Meu Workspace', 'Assistente IA'] }
};

const WEEKDAYS = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'];
const MONTHS_SHORT = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];

const els = {
  sidebar: document.getElementById('sidebar'),
  sidebarScrim: document.getElementById('sidebar-scrim'),
  sidebarToggle: document.getElementById('sidebar-toggle'),
  spaceTree: document.getElementById('space-tree'),
  customSpaces: document.getElementById('custom-spaces'),
  addSpaceBtn: document.getElementById('add-space-btn'),
  workspaceSwitcher: document.getElementById('workspace-switcher'),
  workspaceName: document.getElementById('workspace-name'),
  inboxBadge: document.getElementById('inbox-badge'),
  notificationDot: document.getElementById('notification-dot'),
  profileBtn: document.getElementById('profile-btn'),
  profileAvatar: document.getElementById('profile-avatar'),
  profileName: document.getElementById('profile-name'),
  helpBtn: document.getElementById('help-btn'),
  settingsBtn: document.getElementById('settings-btn'),
  boardListBtn: document.getElementById('board-list-btn'),
  themeToggle: document.getElementById('theme-toggle'),
  metaThemeColor: document.getElementById('meta-theme-color'),
  notificationsBtn: document.getElementById('notifications-btn'),
  inviteTopbar: document.getElementById('invite-topbar'),
  inviteSidebar: document.getElementById('invite-sidebar'),
  favoriteBtn: document.getElementById('favorite-btn'),
  shareBtn: document.getElementById('share-btn'),
  newTaskBtn: document.getElementById('new-task-btn'),
  headerAvatars: document.getElementById('header-avatars'),
  breadcrumbs: document.getElementById('breadcrumbs'),
  listHeader: document.querySelector('.list-header'),
  listTitle: document.getElementById('list-title'),
  listIconUse: document.getElementById('list-icon-use'),
  viewTabsRow: document.querySelector('.view-tabs-row'),
  viewTabs: document.getElementById('view-tabs'),
  viewSettingsBtn: document.getElementById('view-settings-btn'),
  boardToolbar: document.querySelector('.board-toolbar'),
  filterBtn: document.getElementById('filter-btn'),
  filterPopover: document.getElementById('filter-popover'),
  filterBadge: document.getElementById('filter-badge'),
  filterClose: document.getElementById('filter-close'),
  filterPriorities: document.getElementById('filter-priorities'),
  filterAssignees: document.getElementById('filter-assignees'),
  clearFilters: document.getElementById('clear-filters'),
  applyFilters: document.getElementById('apply-filters'),
  sortBtn: document.getElementById('sort-btn'),
  sortPopover: document.getElementById('sort-popover'),
  sortClose: document.getElementById('sort-close'),
  searchInput: document.getElementById('search-input'),
  searchClear: document.getElementById('search-clear'),
  taskSummary: document.getElementById('task-summary'),
  boardMenuBtn: document.getElementById('board-menu-btn'),
  boardMenu: document.getElementById('board-menu'),
  exportBoard: document.getElementById('export-board'),
  clearCompleted: document.getElementById('clear-completed'),
  doneCount: document.getElementById('done-count'),
  activeFilters: document.getElementById('active-filters'),
  boardWrap: document.getElementById('board-wrap'),
  board: document.getElementById('board'),
  moduleWrap: document.getElementById('module-wrap'),
  taskMenu: document.getElementById('task-menu'),
  toastContainer: document.getElementById('toast-container'),
  srAnnouncer: document.getElementById('sr-announcer'),
  taskDialog: document.getElementById('task-dialog'),
  taskForm: document.getElementById('task-form'),
  taskClose: document.getElementById('task-close'),
  taskId: document.getElementById('task-id'),
  taskCode: document.getElementById('task-code'),
  taskDialogTitle: document.getElementById('task-dialog-title'),
  taskTitle: document.getElementById('task-title'),
  taskDescription: document.getElementById('task-description'),
  taskStatus: document.getElementById('task-status'),
  taskStatusDot: document.getElementById('task-status-dot'),
  taskAssignee: document.getElementById('task-assignee'),
  taskPriority: document.getElementById('task-priority'),
  taskPriorityDot: document.getElementById('task-priority-dot'),
  taskDue: document.getElementById('task-due'),
  taskTags: document.getElementById('task-tags'),
  taskDelete: document.getElementById('task-delete'),
  taskCancel: document.getElementById('task-cancel'),
  taskSave: document.getElementById('task-save'),
  appDialog: document.getElementById('app-dialog'),
  appDialogForm: document.getElementById('app-dialog-form'),
  appDialogEyebrow: document.getElementById('app-dialog-eyebrow'),
  appDialogTitle: document.getElementById('app-dialog-title'),
  appDialogSubtitle: document.getElementById('app-dialog-subtitle'),
  appDialogBody: document.getElementById('app-dialog-body'),
  appDialogFooter: document.getElementById('app-dialog-footer'),
  appDialogCancel: document.getElementById('app-dialog-cancel'),
  appDialogSubmit: document.getElementById('app-dialog-submit')
};

let state = loadState();
const ui = {
  query: '',
  filters: {
    priorities: new Set(),
    assignees: new Set()
  },
  sort: 'manual',
  module: 'board',
  view: 'board',
  calendar: {
    year: new Date().getFullYear(),
    month: new Date().getMonth()
  },
  aiMessages: []
};

let remoteSyncEnabled = false;
let remoteSaveTimer = null;
let remoteSaveInFlight = false;
let remoteSaveQueued = false;
let draggedTaskId = null;
let lastDropKey = '';
let suppressCardClickUntil = 0;
let contextTaskId = null;
let taskMenuTrigger = null;
let activeDialogSubmit = null;
let wasMobile = window.innerWidth <= 1024;

async function init() {
  const remoteState = await fetchRemoteState();
  if (remoteState) state = normalizeState(remoteState);

  populateHeaderAvatars();
  populateFilterOptions();
  populateAssigneeOptions();
  bindEvents();
  applyTheme(state.theme, false);
  applySavedSidebarState();
  setNavigationTitles();
  updateFavoriteButton();
  renderAll();
  if (!remoteSyncEnabled) saveState();
}

async function fetchRemoteState() {
  if (STATIC_HOST) return null;
  if (!/^https?:$/.test(window.location.protocol)) return null;

  try {
    const response = await fetch('/api/state', { cache: 'no-store' });
    if (!response.ok) return null;
    const payload = await response.json();
    remoteSyncEnabled = true;
    return payload;
  } catch (error) {
    remoteSyncEnabled = false;
    return null;
  }
}

function bindEvents() {
  els.sidebarToggle.addEventListener('click', handleSidebarToggle);
  els.sidebarScrim.addEventListener('click', closeMobileSidebar);
  els.sidebar.addEventListener('click', handleSidebarClick);
  els.themeToggle.addEventListener('click', toggleTheme);
  els.notificationsBtn.addEventListener('click', () => showModule('inbox'));
  els.inviteTopbar.addEventListener('click', openInviteDialog);
  els.inviteSidebar.addEventListener('click', openInviteDialog);
  els.shareBtn.addEventListener('click', openInviteDialog);
  els.favoriteBtn.addEventListener('click', toggleFavorite);
  els.newTaskBtn.addEventListener('click', () => openTaskDialog());
  els.profileBtn.addEventListener('click', openSettingsDialog);
  els.settingsBtn.addEventListener('click', openSettingsDialog);
  els.helpBtn.addEventListener('click', openHelpDialog);
  els.workspaceSwitcher.addEventListener('click', openWorkspaceDialog);
  els.addSpaceBtn.addEventListener('click', openSpaceDialog);
  els.boardListBtn.addEventListener('click', () => showModule('board'));

  els.filterBtn.addEventListener('click', () => togglePopover(els.filterPopover, els.filterBtn));
  els.sortBtn.addEventListener('click', () => togglePopover(els.sortPopover, els.sortBtn));
  els.boardMenuBtn.addEventListener('click', () => togglePopover(els.boardMenu, els.boardMenuBtn));
  els.filterClose.addEventListener('click', closePopovers);
  els.sortClose.addEventListener('click', closePopovers);
  els.applyFilters.addEventListener('click', closePopovers);
  els.clearFilters.addEventListener('click', clearFilters);
  els.filterPopover.addEventListener('change', handleFilterChange);
  els.activeFilters.addEventListener('click', handleActiveFilterClick);
  els.sortPopover.addEventListener('click', handleSortSelection);
  els.exportBoard.addEventListener('click', exportBoard);
  els.clearCompleted.addEventListener('click', clearCompletedTasks);
  els.viewTabs.addEventListener('click', handleViewTabsClick);
  els.viewSettingsBtn.addEventListener('click', openViewSettingsDialog);

  els.searchInput.addEventListener('input', handleSearch);
  els.searchClear.addEventListener('click', clearSearch);

  els.board.addEventListener('click', handleBoardClick);
  els.board.addEventListener('keydown', handleBoardKeydown);
  els.board.addEventListener('dragstart', handleDragStart);
  els.board.addEventListener('dragover', handleDragOver);
  els.board.addEventListener('drop', handleDrop);
  els.board.addEventListener('dragend', finishDrag);
  els.board.addEventListener('dragleave', handleBoardDragLeave);
  els.boardWrap.addEventListener('scroll', closeTaskMenu, { passive: true });
  els.moduleWrap.addEventListener('click', handleModuleClick);
  els.moduleWrap.addEventListener('submit', handleModuleSubmit);

  els.taskMenu.addEventListener('click', handleTaskMenuClick);
  els.taskForm.addEventListener('submit', handleTaskSubmit);
  els.taskTitle.addEventListener('input', () => els.taskTitle.setCustomValidity(''));
  els.taskStatus.addEventListener('change', updateTaskIndicators);
  els.taskPriority.addEventListener('change', updateTaskIndicators);
  els.taskClose.addEventListener('click', closeTaskDialog);
  els.taskCancel.addEventListener('click', closeTaskDialog);
  els.taskDelete.addEventListener('click', deleteCurrentTask);
  els.taskDialog.addEventListener('click', (event) => {
    if (event.target === els.taskDialog) closeTaskDialog();
  });
  els.taskDialog.addEventListener('close', () => {
    els.taskTitle.setCustomValidity('');
  });

  els.appDialogForm.addEventListener('submit', handleAppDialogSubmit);
  els.appDialog.addEventListener('click', (event) => {
    if (event.target.closest('[data-dialog-close]') || event.target === els.appDialog) closeAppDialog();
  });
  els.appDialogBody.addEventListener('click', handleAppDialogBodyClick);
  els.appDialog.addEventListener('close', () => {
    if (els.appDialog.open) return;
    activeDialogSubmit = null;
    els.appDialogForm.classList.remove('is-busy');
  });

  document.addEventListener('click', handleDocumentClick);
  document.addEventListener('keydown', handleGlobalKeydown);
  window.addEventListener('resize', handleWindowResize);
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createInitialState();
    return normalizeState(JSON.parse(raw));
  } catch (error) {
    return createInitialState();
  }
}

function normalizeState(saved) {
  if (!saved || !Array.isArray(saved.tasks)) return createInitialState();
  const defaults = createInitialState();
  const savedMembers = Array.isArray(saved.members) && saved.members.length ? saved.members : defaults.members;
  const memberIds = new Set(savedMembers.map((member) => member.id));
  const ids = new Set();
  const tasks = saved.tasks
    .map((task) => sanitizeTask(task, memberIds))
    .filter((task) => {
      if (!task || ids.has(task.id)) return false;
      ids.add(task.id);
      return true;
    });

  let maxNumber = tasks.reduce((max, task) => Math.max(max, Number(task.number) || 0), 100);
  tasks.forEach((task) => {
    if (!task.number || task.number < 1) task.number = ++maxNumber;
  });

  return {
    version: 2,
    theme: saved.theme === 'dark' ? 'dark' : 'light',
    sidebarCollapsed: Boolean(saved.sidebarCollapsed),
    favorite: Boolean(saved.favorite),
    settings: { ...defaults.settings, ...(saved.settings && typeof saved.settings === 'object' ? saved.settings : {}) },
    members: savedMembers,
    tasks,
    documents: Array.isArray(saved.documents) ? saved.documents : defaults.documents,
    goals: Array.isArray(saved.goals) ? saved.goals : defaults.goals,
    notifications: Array.isArray(saved.notifications) ? saved.notifications : defaults.notifications,
    invites: Array.isArray(saved.invites) ? saved.invites : defaults.invites,
    spaces: Array.isArray(saved.spaces) ? saved.spaces : defaults.spaces,
    customViews: Array.isArray(saved.customViews) ? saved.customViews : defaults.customViews
  };
}

function sanitizeTask(task, memberIds = new Set(MEMBERS.map((member) => member.id))) {
  if (!task || typeof task !== 'object') return null;
  if (typeof task.id !== 'string' || !task.id.trim()) return null;
  if (typeof task.title !== 'string' || !task.title.trim()) return null;
  if (!COLUMNS.some((column) => column.id === task.statusId)) return null;

  const tags = Array.isArray(task.tags)
    ? [...new Set(task.tags.filter((tag) => typeof tag === 'string').map((tag) => tag.trim()).filter(Boolean))]
        .slice(0, 6)
        .map((tag) => tag.slice(0, 26))
    : [];

  return {
    id: task.id,
    number: Number.isFinite(Number(task.number)) ? Number(task.number) : 0,
    title: task.title.trim().slice(0, 140),
    description: typeof task.description === 'string' ? task.description.slice(0, 1200) : '',
    statusId: task.statusId,
    priority: PRIORITIES[task.priority] ? task.priority : 'normal',
    dueDate: /^\d{4}-\d{2}-\d{2}$/.test(task.dueDate || '') ? task.dueDate : '',
    tags,
    assigneeId: memberIds.has(task.assigneeId) ? task.assigneeId : '',
    createdAt: Number.isFinite(Number(task.createdAt)) ? Number(task.createdAt) : Date.now()
  };
}

function createInitialState() {
  return {
    version: 2,
    theme: document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light',
    sidebarCollapsed: false,
    favorite: false,
    settings: {
      displayName: 'Meu perfil',
      workspaceName: 'Meu Workspace',
      compactCards: false,
      showTags: true,
      showDueDates: true
    },
    members: MEMBERS.map((member) => ({ ...member })),
    tasks: createSampleTasks(),
    documents: createSampleDocuments(),
    goals: createSampleGoals(),
    notifications: createSampleNotifications(),
    invites: [],
    spaces: [],
    customViews: []
  };
}

function createSampleTasks() {
  const createdAt = Date.now();

  return [
    {
      id: 'sample-home-wireframe',
      number: 101,
      title: 'Criar wireframe da nova home',
      description: 'Mapear a hierarquia das seções, os componentes principais e os estados responsivos da nova página inicial.',
      statusId: 'todo',
      priority: 'high',
      dueDate: offsetDateKey(3),
      tags: ['design', 'site'],
      assigneeId: 'ana',
      createdAt
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
      assigneeId: 'carla',
      createdAt
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
      assigneeId: 'bruno',
      createdAt
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
      assigneeId: 'bruno',
      createdAt
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
      assigneeId: 'ana',
      createdAt
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
      assigneeId: 'diego',
      createdAt
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
      assigneeId: 'ana',
      createdAt
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
      assigneeId: 'carla',
      createdAt
    }
  ];
}

function createSampleDocuments() {
  const now = Date.now();
  return [
    {
      id: 'doc-briefing',
      title: 'Briefing do novo site',
      content:
        'Objetivo: reposicionar a marca e facilitar o contato comercial.\n\nPúblico: pequenas e médias empresas.\nEntregáveis: home, serviços, sobre, blog e contato.\nPrazo geral: fim do trimestre.',
      createdAt: now - 52 * 3600000,
      updatedAt: now - 3 * 3600000
    },
    {
      id: 'doc-brand-guide',
      title: 'Guia rápido de marca',
      content:
        'Tom de voz: claro, próximo e consultivo.\n\nCores principais: roxo, azul e neutros claros.\nTipografia: Inter para interface e títulos.\nEvitar excesso de texto e jargões técnicos.',
      createdAt: now - 120 * 3600000,
      updatedAt: now - 28 * 3600000
    },
    {
      id: 'doc-launch-checklist',
      title: 'Checklist de lançamento',
      content:
        '1. Revisar conteúdo e links.\n2. Validar SEO e acessibilidade.\n3. Testar formulário de contato.\n4. Configurar analytics.\n5. Publicar e monitorar erros.',
      createdAt: now - 30 * 3600000,
      updatedAt: now - 7 * 3600000
    }
  ];
}

function createSampleGoals() {
  const now = Date.now();
  return [
    {
      id: 'goal-launch',
      title: 'Lançar o novo site',
      description: 'Colocar todas as páginas principais no ar com conteúdo revisado.',
      progress: 65,
      dueDate: offsetDateKey(21),
      createdAt: now - 200 * 3600000,
      updatedAt: now - 5 * 3600000
    },
    {
      id: 'goal-conversion',
      title: 'Aumentar conversão do formulário',
      description: 'Elevar a taxa de envio do formulário de contato em 20%.',
      progress: 40,
      dueDate: offsetDateKey(45),
      createdAt: now - 190 * 3600000,
      updatedAt: now - 16 * 3600000
    },
    {
      id: 'goal-performance',
      title: 'Melhorar performance',
      description: 'Manter as páginas principais acima de 90 no Lighthouse.',
      progress: 80,
      dueDate: offsetDateKey(14),
      createdAt: now - 180 * 3600000,
      updatedAt: now - 9 * 3600000
    }
  ];
}

function createSampleNotifications() {
  const now = Date.now();
  return [
    {
      id: 'notification-seo',
      message: 'A tarefa “Validar SEO das páginas principais” está atrasada.',
      kind: 'warning',
      taskId: 'sample-seo',
      read: false,
      createdAt: now - 2 * 3600000
    },
    {
      id: 'notification-mention',
      message: 'Carla Mendes mencionou você em “Revisar textos da página Sobre”.',
      kind: 'info',
      taskId: 'sample-about-copy',
      read: false,
      createdAt: now - 5 * 3600000
    },
    {
      id: 'notification-done',
      message: 'Ana Souza concluiu “Definir arquitetura de informação”.',
      kind: 'success',
      taskId: 'sample-information-architecture',
      read: true,
      createdAt: now - 26 * 3600000
    },
    {
      id: 'notification-goal',
      message: 'A meta “Melhorar performance” chegou a 80%.',
      kind: 'success',
      taskId: '',
      read: true,
      createdAt: now - 48 * 3600000
    }
  ];
}

function icon(name, className = '') {
  return `<svg class="icon${className ? ` ${className}` : ''}" aria-hidden="true"><use href="#i-${name}"></use></svg>`;
}

function avatarMarkup(member) {
  return `<span class="avatar" style="--avatar-color: ${member.color}" title="${escapeAttr(member.name)}">${member.initials}</span>`;
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (character) => {
    const entities = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
    return entities[character];
  });
}

function escapeAttr(value) {
  return escapeHtml(value).replace(/`/g, '&#096;');
}

function getMember(memberId) {
  const members = Array.isArray(state.members) ? state.members : MEMBERS;
  return members.find((member) => member.id === memberId) || null;
}

function getTask(taskId) {
  return state.tasks.find((task) => task.id === taskId) || null;
}

function getColumn(columnId) {
  return COLUMNS.find((column) => column.id === columnId) || null;
}

function taskCode(task) {
  return task.number ? `#WEB-${task.number}` : '#WEB';
}

function getTagHue(tag) {
  let hash = 0;
  for (let index = 0; index < tag.length; index += 1) {
    hash = (hash * 31 + tag.charCodeAt(index)) >>> 0;
  }
  return TAG_HUES[hash % TAG_HUES.length];
}

function normalizeText(value) {
  return String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

function parseDateKey(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value || '')) return null;
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) return null;
  date.setHours(0, 0, 0, 0);
  return date;
}

function formatDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function offsetDateKey(days) {
  const date = new Date();
  date.setHours(12, 0, 0, 0);
  date.setDate(date.getDate() + days);
  return formatDateKey(date);
}

function formatShortDate(date) {
  const currentYear = new Date().getFullYear();
  const suffix = date.getFullYear() !== currentYear ? ` ${date.getFullYear()}` : '';
  return `${date.getDate()} ${MONTHS_SHORT[date.getMonth()]}${suffix}`;
}

function formatLongDate(date) {
  return new Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' }).format(date);
}

function getDueInfo(task) {
  const due = parseDateKey(task.dueDate);
  if (!due) return null;

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const diff = Math.round((due.getTime() - today.getTime()) / 86400000);
  const done = task.statusId === 'done';
  const fullDate = formatLongDate(due);
  let label = formatShortDate(due);
  let className = '';
  let title = `Vence em ${fullDate}`;

  if (done) {
    title = `Prazo: ${fullDate}`;
  } else if (diff < 0) {
    className = 'is-overdue';
    title = `Atrasado desde ${fullDate}`;
  } else if (diff === 0) {
    className = 'is-soon';
    label = 'Hoje';
    title = `Vence hoje, ${fullDate}`;
  } else if (diff === 1) {
    className = 'is-soon';
    label = 'Amanhã';
    title = `Vence amanhã, ${fullDate}`;
  } else if (diff <= 3) {
    className = 'is-soon';
  }

  return { label, className, title };
}

function hasActiveFilters() {
  return Boolean(ui.query.trim() || ui.filters.priorities.size || ui.filters.assignees.size);
}

function taskMatchesFilters(task) {
  if (ui.filters.priorities.size && !ui.filters.priorities.has(task.priority)) return false;
  if (ui.filters.assignees.size && !ui.filters.assignees.has(task.assigneeId)) return false;

  const query = normalizeText(ui.query.trim());
  if (!query) return true;

  const member = getMember(task.assigneeId);
  const haystack = normalizeText([task.title, task.description, task.tags.join(' '), member ? member.name : ''].join(' '));
  return haystack.includes(query);
}

function sortTasks(tasks) {
  const sorted = [...tasks];

  if (ui.sort === 'priority') {
    sorted.sort((a, b) => PRIORITIES[a.priority].rank - PRIORITIES[b.priority].rank);
  } else if (ui.sort === 'due') {
    sorted.sort((a, b) => {
      const dueA = a.dueDate || '9999-12-31';
      const dueB = b.dueDate || '9999-12-31';
      if (dueA !== dueB) return dueA.localeCompare(dueB);
      return PRIORITIES[a.priority].rank - PRIORITIES[b.priority].rank;
    });
  } else if (ui.sort === 'title') {
    sorted.sort((a, b) => a.title.localeCompare(b.title, 'pt-BR', { sensitivity: 'base' }));
  }

  return sorted;
}

function saveState() {
  state.theme = document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.warn('Não foi possível salvar os dados do quadro.', error);
  }

  if (remoteSyncEnabled) {
    clearTimeout(remoteSaveTimer);
    remoteSaveTimer = setTimeout(persistStateToApi, 300);
  }
}

async function persistStateToApi() {
  if (!remoteSyncEnabled) return;
  if (remoteSaveInFlight) {
    remoteSaveQueued = true;
    return;
  }

  remoteSaveInFlight = true;
  try {
    const response = await fetch('/api/state', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(state)
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
  } catch (error) {
    console.warn('Não foi possível sincronizar com o banco local.', error);
    remoteSyncEnabled = false;
    showToast('Banco local indisponível. Usando armazenamento do navegador.', { type: 'danger' });
  } finally {
    remoteSaveInFlight = false;
    if (remoteSaveQueued) {
      remoteSaveQueued = false;
      persistStateToApi();
    }
  }
}

function populateHeaderAvatars() {
  const members = Array.isArray(state.members) ? state.members : MEMBERS;
  const visible = members.slice(0, 3).map((member) => avatarMarkup(member)).join('');
  const remaining = members.length - 3;
  els.headerAvatars.innerHTML =
    visible + (remaining > 0 ? `<span class="avatar avatar-more" title="Mais ${remaining} membros">+${remaining}</span>` : '');
}

function populateFilterOptions() {
  const members = Array.isArray(state.members) ? state.members : MEMBERS;
  els.filterPriorities.innerHTML = Object.entries(PRIORITIES)
    .map(
      ([key, priority]) => `
        <label class="filter-option">
          <input type="checkbox" value="${key}" data-filter-priority>
          <span class="filter-flag" style="--flag-color: ${priority.color}">${icon('flag')}</span>
          <span>${priority.label}</span>
        </label>`
    )
    .join('');

  els.filterAssignees.innerHTML = members.map(
    (member) => `
      <label class="filter-option">
        <input type="checkbox" value="${member.id}" data-filter-assignee>
        ${avatarMarkup(member)}
        <span>${escapeHtml(member.name)}</span>
      </label>`
  ).join('');
}

function populateAssigneeOptions() {
  const members = Array.isArray(state.members) ? state.members : MEMBERS;
  els.taskAssignee.innerHTML =
    '<option value="">Sem responsável</option>' +
    members.map((member) => `<option value="${member.id}">${escapeHtml(member.name)}</option>`).join('');
}

function setNavigationTitles() {
  document.querySelectorAll('.nav-item, .footer-action').forEach((button) => {
    const label = button.querySelector('.nav-label, .footer-label');
    if (label) button.title = label.textContent.trim();
  });
}

function renderAll() {
  updateChrome();
  renderCustomSpaces();
  updateNotificationBadges();

  if (ui.module === 'board') {
    els.boardWrap.hidden = false;
    els.moduleWrap.hidden = true;
    renderViewTabs();
    renderBoardView();
    updateToolbar();
  } else {
    els.boardWrap.hidden = true;
    els.moduleWrap.hidden = false;
    els.activeFilters.hidden = true;
    renderModuleView();
  }
}

function updateChrome() {
  const meta = MODULE_META[ui.module] || MODULE_META.board;
  const isBoard = ui.module === 'board';

  els.listTitle.textContent = meta.title;
  els.listIconUse.setAttribute('href', `#i-${meta.icon}`);
  els.breadcrumbs.innerHTML = meta.breadcrumbs
    .map((crumb, index) => {
      const tag = index === meta.breadcrumbs.length - 1 ? 'strong' : 'span';
      const separator =
        index < meta.breadcrumbs.length - 1
          ? `<svg class="icon crumb-separator"><use href="#i-chevron-right"></use></svg>`
          : '';
      return `<${tag}>${escapeHtml(crumb)}</${tag}>${separator}`;
    })
    .join('');

  [els.favoriteBtn, els.headerAvatars, els.shareBtn, els.newTaskBtn].forEach((element) => {
    element.hidden = !isBoard;
  });
  els.viewTabsRow.hidden = !isBoard;
  els.boardToolbar.hidden = !isBoard;
  els.boardWrap.hidden = !isBoard;
  els.moduleWrap.hidden = isBoard;

  document.querySelectorAll('.nav-item[data-module]').forEach((button) => {
    const active = button.dataset.module === ui.module;
    button.classList.toggle('is-active', active);
    if (active) button.setAttribute('aria-current', 'page');
    else button.removeAttribute('aria-current');
  });
  els.boardListBtn.classList.toggle('is-active', isBoard);

  document.title = `${meta.title} · Kanban`;
  updateProfileLabels();
  applyPreferences();
}

function updateProfileLabels() {
  const displayName = state.settings?.displayName || 'Meu perfil';
  const workspaceName = state.settings?.workspaceName || 'Meu Workspace';
  const initial = displayName.trim().charAt(0).toUpperCase() || 'W';
  els.profileName.textContent = displayName;
  els.profileAvatar.textContent = initial;
  els.profileBtn.textContent = initial;
  els.workspaceName.textContent = workspaceName;
  document.querySelectorAll('.workspace-avatar').forEach((avatar) => {
    avatar.textContent = workspaceName.trim().charAt(0).toUpperCase() || 'W';
  });
}

function applyPreferences() {
  document.body.classList.toggle('hide-task-tags', state.settings?.showTags === false);
  document.body.classList.toggle('hide-task-due', state.settings?.showDueDates === false);
  document.body.classList.toggle('compact-cards', Boolean(state.settings?.compactCards));
}

function updateNotificationBadges() {
  const unread = state.notifications.filter((item) => !item.read).length;
  els.inboxBadge.textContent = String(unread);
  els.inboxBadge.hidden = unread === 0;
  els.notificationDot.hidden = unread === 0;
  els.notificationsBtn.setAttribute(
    'aria-label',
    unread ? `Notificações, ${unread} não lidas` : 'Notificações'
  );
}

function renderCustomSpaces() {
  els.customSpaces.innerHTML = state.spaces
    .map(
      (space) => `
        <button class="tree-item space-row is-collapsed" type="button" data-tree-toggle aria-expanded="false">
          <span class="space-dot" style="--dot-color: ${escapeAttr(space.color || '#7b68ee')}"></span>
          <span class="tree-label">${escapeHtml(space.name)}</span>
          <svg class="icon tree-chevron"><use href="#i-chevron-down"></use></svg>
        </button>
        <div class="tree-children">
          <div class="tree-empty">Nenhuma lista ainda</div>
        </div>`
    )
    .join('');
}

function renderViewTabs() {
  const standard = Object.entries(VIEW_META).map(([id, meta]) => ({
    id,
    label: meta.label,
    icon: meta.icon,
    custom: false
  }));
  const custom = state.customViews.map((view) => ({
    id: view.id,
    label: view.name,
    icon: VIEW_META[view.type]?.icon || 'columns',
    custom: true
  }));

  els.viewTabs.innerHTML =
    [...standard, ...custom]
      .map(
        (view) => `
          <button class="view-tab${view.id === ui.view ? ' is-active' : ''}" type="button" data-view-id="${escapeAttr(view.id)}"${view.id === ui.view ? ' aria-current="page"' : ''}>
            ${icon(view.icon)}
            <span>${escapeHtml(view.label)}</span>
          </button>`
      )
      .join('') +
    `<button class="view-tab view-tab-add" type="button" data-add-view aria-label="Adicionar visualização" title="Adicionar visualização">${icon('plus')}</button>`;
}

function getActiveView() {
  if (VIEW_META[ui.view]) return { id: ui.view, type: ui.view, ...VIEW_META[ui.view] };
  const custom = state.customViews.find((view) => view.id === ui.view);
  if (custom) {
    return { id: custom.id, type: custom.type, label: custom.name, icon: VIEW_META[custom.type]?.icon || 'columns' };
  }
  ui.view = 'board';
  return { id: 'board', type: 'board', ...VIEW_META.board };
}

function showModule(moduleId) {
  if (!MODULE_META[moduleId]) return;
  ui.module = moduleId;
  closePopovers();
  closeTaskMenu();
  if (isMobile()) closeMobileSidebar();
  renderAll();
}

function showView(viewId) {
  if (VIEW_META[viewId] || state.customViews.some((view) => view.id === viewId)) {
    ui.view = viewId;
    if (ui.module !== 'board') ui.module = 'board';
    closePopovers();
    renderAll();
  }
}

function handleSidebarClick(event) {
  const treeToggle = event.target.closest('[data-tree-toggle]');
  if (treeToggle) {
    const collapsed = treeToggle.classList.toggle('is-collapsed');
    treeToggle.setAttribute('aria-expanded', String(!collapsed));
    return;
  }

  const moduleButton = event.target.closest('[data-module]');
  if (moduleButton) {
    showModule(moduleButton.dataset.module);
    return;
  }

  if (event.target.closest('#board-list-btn')) {
    showModule('board');
  }
}

function handleViewTabsClick(event) {
  const addButton = event.target.closest('[data-add-view]');
  if (addButton) {
    openAddViewDialog();
    return;
  }

  const tab = event.target.closest('[data-view-id]');
  if (tab) showView(tab.dataset.viewId);
}

function renderBoardView() {
  const view = getActiveView();
  els.board.className = `board view-${view.type}`;
  els.board.dataset.view = view.type;

  if (view.type === 'list') renderListView();
  else if (view.type === 'calendar') renderCalendarView();
  else if (view.type === 'timeline') renderTimelineView();
  else renderBoard();
}

function getVisibleTasks() {
  return sortTasks(state.tasks.filter(taskMatchesFilters));
}

function renderBoard() {
  const filtering = hasActiveFilters();
  const html = COLUMNS.map((column) => {
    const tasks = sortTasks(state.tasks.filter((task) => task.statusId === column.id && taskMatchesFilters(task)));
    const cards = tasks.length
      ? tasks.map(renderTask).join('')
      : `<div class="empty-column">${filtering ? 'Nenhum resultado com os filtros atuais' : 'Solte um cartão aqui'}</div>`;

    return `
      <section class="column" data-column-id="${column.id}" aria-label="${column.label}">
        <div class="column-header">
          <span class="status-dot" style="--status-color: ${column.color}"></span>
          <span class="column-name">${column.label}</span>
          <span class="column-count">${tasks.length}</span>
          <div class="column-actions">
            <button class="column-add" type="button" data-add-task data-column-id="${column.id}" aria-label="Adicionar tarefa em ${column.label}" title="Adicionar tarefa">
              ${icon('plus')}
            </button>
          </div>
        </div>
        <div class="task-list" data-column-id="${column.id}" role="list" aria-label="Tarefas em ${column.label}">
          ${cards}
        </div>
        <button class="add-task-row" type="button" data-add-task data-column-id="${column.id}">
          ${icon('plus')}
          <span>Adicionar tarefa</span>
        </button>
      </section>`;
  }).join('');

  els.board.innerHTML = html;
}

function renderListView() {
  const visible = getVisibleTasks();
  const groups = COLUMNS.map((column) => ({
    column,
    tasks: visible.filter((task) => task.statusId === column.id)
  }));

  els.board.innerHTML = `
    <div class="list-view">
      <div class="view-heading">
        <div>
          <span class="view-eyebrow">Visualização em lista</span>
          <h2>${visible.length} ${visible.length === 1 ? 'tarefa' : 'tarefas'}</h2>
        </div>
        <button class="btn btn-primary btn-sm" type="button" data-add-task data-column-id="todo">
          ${icon('plus')}<span>Nova tarefa</span>
        </button>
      </div>
      <div class="list-groups">
        ${groups
          .map(
            ({ column, tasks }) => `
              <section class="list-group" data-column-id="${column.id}">
                <header class="list-group-head">
                  <span class="status-dot" style="--status-color: ${column.color}"></span>
                  <strong>${column.label}</strong>
                  <span class="count-badge">${tasks.length}</span>
                  <button class="column-add" type="button" data-add-task data-column-id="${column.id}" aria-label="Adicionar tarefa em ${column.label}">
                    ${icon('plus')}
                  </button>
                </header>
                <div class="task-table" role="list">
                  <div class="task-table-head" aria-hidden="true">
                    <span></span>
                    <span>Tarefa</span>
                    <span>Etiquetas</span>
                    <span>Responsável</span>
                    <span>Prioridade</span>
                    <span>Vencimento</span>
                  </div>
                  ${
                    tasks.length
                      ? tasks.map(renderListRow).join('')
                      : `<div class="task-table-empty">${hasActiveFilters() ? 'Nenhuma tarefa com os filtros atuais.' : 'Nenhuma tarefa neste status.'}</div>`
                  }
                  <button class="task-table-add" type="button" data-add-task data-column-id="${column.id}">
                    ${icon('plus')}<span>Adicionar tarefa</span>
                  </button>
                </div>
              </section>`
          )
          .join('')}
      </div>
    </div>`;
}

function renderListRow(task) {
  const priority = PRIORITIES[task.priority];
  const member = getMember(task.assigneeId);
  const due = getDueInfo(task);
  return `
    <div class="task-row${task.statusId === 'done' ? ' is-done' : ''}" data-open-task="${escapeAttr(task.id)}" role="button" tabindex="0">
      <button class="task-check${task.statusId === 'done' ? ' is-checked' : ''}" type="button" data-toggle-task="${escapeAttr(task.id)}" aria-label="${task.statusId === 'done' ? 'Reabrir' : 'Concluir'} ${escapeAttr(task.title)}">
        ${task.statusId === 'done' ? icon('check') : ''}
      </button>
      <span class="task-row-title">
        <span class="task-row-code">${taskCode(task)}</span>
        <span class="task-row-name">${escapeHtml(task.title)}</span>
      </span>
      <span class="task-row-tags">${task.tags.map((tag) => `<span class="mini-tag" style="--tag-hue: ${getTagHue(tag)}">${escapeHtml(tag)}</span>`).join('') || '<span class="cell-empty">—</span>'}</span>
      <span class="task-row-assignee">${member ? avatarMarkup(member) : '<span class="cell-empty">—</span>'}</span>
      <span class="task-row-priority"><span class="priority-label" style="--priority-color: ${priority.color}">${icon('flag')}${priority.label}</span></span>
      <span class="task-row-due">${due ? `<span class="task-due ${due.className}" title="${escapeAttr(due.title)}">${icon('calendar')}${due.label}</span>` : '<span class="cell-empty">—</span>'}</span>
    </div>`;
}

function renderCalendarView() {
  const visible = getVisibleTasks().filter((task) => task.dueDate);
  const year = ui.calendar.year;
  const month = ui.calendar.month;
  const firstDay = new Date(year, month, 1);
  const start = new Date(year, month, 1 - firstDay.getDay());
  const todayKey = formatDateKey(new Date());
  const monthLabel = new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric' }).format(firstDay);
  const cells = [];

  for (let index = 0; index < 42; index += 1) {
    const date = new Date(start);
    date.setDate(start.getDate() + index);
    const key = formatDateKey(date);
    const dayTasks = visible.filter((task) => task.dueDate === key);
    const outside = date.getMonth() !== month;
    const classes = [
      'calendar-day',
      outside ? 'is-outside' : '',
      key === todayKey ? 'is-today' : '',
      [0, 6].includes(date.getDay()) ? 'is-weekend' : ''
    ]
      .filter(Boolean)
      .join(' ');

    cells.push(`
      <div class="${classes}" data-date="${key}">
        <div class="calendar-day-head">
          <span class="calendar-day-number">${date.getDate()}</span>
          <button class="calendar-add" type="button" data-add-task-date="${key}" data-column-id="todo" aria-label="Adicionar tarefa em ${key}" title="Adicionar tarefa">${icon('plus')}</button>
        </div>
        <div class="calendar-tasks">
          ${dayTasks
            .slice(0, 3)
            .map(
              (task) => `
                <button class="calendar-task priority-${task.priority}" type="button" data-open-task="${escapeAttr(task.id)}" title="${escapeAttr(task.title)}">
                  <span class="calendar-task-dot"></span>
                  <span>${escapeHtml(task.title)}</span>
                </button>`
            )
            .join('')}
          ${dayTasks.length > 3 ? `<span class="calendar-more">+${dayTasks.length - 3} mais</span>` : ''}
        </div>
      </div>`);
  }

  els.board.innerHTML = `
    <div class="calendar-view">
      <div class="view-heading calendar-heading">
        <div>
          <span class="view-eyebrow">Calendário</span>
          <h2>${escapeHtml(monthLabel)}</h2>
        </div>
        <div class="calendar-controls">
          <button class="icon-btn" type="button" data-calendar-prev aria-label="Mês anterior" title="Mês anterior">${icon('chevron-right', 'is-prev')}</button>
          <button class="btn btn-outline btn-sm" type="button" data-calendar-today>Hoje</button>
          <button class="icon-btn" type="button" data-calendar-next aria-label="Próximo mês" title="Próximo mês">${icon('chevron-right')}</button>
        </div>
      </div>
      <div class="calendar-grid">
        ${WEEKDAYS.map((day) => `<div class="calendar-weekday">${day}</div>`).join('')}
        ${cells.join('')}
      </div>
      ${visible.length ? '' : '<div class="view-footnote">Nenhuma tarefa com vencimento neste quadro.</div>'}
    </div>`;
}

function renderTimelineView() {
  const visible = getVisibleTasks()
    .filter((task) => task.dueDate)
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate));
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const start = new Date(today);
  start.setDate(today.getDate() - ((today.getDay() + 6) % 7) - 7);
  const totalDays = 35;
  const dayWidth = 40;
  const days = Array.from({ length: totalDays }, (_, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() + index);
    return date;
  });
  const end = days[days.length - 1];
  const rangeLabel = `${formatShortDate(start)} – ${formatShortDate(end)}`;
  const visibleRows = visible.filter((task) => {
    const due = parseDateKey(task.dueDate);
    return due && due >= start;
  });

  els.board.innerHTML = `
    <div class="timeline-view">
      <div class="view-heading">
        <div>
          <span class="view-eyebrow">Timeline</span>
          <h2>${escapeHtml(rangeLabel)}</h2>
        </div>
        <span class="timeline-legend"><span class="timeline-legend-dot"></span> Período planejado</span>
      </div>
      <div class="timeline-scroll">
        <div class="timeline-grid" style="--day-width: ${dayWidth}px; --days: ${totalDays}">
          <div class="timeline-corner">Tarefa</div>
          <div class="timeline-days">
            ${days
              .map((date) => {
                const isToday = formatDateKey(date) === formatDateKey(today);
                const weekend = [0, 6].includes(date.getDay());
                return `<div class="timeline-day${isToday ? ' is-today' : ''}${weekend ? ' is-weekend' : ''}"><span>${date.getDate()}</span><small>${WEEKDAYS[date.getDay()]}</small></div>`;
              })
              .join('')}
          </div>
          <div class="timeline-labels">
            ${visibleRows
              .map(
                (task) => `
                  <button class="timeline-label" type="button" data-open-task="${escapeAttr(task.id)}" title="${escapeAttr(task.title)}">
                    <span class="status-dot" style="--status-color: ${getColumn(task.statusId)?.color || '#87909e'}"></span>
                    <span>${escapeHtml(task.title)}</span>
                  </button>`
              )
              .join('')}
          </div>
          <div class="timeline-tracks">
            ${visibleRows
              .map((task) => {
                const due = parseDateKey(task.dueDate);
                const created = new Date(task.createdAt);
                created.setHours(0, 0, 0, 0);
                const plannedStart = new Date(due);
                plannedStart.setDate(due.getDate() - 2);
                const barStart = new Date(Math.min(created.getTime(), plannedStart.getTime()));
                const startIndex = Math.max(0, Math.min(totalDays - 1, Math.round((Math.max(barStart, start) - start) / 86400000)));
                const endIndex = Math.max(startIndex, Math.min(totalDays - 1, Math.round((due - start) / 86400000)));
                const width = Math.max(24, (endIndex - startIndex + 1) * dayWidth - 8);
                const left = startIndex * dayWidth + 4;
                const color = getColumn(task.statusId)?.color || '#7b68ee';
                return `
                  <div class="timeline-track">
                    ${days.map((date) => `<span class="timeline-gridline${[0, 6].includes(date.getDay()) ? ' is-weekend' : ''}"></span>`).join('')}
                    <button class="timeline-bar" type="button" data-open-task="${escapeAttr(task.id)}" style="left: ${left}px; width: ${width}px; --bar-color: ${color}" title="${escapeAttr(task.title)}">
                      <span>${escapeHtml(task.title)}</span>
                    </button>
                  </div>`;
              })
              .join('')}
          </div>
        </div>
      </div>
      ${visibleRows.length ? '' : '<div class="view-footnote">Nenhuma tarefa com vencimento no período exibido.</div>'}
    </div>`;
}

function renderTask(task) {
  const priority = PRIORITIES[task.priority];
  const member = getMember(task.assigneeId);
  const due = getDueInfo(task);
  const canDrag = ui.sort === 'manual';
  const tags = task.tags.length
    ? `<div class="task-tags">${task.tags
        .map(
          (tag) =>
            `<span class="task-tag" style="--tag-hue: ${getTagHue(tag)}" title="${escapeAttr(tag)}">${escapeHtml(tag)}</span>`
        )
        .join('')}</div>`
    : '';
  const dueMarkup = due
    ? `<span class="task-due ${due.className}" title="${escapeAttr(due.title)}">${icon('calendar')}<span>${due.label}</span></span>`
    : '';
  const memberMarkup = member ? avatarMarkup(member) : '';

  return `
    <article class="task-card ${task.statusId === 'done' ? 'is-done' : ''}" data-task-id="${escapeAttr(task.id)}" role="listitem" tabindex="0" draggable="${canDrag}">
      <button class="card-menu-btn" type="button" data-task-menu aria-haspopup="menu" aria-expanded="false" aria-label="Mais ações para ${escapeAttr(task.title)}" title="Mais ações">
        ${icon('more-horizontal')}
      </button>
      <h3 class="task-name">${escapeHtml(task.title)}</h3>
      ${tags}
      <div class="task-footer">
        <div class="task-footer-left">${memberMarkup}</div>
        <div class="task-footer-right">
          ${dueMarkup}
          <span class="task-priority" style="--priority-color: ${priority.color}" title="Prioridade: ${priority.label}">
            ${icon('flag')}
            <span>${priority.label}</span>
          </span>
        </div>
      </div>
    </article>`;
}

function renderModuleView() {
  if (ui.module === 'inbox') renderInboxModule();
  else if (ui.module === 'everything') renderEverythingModule();
  else if (ui.module === 'dashboards') renderDashboardsModule();
  else if (ui.module === 'documents') renderDocumentsModule();
  else if (ui.module === 'goals') renderGoalsModule();
  else if (ui.module === 'teams') renderTeamsModule();
  else if (ui.module === 'ai') renderAiModule();
  else renderHomeModule();
}

function formatRelativeTime(timestamp) {
  const diff = Date.now() - Number(timestamp || 0);
  if (!Number.isFinite(diff) || diff < 0) return 'agora';
  if (diff < 60000) return 'agora';
  if (diff < 3600000) return `${Math.floor(diff / 60000)} min`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)} h`;
  if (diff < 604800000) return `${Math.floor(diff / 86400000)} d`;
  return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short' }).format(new Date(timestamp));
}

function todayDateKey() {
  return formatDateKey(new Date());
}

function isTaskOverdue(task) {
  return task.statusId !== 'done' && Boolean(task.dueDate) && task.dueDate < todayDateKey();
}

function renderTaskMiniRow(task, options = {}) {
  const member = getMember(task.assigneeId);
  const due = getDueInfo(task);
  const priority = PRIORITIES[task.priority];
  return `
    <button class="mini-task-row${task.statusId === 'done' ? ' is-done' : ''}" type="button" data-open-task="${escapeAttr(task.id)}">
      <span class="status-dot" style="--status-color: ${getColumn(task.statusId)?.color || '#87909e'}"></span>
      <span class="mini-task-main">
        <span class="mini-task-title">${escapeHtml(task.title)}</span>
        <span class="mini-task-meta">${taskCode(task)}${options.showList ? ' · Site institucional' : ''}</span>
      </span>
      ${member ? avatarMarkup(member) : ''}
      <span class="priority-label" style="--priority-color: ${priority.color}">${icon('flag')}${priority.label}</span>
      ${due ? `<span class="task-due ${due.className}">${icon('calendar')}${due.label}</span>` : '<span class="cell-empty">Sem prazo</span>'}
    </button>`;
}

function renderEmptyState(iconName, title, description, action = '') {
  return `
    <div class="empty-state">
      <span class="empty-state-icon">${icon(iconName)}</span>
      <h3>${escapeHtml(title)}</h3>
      <p>${escapeHtml(description)}</p>
      ${action}
    </div>`;
}

function renderMetric(iconName, label, value, hint, tone = 'primary') {
  return `
    <article class="metric-card tone-${tone}">
      <span class="metric-icon">${icon(iconName)}</span>
      <div>
        <span class="metric-label">${label}</span>
        <strong class="metric-value">${value}</strong>
        <span class="metric-hint">${hint}</span>
      </div>
    </article>`;
}

function renderHomeModule() {
  const open = state.tasks.filter((task) => task.statusId !== 'done');
  const done = state.tasks.filter((task) => task.statusId === 'done');
  const overdue = open.filter(isTaskOverdue);
  const today = open.filter((task) => task.dueDate === todayDateKey());
  const upcoming = open
    .filter((task) => task.dueDate && task.dueDate >= todayDateKey())
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
    .slice(0, 5);
  const greetingHour = new Date().getHours();
  const greeting = greetingHour < 12 ? 'Bom dia' : greetingHour < 18 ? 'Boa tarde' : 'Boa noite';
  const dateLabel = new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  }).format(new Date());
  const progress = state.tasks.length ? Math.round((done.length / state.tasks.length) * 100) : 0;

  els.moduleWrap.innerHTML = `
    <div class="module-page">
      <section class="module-hero">
        <div>
          <span class="module-eyebrow">${escapeHtml(dateLabel)}</span>
          <h2>${greeting}, ${escapeHtml(state.settings.displayName)}</h2>
          <p>Você tem <strong>${open.length} tarefas abertas</strong>${overdue.length ? ` e <strong>${overdue.length} atrasada${overdue.length === 1 ? '' : 's'}</strong>` : ''}. ${
            today.length ? `${today.length} ${today.length === 1 ? 'vence hoje' : 'vencem hoje'}.` : 'Nada vence hoje.'
          }</p>
        </div>
        <div class="module-actions">
          <button class="btn btn-outline" type="button" data-module-action="show-board">${icon('columns')}<span>Abrir quadro</span></button>
          <button class="btn btn-primary" type="button" data-module-action="new-task">${icon('plus')}<span>Nova tarefa</span></button>
        </div>
      </section>

      <div class="metric-grid">
        ${renderMetric('layers', 'Tarefas abertas', open.length, `${state.tasks.length} no total`, 'primary')}
        ${renderMetric('rotate', 'Em andamento', state.tasks.filter((task) => task.statusId === 'doing').length, 'trabalho ativo', 'blue')}
        ${renderMetric('calendar', 'Vencem hoje', today.length, overdue.length ? `${overdue.length} atrasada${overdue.length === 1 ? '' : 's'}` : 'prazos em dia', overdue.length ? 'danger' : 'green')}
        ${renderMetric('check-circle', 'Concluídas', done.length, `${progress}% do quadro`, 'green')}
      </div>

      <div class="panel-grid panel-grid-wide">
        <section class="panel">
          <header class="panel-head">
            <div><span class="panel-eyebrow">Prioridades</span><h3>Próximos prazos</h3></div>
            <button class="text-link" type="button" data-module="everything">Ver tudo ${icon('arrow-right')}</button>
          </header>
          <div class="mini-task-list">
            ${
              upcoming.length
                ? upcoming.map((task) => renderTaskMiniRow(task)).join('')
                : renderEmptyState('calendar', 'Nenhum prazo próximo', 'As tarefas com vencimento aparecerão aqui.')
            }
          </div>
        </section>

        <section class="panel">
          <header class="panel-head">
            <div><span class="panel-eyebrow">Quadro</span><h3>Progresso geral</h3></div>
            <span class="count-badge">${progress}%</span>
          </header>
          <div class="progress-summary">
            <div class="progress-ring" style="--progress: ${progress}"><span>${progress}%</span></div>
            <div class="status-summary">
              ${COLUMNS.map((column) => {
                const count = state.tasks.filter((task) => task.statusId === column.id).length;
                return `<div class="status-summary-row"><span class="status-dot" style="--status-color: ${column.color}"></span><span>${column.label}</span><strong>${count}</strong></div>`;
              }).join('')}
            </div>
          </div>
        </section>
      </div>

      <section class="panel">
        <header class="panel-head">
          <div><span class="panel-eyebrow">Atividade</span><h3>Últimas notificações</h3></div>
          <button class="text-link" type="button" data-module="inbox">Abrir caixa de entrada ${icon('arrow-right')}</button>
        </header>
        <div class="compact-feed">
          ${
            state.notifications
              .slice(0, 4)
              .map(
                (item) => `
                  <button class="feed-row${item.read ? '' : ' is-unread'}" type="button" data-inbox-id="${escapeAttr(item.id)}">
                    <span class="feed-dot kind-${escapeAttr(item.kind)}"></span>
                    <span class="feed-text">${escapeHtml(item.message)}</span>
                    <span class="feed-time">${formatRelativeTime(item.createdAt)}</span>
                  </button>`
              )
              .join('') || '<div class="view-footnote">Nenhuma atividade recente.</div>'
          }
        </div>
      </section>
    </div>`;
}

function renderInboxModule() {
  const unread = state.notifications.filter((item) => !item.read).length;
  els.moduleWrap.innerHTML = `
    <div class="module-page">
      <section class="module-heading-row">
        <div>
          <span class="module-eyebrow">Central de atividade</span>
          <h2>Caixa de entrada</h2>
          <p>${unread ? `${unread} ${unread === 1 ? 'notificação não lida' : 'notificações não lidas'}.` : 'Você está em dia.'}</p>
        </div>
        <div class="module-actions">
          <button class="btn btn-outline" type="button" data-module-action="read-all" ${unread ? '' : 'disabled'}>${icon('check')}<span>Marcar todas como lidas</span></button>
        </div>
      </section>
      <section class="panel inbox-panel">
        <div class="inbox-list">
          ${
            state.notifications
              .map(
                (item) => `
                  <button class="inbox-row${item.read ? '' : ' is-unread'}" type="button" data-inbox-id="${escapeAttr(item.id)}">
                    <span class="inbox-icon kind-${escapeAttr(item.kind)}">${icon(item.kind === 'warning' ? 'flag' : item.kind === 'success' ? 'check-circle' : 'bell')}</span>
                    <span class="inbox-copy">
                      <span class="inbox-message">${escapeHtml(item.message)}</span>
                      <span class="inbox-meta">${item.taskId && getTask(item.taskId) ? taskCode(getTask(item.taskId)) : 'Atualização do workspace'} · ${formatRelativeTime(item.createdAt)}</span>
                    </span>
                    ${item.read ? '' : '<span class="unread-dot" aria-label="Não lida"></span>'}
                  </button>`
              )
              .join('') || renderEmptyState('inbox', 'Caixa de entrada vazia', 'Novas menções e atualizações aparecerão aqui.')
          }
        </div>
      </section>
    </div>`;
}

function renderEverythingModule() {
  const open = state.tasks.filter((task) => task.statusId !== 'done');
  const overdue = state.tasks.filter(isTaskOverdue);
  els.moduleWrap.innerHTML = `
    <div class="module-page">
      <section class="module-heading-row">
        <div>
          <span class="module-eyebrow">Todas as listas</span>
          <h2>Tudo</h2>
          <p>${state.tasks.length} tarefas em Site institucional. ${overdue.length ? `${overdue.length} atrasada${overdue.length === 1 ? '' : 's'} ${overdue.length === 1 ? 'exige' : 'exigem'} atenção.` : 'Nenhuma tarefa atrasada.'}</p>
        </div>
        <div class="module-actions">
          <button class="btn btn-outline" type="button" data-module-action="show-board">${icon('columns')}<span>Abrir quadro</span></button>
          <button class="btn btn-primary" type="button" data-module-action="new-task">${icon('plus')}<span>Nova tarefa</span></button>
        </div>
      </section>
      <div class="metric-grid metric-grid-compact">
        ${renderMetric('layers', 'Total', state.tasks.length, 'em uma lista', 'primary')}
        ${renderMetric('rotate', 'Abertas', open.length, 'para concluir', 'blue')}
        ${renderMetric('flag', 'Atrasadas', overdue.length, 'requerem ação', overdue.length ? 'danger' : 'green')}
      </div>
      <div class="panel-grid">
        ${COLUMNS.map((column) => {
          const tasks = state.tasks.filter((task) => task.statusId === column.id);
          return `
            <section class="panel">
              <header class="panel-head">
                <div class="panel-title-inline"><span class="status-dot" style="--status-color: ${column.color}"></span><h3>${column.label}</h3><span class="count-badge">${tasks.length}</span></div>
              </header>
              <div class="mini-task-list">
                ${tasks.length ? tasks.map((task) => renderTaskMiniRow(task, { showList: true })).join('') : '<div class="view-footnote">Nenhuma tarefa.</div>'}
              </div>
            </section>`;
        }).join('')}
      </div>
    </div>`;
}

function renderDashboardsModule() {
  const total = state.tasks.length;
  const done = state.tasks.filter((task) => task.statusId === 'done').length;
  const progress = total ? Math.round((done / total) * 100) : 0;
  const overdue = state.tasks.filter(isTaskOverdue).length;
  const members = state.members;
  const workloads = members.map((member) => {
    const tasks = state.tasks.filter((task) => task.assigneeId === member.id && task.statusId !== 'done');
    return { member, tasks };
  });
  const maxWorkload = Math.max(1, ...workloads.map((entry) => entry.tasks.length));
  const priorityRows = Object.entries(PRIORITIES)
    .map(([key, priority]) => ({
      key,
      ...priority,
      count: state.tasks.filter((task) => task.priority === key).length
    }))
    .sort((a, b) => a.rank - b.rank);
  const maxPriority = Math.max(1, ...priorityRows.map((row) => row.count));

  els.moduleWrap.innerHTML = `
    <div class="module-page">
      <section class="module-heading-row">
        <div>
          <span class="module-eyebrow">Análise do workspace</span>
          <h2>Painéis</h2>
          <p>Indicadores em tempo real calculados a partir das tarefas do banco local.</p>
        </div>
        <div class="module-actions">
          <button class="btn btn-outline" type="button" data-module-action="show-board">${icon('columns')}<span>Ver quadro</span></button>
        </div>
      </section>
      <div class="metric-grid">
        ${renderMetric('layers', 'Total de tarefas', total, 'no quadro', 'primary')}
        ${renderMetric('check-circle', 'Concluídas', done, `${progress}% de progresso`, 'green')}
        ${renderMetric('rotate', 'Em andamento', state.tasks.filter((task) => task.statusId === 'doing').length, 'trabalho ativo', 'blue')}
        ${renderMetric('flag', 'Atrasadas', overdue, overdue ? 'requerem atenção' : 'prazos em dia', overdue ? 'danger' : 'green')}
      </div>
      <div class="panel-grid panel-grid-wide">
        <section class="panel">
          <header class="panel-head"><div><span class="panel-eyebrow">Equipe</span><h3>Carga de trabalho</h3></div></header>
          <div class="bar-list">
            ${workloads
              .map(
                ({ member, tasks }) => `
                  <div class="bar-row">
                    ${avatarMarkup(member)}
                    <span class="bar-label">${escapeHtml(member.name)}</span>
                    <span class="bar-track"><span class="bar-fill" style="width: ${(tasks.length / maxWorkload) * 100}%"></span></span>
                    <strong>${tasks.length}</strong>
                  </div>`
              )
              .join('')}
          </div>
        </section>
        <section class="panel">
          <header class="panel-head"><div><span class="panel-eyebrow">Progresso</span><h3>Distribuição do quadro</h3></div></header>
          <div class="progress-summary">
            <div class="progress-ring" style="--progress: ${progress}"><span>${progress}%</span></div>
            <div class="status-summary">
              ${COLUMNS.map((column) => {
                const count = state.tasks.filter((task) => task.statusId === column.id).length;
                return `<div class="status-summary-row"><span class="status-dot" style="--status-color: ${column.color}"></span><span>${column.label}</span><strong>${count}</strong></div>`;
              }).join('')}
            </div>
          </div>
        </section>
      </div>
      <section class="panel">
        <header class="panel-head"><div><span class="panel-eyebrow">Prioridades</span><h3>Tarefas por prioridade</h3></div></header>
        <div class="bar-list">
          ${priorityRows
            .map(
              (row) => `
                <div class="bar-row">
                  <span class="priority-label" style="--priority-color: ${row.color}">${icon('flag')}${row.label}</span>
                  <span class="bar-track"><span class="bar-fill" style="width: ${(row.count / maxPriority) * 100}%; --bar-color: ${row.color}"></span></span>
                  <strong>${row.count}</strong>
                </div>`
            )
            .join('')}
        </div>
      </section>
    </div>`;
}

function renderDocumentsModule() {
  const docs = [...state.documents].sort((a, b) => b.updatedAt - a.updatedAt);
  els.moduleWrap.innerHTML = `
    <div class="module-page">
      <section class="module-heading-row">
        <div>
          <span class="module-eyebrow">Conhecimento do workspace</span>
          <h2>Documentos</h2>
          <p>${docs.length} ${docs.length === 1 ? 'documento salvo' : 'documentos salvos'} no banco local.</p>
        </div>
        <div class="module-actions">
          <button class="btn btn-primary" type="button" data-module-action="new-doc">${icon('plus')}<span>Novo documento</span></button>
        </div>
      </section>
      ${
        docs.length
          ? `<div class="doc-grid">${docs
              .map(
                (doc) => `
                  <button class="doc-card" type="button" data-doc-id="${escapeAttr(doc.id)}">
                    <span class="doc-icon">${icon('file')}</span>
                    <span class="doc-card-title">${escapeHtml(doc.title)}</span>
                    <span class="doc-card-preview">${escapeHtml(doc.content.replace(/\s+/g, ' ').slice(0, 150))}</span>
                    <span class="doc-card-meta">Atualizado ${formatRelativeTime(doc.updatedAt)}</span>
                  </button>`
              )
              .join('')}</div>`
          : renderEmptyState('file', 'Nenhum documento', 'Crie um documento para centralizar o contexto do projeto.', `<button class="btn btn-primary" type="button" data-module-action="new-doc">${icon('plus')}<span>Novo documento</span></button>`)
      }
    </div>`;
}

function renderGoalsModule() {
  const goals = [...state.goals].sort((a, b) => (a.dueDate || '9999').localeCompare(b.dueDate || '9999'));
  els.moduleWrap.innerHTML = `
    <div class="module-page">
      <section class="module-heading-row">
        <div>
          <span class="module-eyebrow">Resultados</span>
          <h2>Metas</h2>
          <p>Acompanhe o progresso das iniciativas do workspace.</p>
        </div>
        <div class="module-actions">
          <button class="btn btn-primary" type="button" data-module-action="new-goal">${icon('plus')}<span>Nova meta</span></button>
        </div>
      </section>
      ${
        goals.length
          ? `<div class="goal-grid">${goals
              .map((goal) => {
                const due = goal.dueDate ? getDueInfo({ ...goal, statusId: goal.progress >= 100 ? 'done' : 'todo' }) : null;
                return `
                  <article class="goal-card">
                    <div class="goal-head">
                      <button class="goal-title" type="button" data-goal-edit="${escapeAttr(goal.id)}">${escapeHtml(goal.title)}</button>
                      <span class="count-badge">${goal.progress}%</span>
                    </div>
                    <p>${escapeHtml(goal.description || 'Sem descrição.')}</p>
                    <div class="goal-progress"><span style="width: ${goal.progress}%"></span></div>
                    <div class="goal-meta">
                      <span>${due ? `<span class="task-due ${due.className}">${icon('calendar')}${due.label}</span>` : 'Sem prazo'}</span>
                      <div class="goal-actions">
                        <button class="icon-btn" type="button" data-goal-step="-10" data-goal-id="${escapeAttr(goal.id)}" aria-label="Reduzir progresso" ${goal.progress <= 0 ? 'disabled' : ''}>−</button>
                        <button class="icon-btn" type="button" data-goal-step="10" data-goal-id="${escapeAttr(goal.id)}" aria-label="Aumentar progresso" ${goal.progress >= 100 ? 'disabled' : ''}>+</button>
                      </div>
                    </div>
                  </article>`;
              })
              .join('')}</div>`
          : renderEmptyState('target', 'Nenhuma meta definida', 'Crie uma meta para acompanhar o progresso do time.', `<button class="btn btn-primary" type="button" data-module-action="new-goal">${icon('plus')}<span>Nova meta</span></button>`)
      }
    </div>`;
}

function renderTeamsModule() {
  const pendingInvites = state.invites.filter((invite) => invite.status === 'pending').length;
  const workloads = state.members.map((member) => {
    const tasks = state.tasks.filter((task) => task.assigneeId === member.id);
    const open = tasks.filter((task) => task.statusId !== 'done');
    return { member, tasks, open };
  });
  const maxOpen = Math.max(1, ...workloads.map((entry) => entry.open.length));

  els.moduleWrap.innerHTML = `
    <div class="module-page">
      <section class="module-heading-row">
        <div>
          <span class="module-eyebrow">Pessoas</span>
          <h2>Equipes</h2>
          <p>${state.members.length} membros e ${pendingInvites} ${pendingInvites === 1 ? 'convite pendente' : 'convites pendentes'}.</p>
        </div>
        <div class="module-actions">
          <button class="btn btn-primary" type="button" data-module-action="invite">${icon('user-plus')}<span>Convidar pessoas</span></button>
        </div>
      </section>
      <div class="team-grid">
        ${workloads
          .map(
            ({ member, tasks, open }) => `
              <button class="team-card" type="button" data-member-id="${escapeAttr(member.id)}">
                <span class="team-avatar" style="--avatar-color: ${member.color}">${escapeHtml(member.initials)}</span>
                <span class="team-copy">
                  <strong>${escapeHtml(member.name)}</strong>
                  <span>Membro · ${tasks.length} ${tasks.length === 1 ? 'tarefa' : 'tarefas'}</span>
                  <span class="team-bar"><span style="width: ${(open.length / maxOpen) * 100}%; --bar-color: ${member.color}"></span></span>
                  <small>${open.length} em aberto</small>
                </span>
              </button>`
          )
          .join('')}
      </div>
      ${
        state.invites.length
          ? `<section class="panel">
              <header class="panel-head"><div><span class="panel-eyebrow">Convites</span><h3>Pendentes</h3></div></header>
              <div class="invite-list">
                ${state.invites
                  .map(
                    (invite) => `
                      <div class="invite-row">
                        <span class="invite-avatar">${escapeHtml(invite.email.charAt(0).toUpperCase())}</span>
                        <span class="invite-copy"><strong>${escapeHtml(invite.email)}</strong><small>${roleLabel(invite.role)} · ${formatRelativeTime(invite.createdAt)}</small></span>
                        <button class="icon-btn" type="button" data-revoke-invite="${escapeAttr(invite.id)}" aria-label="Revogar convite" title="Revogar convite">${icon('x')}</button>
                      </div>`
                  )
                  .join('')}
              </div>
            </section>`
          : ''
      }
    </div>`;
}

function ensureAiGreeting() {
  if (ui.aiMessages.length) return;
  const open = state.tasks.filter((task) => task.statusId !== 'done').length;
  ui.aiMessages.push({
    role: 'assistant',
    html: `Olá! Posso analisar o quadro local. No momento há <strong>${open} tarefas abertas</strong>. Escolha uma ação rápida ou faça uma pergunta sobre prazos, prioridades ou carga de trabalho.`
  });
}

function renderAiModule() {
  ensureAiGreeting();
  const prompts = ['Resumo do quadro', 'Prioridades de hoje', 'Tarefas atrasadas', 'Carga da equipe'];
  els.moduleWrap.innerHTML = `
    <div class="module-page ai-page">
      <section class="module-heading-row">
        <div>
          <span class="module-eyebrow">Análise local</span>
          <h2>Assistente IA</h2>
          <p>Respostas calculadas a partir dos dados salvos no SQLite, sem enviar informações para fora.</p>
        </div>
      </section>
      <div class="ai-layout">
        <section class="ai-chat-panel">
          <div class="ai-messages" id="ai-messages">
            ${ui.aiMessages
              .map(
                (message) => `
                  <div class="ai-message is-${message.role}">
                    <span class="ai-avatar">${message.role === 'assistant' ? icon('sparkles') : 'W'}</span>
                    <div class="ai-bubble">${message.html}</div>
                  </div>`
              )
              .join('')}
          </div>
          <form class="ai-form" id="ai-form">
            <label class="sr-only" for="ai-input">Pergunte ao assistente</label>
            <input id="ai-input" type="text" placeholder="Pergunte sobre prazos, prioridades ou equipe..." autocomplete="off" required>
            <button class="btn btn-primary" type="submit">${icon('arrow-right')}<span>Enviar</span></button>
          </form>
        </section>
        <aside class="ai-side-panel">
          <span class="panel-eyebrow">Ações rápidas</span>
          <div class="ai-prompts">
            ${prompts.map((prompt) => `<button class="ai-prompt" type="button" data-ai-prompt="${escapeAttr(prompt)}">${escapeHtml(prompt)}${icon('arrow-right')}</button>`).join('')}
          </div>
          <div class="ai-note">${icon('help')}<span>O assistente usa regras locais e os dados atuais do quadro.</span></div>
        </aside>
      </div>
    </div>`;
  const messages = document.getElementById('ai-messages');
  if (messages) messages.scrollTop = messages.scrollHeight;
}

function roleLabel(role) {
  return {
    viewer: 'Visualizador',
    commenter: 'Comentador',
    editor: 'Editor',
    admin: 'Administrador'
  }[role] || 'Editor';
}

function handleModuleClick(event) {
  const inboxItem = event.target.closest('[data-inbox-id]');
  if (inboxItem) {
    openNotification(inboxItem.dataset.inboxId);
    return;
  }

  const member = event.target.closest('[data-member-id]');
  if (member) {
    openMemberDialog(member.dataset.memberId);
    return;
  }

  const doc = event.target.closest('[data-doc-id]');
  if (doc) {
    openDocumentDialog(doc.dataset.docId);
    return;
  }

  const goalStep = event.target.closest('[data-goal-step]');
  if (goalStep) {
    adjustGoalProgress(goalStep.dataset.goalId, Number(goalStep.dataset.goalStep));
    return;
  }

  const goalEdit = event.target.closest('[data-goal-edit]');
  if (goalEdit) {
    openGoalDialog(goalEdit.dataset.goalEdit);
    return;
  }

  const revoke = event.target.closest('[data-revoke-invite]');
  if (revoke) {
    revokeInvite(revoke.dataset.revokeInvite);
    return;
  }

  const openTask = event.target.closest('[data-open-task]');
  if (openTask) {
    openTaskDialog(openTask.dataset.openTask);
    return;
  }

  const toggle = event.target.closest('[data-toggle-task]');
  if (toggle) {
    toggleTaskDone(toggle.dataset.toggleTask);
    return;
  }

  const aiPrompt = event.target.closest('[data-ai-prompt]');
  if (aiPrompt) {
    sendAiMessage(aiPrompt.dataset.aiPrompt);
    return;
  }

  const moduleLink = event.target.closest('[data-module]');
  if (moduleLink) {
    showModule(moduleLink.dataset.module);
    return;
  }

  const action = event.target.closest('[data-module-action]');
  if (!action) return;
  const name = action.dataset.moduleAction;
  if (name === 'show-board') showModule('board');
  if (name === 'new-task') openTaskDialog();
  if (name === 'new-doc') openDocumentDialog();
  if (name === 'new-goal') openGoalDialog();
  if (name === 'invite') openInviteDialog();
  if (name === 'read-all') markAllNotificationsRead();
}

function handleModuleSubmit(event) {
  if (event.target.id !== 'ai-form') return;
  event.preventDefault();
  const input = event.target.querySelector('#ai-input');
  const value = input.value.trim();
  if (!value) return;
  input.value = '';
  sendAiMessage(value);
}

function sendAiMessage(prompt) {
  ui.aiMessages.push({ role: 'user', html: escapeHtml(prompt) });
  const response = buildAiResponse(prompt);
  ui.aiMessages.push({ role: 'assistant', html: response });
  renderAiModule();
  const input = document.getElementById('ai-input');
  if (input) input.focus();
}

function buildAiResponse(prompt) {
  const query = normalizeText(prompt);
  const open = state.tasks.filter((task) => task.statusId !== 'done');
  const overdue = open.filter(isTaskOverdue);
  const done = state.tasks.filter((task) => task.statusId === 'done');
  const today = open.filter((task) => task.dueDate === todayDateKey());

  if (query.includes('atras') || query.includes('risco')) {
    if (!overdue.length) return 'Não há tarefas atrasadas no momento. Todos os prazos abertos estão dentro do esperado.';
    return `Há <strong>${overdue.length} ${overdue.length === 1 ? 'tarefa atrasada' : 'tarefas atrasadas'}</strong>:<ul>${overdue
      .map((task) => `<li><strong>${escapeHtml(task.title)}</strong> — venceu em ${formatLongDate(parseDateKey(task.dueDate))}</li>`)
      .join('')}</ul>Recomendo revisar o responsável e repriorizar essas tarefas hoje.`;
  }

  if (query.includes('equipe') || query.includes('carga') || query.includes('sobrecar')) {
    const loads = state.members
      .map((member) => ({
        member,
        count: open.filter((task) => task.assigneeId === member.id).length
      }))
      .sort((a, b) => b.count - a.count);
    return `Carga atual por responsável:<ul>${loads
      .map(({ member, count }) => `<li><strong>${escapeHtml(member.name)}</strong>: ${count} ${count === 1 ? 'tarefa aberta' : 'tarefas abertas'}</li>`)
      .join('')}</ul>${loads[0]?.count > loads[1]?.count + 1 ? `${escapeHtml(loads[0].member.name)} está com a maior carga; considere redistribuir uma tarefa.` : 'A distribuição de trabalho está equilibrada.'}`;
  }

  if (query.includes('prioridade') || query.includes('hoje') || query.includes('fazer')) {
    const priorities = open
      .filter((task) => task.priority === 'urgent' || task.priority === 'high' || task.dueDate === todayDateKey())
      .sort((a, b) => (a.dueDate || '9999').localeCompare(b.dueDate || '9999'))
      .slice(0, 6);
    if (!priorities.length) return 'Não há tarefas urgentes, de alta prioridade ou vencendo hoje. Bom momento para avançar em itens de prioridade normal.';
    return `Prioridades sugeridas para hoje:<ol>${priorities
      .map((task) => `<li><strong>${escapeHtml(task.title)}</strong> — ${PRIORITIES[task.priority].label}${task.dueDate ? `, vencimento ${formatLongDate(parseDateKey(task.dueDate))}` : ''}</li>`)
      .join('')}</ol>`;
  }

  if (query.includes('resumo') || query.includes('quadro') || query.includes('status')) {
    const progress = state.tasks.length ? Math.round((done.length / state.tasks.length) * 100) : 0;
    return `Resumo do quadro:<ul><li>${state.tasks.length} tarefas no total</li><li>${open.length} abertas e ${done.length} concluídas (${progress}%)</li><li>${state.tasks.filter((task) => task.statusId === 'doing').length} em andamento</li><li>${today.length} vencendo hoje</li><li>${overdue.length} atrasadas</li></ul>Próximo foco: ${escapeHtml(open[0]?.title || 'revisar o planejamento')}.`;
  }

  return `Posso ajudar com <strong>resumo do quadro</strong>, <strong>prioridades de hoje</strong>, <strong>tarefas atrasadas</strong> ou <strong>carga da equipe</strong>. No momento, há ${open.length} tarefas abertas e ${overdue.length} atrasadas.`;
}

function openNotification(id) {
  const item = state.notifications.find((notification) => notification.id === id);
  if (!item) return;
  if (!item.read) {
    item.read = true;
    saveState();
    updateNotificationBadges();
  }
  if (item.taskId && getTask(item.taskId)) openTaskDialog(item.taskId);
  else renderAll();
}

function markAllNotificationsRead() {
  let changed = false;
  state.notifications.forEach((item) => {
    if (!item.read) {
      item.read = true;
      changed = true;
    }
  });
  if (changed) {
    saveState();
    announce('Todas as notificações foram marcadas como lidas.');
  }
  renderAll();
}

function revokeInvite(id) {
  const index = state.invites.findIndex((invite) => invite.id === id);
  if (index === -1) return;
  const [removed] = state.invites.splice(index, 1);
  saveState();
  renderAll();
  showToast('Convite revogado.', {
    actionLabel: 'Desfazer',
    onAction: () => {
      state.invites.splice(index, 0, removed);
      saveState();
      renderAll();
    }
  });
}

function adjustGoalProgress(goalId, delta) {
  const goal = state.goals.find((item) => item.id === goalId);
  if (!goal) return;
  goal.progress = Math.max(0, Math.min(100, goal.progress + delta));
  goal.updatedAt = Date.now();
  saveState();
  renderAll();
}

function updateToolbar() {
  const visibleCount = state.tasks.filter(taskMatchesFilters).length;
  const totalCount = state.tasks.length;
  const filtering = hasActiveFilters();
  const doneCount = state.tasks.filter((task) => task.statusId === 'done').length;

  els.taskSummary.textContent = filtering
    ? `${visibleCount} de ${totalCount} ${totalCount === 1 ? 'tarefa' : 'tarefas'}`
    : `${totalCount} ${totalCount === 1 ? 'tarefa' : 'tarefas'}`;

  els.doneCount.textContent = doneCount;
  els.clearCompleted.disabled = doneCount === 0;
  els.searchClear.hidden = !els.searchInput.value;

  const filterCount = ui.filters.priorities.size + ui.filters.assignees.size;
  els.filterBadge.textContent = filterCount;
  els.filterBadge.hidden = filterCount === 0;
  els.filterBtn.classList.toggle('is-active', filterCount > 0);
  els.sortBtn.classList.toggle('is-active', ui.sort !== 'manual');
  els.filterBtn.setAttribute(
    'aria-label',
    filterCount > 0 ? `Filtrar tarefas, ${filterCount} filtros ativos` : 'Filtrar tarefas'
  );

  document.querySelectorAll('[data-filter-priority]').forEach((checkbox) => {
    checkbox.checked = ui.filters.priorities.has(checkbox.value);
  });
  document.querySelectorAll('[data-filter-assignee]').forEach((checkbox) => {
    checkbox.checked = ui.filters.assignees.has(checkbox.value);
  });
  document.querySelectorAll('[data-sort]').forEach((button) => {
    button.classList.toggle('is-active', button.dataset.sort === ui.sort);
  });

  renderActiveFilters();
}

function renderActiveFilters() {
  const parts = [];

  ui.filters.priorities.forEach((priorityKey) => {
    const priority = PRIORITIES[priorityKey];
    if (!priority) return;
    parts.push(`
      <span class="filter-chip">
        <span class="filter-chip-flag" style="--flag-color: ${priority.color}">${icon('flag')}</span>
        <span>${priority.label}</span>
        <button class="filter-chip-remove" type="button" data-filter-remove="priority" data-value="${priorityKey}" aria-label="Remover filtro ${priority.label}">
          ${icon('x')}
        </button>
      </span>`);
  });

  ui.filters.assignees.forEach((memberId) => {
    const member = getMember(memberId);
    if (!member) return;
    parts.push(`
      <span class="filter-chip">
        ${avatarMarkup(member)}
        <span>${escapeHtml(member.name)}</span>
        <button class="filter-chip-remove" type="button" data-filter-remove="assignee" data-value="${member.id}" aria-label="Remover filtro ${escapeAttr(member.name)}">
          ${icon('x')}
        </button>
      </span>`);
  });

  if (!parts.length) {
    els.activeFilters.hidden = true;
    els.activeFilters.innerHTML = '';
    return;
  }

  els.activeFilters.hidden = false;
  els.activeFilters.innerHTML =
    parts.join('') + '<button class="clear-filter-btn" type="button" id="clear-all-filters">Limpar tudo</button>';
}

function handleFilterChange(event) {
  if (event.target.matches('[data-filter-priority]')) {
    const value = event.target.value;
    if (event.target.checked) ui.filters.priorities.add(value);
    else ui.filters.priorities.delete(value);
    renderAll();
  }

  if (event.target.matches('[data-filter-assignee]')) {
    const value = event.target.value;
    if (event.target.checked) ui.filters.assignees.add(value);
    else ui.filters.assignees.delete(value);
    renderAll();
  }
}

function handleActiveFilterClick(event) {
  const remove = event.target.closest('[data-filter-remove]');
  if (remove) {
    const value = remove.dataset.value;
    if (remove.dataset.filterRemove === 'priority') ui.filters.priorities.delete(value);
    if (remove.dataset.filterRemove === 'assignee') ui.filters.assignees.delete(value);
    renderAll();
    return;
  }

  if (event.target.closest('#clear-all-filters')) clearFilters();
}

function clearFilters() {
  ui.filters.priorities.clear();
  ui.filters.assignees.clear();
  renderAll();
}

function handleSortSelection(event) {
  const button = event.target.closest('[data-sort]');
  if (!button) return;
  ui.sort = button.dataset.sort;
  closePopovers();
  renderAll();
}

function handleSearch() {
  ui.query = els.searchInput.value;
  renderAll();
}

function clearSearch() {
  els.searchInput.value = '';
  ui.query = '';
  renderAll();
  els.searchInput.focus();
}

function togglePopover(popover, trigger) {
  const willOpen = popover.hidden;
  closePopovers();
  if (willOpen) {
    popover.hidden = false;
    trigger.setAttribute('aria-expanded', 'true');
  }
}

function closePopovers() {
  [els.filterPopover, els.sortPopover, els.boardMenu].forEach((popover) => {
    popover.hidden = true;
  });
  document.querySelectorAll('[data-popover-trigger]').forEach((button) => {
    button.setAttribute('aria-expanded', 'false');
  });
}

function handleBoardClick(event) {
  const calendarPrev = event.target.closest('[data-calendar-prev]');
  if (calendarPrev) {
    ui.calendar.month -= 1;
    if (ui.calendar.month < 0) {
      ui.calendar.month = 11;
      ui.calendar.year -= 1;
    }
    renderBoardView();
    return;
  }

  const calendarNext = event.target.closest('[data-calendar-next]');
  if (calendarNext) {
    ui.calendar.month += 1;
    if (ui.calendar.month > 11) {
      ui.calendar.month = 0;
      ui.calendar.year += 1;
    }
    renderBoardView();
    return;
  }

  if (event.target.closest('[data-calendar-today]')) {
    const now = new Date();
    ui.calendar.year = now.getFullYear();
    ui.calendar.month = now.getMonth();
    renderBoardView();
    return;
  }

  const addOnDate = event.target.closest('[data-add-task-date]');
  if (addOnDate) {
    openTaskDialog(null, addOnDate.dataset.columnId || 'todo', addOnDate.dataset.addTaskDate);
    return;
  }

  const toggle = event.target.closest('[data-toggle-task]');
  if (toggle) {
    event.stopPropagation();
    toggleTaskDone(toggle.dataset.toggleTask);
    return;
  }

  const menuButton = event.target.closest('[data-task-menu]');
  if (menuButton) {
    const card = menuButton.closest('[data-task-id]');
    if (card) openTaskMenu(card.dataset.taskId, menuButton);
    return;
  }

  const addButton = event.target.closest('[data-add-task]');
  if (addButton) {
    closeTaskMenu();
    openTaskDialog(null, addButton.dataset.columnId || 'todo');
    return;
  }

  const openButton = event.target.closest('[data-open-task]');
  if (openButton) {
    openTaskDialog(openButton.dataset.openTask);
    return;
  }

  const card = event.target.closest('.task-card');
  if (card && Date.now() > suppressCardClickUntil) {
    openTaskDialog(card.dataset.taskId);
  }
}

function handleBoardKeydown(event) {
  if (event.key !== 'Enter' && event.key !== ' ') return;
  const target = event.target.closest('[data-open-task], .task-card');
  if (!target) return;
  event.preventDefault();
  openTaskDialog(target.dataset.openTask || target.dataset.taskId);
}

function handleDragStart(event) {
  const card = event.target.closest('.task-card');
  if (!card || ui.sort !== 'manual' || event.target.closest('button')) {
    event.preventDefault();
    return;
  }

  draggedTaskId = card.dataset.taskId;
  lastDropKey = '';
  closePopovers();
  closeTaskMenu();
  event.dataTransfer.effectAllowed = 'move';
  event.dataTransfer.setData('text/plain', draggedTaskId);
  requestAnimationFrame(() => card.classList.add('is-dragging'));
}

function handleDragOver(event) {
  if (!draggedTaskId) return;
  const list = getDropList(event.target);
  if (!list) return;

  event.preventDefault();
  event.dataTransfer.dropEffect = 'move';

  const hoveredCard = event.target.closest('.task-card');
  const targetCard = hoveredCard && hoveredCard.dataset.taskId !== draggedTaskId ? hoveredCard : null;
  let position = 'after';

  if (targetCard) {
    const rect = targetCard.getBoundingClientRect();
    position = event.clientY < rect.top + rect.height / 2 ? 'before' : 'after';
  }

  const key = `${list.dataset.columnId}:${targetCard ? targetCard.dataset.taskId : 'end'}:${position}`;
  if (key === lastDropKey) return;
  lastDropKey = key;
  clearDropIndicators();

  if (targetCard) {
    targetCard.classList.add(position === 'before' ? 'drop-before' : 'drop-after');
  } else {
    list.classList.add('is-drag-over');
  }
}

function handleDrop(event) {
  if (!draggedTaskId) return;
  const list = getDropList(event.target);
  if (!list) return;

  event.preventDefault();
  const hoveredCard = event.target.closest('.task-card');
  const taskId = draggedTaskId;

  if (hoveredCard && hoveredCard.dataset.taskId === taskId) {
    finishDrag();
    return;
  }

  let targetTaskId = null;
  let position = 'after';

  if (hoveredCard) {
    const rect = hoveredCard.getBoundingClientRect();
    position = event.clientY < rect.top + rect.height / 2 ? 'before' : 'after';
    targetTaskId = hoveredCard.dataset.taskId;
  }

  finishDrag();
  moveTaskByDrop(taskId, list.dataset.columnId, targetTaskId, position);
}

function handleBoardDragLeave(event) {
  if (!els.board.contains(event.relatedTarget)) {
    clearDropIndicators();
    lastDropKey = '';
  }
}

function getDropList(target) {
  const list = target.closest('.task-list');
  if (list) return list;
  const column = target.closest('.column');
  return column ? column.querySelector('.task-list') : null;
}

function clearDropIndicators() {
  els.board.querySelectorAll('.task-list.is-drag-over').forEach((list) => list.classList.remove('is-drag-over'));
  els.board.querySelectorAll('.drop-before, .drop-after').forEach((card) => {
    card.classList.remove('drop-before', 'drop-after');
  });
}

function finishDrag() {
  clearDropIndicators();
  els.board.querySelectorAll('.task-card.is-dragging').forEach((card) => card.classList.remove('is-dragging'));
  draggedTaskId = null;
  lastDropKey = '';
  suppressCardClickUntil = Date.now() + 250;
}

function moveTaskByDrop(taskId, statusId, targetTaskId, position) {
  const task = getTask(taskId);
  if (!task) return;

  const oldStatus = task.statusId;
  const oldIndex = state.tasks.findIndex((item) => item.id === taskId);
  if (oldIndex === -1) return;

  state.tasks.splice(oldIndex, 1);
  task.statusId = statusId;

  let insertIndex = -1;
  if (targetTaskId) {
    const targetIndex = state.tasks.findIndex((item) => item.id === targetTaskId);
    if (targetIndex !== -1) insertIndex = position === 'before' ? targetIndex : targetIndex + 1;
  }

  if (insertIndex === -1) {
    let lastIndex = -1;
    state.tasks.forEach((item, index) => {
      if (item.statusId === statusId) lastIndex = index;
    });
    insertIndex = lastIndex === -1 ? state.tasks.length : lastIndex + 1;
  }

  state.tasks.splice(insertIndex, 0, task);
  saveState();
  renderAll();

  if (oldStatus !== statusId) {
    const column = getColumn(statusId);
    announce(`Tarefa movida para ${column ? column.label : statusId}.`);
  }
}

function openTaskMenu(taskId, trigger) {
  const task = getTask(taskId);
  if (!task) return;

  closeTaskMenu();
  closePopovers();
  contextTaskId = taskId;
  taskMenuTrigger = trigger;
  const isDone = task.statusId === 'done';

  els.taskMenu.innerHTML = `
    <button class="menu-item" type="button" role="menuitem" data-menu-action="edit">
      ${icon('pencil')}
      <span>Editar tarefa</span>
    </button>
    <button class="menu-item" type="button" role="menuitem" data-menu-action="duplicate">
      ${icon('copy')}
      <span>Duplicar tarefa</span>
    </button>
    <button class="menu-item" type="button" role="menuitem" data-menu-action="toggle">
      ${icon(isDone ? 'rotate' : 'check-circle')}
      <span>${isDone ? 'Reabrir tarefa' : 'Concluir tarefa'}</span>
    </button>
    <div class="menu-separator"></div>
    <button class="menu-item menu-item-danger" type="button" role="menuitem" data-menu-action="delete">
      ${icon('trash')}
      <span>Excluir tarefa</span>
    </button>`;

  els.taskMenu.hidden = false;
  els.taskMenu.style.visibility = 'hidden';
  els.taskMenu.style.left = '0px';
  els.taskMenu.style.top = '0px';

  const triggerRect = trigger.getBoundingClientRect();
  const menuRect = els.taskMenu.getBoundingClientRect();
  let left = triggerRect.right - menuRect.width;
  let top = triggerRect.bottom + 4;

  left = Math.max(8, Math.min(left, window.innerWidth - menuRect.width - 8));
  if (top + menuRect.height > window.innerHeight - 8) {
    top = Math.max(8, triggerRect.top - menuRect.height - 4);
  }

  els.taskMenu.style.left = `${left}px`;
  els.taskMenu.style.top = `${top}px`;
  els.taskMenu.style.visibility = '';
  trigger.setAttribute('aria-expanded', 'true');
}

function closeTaskMenu() {
  if (els.taskMenu.hidden && !taskMenuTrigger) return;
  els.taskMenu.hidden = true;
  if (taskMenuTrigger) taskMenuTrigger.setAttribute('aria-expanded', 'false');
  taskMenuTrigger = null;
  contextTaskId = null;
}

function handleTaskMenuClick(event) {
  const button = event.target.closest('[data-menu-action]');
  if (!button) return;

  const action = button.dataset.menuAction;
  const taskId = contextTaskId;
  closeTaskMenu();
  if (!taskId) return;

  if (action === 'edit') openTaskDialog(taskId);
  if (action === 'duplicate') duplicateTask(taskId);
  if (action === 'toggle') toggleTaskDone(taskId);
  if (action === 'delete') deleteTask(taskId);
}

function openAppDialog(config) {
  const {
    eyebrow = '',
    title = '',
    subtitle = '',
    body = '',
    submitLabel = 'Salvar',
    cancelLabel = 'Cancelar',
    showSubmit = true,
    danger = false,
    onSubmit = null
  } = config || {};

  activeDialogSubmit = typeof onSubmit === 'function' ? onSubmit : null;
  els.appDialogForm.reset();
  els.appDialogEyebrow.textContent = eyebrow;
  els.appDialogEyebrow.hidden = !eyebrow;
  els.appDialogTitle.textContent = title;
  els.appDialogSubtitle.textContent = subtitle;
  els.appDialogSubtitle.hidden = !subtitle;
  els.appDialogBody.innerHTML = body;
  els.appDialogSubmit.hidden = !showSubmit;
  els.appDialogSubmit.disabled = false;
  els.appDialogSubmit.textContent = submitLabel;
  els.appDialogSubmit.classList.toggle('btn-danger', danger);
  els.appDialogCancel.textContent = cancelLabel;
  els.appDialog.classList.toggle('is-danger', danger);

  if (els.appDialog.open) els.appDialog.close();
  els.appDialog.showModal();

  requestAnimationFrame(() => {
    const target = els.appDialogBody.querySelector('input:not([type="hidden"]), textarea, select');
    if (target) target.focus();
    else if (showSubmit) els.appDialogSubmit.focus();
    else els.appDialogCancel.focus();
  });
}

function closeAppDialog() {
  if (els.appDialog.open) els.appDialog.close();
}

async function handleAppDialogSubmit(event) {
  event.preventDefault();
  if (!els.appDialogForm.reportValidity()) return;
  if (!activeDialogSubmit) {
    closeAppDialog();
    return;
  }

  const submit = activeDialogSubmit;
  els.appDialogSubmit.disabled = true;
  els.appDialogForm.classList.add('is-busy');
  try {
    const result = await submit(new FormData(els.appDialogForm), els.appDialogForm);
    if (result !== false) closeAppDialog();
  } catch (error) {
    console.error('Não foi possível concluir a ação do diálogo.', error);
    showToast('Não foi possível concluir a ação. Tente novamente.', { type: 'danger' });
  } finally {
    els.appDialogSubmit.disabled = false;
    els.appDialogForm.classList.remove('is-busy');
  }
}

function handleAppDialogBodyClick(event) {
  const button = event.target.closest('[data-dialog-action]');
  if (!button) return;
  const action = button.dataset.dialogAction;

  if (action === 'reset-data') {
    closeAppDialog();
    openConfirmDialog({
      title: 'Restaurar dados de exemplo?',
      message: 'Todas as tarefas, documentos, metas e convites atuais serão substituídos pelos dados de exemplo. Esta ação não pode ser desfeita.',
      confirmLabel: 'Restaurar dados',
      onConfirm: () => {
        const theme = state.theme;
        state = createInitialState();
        state.theme = theme;
        applyTheme(theme, false);
        saveState();
        populateHeaderAvatars();
        populateFilterOptions();
        populateAssigneeOptions();
        renderAll();
        showToast('Dados de exemplo restaurados.');
      }
    });
    return;
  }

  if (action === 'delete-view') {
    const viewId = button.dataset.viewId;
    const view = state.customViews.find((item) => item.id === viewId);
    closeAppDialog();
    if (!view) return;
    openConfirmDialog({
      title: 'Excluir visualização?',
      message: `A visualização "${view.name}" será removida deste quadro. As tarefas não serão afetadas.`,
      confirmLabel: 'Excluir visualização',
      onConfirm: () => deleteCustomView(viewId)
    });
    return;
  }

  if (action === 'create-view') {
    closeAppDialog();
    openAddViewDialog();
    return;
  }

  if (action === 'delete-doc') {
    const docId = button.dataset.docId;
    closeAppDialog();
    deleteDocument(docId);
    return;
  }

  if (action === 'delete-goal') {
    const goalId = button.dataset.goalId;
    closeAppDialog();
    deleteGoal(goalId);
    return;
  }

  if (action === 'delete-member') {
    const memberId = button.dataset.memberId;
    closeAppDialog();
    deleteMember(memberId);
  }
}

function openConfirmDialog({ title, message, confirmLabel = 'Confirmar', danger = true, onConfirm }) {
  openAppDialog({
    eyebrow: 'Confirmação',
    title,
    body: `<p class="dialog-copy">${escapeHtml(message)}</p>`,
    submitLabel: confirmLabel,
    cancelLabel: 'Cancelar',
    danger,
    onSubmit: () => onConfirm()
  });
}

function openSettingsDialog() {
  const settings = state.settings;
  openAppDialog({
    eyebrow: 'Preferências',
    title: 'Configurações',
    subtitle: 'Ajuste seu perfil, o workspace e a aparência do quadro.',
    submitLabel: 'Salvar alterações',
    body: `
      <div class="form-grid">
        <label class="form-field">
          <span>Nome de exibição</span>
          <input name="displayName" type="text" maxlength="60" value="${escapeAttr(settings.displayName)}" required autocomplete="off">
        </label>
        <label class="form-field">
          <span>Nome do workspace</span>
          <input name="workspaceName" type="text" maxlength="60" value="${escapeAttr(settings.workspaceName)}" required autocomplete="off">
        </label>
        <label class="form-field">
          <span>Tema</span>
          <select name="theme">
            <option value="light"${state.theme === 'light' ? ' selected' : ''}>Claro</option>
            <option value="dark"${state.theme === 'dark' ? ' selected' : ''}>Escuro</option>
          </select>
        </label>
      </div>
      <div class="form-checks">
        <label class="form-check">
          <input name="compactCards" type="checkbox"${settings.compactCards ? ' checked' : ''}>
          <span><strong>Cartões compactos</strong><small>Reduz o espaçamento das tarefas no quadro.</small></span>
        </label>
        <label class="form-check">
          <input name="showTags" type="checkbox"${settings.showTags !== false ? ' checked' : ''}>
          <span><strong>Mostrar etiquetas</strong><small>Exibe as etiquetas nos cartões e listas.</small></span>
        </label>
        <label class="form-check">
          <input name="showDueDates" type="checkbox"${settings.showDueDates !== false ? ' checked' : ''}>
          <span><strong>Mostrar vencimentos</strong><small>Exibe as datas de vencimento nas tarefas.</small></span>
        </label>
      </div>
      <div class="dialog-section">
        <div>
          <h3>Dados locais</h3>
          <p>O quadro usa o banco SQLite deste workspace. Você pode restaurar o conteúdo de exemplo a qualquer momento.</p>
        </div>
        <button class="btn btn-outline btn-sm" type="button" data-dialog-action="reset-data">Restaurar exemplo</button>
      </div>`,
    onSubmit: (data) => {
      state.settings.displayName = String(data.get('displayName') || '').trim() || 'Meu perfil';
      state.settings.workspaceName = String(data.get('workspaceName') || '').trim() || 'Meu Workspace';
      state.settings.compactCards = data.has('compactCards');
      state.settings.showTags = data.has('showTags');
      state.settings.showDueDates = data.has('showDueDates');
      applyTheme(String(data.get('theme') || state.theme), false);
      saveState();
      renderAll();
      announce('Configurações atualizadas.');
      showToast('Configurações salvas.');
    }
  });
}

function openWorkspaceDialog() {
  openAppDialog({
    eyebrow: 'Workspace',
    title: 'Editar workspace',
    subtitle: 'O nome aparece na navegação e nos títulos das páginas.',
    submitLabel: 'Salvar workspace',
    body: `
      <label class="form-field">
        <span>Nome do workspace</span>
        <input name="workspaceName" type="text" maxlength="60" value="${escapeAttr(state.settings.workspaceName)}" required autocomplete="off">
      </label>`,
    onSubmit: (data) => {
      state.settings.workspaceName = String(data.get('workspaceName') || '').trim() || 'Meu Workspace';
      saveState();
      renderAll();
      showToast('Workspace atualizado.');
    }
  });
}

function openHelpDialog() {
  openAppDialog({
    eyebrow: 'Ajuda',
    title: 'Atalhos e dicas',
    showSubmit: false,
    cancelLabel: 'Fechar',
    body: `
      <div class="shortcut-list">
        <div class="shortcut-row"><span>Nova tarefa</span><kbd>N</kbd></div>
        <div class="shortcut-row"><span>Pesquisar tarefas</span><kbd>/</kbd></div>
        <div class="shortcut-row"><span>Fechar diálogos e menus</span><kbd>Esc</kbd></div>
        <div class="shortcut-row"><span>Mover tarefa</span><span class="shortcut-hint">Arraste o cartão entre as colunas</span></div>
      </div>
      <div class="dialog-section dialog-section-stack">
        <h3>Módulos do workspace</h3>
        <p><strong>Início</strong> resume prazos e progresso. <strong>Caixa de entrada</strong> reúne notificações. <strong>Tudo</strong> lista as tarefas por status. <strong>Painéis</strong>, <strong>Documentos</strong>, <strong>Metas</strong> e <strong>Equipes</strong> concentram a gestão do projeto.</p>
        <p>O <strong>Assistente IA</strong> responde localmente com base nas tarefas salvas no banco SQLite.</p>
      </div>`
  });
}

function openSpaceDialog() {
  openAppDialog({
    eyebrow: 'Organização',
    title: 'Novo espaço',
    subtitle: 'Espaços agrupam listas e projetos do workspace.',
    submitLabel: 'Criar espaço',
    body: `
      <label class="form-field">
        <span>Nome do espaço</span>
        <input name="name" type="text" maxlength="50" placeholder="Ex.: Produto" required autocomplete="off">
      </label>
      <label class="form-field">
        <span>Cor</span>
        <select name="color">
          ${MEMBER_COLORS.map((color) => `<option value="${color}"${color === '#7b68ee' ? ' selected' : ''}>${color}</option>`).join('')}
        </select>
      </label>`,
    onSubmit: (data) => {
      const name = String(data.get('name') || '').trim();
      if (!name) return false;
      state.spaces.push({
        id: generateId(),
        name,
        color: String(data.get('color') || '#7b68ee'),
        createdAt: Date.now()
      });
      saveState();
      renderCustomSpaces();
      showToast(`Espaço "${name}" criado.`);
    }
  });
}

function openInviteDialog() {
  openAppDialog({
    eyebrow: 'Colaboração',
    title: 'Convidar para o workspace',
    subtitle: 'O convite fica pendente até a pessoa entrar no workspace.',
    submitLabel: 'Enviar convite',
    body: `
      <label class="form-field">
        <span>E-mail</span>
        <input name="email" type="email" maxlength="120" placeholder="pessoa@empresa.com" required autocomplete="off">
      </label>
      <label class="form-field">
        <span>Permissão</span>
        <select name="role">
          ${Object.entries(MEMBER_ROLES).map(([value, label]) => `<option value="${value}"${value === 'editor' ? ' selected' : ''}>${label}</option>`).join('')}
        </select>
      </label>`,
    onSubmit: (data) => {
      const email = String(data.get('email') || '').trim().toLowerCase();
      if (!email) return false;
      if (state.invites.some((invite) => invite.email.toLowerCase() === email && invite.status === 'pending')) {
        showToast('Já existe um convite pendente para este e-mail.', { type: 'danger' });
        return false;
      }
      state.invites.push({
        id: generateId(),
        email,
        role: MEMBER_ROLES[data.get('role')] ? String(data.get('role')) : 'editor',
        status: 'pending',
        createdAt: Date.now()
      });
      saveState();
      renderAll();
      showToast(`Convite enviado para ${email}.`);
    }
  });
}

function openAddViewDialog() {
  openAppDialog({
    eyebrow: 'Visualizações',
    title: 'Nova visualização',
    subtitle: 'Crie uma visão salva do quadro com o tipo que preferir.',
    submitLabel: 'Criar visualização',
    body: `
      <label class="form-field">
        <span>Nome</span>
        <input name="name" type="text" maxlength="40" placeholder="Ex.: Revisão semanal" required autocomplete="off">
      </label>
      <label class="form-field">
        <span>Tipo</span>
        <select name="type">
          ${Object.entries(VIEW_META).map(([value, meta]) => `<option value="${value}">${meta.label}</option>`).join('')}
        </select>
      </label>`,
    onSubmit: (data) => {
      const name = String(data.get('name') || '').trim();
      const type = VIEW_META[data.get('type')] ? String(data.get('type')) : 'board';
      if (!name) return false;
      const view = { id: generateId(), name, type, createdAt: Date.now() };
      state.customViews.push(view);
      ui.module = 'board';
      ui.view = view.id;
      saveState();
      renderAll();
      announce(`Visualização ${name} criada.`);
      showToast(`Visualização "${name}" criada.`);
    }
  });
}

function openViewSettingsDialog() {
  const view = getActiveView();
  const custom = state.customViews.find((item) => item.id === view.id);

  if (!custom) {
    openAppDialog({
      eyebrow: 'Visualização',
      title: `${view.label} · ${state.tasks.length} tarefas`,
      subtitle: 'Visualizações padrão não podem ser renomeadas, mas você pode criar uma visão personalizada.',
      showSubmit: false,
      cancelLabel: 'Fechar',
      body: `
        <div class="dialog-section dialog-section-stack">
          <p>Esta visualização mostra as tarefas do quadro no formato <strong>${escapeHtml(view.label)}</strong>. Filtros, busca e ordenação continuam disponíveis na barra superior.</p>
          <button class="btn btn-primary btn-sm" type="button" data-dialog-action="create-view">Criar visualização personalizada</button>
        </div>`
    });
    return;
  }

  openAppDialog({
    eyebrow: 'Visualização personalizada',
    title: 'Configurar visualização',
    submitLabel: 'Salvar visualização',
    body: `
      <label class="form-field">
        <span>Nome</span>
        <input name="name" type="text" maxlength="40" value="${escapeAttr(custom.name)}" required autocomplete="off">
      </label>
      <label class="form-field">
        <span>Tipo</span>
        <select name="type">
          ${Object.entries(VIEW_META).map(([value, meta]) => `<option value="${value}"${custom.type === value ? ' selected' : ''}>${meta.label}</option>`).join('')}
        </select>
      </label>
      <div class="dialog-section">
        <div>
          <h3>Excluir visualização</h3>
          <p>A visualização será removida deste quadro. As tarefas não serão afetadas.</p>
        </div>
        <button class="btn btn-danger-text btn-sm" type="button" data-dialog-action="delete-view" data-view-id="${escapeAttr(custom.id)}">Excluir</button>
      </div>`,
    onSubmit: (data) => {
      const name = String(data.get('name') || '').trim();
      if (!name) return false;
      custom.name = name;
      custom.type = VIEW_META[data.get('type')] ? String(data.get('type')) : custom.type;
      saveState();
      renderAll();
      showToast('Visualização atualizada.');
    }
  });
}

function deleteCustomView(viewId) {
  const index = state.customViews.findIndex((view) => view.id === viewId);
  if (index === -1) return;
  const [removed] = state.customViews.splice(index, 1);
  if (ui.view === viewId) ui.view = 'board';
  saveState();
  renderAll();
  showToast('Visualização excluída.', {
    actionLabel: 'Desfazer',
    onAction: () => {
      state.customViews.splice(index, 0, removed);
      saveState();
      renderAll();
    }
  });
}

function openDocumentDialog(docId = null) {
  const doc = docId ? state.documents.find((item) => item.id === docId) : null;
  openAppDialog({
    eyebrow: 'Documentos',
    title: doc ? 'Editar documento' : 'Novo documento',
    subtitle: doc ? `Atualizado ${formatRelativeTime(doc.updatedAt)}` : 'Registre contexto, decisões e referências do projeto.',
    submitLabel: doc ? 'Salvar documento' : 'Criar documento',
    body: `
      <label class="form-field">
        <span>Título</span>
        <input name="title" type="text" maxlength="100" value="${escapeAttr(doc ? doc.title : '')}" required autocomplete="off">
      </label>
      <label class="form-field">
        <span>Conteúdo</span>
        <textarea name="content" rows="9" maxlength="5000" placeholder="Escreva o conteúdo do documento...">${escapeHtml(doc ? doc.content : '')}</textarea>
      </label>
      ${
        doc
          ? `<div class="dialog-section">
              <div><h3>Excluir documento</h3><p>O documento será removido do workspace.</p></div>
              <button class="btn btn-danger-text btn-sm" type="button" data-dialog-action="delete-doc" data-doc-id="${escapeAttr(doc.id)}">Excluir</button>
            </div>`
          : ''
      }`,
    onSubmit: (data) => {
      const title = String(data.get('title') || '').trim();
      const content = String(data.get('content') || '').trim();
      if (!title) return false;
      if (doc) {
        doc.title = title;
        doc.content = content;
        doc.updatedAt = Date.now();
      } else {
        state.documents.push({
          id: generateId(),
          title,
          content,
          createdAt: Date.now(),
          updatedAt: Date.now()
        });
      }
      saveState();
      renderAll();
      showToast(doc ? 'Documento atualizado.' : 'Documento criado.');
    }
  });
}

function deleteDocument(docId) {
  const index = state.documents.findIndex((doc) => doc.id === docId);
  if (index === -1) return;
  const doc = state.documents[index];
  openConfirmDialog({
    title: 'Excluir documento?',
    message: `O documento "${doc.title}" será removido do workspace.`,
    confirmLabel: 'Excluir documento',
    onConfirm: () => {
      state.documents.splice(index, 1);
      saveState();
      renderAll();
      showToast('Documento excluído.', {
        actionLabel: 'Desfazer',
        onAction: () => {
          state.documents.splice(index, 0, doc);
          saveState();
          renderAll();
        }
      });
    }
  });
}

function openGoalDialog(goalId = null) {
  const goal = goalId ? state.goals.find((item) => item.id === goalId) : null;
  openAppDialog({
    eyebrow: 'Metas',
    title: goal ? 'Editar meta' : 'Nova meta',
    subtitle: 'Defina um resultado mensurável e acompanhe o progresso.',
    submitLabel: goal ? 'Salvar meta' : 'Criar meta',
    body: `
      <label class="form-field">
        <span>Título</span>
        <input name="title" type="text" maxlength="100" value="${escapeAttr(goal ? goal.title : '')}" required autocomplete="off">
      </label>
      <label class="form-field">
        <span>Descrição</span>
        <textarea name="description" rows="3" maxlength="500" placeholder="Como o sucesso será medido?">${escapeHtml(goal ? goal.description || '' : '')}</textarea>
      </label>
      <div class="form-grid">
        <label class="form-field">
          <span>Prazo</span>
          <input name="dueDate" type="date" value="${escapeAttr(goal ? goal.dueDate || '' : '')}">
        </label>
        <label class="form-field">
          <span>Progresso (%)</span>
          <input name="progress" type="number" min="0" max="100" step="5" value="${goal ? goal.progress : 0}">
        </label>
      </div>
      ${
        goal
          ? `<div class="dialog-section">
              <div><h3>Excluir meta</h3><p>A meta será removida do acompanhamento.</p></div>
              <button class="btn btn-danger-text btn-sm" type="button" data-dialog-action="delete-goal" data-goal-id="${escapeAttr(goal.id)}">Excluir</button>
            </div>`
          : ''
      }`,
    onSubmit: (data) => {
      const title = String(data.get('title') || '').trim();
      if (!title) return false;
      const progress = Math.max(0, Math.min(100, Number(data.get('progress')) || 0));
      const dueDate = parseDateKey(String(data.get('dueDate') || '')) ? String(data.get('dueDate')) : '';
      const description = String(data.get('description') || '').trim();
      if (goal) {
        goal.title = title;
        goal.description = description;
        goal.dueDate = dueDate;
        goal.progress = progress;
        goal.updatedAt = Date.now();
      } else {
        state.goals.push({
          id: generateId(),
          title,
          description,
          dueDate,
          progress,
          createdAt: Date.now(),
          updatedAt: Date.now()
        });
      }
      saveState();
      renderAll();
      showToast(goal ? 'Meta atualizada.' : 'Meta criada.');
    }
  });
}

function deleteGoal(goalId) {
  const index = state.goals.findIndex((goal) => goal.id === goalId);
  if (index === -1) return;
  const goal = state.goals[index];
  openConfirmDialog({
    title: 'Excluir meta?',
    message: `A meta "${goal.title}" será removida do acompanhamento.`,
    confirmLabel: 'Excluir meta',
    onConfirm: () => {
      state.goals.splice(index, 1);
      saveState();
      renderAll();
      showToast('Meta excluída.', {
        actionLabel: 'Desfazer',
        onAction: () => {
          state.goals.splice(index, 0, goal);
          saveState();
          renderAll();
        }
      });
    }
  });
}

function openMemberDialog(memberId) {
  const member = getMember(memberId);
  if (!member) return;
  const tasks = state.tasks.filter((task) => task.assigneeId === member.id);
  const open = tasks.filter((task) => task.statusId !== 'done');

  openAppDialog({
    eyebrow: 'Equipe',
    title: 'Editar membro',
    subtitle: `${tasks.length} ${tasks.length === 1 ? 'tarefa atribuída' : 'tarefas atribuídas'} · ${open.length} em aberto`,
    submitLabel: 'Salvar membro',
    body: `
      <label class="form-field">
        <span>Nome</span>
        <input name="name" type="text" maxlength="60" value="${escapeAttr(member.name)}" required autocomplete="off">
      </label>
      <div class="form-grid">
        <label class="form-field">
          <span>Permissão</span>
          <select name="role">
            ${Object.entries(MEMBER_ROLES).map(([value, label]) => `<option value="${value}"${(member.role || 'editor') === value ? ' selected' : ''}>${label}</option>`).join('')}
          </select>
        </label>
        <label class="form-field">
          <span>Cor do avatar</span>
          <select name="color">
            ${MEMBER_COLORS.map((color) => `<option value="${color}"${member.color === color ? ' selected' : ''}>${color}</option>`).join('')}
          </select>
        </label>
      </div>
      <div class="dialog-section">
        <div><h3>Remover do workspace</h3><p>As tarefas atribuídas ficarão sem responsável.</p></div>
        <button class="btn btn-danger-text btn-sm" type="button" data-dialog-action="delete-member" data-member-id="${escapeAttr(member.id)}" ${state.members.length <= 1 ? 'disabled' : ''}>Remover</button>
      </div>`,
    onSubmit: (data) => {
      const name = String(data.get('name') || '').trim();
      if (!name) return false;
      member.name = name;
      member.initials = name
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part.charAt(0).toUpperCase())
        .join('');
      member.role = MEMBER_ROLES[data.get('role')] ? String(data.get('role')) : 'editor';
      member.color = MEMBER_COLORS.includes(String(data.get('color'))) ? String(data.get('color')) : member.color;
      saveState();
      refreshPeopleUi();
      renderAll();
      showToast('Membro atualizado.');
    }
  });
}

function deleteMember(memberId) {
  const index = state.members.findIndex((member) => member.id === memberId);
  if (index === -1) return;
  if (state.members.length <= 1) {
    showToast('O workspace precisa ter pelo menos um membro.', { type: 'danger' });
    return;
  }
  const member = state.members[index];
  const assignedTaskIds = state.tasks.filter((task) => task.assigneeId === memberId).map((task) => task.id);
  openConfirmDialog({
    title: 'Remover membro?',
    message: `${member.name} será removido do workspace e as tarefas atribuídas ficarão sem responsável.`,
    confirmLabel: 'Remover membro',
    onConfirm: () => {
      state.members.splice(index, 1);
      state.tasks.forEach((task) => {
        if (task.assigneeId === memberId) task.assigneeId = '';
      });
      saveState();
      refreshPeopleUi();
      renderAll();
      showToast('Membro removido.', {
        actionLabel: 'Desfazer',
        onAction: () => {
          state.members.splice(index, 0, member);
          assignedTaskIds.forEach((taskId) => {
            const task = getTask(taskId);
            if (task) task.assigneeId = memberId;
          });
          saveState();
          refreshPeopleUi();
          renderAll();
        }
      });
    }
  });
}

function refreshPeopleUi() {
  populateHeaderAvatars();
  populateFilterOptions();
  populateAssigneeOptions();
  updateProfileLabels();
}

function openTaskDialog(taskId = null, presetColumnId = 'todo', presetDueDate = '') {
  closePopovers();
  closeTaskMenu();

  const task = taskId ? getTask(taskId) : null;
  const validPreset = COLUMNS.some((column) => column.id === presetColumnId) ? presetColumnId : 'todo';
  const statusId = task ? task.statusId : validPreset;

  els.taskForm.reset();
  els.taskTitle.setCustomValidity('');
  els.taskId.value = task ? task.id : '';
  els.taskDialogTitle.textContent = task ? 'Editar tarefa' : 'Nova tarefa';
  els.taskTitle.value = task ? task.title : '';
  els.taskDescription.value = task ? task.description : '';
  els.taskStatus.value = statusId;
  els.taskAssignee.value = task ? task.assigneeId : '';
  els.taskPriority.value = task ? task.priority : 'normal';
  els.taskDue.value = task ? task.dueDate : parseDateKey(presetDueDate) ? presetDueDate : '';
  els.taskTags.value = task ? task.tags.join(', ') : '';
  els.taskCode.textContent = task ? taskCode(task) : 'Nova tarefa';
  els.taskDelete.hidden = !task;
  els.taskSave.textContent = task ? 'Salvar' : 'Criar tarefa';
  updateTaskIndicators();

  if (els.taskDialog.open) els.taskDialog.close();
  els.taskDialog.showModal();

  const main = els.taskDialog.querySelector('.task-modal-main');
  if (main) main.scrollTop = 0;

  requestAnimationFrame(() => {
    els.taskTitle.focus();
    if (task) {
      const end = els.taskTitle.value.length;
      els.taskTitle.setSelectionRange(end, end);
    }
  });
}

function closeTaskDialog() {
  if (els.taskDialog.open) els.taskDialog.close();
}

function updateTaskIndicators() {
  const status = getColumn(els.taskStatus.value);
  const priority = PRIORITIES[els.taskPriority.value];
  els.taskStatusDot.style.background = status ? status.color : '';
  els.taskPriorityDot.style.background = priority ? priority.color : '';
}

function handleTaskSubmit(event) {
  event.preventDefault();

  const title = els.taskTitle.value.trim();
  if (!title) {
    els.taskTitle.setCustomValidity('Informe um título para a tarefa.');
    els.taskTitle.reportValidity();
    els.taskTitle.focus();
    return;
  }
  els.taskTitle.setCustomValidity('');

  const statusId = getColumn(els.taskStatus.value) ? els.taskStatus.value : 'todo';
  const priority = PRIORITIES[els.taskPriority.value] ? els.taskPriority.value : 'normal';
  const assigneeId = getMember(els.taskAssignee.value) ? els.taskAssignee.value : '';
  const dueDate = parseDateKey(els.taskDue.value) ? els.taskDue.value : '';
  const tags = parseTags(els.taskTags.value);
  const description = els.taskDescription.value.trim();
  const taskId = els.taskId.value;

  if (taskId) {
    const task = getTask(taskId);
    if (!task) return;
    const oldStatus = task.statusId;

    task.title = title;
    task.description = description;
    task.statusId = statusId;
    task.priority = priority;
    task.assigneeId = assigneeId;
    task.dueDate = dueDate;
    task.tags = tags;

    if (oldStatus !== statusId) {
      const index = state.tasks.findIndex((item) => item.id === task.id);
      if (index !== -1) state.tasks.splice(index, 1);
      insertTaskAtTopOfStatus(task, statusId);
    }

    saveState();
    closeTaskDialog();
    renderAll();
    announce('Tarefa atualizada.');
    showToast('Tarefa atualizada.');
    return;
  }

  const task = {
    id: generateId(),
    number: getNextTaskNumber(),
    title,
    description,
    statusId,
    priority,
    dueDate,
    tags,
    assigneeId,
    createdAt: Date.now()
  };

  insertTaskAtTopOfStatus(task, statusId);
  saveState();
  closeTaskDialog();
  renderAll();
  announce('Tarefa criada.');
  showToast('Tarefa criada.');
}

function insertTaskAtTopOfStatus(task, statusId) {
  const firstIndex = state.tasks.findIndex((item) => item.statusId === statusId);
  if (firstIndex === -1) state.tasks.unshift(task);
  else state.tasks.splice(firstIndex, 0, task);
}

function deleteTask(taskId) {
  const index = state.tasks.findIndex((task) => task.id === taskId);
  if (index === -1) return;

  const [task] = state.tasks.splice(index, 1);
  saveState();
  renderAll();
  announce('Tarefa excluída.');

  showToast('Tarefa excluída.', {
    actionLabel: 'Desfazer',
    duration: 6500,
    onAction: () => {
      const insertIndex = Math.min(index, state.tasks.length);
      state.tasks.splice(insertIndex, 0, task);
      saveState();
      renderAll();
      announce('Tarefa restaurada.');
    }
  });
}

function deleteCurrentTask() {
  const taskId = els.taskId.value;
  if (!taskId) return;
  closeTaskDialog();
  deleteTask(taskId);
}

function duplicateTask(taskId) {
  const task = getTask(taskId);
  if (!task) return;

  const index = state.tasks.findIndex((item) => item.id === task.id);
  if (index === -1) return;

  const suffix = ' (cópia)';
  const copy = {
    ...task,
    id: generateId(),
    number: getNextTaskNumber(),
    title: task.title.length + suffix.length > 140 ? task.title.slice(0, 140 - suffix.length) + suffix : task.title + suffix,
    tags: [...task.tags],
    createdAt: Date.now()
  };

  state.tasks.splice(index + 1, 0, copy);
  saveState();
  renderAll();
  announce('Tarefa duplicada.');
  showToast('Tarefa duplicada.');
}

function toggleTaskDone(taskId) {
  const task = getTask(taskId);
  if (!task) return;

  const oldStatus = task.statusId;
  const oldIndex = state.tasks.findIndex((item) => item.id === task.id);
  if (oldIndex === -1) return;

  const targetStatus = oldStatus === 'done' ? 'todo' : 'done';
  state.tasks.splice(oldIndex, 1);
  task.statusId = targetStatus;
  insertTaskAtTopOfStatus(task, targetStatus);

  saveState();
  renderAll();

  const message = targetStatus === 'done' ? 'Tarefa concluída.' : 'Tarefa reaberta.';
  announce(message);

  showToast(message, {
    actionLabel: 'Desfazer',
    duration: 5000,
    onAction: () => {
      const currentIndex = state.tasks.findIndex((item) => item.id === task.id);
      if (currentIndex !== -1) state.tasks.splice(currentIndex, 1);
      task.statusId = oldStatus;
      state.tasks.splice(Math.min(oldIndex, state.tasks.length), 0, task);
      saveState();
      renderAll();
      announce('Alteração desfeita.');
    }
  });
}

function clearCompletedTasks() {
  closePopovers();
  closeTaskMenu();

  const removed = [];
  state.tasks.forEach((task, index) => {
    if (task.statusId === 'done') removed.push({ task, index });
  });

  if (!removed.length) {
    showToast('Nenhuma tarefa concluída para limpar.', { type: 'info' });
    return;
  }

  state.tasks = state.tasks.filter((task) => task.statusId !== 'done');
  saveState();
  renderAll();

  const message = `${removed.length} ${removed.length === 1 ? 'tarefa concluída removida' : 'tarefas concluídas removidas'}.`;
  announce(message);

  showToast(message, {
    actionLabel: 'Desfazer',
    duration: 7000,
    onAction: () => {
      removed
        .sort((a, b) => a.index - b.index)
        .forEach(({ task, index }) => {
          state.tasks.splice(Math.min(index, state.tasks.length), 0, task);
        });
      saveState();
      renderAll();
      announce('Tarefas restauradas.');
    }
  });
}

function exportBoard() {
  closePopovers();

  const payload = {
    board: 'Site institucional',
    version: 1,
    exportedAt: new Date().toISOString(),
    statuses: COLUMNS,
    members: MEMBERS,
    tasks: state.tasks
  };

  try {
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'site-institucional-quadro.json';
    link.style.display = 'none';
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    showToast('Quadro exportado em JSON.');
  } catch (error) {
    showToast('Não foi possível exportar o quadro.', { type: 'danger' });
  }
}

async function copyInviteLink() {
  if (isMobile()) closeMobileSidebar();
  const copied = await copyText(window.location.href);
  showToast(copied ? 'Link do quadro copiado.' : 'Não foi possível copiar o link.', {
    type: copied ? 'success' : 'danger'
  });
}

async function copyText(text) {
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (error) {
      console.warn('Clipboard indisponível, usando alternativa.', error);
    }
  }

  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.left = '-9999px';
  textarea.style.top = '0';
  document.body.append(textarea);
  textarea.select();

  let copied = false;
  try {
    copied = document.execCommand('copy');
  } catch (error) {
    copied = false;
  }

  textarea.remove();
  return copied;
}

function toggleFavorite() {
  state.favorite = !state.favorite;
  saveState();
  updateFavoriteButton();
  announce(state.favorite ? 'Quadro adicionado aos favoritos.' : 'Quadro removido dos favoritos.');
}

function updateFavoriteButton() {
  const active = Boolean(state.favorite);
  els.favoriteBtn.classList.toggle('is-favorite', active);
  els.favoriteBtn.setAttribute('aria-pressed', String(active));
  const label = active ? 'Remover dos favoritos' : 'Adicionar aos favoritos';
  els.favoriteBtn.setAttribute('aria-label', label);
  els.favoriteBtn.title = label;
}

function toggleTheme() {
  const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  applyTheme(next, true);
  announce(next === 'dark' ? 'Tema escuro ativado.' : 'Tema claro ativado.');
}

function applyTheme(theme, persist = true) {
  const next = theme === 'dark' ? 'dark' : 'light';
  document.documentElement.dataset.theme = next;
  state.theme = next;
  if (els.metaThemeColor) els.metaThemeColor.content = next === 'dark' ? '#22232b' : '#ffffff';

  const label = next === 'dark' ? 'Ativar tema claro' : 'Ativar tema escuro';
  els.themeToggle.setAttribute('aria-label', label);
  els.themeToggle.title = label;

  if (persist) saveState();
}

function isMobile() {
  return window.innerWidth <= 1024;
}

function handleSidebarToggle() {
  if (isMobile()) {
    document.body.classList.toggle('sidebar-open');
    updateSidebarToggle();
    return;
  }

  const collapsed = !document.body.classList.contains('sidebar-collapsed');
  document.body.classList.toggle('sidebar-collapsed', collapsed);
  state.sidebarCollapsed = collapsed;
  saveState();
  updateSidebarToggle();
}

function closeMobileSidebar() {
  document.body.classList.remove('sidebar-open');
  updateSidebarToggle();
}

function applySavedSidebarState() {
  if (isMobile()) {
    document.body.classList.remove('sidebar-open');
    document.body.classList.remove('sidebar-collapsed');
  } else {
    document.body.classList.remove('sidebar-open');
    document.body.classList.toggle('sidebar-collapsed', Boolean(state.sidebarCollapsed));
  }
  updateSidebarToggle();
}

function updateSidebarToggle() {
  const mobile = isMobile();
  const expanded = mobile
    ? document.body.classList.contains('sidebar-open')
    : !document.body.classList.contains('sidebar-collapsed');

  const label = mobile
    ? expanded
      ? 'Fechar menu lateral'
      : 'Abrir menu lateral'
    : expanded
      ? 'Recolher barra lateral'
      : 'Expandir barra lateral';

  els.sidebarToggle.setAttribute('aria-expanded', String(expanded));
  els.sidebarToggle.setAttribute('aria-label', label);
  els.sidebarToggle.title = label;

  const use = els.sidebarToggle.querySelector('use');
  if (use) use.setAttribute('href', mobile ? '#i-menu' : '#i-panel-left');
}

function handleWindowResize() {
  closeTaskMenu();
  const mobile = isMobile();

  if (mobile === wasMobile) return;
  wasMobile = mobile;
  document.body.classList.remove('sidebar-open');
  document.body.classList.toggle('sidebar-collapsed', !mobile && Boolean(state.sidebarCollapsed));
  updateSidebarToggle();
  closePopovers();
}

function handleDocumentClick(event) {
  if (!event.target.closest('.popover') && !event.target.closest('[data-popover-trigger]')) {
    closePopovers();
  }

  if (!event.target.closest('#task-menu') && !event.target.closest('[data-task-menu]')) {
    closeTaskMenu();
  }
}

function handleGlobalKeydown(event) {
  if (event.key === 'Escape') {
    closePopovers();
    closeTaskMenu();
    if (document.body.classList.contains('sidebar-open')) closeMobileSidebar();
    return;
  }

  if (event.metaKey || event.ctrlKey || event.altKey || event.repeat) return;
  if (document.querySelector('dialog[open]')) return;

  const target = event.target;
  if (target.matches('input, textarea, select') || target.isContentEditable) return;

  if (event.key === 'n' || event.key === 'N') {
    event.preventDefault();
    openTaskDialog();
    return;
  }

  if (event.key === '/') {
    event.preventDefault();
    els.searchInput.focus();
    els.searchInput.select();
  }
}

function showToast(message, options = {}) {
  const { type = 'success', actionLabel = '', onAction = null, duration = null } = options;

  while (els.toastContainer.children.length >= 4) {
    els.toastContainer.firstElementChild.remove();
  }

  const toast = document.createElement('div');
  toast.className = `toast${type === 'danger' ? ' is-danger' : ''}`;
  toast.setAttribute('role', 'status');

  const iconName = type === 'danger' ? 'x' : type === 'info' ? 'help' : 'check';
  toast.innerHTML = `<span class="toast-icon">${icon(iconName)}</span><span class="toast-message">${escapeHtml(message)}</span>`;

  let timerId = null;
  let dismissed = false;

  const dismiss = () => {
    if (dismissed) return;
    dismissed = true;
    if (timerId) clearTimeout(timerId);
    toast.classList.add('is-leaving');
    setTimeout(() => toast.remove(), 200);
  };

  if (actionLabel && typeof onAction === 'function') {
    const action = document.createElement('button');
    action.type = 'button';
    action.className = 'toast-action';
    action.textContent = actionLabel;
    action.addEventListener('click', () => {
      dismiss();
      onAction();
    });
    toast.append(action);
  }

  els.toastContainer.append(toast);
  timerId = setTimeout(dismiss, duration ?? (actionLabel ? 6500 : 3400));
}

function announce(message) {
  els.srAnnouncer.textContent = '';
  setTimeout(() => {
    els.srAnnouncer.textContent = message;
  }, 30);
}

function generateId() {
  if (window.crypto && typeof window.crypto.randomUUID === 'function') {
    try {
      return window.crypto.randomUUID();
    } catch (error) {
      console.warn('Não foi possível gerar um UUID.', error);
    }
  }
  return `task-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function getNextTaskNumber() {
  return state.tasks.reduce((max, task) => Math.max(max, Number(task.number) || 0), 100) + 1;
}

function parseTags(value) {
  const seen = new Set();

  return value
    .split(',')
    .map((tag) => tag.trim().replace(/^#+/, '').trim())
    .filter((tag) => {
      if (!tag) return false;
      const key = tag.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, 6)
    .map((tag) => tag.slice(0, 26));
}

init().catch((error) => {
  console.error('Não foi possível iniciar o quadro.', error);
  showToast('Não foi possível carregar o quadro. Recarregue a página.', { type: 'danger', duration: 8000 });
});
