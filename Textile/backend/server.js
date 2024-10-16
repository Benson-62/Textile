const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

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

// Sign Up
app.post('/api/signup', async (req, res) => {
    const { name, email, password } = req.body;

    // Check if user already exists
    db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
        if (err) {
            console.error('Error checking for existing user:', err);
            return res.status(500).json({ message: 'Server error' });
        }
        if (results.length > 0) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // If the user does not exist, insert the new user
        db.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, password], (err, result) => {
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

        const user = results[0];

        // Define admin credentials
        const adminCredentials = {
            'bhavana@gmail.com': '123456', // Replace with your actual admin password
            'aswin@gmail.com': '123456',
            'aadhi@gmail.com': '123456',
            'benson@gmail.com': '123456',
        };

        // Check if the email belongs to an admin and if the password matches
        const isAdmin = Object.keys(adminCredentials).includes(user.email) && adminCredentials[user.email] === password;

        res.status(200).json({ user, isAdmin }); // Return user data and admin status
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

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


