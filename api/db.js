import pg from 'pg';
const { Pool } = pg;

let pool;

export function getDbPool() {
  if (!pool) {
    console.log('Creating new database connection pool.');
    const connectionString = process.env.POSTGRES_URL;
    if (!connectionString) {
      throw new Error("FATAL ERROR: POSTGRES_URL environment variable is not set.");
    }

    pool = new Pool({
      connectionString,
      ssl: {
        rejectUnauthorized: false,
      },
    });
  }
  return pool;
}
