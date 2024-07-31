const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  port: 3306,
  password: '12345678',
  database: 'product',
});

connection.connect((err) => {
  if (err) {
    console.error('Database connection failed: ' + err.stack);
    return;
  }
  console.log('Connected to database.');
});


app.post('/user', (req, res) => {
  console.log(req.body);
  const { username, email, password, gender, age } = req.body;
  connection.query(
    'INSERT INTO user (id,username, email, password, gender, age) VALUES (?,?,?,?,?,?)',
    [null, username, email, password, gender, age],
    (err, results) => {
      if (err) throw err;
      res.json({ id: results.insertId, username, email, password, gender, age });
    }
  );
});


app.post('/login', (req, res) => {
  const { username, password } = req.body; 
  console.log(`Attempting login for user: ${username}`); // Extract username and password from request body
  connection.query(
    'SELECT * FROM user WHERE username = ? AND password = ?',  // Query to find matching user
    [username, password],
    (err, results) => {
      if (err) {  // Error handling for database query
        console.error('Query error:', err);
        return res.status(500).json({ error: 'Database query error' });
      }
      if (results.length > 0) {  // If matching user found, return user information
        res.json({ success: true, user: results[0] });
      } else {  // If no matching user found, return error message
        res.status(401).json({ success: false, message: 'Invalid credentials' });
      }
    }
  );
});

app.get('/user/:id', (req, res) => {
  const { id } = req.params;
  connection.query('SELECT * FROM user WHERE id = ?', [id], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database query error' });
    }
    if (results.length > 0) {
      res.json({ user: results[0] });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  });
});


// Update user by ID
app.put('/user/:id', (req, res) => {
  const { id } = req.params;
  const { username, email, password, gender, age } = req.body;
  connection.query(
    'UPDATE user SET username = ?, email = ?, password = ?, gender = ?, age = ? WHERE id = ?',
    [username, email, password, gender, age, id],
    (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Database query error' });
      }
      res.json({ success: true, message: 'User updated successfully' });
    }
  );
});

// Delete user by ID
app.delete('/user/:id', (req, res) => {
  const { id } = req.params;
  connection.query('DELETE FROM user WHERE id = ?', [id], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database query error' });
    }
    res.json({ success: true, message: 'User deleted successfully' });
  });
});


//Add User
app.post('/user', (req, res) => {
  const { username, email, password, gender, age } = req.body;

  // Check if any required field is missing
  if (!username || !email || !password || !gender || !age) {
    return res.status(400).json({ error: 'Please fill in all fields' });
  }

  // Proceed with database insertion
  connection.query(
    'INSERT INTO user (username, email, password, gender, age) VALUES (?, ?, ?, ?, ?)',
    [username, email, password, gender, age],
    (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to add user' });
      }
      res.json({ id: results.insertId, username, email, password, gender, age });
    }
  );
});


app.get('/users', (req, res) => {
  connection.query('SELECT * FROM user', (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database query error' });
    }
    res.json(results);
  });
});

                                    //PRODUCT MANAGEMENT


// API routes for products

app.get('/products', (req, res) => {
  connection.query('SELECT * FROM products', (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database query error' });
    }
    res.json(results);
  });
});

app.post('/products', (req, res) => {
  const { name, quantity, price, description } = req.body;
  connection.query(
    'INSERT INTO products (name, quantity, price, description) VALUES (?, ?, ?, ?)',
    [name, quantity, price, description],
    (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to add product' });
      }
      res.json({ id: results.insertId, name, quantity, price, description });
    }
  );
});

app.put('/products/:id', (req, res) => {
  const { id } = req.params;
  const { name, quantity, price, description } = req.body;
  connection.query(
    'UPDATE products SET name = ?, quantity = ?, price = ?, description = ? WHERE id = ?',
    [name, quantity, price, description, id],
    (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Database query error' });
      }
      res.json({ id, name, quantity, price, description });
    }
  );
});

app.delete('/products/:id', (req, res) => {
  const { id } = req.params;
  connection.query('DELETE FROM products WHERE id = ?', [id], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database query error' });
    }
    res.json({ message: 'Product deleted successfully' });
  });
});


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${3001}`);
});
