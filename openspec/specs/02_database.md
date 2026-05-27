# Banco de Dados

## Backend Escolhido
**Xano** - Plataforma No-Code para construção da API e banco de dados.

## Padrão de Nomenclatura
Todas as tabelas e colunas devem obrigatoriamente utilizar o padrão **snake_case**.

## Estrutura Inicial de Tabelas

Abaixo estão as tabelas principais mapeadas para o MVP:

### 1. `users`
Tabela para gerenciamento de usuários do sistema.
- Responsável por armazenar as credenciais, dados de perfil e vínculos de autenticação.

### 2. `subjects`
Tabela para cadastro das disciplinas.
- Deve conter os dados básicos da disciplina (`name`, `professor`, `workload_hours`, `description`, `start_date`, `end_date`, `status`) e a relação de qual usuário é dono daquele registro (`user_id`).

### 3. `academic_tasks`
Tabela para gerenciamento das tarefas acadêmicas.
- Deve possuir chaves estrangeiras vinculando a tarefa ao `user` e à respectiva `subject`.
- Pode incluir dados como status de conclusão, prazos e notas/pontuações para viabilizar o cálculo de progresso.
