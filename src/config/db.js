import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  
});

pool.on('connect', () => {
  console.log('Connected to PostgreSQL');
});

export const query = (text, params) => pool.query(text, params);
export default pool;