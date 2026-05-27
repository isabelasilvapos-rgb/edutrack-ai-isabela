# Tasks: Integração com a API do Xano

- [ ] **Configuração da Base URL**
  - [ ] Adicionar a constante `BASE_URL` no topo do arquivo `api.js`.
- [ ] **Utilitário de Autenticação**
  - [ ] Criar a função `fetchWithAuth()` para padronizar as requisições protegidas, injetando o Bearer Token.
- [ ] **Refatoração dos Métodos (api.js)**
  - [ ] Implementar `login(email, password)` usando `POST /auth/login`. Salvar token no `localStorage`.
  - [ ] Implementar `getSubjects()` consumindo `GET /subjects`.
  - [ ] Implementar `getAllTasks()` consumindo `GET /academic_tasks`.
  - [ ] Implementar `getTasksBySubjectId(id)` consumindo `GET /academic_tasks`.
  - [ ] Implementar `toggleTaskCompletion(id, isCompleted)` disparando `POST /academic_tasks/{id}` ou via endpoint customizado do Xano.
- [ ] **Tratamento de Erros**
  - [ ] Configurar logs para alertar falhas na requisição HTTP (`catch`).
  - [ ] Redirecionar para login caso o erro seja `401 Unauthorized`.
- [ ] **Limpeza**
  - [ ] Remover arrays locais (`mockUser`, `mockSubjects`, `mockTasks`) do código.
