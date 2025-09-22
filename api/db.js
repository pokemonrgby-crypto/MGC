// 이 코드는 서버에서 실행됩니다.
const { Pool } = require('pg');

// Vercel 환경 변수인 'POSTGRES_URL'을 사용하도록 수정합니다.
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL, // ★★★ 바로 이 부분입니다! ★★★
});

module.exports = { pool };
