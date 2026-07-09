const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { createClient } = require('@supabase/supabase-js');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Initialize Supabase Admin client
const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn('Supabase URL or Service Role Key is missing. Backend functionality requiring DB access may fail.');
}

const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

// Share supabase client with routers
app.use((req, res, next) => {
  req.supabase = supabase;
  next();
});

// Basic health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'SimpanAja Backend is running.' });
});

// API Routes placeholder
// app.use('/api/inbound', require('./routes/inbound'));
// app.use('/api/outbound', require('./routes/outbound'));
// app.use('/api/inventory', require('./routes/inventory'));

app.listen(PORT, () => {
  console.log(`===================================================`);
  console.log(`   SimpanAja Backend Server running on port ${PORT} `);
  console.log(`   URL: http://localhost:${PORT}                    `);
  console.log(`===================================================`);
});

module.exports = app;