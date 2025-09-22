import pg from 'pg';
const { Pool } = pg;

// Vercel 환경 변수인 'POSTGRES_URL'을 읽어옵니다.
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: {
    rejectUnauthorized: false // Vercel에서 Neon DB에 연결하기 위한 필수 옵션
  }
});

// 다른 파일에서 import { pool } 로 불러올 수 있도록 export 합니다.
export { pool };
