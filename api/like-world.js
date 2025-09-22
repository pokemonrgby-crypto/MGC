import { getDbPool } from './db.js';
import jwt from 'jsonwebtoken';

const jwtSecret = process.env.JWT_SECRET;

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }
    
    try {
        // '좋아요'는 로그인한 사용자만 누를 수 있도록 인증합니다.
        const token = req.headers.authorization.split(' ')[1];
        jwt.verify(token, jwtSecret);

        const { worldId } = req.body;
        if (!worldId) {
            return res.status(400).json({ message: '월드 ID가 필요합니다.' });
        }

        const pool = getDbPool();
        // 'likes' 값을 1 증가시키고, 업데이트된 값을 반환받습니다.
        const result = await pool.query(
            'UPDATE worlds SET likes = likes + 1 WHERE id = $1 RETURNING likes',
            [worldId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: '해당 세계관을 찾을 수 없습니다.' });
        }

        return res.status(200).json({ newLikes: result.rows[0].likes });

    } catch (error) {
        console.error('좋아요 처리 실패:', error);
        return res.status(500).json({ message: '좋아요 처리 중 오류가 발생했습니다.' });
    }
}
