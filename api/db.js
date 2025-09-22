import pg from 'pg';
const { Pool } = pg;

// Vercel 환경 변수를 못 읽어올 경우를 대비해, 빈 값으로라도 초기화합니다.
const connectionString = process.env.POSTGRES_URL || '';

// 만약 connectionString을 못 불러왔다면, 더 명확한 에러를 발생시킵니다.
if (!connectionString) {
  console.error("치명적 오류: POSTGRES_URL 환경 변수가 설정되지 않았습니다.");
  // process.exit(1); // 실제 운영에서는 프로세스를 종료할 수 있습니다.
}

const pool = new Pool({
  connectionString: connectionString,
  ssl: {
    // Vercel에서 외부 데이터베이스(Neon)에 연결하기 위한 필수 보안 옵션입니다.
    rejectUnauthorized: false 
  }
});

// 다른 파일에서 import { pool } 로 불러올 수 있도록 export 합니다.
export { pool };
