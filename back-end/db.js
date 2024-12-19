const mysql = require('mysql2/promise');

// Create a connection pool
const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '01033239589',
  database: 'car_sales',
});

// Test connection
const testConnection = async () => {
  try {
    await db.getConnection(); 
    console.log('Connected to MySQL database.');
  } catch (err) {
    console.error('Error connecting to MySQL database:', err.message);
  }
};

testConnection();

module.exports = db;
