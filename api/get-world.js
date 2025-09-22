import { getDbPool } from './db.js';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        const { id } = req.query; // URL에서 id를 추출 (예: /api/get-world?id=123)
        if (!id) {
            return res.status(400).json({ message: 'World ID is required.' });
        }

        const pool = getDbPool();
        const result = await pool.query(`
            SELECT 
                w.*, 
                u.nickname as creator_nickname 
            FROM 
                worlds w 
            LEFT JOIN 
                users u ON w.created_by_user_id = u.id 
            WHERE 
                w.id = $1
        `, [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'World not found.' });
        }

        return res.status(200).json({ world: result.rows[0] });

    } catch (error) {
        console.error('단일 세계관 조회 실패:', error);
        return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
}
