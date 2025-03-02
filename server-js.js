const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON body
app.use(express.json());

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Configure CORS - allow specific origins only
const allowedOrigins = ['http://localhost:3000', 'http://127.0.0.1:3000'];
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, etc)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: ['GET'],
  credentials: true
}));

// RESTful API for rolling a single 6-sided die
app.get('/api/roll', (req, res) => {
  // Generate random number between 1 and 6 on the server
  const diceValue = Math.floor(Math.random() * 6) + 1;
  
  // Simulate some processing time
  setTimeout(() => {
    // Return the result as JSON
    res.json({ 
      value: diceValue,
      timestamp: new Date().toISOString()
    });
  }, 200);
});

// Block all other API endpoints
app.all('/api/*', (req, res) => {
  if (req.path !== '/api/roll') {
    res.status(403).json({
      error: 'Access denied. Only single 6-sided die rolls are permitted.'
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API testing page: http://localhost:${PORT}`);
  console.log(`Only single 6-sided die rolls are permitted.`);
});
