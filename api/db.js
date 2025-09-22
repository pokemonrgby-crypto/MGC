// 이 코드는 서버(Netlify)에서 실행됩니다.
const { Pool } = require('pg');

// Netlify가 자동으로 설정해준 환경 변수를 사용합니다.
const pool = new Pool({
  connectionString: process.env.NETLIFY_DATABASE_URL,
});

module.exports = { pool };
