# Proposal: Integração com a API do Xano

## Objetivo
Substituir a camada de mock de dados atual (hardcoded em JS) pelas chamadas HTTP reais consumindo a API construída no Xano para o projeto EduTrack AI.

## Endpoints e Base URL
Foi definida a seguinte **Base URL** para a API:
`https://x8ki-letl-twmt.n7.xano.io/api:edutrack-ai`

Os métodos no `api.js` serão mapeados para as seguintes rotas do Xano (presumindo os nomes de tabelas padrão gerados pela plataforma):
1. **Login:** `POST /auth/login` - Responsável por gerar e retornar o JWT de autenticação.
2. **Listar Disciplinas:** `GET /subjects` - Retorna todas as disciplinas atreladas ao usuário logado (o token JWT define quem é o usuário).
3. **Listar Tarefas:** `GET /academic_tasks` - Retorna as tarefas (podendo utilizar o filtro via query string `?subject_id=X` se o Xano suportar, ou retornando todas as do usuário logado e filtrando no client-side).
4. **Atualizar Tarefa:** `POST /academic_tasks/{id}` ou `PATCH /academic_tasks/{id}` - Atualizará o campo `is_completed`.

## Segurança e Header
- Após o `/auth/login` ser bem-sucedido, o Frontend armazenará a chave JWT `token` no `localStorage`.
- Foi criado um utilitário interno `fetchWithAuth()` dentro do `api.js` que automaticamente anexa o cabeçalho `Authorization: Bearer <TOKEN>` em todas as requisições, evitando duplicação de código.
- Se a API retornar código **401 Unauthorized**, o usuário será deslogado e redirecionado automaticamente para a tela de Login (`index.html`).
