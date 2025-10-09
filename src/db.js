const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

let pool;
async function connect() {
	if (pool) return pool;

	pool = await mysql.createPool({
		host: process.env.DB_HOST || 'localhost',
		user: process.env.DB_USER || 'root',
		password: process.env.DB_PASSWORD || 'ifsp',
		database: process.env.DB_NAME || 'saude',
		waitForConnections: true,
		connectionLimit: 10,
		queueLimit: 0,
	});

	return pool;
}

module.exports = { connect };
