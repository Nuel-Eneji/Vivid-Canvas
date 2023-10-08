// server.js
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

// Replace 'your-secret-key' with your actual secret key
const secretKey = 'your-secret-key';

// Your database (for simplicity, we'll use an in-memory array)
const users = [];

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});




// User registration
app.post('/register', async (req, res) => {
    const { username, password } = req.body;
  
    // Check if the user already exists
    if (users.some((user) => user.username === username)) {
      return res.status(400).json({ error: 'User already exists' });
    }
  
    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
  
    // Save the user to the database
    users.push({ username, password: hashedPassword });
  
    res.status(201).json({ message: 'User registered successfully' });
  });

  



// User login
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
  
    // Find the user in the database
    const user = users.find((user) => user.username === username);
  
    if (!user) {
      return res.status(401).json({ error: 'Authentication failed' });
    }
  
    // Compare the provided password with the hashed password
    const passwordMatch = await bcrypt.compare(password, user.password);
  
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Authentication failed' });
    }
  
    // Generate a JWT token
    const token = jwt.sign({ username }, secretKey, { expiresIn: '1h' });
  
    res.json({ message: 'Login successful', token });
  });
  