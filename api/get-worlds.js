import { getDbPool } from './db.js';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        const pool = getDbPool();
        // worlds 테이블과 users 테이블을 조인하여 작성자 닉네임을 함께 가져옵니다.
        const result = await pool.query(`
            SELECT 
                w.*, 
                u.nickname as creator_nickname 
            FROM 
                worlds w 
            LEFT JOIN 
                users u ON w.created_by_user_id = u.id 
            ORDER BY 
                w.created_at DESC
        `);
        
        return res.status(200).json({ worlds: result.rows });

    } catch (error) {
        console.error('세계관 목록 조회 실패:', error);
        return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
}
