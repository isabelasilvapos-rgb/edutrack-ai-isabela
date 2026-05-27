/*
  frontend API bridge
  Replaces previous mock with fetch calls to local backend:
  - POST /api/cadastro
  - POST /api/login
  - GET /api/disciplinas
  - POST /api/disciplinas
  - GET /api/tarefas
  - POST /api/tarefas
  - PUT /api/tarefas/:id
*/

const API_BASE = (window.__API_BASE__ || 'http://localhost:3000') + '/api';

async function request(path, opts = {}) {
  const token = localStorage.getItem('token');
  const headers = opts.headers || {};
  headers['Content-Type'] = 'application/json';
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(API_BASE + path, { ...opts, headers });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const err = new Error(body.error || res.statusText || 'HTTP error');
    err.status = res.status;
    err.body = body;
    throw err;
  }
  return res.status === 204 ? null : res.json();
}

const api = {
  async signup(name, email, password) {
    return request('/cadastro', { method: 'POST', body: JSON.stringify({ name, email, password }) });
  },
  async login(email, password) {
    return request('/login', { method: 'POST', body: JSON.stringify({ email, password }) });
  },
  async getSubjects() {
    return request('/disciplinas', { method: 'GET' });
  },
  async createSubject(payload) {
    return request('/disciplinas', { method: 'POST', body: JSON.stringify(payload) });
  },
  async getAllTasks() {
    return request('/tarefas', { method: 'GET' });
  },
  async getTasksBySubjectId(subjectId) {
    return request(`/tarefas?subjectId=${encodeURIComponent(subjectId)}`, { method: 'GET' });
  },
  async createTask(payload) {
    return request('/tarefas', { method: 'POST', body: JSON.stringify(payload) });
  },
  async toggleTaskCompletion(taskId, isCompleted) {
    return request(`/tarefas/${taskId}`, { method: 'PUT', body: JSON.stringify({ is_completed: !!isCompleted }) });
  }
};

window.api = api;