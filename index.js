const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 4000; // Changed port to 4000


// Create a MySQL connection pool
const pool = mysql.createPool({
  host: 'localhost',
  user: 'your_username',
  password: 'your_password',
  database: 'your_database',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Middleware to parse JSON requests
app.use(bodyParser.json());

// Root path handler
app.get('/', (req, res) => {
  res.send('Welcome to the API');
});

// Get all users
app.get('/users', (req, res) => {
  pool.query('SELECT * FROM users', (error, results) => {
    if (error) throw error;
    res.json(results);
  });
});

// Get user by ID
app.get('/users/:id', (req, res) => {
  const { id } = req.params;
  pool.query('SELECT * FROM users WHERE id = ?', [id], (error, results) => {
    if (error) throw error;
    res.json(results[0]);
  });
});

// Create a new user
app.post('/users', (req, res) => {
  const { name, email } = req.body;
  pool.query('INSERT INTO users (name, email) VALUES (?, ?)', [name, email], (error, results) => {
    if (error) throw error;
    res.status(201).send('User created successfully');
  });
});

// Update user by ID
app.put('/users/:id', (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;
  pool.query('UPDATE users SET name = ?, email = ? WHERE id = ?', [name, email, id], (error, results) => {
    if (error) throw error;
    res.send('User updated successfully');
  });
});

// Delete user by ID
app.delete('/users/:id', (req, res) => {
  const { id } = req.params;
  pool.query('DELETE FROM users WHERE id = ?', [id], (error, results) => {
    if (error) throw error;
    res.send('User deleted successfully');
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
