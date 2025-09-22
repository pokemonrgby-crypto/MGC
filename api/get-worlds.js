import { getDbPool } from './db.js';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        const pool = getDbPool();
        // 생성된 최신순으로 정렬해서 모든 세계관을 가져옵니다.
        const result = await pool.query('SELECT * FROM worlds ORDER BY created_at DESC');
        
        return res.status(200).json({ worlds: result.rows });

    } catch (error) {
        console.error('세계관 목록 조회 실패:', error);
        return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
}
