const sql = require('mssql');
const bcrypt = require('bcryptjs');

const config = {
  user: process.env.DB_USER || 'SA',
  password: process.env.DB_PASSWORD || '098098Isa',
  server: process.env.DB_SERVER || 'localhost',
  database: process.env.DB_DATABASE || 'EduTrackDB',
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 1433,
  options: { encrypt: false, trustServerCertificate: true }
};

(async () => {
  try {
    const pool = await sql.connect(config);
    const userRes = await pool.request().query('SELECT id, name, email FROM Users WHERE id = 1');
    console.log('USER', userRes.recordset);
    const userRow = userRes.recordset[0];
    if (!userRow) {
      console.log('no user');
      process.exit(0);
    }

    const clienteRes = await pool.request().input('email', sql.NVarChar, userRow.email).query('SELECT id_cliente FROM Clientes WHERE email = @email');
    console.log('CLIENTE_FOUND', clienteRes.recordset);
    let clienteId;
    if (clienteRes.recordset.length) {
      clienteId = clienteRes.recordset[0].id_cliente;
    } else {
      const placeholder = await bcrypt.hash(userRow.email + Date.now(), 10);
      const insCliente = await pool.request()
        .input('nome', sql.NVarChar, userRow.name)
        .input('email', sql.NVarChar, userRow.email)
        .input('senha', sql.NVarChar, placeholder)
        .query('INSERT INTO Clientes (nome, email, senha) OUTPUT INSERTED.id_cliente VALUES (@nome, @email, @senha)');
      console.log('INSERT_CLIENTE', insCliente.recordset);
      clienteId = insCliente.recordset[0].id_cliente;
    }

    console.log('USING clienteId', clienteId);
    const insert = await pool.request()
      .input('clienteId', sql.Int, clienteId)
      .input('nome', sql.NVarChar, 'Teste Auto')
      .input('professor', sql.NVarChar, 'Prof')
      .input('carga', sql.Int, 10)
      .query('INSERT INTO Disciplinas (id_cliente, nome, professor, carga_horaria) OUTPUT INSERTED.* VALUES (@clienteId, @nome, @professor, @carga)');
    console.log('INSERTED', insert.recordset);
    process.exit(0);
  } catch (err) {
    console.error('ERR', err);
    process.exit(1);
  }
})();
