const express = require('express');
const router = express.Router();
const db = require('../config/db'); // Ensure correct path to db config

// Get all summer collections
router.get('/collections', async (req, res) => {
  try {
    const [collections] = await db.query('SELECT * FROM summer_collections');
    res.status(200).json(collections); // Send collections data
  } catch (error) {
    console.error('Error fetching collections:', error);
    res.status(500).json({ message: 'Server error while fetching collections' });
  }
});

// Add a new summer collection
router.post('/collections', async (req, res) => {
  const { name, description, price, imageUrl } = req.body;

  // Basic input validation
  if (!name || !description || !price || !imageUrl) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const result = await db.query(
      'INSERT INTO summer_collections (name, description, price, image_url) VALUES (?, ?, ?, ?)',
      [name, description, price, imageUrl]
    );
    res.status(201).json({ message: 'Collection added successfully' });
  } catch (error) {
    console.error('Error adding collection:', error);
    res.status(500).json({ message: 'Server error while adding collection' });
  }
});

module.exports = router;
