require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sql = require('mssql');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';

// MSSQL pool config
const dbConfig = {
  user: process.env.DB_USER || 'sa',
  password: process.env.DB_PASSWORD || 'yourStrong(!)Password',
  server: process.env.DB_SERVER || 'localhost',
  database: process.env.DB_DATABASE || 'EduTrackDB',
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 1433,
  options: {
    encrypt: false,
    trustServerCertificate: true
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  }
};

let pool;

async function initDb() {
  try {
    pool = await sql.connect(dbConfig);
    console.log('Connected to MSSQL');
    await createTablesIfNeeded();
  } catch (err) {
    console.error('DB Connection Error:', err);
    process.exit(1);
  }
}

async function createTablesIfNeeded() {
  // Create Users, Subjects and Tasks tables if they don't exist
  const createUsers = `IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Users]') AND type in (N'U'))
  CREATE TABLE [dbo].[Users] (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(200) NOT NULL,
    email NVARCHAR(200) NOT NULL UNIQUE,
    password NVARCHAR(200) NOT NULL,
    created_at DATETIME2 DEFAULT GETDATE()
  );`;

  const createSubjects = `IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Subjects]') AND type in (N'U'))
  CREATE TABLE [dbo].[Subjects] (
    id INT IDENTITY(1,1) PRIMARY KEY,
    user_id INT NOT NULL,
    name NVARCHAR(200) NOT NULL,
    professor NVARCHAR(200) NULL,
    workload INT NULL,
    status NVARCHAR(50) DEFAULT 'Ativa',
    created_at DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE NO ACTION
  );`;

  const createTasks = `IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Tasks]') AND type in (N'U'))
  CREATE TABLE [dbo].[Tasks] (
    id INT IDENTITY(100,1) PRIMARY KEY,
    user_id INT NOT NULL,
    subject_id INT NULL,
    title NVARCHAR(500) NOT NULL,
    is_completed BIT DEFAULT 0,
    created_at DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE NO ACTION,
    FOREIGN KEY (subject_id) REFERENCES Subjects(id) ON DELETE SET NULL
  );`;

  await pool.request().batch(createUsers + '\n' + createSubjects + '\n' + createTasks);
  console.log('Ensured tables exist');
}

function generateToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

async function findUserByEmail(email) {
  const res = await pool.request().input('email', sql.NVarChar, email).query('SELECT TOP 1 * FROM Users WHERE email = @email');
  return res.recordset[0];
}

async function getUserById(id) {
  const res = await pool.request().input('id', sql.Int, id).query('SELECT TOP 1 id, name, email, created_at FROM Users WHERE id = @id');
  return res.recordset[0];
}

// Middleware to protect routes
function authenticateToken(req, res, next) {
  const auth = req.headers['authorization'];
  if (!auth) return res.status(401).json({ error: 'Token ausente' });
  const parts = auth.split(' ');
  if (parts.length !== 2) return res.status(401).json({ error: 'Token inválido' });
  const token = parts[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload; // should contain userId
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido' });
  }
}

// Routes
app.post('/api/cadastro', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: 'Campos obrigatórios ausentes' });

  try {
    const existing = await findUserByEmail(email);
    if (existing) return res.status(409).json({ error: 'Email já cadastrado' });

    const hashed = await bcrypt.hash(password, 10);
    const insert = await pool.request()
      .input('name', sql.NVarChar, name)
      .input('email', sql.NVarChar, email)
      .input('password', sql.NVarChar, hashed)
      .query('INSERT INTO Users (name, email, password) OUTPUT INSERTED.id VALUES (@name, @email, @password)');

    const userId = insert.recordset[0].id;
    const user = await getUserById(userId);
    const token = generateToken({ userId: user.id });
    res.json({ token, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao cadastrar usuário' });
  }
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Campos obrigatórios ausentes' });

  try {
    const user = await findUserByEmail(email);
    if (!user) return res.status(401).json({ error: 'Credenciais inválidas' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: 'Credenciais inválidas' });

    const userSafe = await getUserById(user.id);
    const token = generateToken({ userId: user.id });
    res.json({ token, user: userSafe });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao logar' });
  }
});

// Subjects
app.get('/api/disciplinas', authenticateToken, async (req, res) => {
  const userId = req.user.userId;
  try {
    const result = await pool.request().input('userId', sql.Int, userId).query('SELECT id, name, professor, workload, status FROM Subjects WHERE user_id = @userId');
    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar disciplinas' });
  }
});

app.post('/api/disciplinas', authenticateToken, async (req, res) => {
  const userId = req.user.userId;
  const { name, professor, workload } = req.body;
  if (!name) return res.status(400).json({ error: 'Nome da disciplina obrigatório' });
  try {
    const insert = await pool.request()
      .input('userId', sql.Int, userId)
      .input('name', sql.NVarChar, name)
      .input('professor', sql.NVarChar, professor || '')
      .input('workload', sql.Int, workload || 0)
      .query('INSERT INTO Subjects (user_id, name, professor, workload) OUTPUT INSERTED.* VALUES (@userId, @name, @professor, @workload)');
    res.json(insert.recordset[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao criar disciplina' });
  }
});

// Tasks
app.get('/api/tarefas', authenticateToken, async (req, res) => {
  const userId = req.user.userId;
  const subjectId = req.query.subjectId ? parseInt(req.query.subjectId, 10) : null;
  try {
    let query = 'SELECT id, subject_id, title, is_completed FROM Tasks WHERE user_id = @userId';
    if (subjectId) query += ' AND subject_id = @subjectId';
    const reqQ = pool.request().input('userId', sql.Int, userId);
    if (subjectId) reqQ.input('subjectId', sql.Int, subjectId);
    const result = await reqQ.query(query);
    res.json(result.recordset.map(r => ({ id: r.id, subject_id: r.subject_id, title: r.title, is_completed: !!r.is_completed })));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar tarefas' });
  }
});

app.post('/api/tarefas', authenticateToken, async (req, res) => {
  const userId = req.user.userId;
  const { subject_id, title } = req.body;
  if (!title) return res.status(400).json({ error: 'Título da tarefa obrigatório' });
  try {
    const insert = await pool.request()
      .input('userId', sql.Int, userId)
      .input('subjectId', sql.Int, subject_id || null)
      .input('title', sql.NVarChar, title)
      .query('INSERT INTO Tasks (user_id, subject_id, title) OUTPUT INSERTED.* VALUES (@userId, @subjectId, @title)');
    res.json({ id: insert.recordset[0].id, subject_id: insert.recordset[0].subject_id, title: insert.recordset[0].title, is_completed: !!insert.recordset[0].is_completed });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao criar tarefa' });
  }
});

app.put('/api/tarefas/:id', authenticateToken, async (req, res) => {
  const userId = req.user.userId;
  const taskId = parseInt(req.params.id, 10);
  const { is_completed } = req.body;
  try {
    const update = await pool.request()
      .input('id', sql.Int, taskId)
      .input('userId', sql.Int, userId)
      .input('isCompleted', sql.Bit, is_completed ? 1 : 0)
      .query('UPDATE Tasks SET is_completed = @isCompleted OUTPUT INSERTED.* WHERE id = @id AND user_id = @userId');
    if (update.recordset.length === 0) return res.status(404).json({ error: 'Tarefa não encontrada' });
    const r = update.recordset[0];
    res.json({ id: r.id, subject_id: r.subject_id, title: r.title, is_completed: !!r.is_completed });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao atualizar tarefa' });
  }
});

// Health
app.get('/api/health', (req, res) => res.json({ ok: true }));

// Start server after DB init
initDb().then(() => {
  app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
});

module.exports = app;
