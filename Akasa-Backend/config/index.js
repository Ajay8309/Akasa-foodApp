require("dotenv").config();
const { Pool } = require("pg"); 

// Use database credentials directly from environment variables
const connectionString = `postgresql://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_HOST}:${process.env.POSTGRES_PORT}/${process.env.POSTGRES_DB}`
    || 'postgresql://postgres:9738@database:5432/new?sslmode=disable';

console.log("connectionString:", connectionString);

const pool = new Pool({
    connectionString,
    rejectUnauthorized: false,  // Set this properly if using SSL
});

// Test the connection and log success or error
pool.connect((err, client, release) => {
    if (err) {
        console.error('Error connecting to the database:', err.stack);
    } else {
        console.log('Connected to the database successfully');
        release();  // Release the client after successful connection
    }
});

module.exports = {
    query: (text, params) => pool.query(text, params),
    end: () => pool.end(),
};
