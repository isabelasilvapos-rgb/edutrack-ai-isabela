
// Fetch helpers using backend API (no localStorage persistence for subjects/tasks)
function getSubjectsList() {
  return window.api.getSubjects().then(subjects => {
    return subjects.map(subject => ({
      id: subject.id,
      name: subject.name,
      professor: subject.professor,
      workload: subject.workload || subject.workload_hours || 0,
      status: subject.status || 'Ativa'
    }));
  });
}

function getAllTasksList() {
  return window.api.getAllTasks().then(tasks => tasks.map(task => ({
    id: task.id,
    subject_id: task.subject_id,
    title: task.name || task.title || '',
    is_completed: !!task.is_completed
  })));
}

function getTasksBySubjectId(subjectId) {
  return window.api.getTasksBySubjectId(subjectId).then(tasks => tasks.map(task => ({
    id: task.id,
    subject_id: task.subject_id,
    title: task.title,
    is_completed: !!task.is_completed
  })));
}

function openModal(modalType) {
  const overlay = document.getElementById('modalOverlay');
  const title = document.getElementById('modalTitle');
  const subtitle = document.getElementById('modalSubtitle');
  const subjectFormSection = document.getElementById('subjectFormSection');
  const taskFormSection = document.getElementById('taskFormSection');

  if (!overlay || !title || !subtitle) return;

  overlay.classList.remove('hidden');
  if (modalType === 'subject') {
    title.textContent = 'Adicionar Nova Disciplina';
    subtitle.textContent = 'Preencha os campos para criar uma nova disciplina.';
    if (subjectFormSection) subjectFormSection.classList.remove('hidden');
    if (taskFormSection) taskFormSection.classList.add('hidden');
  } else {
    title.textContent = 'Adicionar Nova Tarefa';
    subtitle.textContent = 'Insira a tarefa e vincule-a à disciplina.';
    if (subjectFormSection) subjectFormSection.classList.add('hidden');
    if (taskFormSection) taskFormSection.classList.remove('hidden');
  }
}

function closeModal() {
  const overlay = document.getElementById('modalOverlay');
  if (!overlay) return;
  overlay.classList.add('hidden');
  const forms = overlay.querySelectorAll('form');
  forms.forEach(form => form.reset());
  overlay.querySelectorAll('.input-error').forEach(error => error.textContent = '');
}

function validateForm(formElement) {
  let valid = true;
  formElement.querySelectorAll('[data-required]').forEach(input => {
    const errorEl = input.closest('.input-group').querySelector('.input-error');
    if (!input.value.trim()) {
      valid = false;
      if (errorEl) errorEl.textContent = 'Este campo é obrigatório.';
      input.classList.add('input-invalid');
    } else {
      if (errorEl) errorEl.textContent = '';
      input.classList.remove('input-invalid');
    }
  });
  return valid;
}

function initModalListeners() {
  const overlay = document.getElementById('modalOverlay');
  if (!overlay) return;

  overlay.querySelectorAll('[data-close]').forEach(button => {
    button.addEventListener('click', closeModal);
  });

  overlay.addEventListener('click', event => {
    if (event.target === overlay) {
      closeModal();
    }
  });
}

function initSubjectModal() {
  const openButton = document.getElementById('openNewSubjectModal');
  const form = document.getElementById('subjectForm');
  if (!openButton || !form) return;

  openButton.addEventListener('click', () => openModal('subject'));
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (!validateForm(form)) return;
    const payload = {
      name: form.subjectName.value.trim(),
      professor: form.subjectProfessor.value.trim(),
      workload: Number(form.subjectWorkload.value) || 0
    };
    try {
      const created = await window.api.createSubject(payload);
      closeModal();
      if (typeof window.refreshSubjectCards === 'function') {
        const latest = await getSubjectsList();
        window.refreshSubjectCards(latest);
      }
    } catch (err) {
      console.error('Erro criando disciplina', err);
    }
  });
}

function initTaskModal(subjectId, subjectName) {
  const openButton = document.getElementById('openNewTaskModal');
  const form = document.getElementById('taskForm');
  const subjectInput = document.getElementById('taskSubjectRef');
  const hiddenSubjectId = document.getElementById('taskSubjectId');
  if (!openButton || !form || !subjectInput || !hiddenSubjectId) return;

  subjectInput.value = subjectName || '';
  hiddenSubjectId.value = subjectId || '';

  openButton.addEventListener('click', () => openModal('task'));
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (!validateForm(form)) return;
    const payload = {
      subject_id: Number(hiddenSubjectId.value) || null,
      title: form.taskName.value.trim()
    };
    try {
      const created = await window.api.createTask(payload);
      closeModal();
      if (typeof window.refreshTaskList === 'function') {
        const latest = await getTasksBySubjectId(hiddenSubjectId.value);
        window.refreshTaskList(latest);
      }
    } catch (err) {
      console.error('Erro criando tarefa', err);
    }
  });
}

function hydrateTaskModal(subjectId, subjectName) {
  const subjectInput = document.getElementById('taskSubjectRef');
  const hiddenSubjectId = document.getElementById('taskSubjectId');
  if (subjectInput) subjectInput.value = subjectName || ''; 
  if (hiddenSubjectId) hiddenSubjectId.value = subjectId || '';
}

function initPageModals() {
  initModalListeners();
  initSubjectModal();

  const taskPage = document.getElementById('openNewTaskModal');
  if (taskPage) {
    const urlParams = new URLSearchParams(window.location.search);
    const subjectId = urlParams.get('id');
    const subjectName = document.getElementById('subjectName')?.textContent || '';
    hydrateTaskModal(subjectId, subjectName);
    initTaskModal(subjectId, subjectName);
  }
}

window.addEventListener('DOMContentLoaded', initPageModals);
