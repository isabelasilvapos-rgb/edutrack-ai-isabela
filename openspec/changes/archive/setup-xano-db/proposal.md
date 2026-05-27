# Proposal: Configuração do Banco de Dados no Xano

## Objetivo
Configurar a estrutura inicial do banco de dados no Xano, criando as tabelas `users`, `subjects` e `academic_tasks`, conforme os requisitos do MVP definidos em `01_project_mvp.md` e `02_database.md`.

## Alterações Propostas

### 1. Tabela `users`
Responsável por armazenar as credenciais, dados de perfil e vínculos de autenticação do usuário.
- Campos sugeridos: `id`, `created_at`, `name`, `email`, `password`.
- Atende ao escopo de "Autenticação de Usuários" do MVP.

### 2. Tabela `subjects`
Responsável pelo cadastro das disciplinas acadêmicas.
- Campos: `id`, `created_at`, `name`, `professor`, `workload_hours`, `description`, `start_date`, `end_date`, `status` (padrão: "active"), `user_id` (chave estrangeira para `users`).
- Atende ao escopo de "Gestão de Disciplinas" do MVP.

### 3. Tabela `academic_tasks`
Responsável pelo gerenciamento das tarefas acadêmicas vinculadas às disciplinas.
- Campos sugeridos: `id`, `created_at`, `title`, `description`, `due_date` (prazo), `is_completed` (status de conclusão), `score` (nota/pontuação), `user_id` (chave estrangeira), `subject_id` (chave estrangeira).
- Atende ao escopo de "Gestão de Tarefas" e "Cálculo de Progresso" do MVP.

## Restrições e Padrões
- Conforme o documento `02_database.md`, todas as tabelas e colunas devem obrigatoriamente utilizar o padrão **snake_case**.
