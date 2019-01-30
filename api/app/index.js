// Load environment variables
require('dotenv').config();

// Initialize Database
require('./database');

// Load Mailer
require('./mailer');

// Initialize Server
require('./server');
