const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();


const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MySQL Connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', // replace with your MySQL username
    password: 'benson', // replace with your MySQL password
    database: 'factory_outlet',
});

db.connect(err => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('MySQL connected...');
});

// API Routes

app.post('/api/signup', async (req, res) => {
    const { name, email, password } = req.body;

    // Check if user already exists
    db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
        if (err) {
            console.error('Error checking for existing user:', err);
            return res.status(500).json({ message: 'Server error' });
        }
        if (results.length > 0) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the password before inserting the user
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert the new user
        db.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, hashedPassword], (err, result) => {
            if (err) {
                console.error('Error creating user:', err); // Log the error
                return res.status(500).json({ message: 'Error creating user' });
            }

            const newUser = {
                id: result.insertId, // Get the ID of the new user
                name,
                email,
                role: 'user', // Default role; you can adjust this as necessary
            };

            res.status(201).json({ user: newUser });
        });
    });
});



// Login
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    db.query('SELECT * FROM users WHERE email = ? AND password = ?', [email, password], (err, results) => {
        if (err) {
            console.error('Error during login:', err);
            return res.status(500).send('Server error');
        }
        if (results.length === 0) {
            return res.status(401).send('Invalid credentials');
        }
        const user = results[0]; // Get the first user
        res.status(200).json({ user }); // Send the user object back
    });
});
// app.post('/api/login', (req, res) => {
//     const { email, password } = req.body;
    
//     db.query('SELECT * FROM users WHERE email = ? AND password = ?', [email, password], (err, results) => {
//         if (err) {
//             console.error('Error during login:', err);
//             return res.status(500).send('Server error');
//         }
//         if (results.length === 0) {
//             return res.status(401).send('Invalid credentials');
//         }

//         const user = results[0];

//         // Define admin credentials
//         const adminCredentials = {
//             'bhavana@gmail.com': '123456', // Replace with your actual admin password
//             'aswin@gmail.com': '123456',
//             'aadhi@gmail.com': '123456',
//             'benson@gmail.com': '123456',
//         };

//         // Check if the email belongs to an admin and if the password matches
//         const isAdmin = Object.keys(adminCredentials).includes(user.email) && adminCredentials[user.email] === password;

//         res.status(200).json({ user, isAdmin }); // Return user data and admin status
//     });
// });
app.post('/api/admin-login', (req, res) => {
    const { email, password } = req.body;
  
    // Check if admin exists
    const query = 'SELECT * FROM admin_users WHERE email = ?';
    db.query(query, [email], async (err, results) => {
      if (err) {
        return res.status(500).json({ message: 'Database error' });
      }
  
      if (results.length === 0) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
  
      const admin = results[0];
  
      // Compare password with the hashed password in the database
      const isMatch = await bcrypt.compare(password, admin.password);
  
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
  
      // If credentials are correct, create a JWT token
      const token = jwt.sign({ id: admin.id, isAdmin: true }, process.env.JWT_SECRET, {
        expiresIn: '1h',
      });
  
      res.json({ message: 'Login successful', token, isAdmin: true });
    });
  });



// Get Users
app.get('/api/users', (req, res) => {
    db.query('SELECT * FROM user', (err, results) => {
        if (err) {
            return res.status(500).send('Error fetching users');
        }
        res.json(results);
    });
});

// Delete User
app.delete('/api/users/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM users WHERE id = ?', [id], (err, result) => {
        if (err) {
            return res.status(500).send('Error deleting user');
        }
        res.status(200).send('User deleted successfully');
    });
});

// Get Bills
app.get('/api/bills', (req, res) => {
    db.query('SELECT * FROM bills', (err, results) => {
        if (err) {
            return res.status(500).send('Error fetching bills');
        }
        res.json(results);
    });
});

// Create Bill
app.post('/api/bills', (req, res) => {
    const { userEmail, amount } = req.body;
    db.query('INSERT INTO bills (user_email, amount) VALUES (?, ?)', [userEmail, amount], (err, result) => {
        if (err) {
            return res.status(500).send('Error creating bill');
        }
        res.status(200).send('Bill created successfully');
    });
});

// Delete Bill
app.delete('/api/bills/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM bills WHERE id = ?', [id], (err, result) => {
        if (err) {
            return res.status(500).send('Error deleting bill');
        }
        res.status(200).send('Bill deleted successfully');
    });
});
// Get all summer collection products
app.get('/api/summer-collection', (req, res) => {
    const query = 'SELECT * FROM summer_collection';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching summer collection:', err);
            return res.status(500).send('Server error');
        }
        res.json(results);
    });
});

// Add new product to summer collection
app.post('/api/summer-collection', (req, res) => {
    const { name, price, description, imageUrl, stock } = req.body;
    const query = 'INSERT INTO summer_collection (name, price, description, imageUrl, stock) VALUES (?, ?, ?, ?, ?)';
    db.query(query, [name, price, description, imageUrl, stock], (err, result) => {
        if (err) {
            console.error('Error adding product:', err);
            return res.status(500).send('Server error');
        }
        res.status(201).json({ message: 'Product added successfully', productId: result.insertId });
    });
});

// Update product in summer collection
app.put('/api/summer-collection/:id', (req, res) => {
    const { id } = req.params;
    const { name, price, description, imageUrl, stock } = req.body;
    const query = 'UPDATE summer_collection SET name = ?, price = ?, description = ?, imageUrl = ?, stock = ? WHERE id = ?';
    db.query(query, [name, price, description, imageUrl, stock, id], (err) => {
        if (err) {
            console.error('Error updating product:', err);
            return res.status(500).send('Server error');
        }
        res.json({ message: 'Product updated successfully' });
    });
});

// Delete product from summer collection
app.delete('/api/summer-collection/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM summer_collection WHERE id = ?';
    db.query(query, [id], (err) => {
        if (err) {
            console.error('Error deleting product:', err);
            return res.status(500).send('Server error');
        }
        res.json({ message: 'Product deleted successfully' });
    });
});
app.get('/api/autumn-collection', (req, res) => {
    db.query('SELECT * FROM products', (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});

app.post('/api/autumn-collection', (req, res) => {
    const { name, price, description, imageUrl, stock } = req.body;
    const query = 'INSERT INTO products (name, price, description, imageUrl, stock) VALUES (?, ?, ?, ?, ?)';
    db.query(query, [name, price, description, imageUrl, stock], (err, result) => {
        if (err) return res.status(500).send(err);
        res.status(201).json({ id: result.insertId, ...req.body });
    });
});

app.put('/api/autumn-collection/:id', (req, res) => {
    const { id } = req.params;
    const { name, price, description, imageUrl, stock } = req.body;
    const query = 'UPDATE products SET name = ?, price = ?, description = ?, imageUrl = ?, stock = ? WHERE id = ?';
    db.query(query, [name, price, description, imageUrl, stock, id], (err) => {
        if (err) return res.status(500).send(err);
        res.sendStatus(204);
    });
});

app.delete('/api/autumn-collection/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM products WHERE id = ?';
    db.query(query, [id], (err) => {
        if (err) return res.status(500).send(err);
        res.sendStatus(204);
    });
});
// Get all products
app.get('/api/winter-collection', (req, res) => {
    const query = 'SELECT * FROM winter_collection';
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

// Add a new product
app.post('/api/winter-collection', (req, res) => {
    const { name, price, description, imageUrl, stock } = req.body;
    const query = 'INSERT INTO winter_collection (name, price, description, imageUrl, stock) VALUES (?, ?, ?, ?, ?)';
    db.query(query, [name, price, description, imageUrl, stock], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ id: results.insertId });
    });
});

// Update a product
app.put('/api/winter-collection/:id', (req, res) => {
    const { id } = req.params;
    const { name, price, description, imageUrl, stock } = req.body;
    const query = 'UPDATE winter_collection SET name = ?, price = ?, description = ?, imageUrl = ?, stock = ? WHERE id = ?';
    db.query(query, [name, price, description, imageUrl, stock, id], (err) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Product updated successfully' });
    });
});

// Delete a product
app.delete('/api/winter-collection/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM winter_collection WHERE id = ?';
    db.query(query, [id], (err) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Product deleted successfully' });
    });
});
// GET all products in men's fashion
app.get('/api/mens-fashion', (req, res) => {
    const sql = 'SELECT * FROM mens_fashion';
    db.query(sql, (err, result) => {
        if (err) return res.status(500).send(err);
        res.json(result);
    });
});

// GET a single product by ID
app.get('/api/mens-fashion/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'SELECT * FROM mens_fashion WHERE id = ?';
    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).send(err);
        if (result.length === 0) return res.status(404).send('Product not found');
        res.json(result[0]);
    });
});

// POST (Add) a new product
app.post('/api/mens-fashion', (req, res) => {
    const { name, price, description, imageUrl, stock } = req.body;
    const sql = 'INSERT INTO mens_fashion (name, price, description, imageUrl, stock) VALUES (?, ?, ?, ?, ?)';
    db.query(sql, [name, price, description, imageUrl, stock], (err, result) => {
        if (err) return res.status(500).send(err);
        res.json({ id: result.insertId, name, price, description, imageUrl, stock });
    });
});

// PUT (Edit) a product
app.put('/api/mens-fashion/:id', (req, res) => {
    const { id } = req.params;
    const { name, price, description, imageUrl, stock } = req.body;
    const sql = 'UPDATE mens_fashion SET name = ?, price = ?, description = ?, imageUrl = ?, stock = ? WHERE id = ?';
    db.query(sql, [name, price, description, imageUrl, stock, id], (err) => {
        if (err) return res.status(500).send(err);
        res.send('Product updated successfully');
    });
});

// DELETE a product
app.delete('/api/mens-fashion/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM mens_fashion WHERE id = ?';
    db.query(sql, [id], (err) => {
        if (err) return res.status(500).send(err);
        res.send('Product deleted successfully');
    });
});
// Get all women's fashion products
app.get('/api/womens-fashion', (req, res) => {
    const query = 'SELECT * FROM womens_fashion';
    db.query(query, (err, results) => {
      if (err) return res.status(500).send(err);
      res.json(results);
    });
  });
  // Add a new product
app.post('/api/womens-fashion', (req, res) => {
    const { name, price, description, imageUrl, stock } = req.body;
    const query = 'INSERT INTO womens_fashion (name, price, description, imageUrl, stock) VALUES (?, ?, ?, ?, ?)';
    db.query(query, [name, price, description, imageUrl, stock], (err, result) => {
      if (err) return res.status(500).send(err);
      res.json({ message: 'Product added', id: result.insertId });
    });
  });
  // Edit a product
app.put('/api/womens-fashion/:id', (req, res) => {
    const { id } = req.params;
    const { name, price, description, imageUrl, stock } = req.body;
    const query = 'UPDATE womens_fashion SET name = ?, price = ?, description = ?, imageUrl = ?, stock = ? WHERE id = ?';
    db.query(query, [name, price, description, imageUrl, stock, id], (err) => {
      if (err) return res.status(500).send(err);
      res.json({ message: 'Product updated' });
    });
  });
  // Delete a product
app.delete('/api/womens-fashion/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM womens_fashion WHERE id = ?';
    db.query(query, [id], (err) => {
      if (err) return res.status(500).send(err);
      res.json({ message: 'Product deleted' });
    });
  });
  
// Sample API endpoint to get users
app.get('/api/users', (req, res) => {
    db.query('SELECT * FROM users', (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});


// Sample API endpoint to get bills
app.get('/api/bills', (req, res) => {
    db.query('SELECT * FROM bills', (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});
// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


