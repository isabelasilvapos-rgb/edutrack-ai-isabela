
# EduTrack AI — Backend (Express) + Frontend Integration

Este repositório contém a interface front-end (HTML/JS puro) e um backend em Node.js com Express para conectar o aplicativo EduTrack AI a um banco de dados Microsoft SQL Server (MSSQL) usando a biblioteca `mssql`.

Objetivo: permitir que seu professor clone o projeto, configure o SQL Server local, rode o servidor e teste o fluxo completo (cadastro, login, CRUD de disciplinas e tarefas).

---

## Estrutura do repositório (resumida)

- `frontend/` — páginas HTML, CSS e JS do cliente (login, signup, dashboard, subject, etc.).
- `backend/` — servidor Node.js com Express e integração MSSQL.

---

## Requisitos

- Node.js 18+ (ou 16+ compatível)
- NPM
- Microsoft SQL Server (local ou remoto) com credenciais de acesso
- Acesso à porta usada no `.env` (padrão 1433)

---

## Passo a passo para rodar localmente (professor)

1. Clone o repositório:

```bash
git clone <REPO_URL>
cd edutrack-ai-isabela
```

2. Instale dependências do backend:

```bash
cd backend
npm install
```

3. Configure variáveis de ambiente:

- Crie um arquivo `.env` dentro de `backend/` (nunca commite esse arquivo).
- Preencha as variáveis abaixo com as credenciais do seu SQL Server:

```
# Exemplo de .env
DB_USER=sa
DB_PASSWORD=SuaSenhaDoSQL
DB_SERVER=localhost
DB_DATABASE=EduTrackDB
DB_PORT=1433
JWT_SECRET=uma_chave_secreta_para_dev
PORT=3000
```

Observações:
- `DB_SERVER` pode ser `localhost`, `127.0.0.1` ou um endereço de rede. Se estiver usando Docker, ajuste conforme a rede.
- `DB_PORT` é 1433 por padrão no SQL Server.

4. Inicialize o servidor backend:

```bash
npm start
```

Ao iniciar, o servidor tentará conectar ao banco e criará as tabelas necessárias automaticamente (Users, Subjects, Tasks). Se houver erro de conexão, verifique as credenciais no `.env` e se o SQL Server está aceitando conexões TCP.

5. Abra o frontend

- Você pode abrir os arquivos HTML em `frontend/` diretamente no navegador (ex.: `frontend/index.html`) ou servir a pasta via um servidor estático (recomendado para evitar problemas de CORS). O backend já habilita CORS por padrão.

Exemplo rápido para servir o frontend com `http-server` (opcional):

```bash
# instalar http-server globalmente (opcional)
npm install -g http-server
# no diretório raiz do projeto
cd frontend
http-server -c-1
```

6. Fluxo testado

- `POST /api/cadastro` — cria usuário e retorna `{ token, user }`.
- `POST /api/login` — autentica e retorna `{ token, user }`.
- `GET /api/disciplinas` — lista disciplinas do usuário autenticado (`Authorization: Bearer <token>`).
- `POST /api/disciplinas` — cria disciplina (body: `{ name, professor, workload }`).
- `GET /api/tarefas?subjectId=<id>` — lista tarefas do usuário (opcionalmente filtrando por disciplina).
- `POST /api/tarefas` — cria tarefa (body: `{ subject_id, title }`).
- `PUT /api/tarefas/:id` — atualiza `is_completed` (body: `{ is_completed: true|false }`).

As chamadas do front-end já foram adaptadas para consumir `http://localhost:3000/api/...`. Caso o servidor esteja em outra porta ou host, atualize `frontend/js/api.js` (variável `API_BASE`).

---

## Notas de Segurança e Limitações

- Este projeto é um protótipo para fins de avaliação. Em produção, é necessário:
	- Usar HTTPS
	- Melhorar política de CORS
	- Tratar rate-limiting, proteção contra brute-force, validações adicionais
	- Não armazenar segredos no repositório

- Senhas são armazenadas com hashing (bcryptjs) no servidor.

---

## Dúvidas / Testes que o professor pode fazer

- Criar um usuário via tela de cadastro.
- Fazer login e verificar redirecionamento ao dashboard.
- Criar novas disciplinas e verificar a listagem.
- Abrir uma disciplina e criar tarefas; marcar como concluída.

Se houver qualquer problema com a conexão ao SQL Server, envie o erro do console do servidor e eu ajudarei a diagnosticar.

---

Boa avaliação! Se quiser, eu posso também adicionar um script `docker-compose` com um container SQL Server para facilitar testes locais.


