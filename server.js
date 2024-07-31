const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// Ensure the uploads directory exists
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// Set up Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Directory to save images
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  },
});

const upload = multer({ storage });

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

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
  const { username, email, password, gender, age } = req.body;

  // Check if any required field is missing
  if (!username || !email || !password || !gender || !age) {
    return res.status(400).json({ error: 'Please fill in all fields' });
  }

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

app.post('/signup', (req, res) => {
  const { username, email, password, gender, age } = req.body;

  // Check if any required field is missing
  if (!username || !email || !password || !gender || !age) {
    return res.status(400).json({ error: 'Please fill in all fields' });
  }

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


app.post('/login', (req, res) => {
  const { username, password } = req.body;
  connection.query(
    'SELECT * FROM user WHERE username = ? AND password = ?',
    [username, password],
    (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Database query error' });
      }
      if (results.length > 0) {
        res.json({ success: true, user: results[0] });
      } else {
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

app.get('/users', (req, res) => {
  connection.query('SELECT * FROM user', (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database query error' });
    }
    res.json(results);
  });
});

// PRODUCT MANAGEMENT

app.get('/products', (req, res) => {
  connection.query('SELECT * FROM products', (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database query error' });
    }
    res.json(results);
  });
});

// Add a product with an image
app.post('/products', upload.single('image'), (req, res) => {
  const { name, quantity, price, description } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : null;

  connection.query(
    'INSERT INTO products (name, quantity, price, description, image) VALUES (?, ?, ?, ?, ?)',
    [name, quantity, price, description, image],
    (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to add product' });
      }
      res.json({ id: results.insertId, name, quantity, price, description, image });
    }
  );
});

// Update a product with an image
app.put('/products/:id', upload.single('image'), (req, res) => {
  const { id } = req.params;
  const { name, quantity, price, description } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : null;

  connection.query(
    'UPDATE products SET name = ?, quantity = ?, price = ?, description = ?, image = ? WHERE id = ?',
    [name, quantity, price, description, image, id],
    (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to update product' });
      }
      res.json({ id, name, quantity, price, description, image });
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
