import { getDbPool } from './db.js';
import jwt from 'jsonwebtoken';

const jwtSecret = process.env.JWT_SECRET;

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }
    
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, jwtSecret);
        const userId = decoded.userId;

        // (쿨타임 확인 로직 추가)
        const pool = getDbPool(); // ★★★ 요청이 들어온 후에야 DB 연결을 만듭니다.
        const userResult = await pool.query('SELECT last_world_creation FROM users WHERE id = $1', [userId]);
        if (userResult.rows.length > 0) {
            const lastCreation = userResult.rows[0].last_world_creation;
            if (lastCreation) {
                const now = new Date();
                const last = new Date(lastCreation);
                if (now.toDateString() === last.toDateString()) {
                    return res.status(429).json({ message: '세계관은 하루에 한 번만 생성할 수 있습니다.' });
                }
            }
        }
        
        const { worldData, imageUrl } = req.body;
        if (!worldData || !worldData.name) {
            return res.status(400).json({ message: '올바른 세계관 데이터가 아닙니다.' });
        }

        const newWorld = await pool.query(
            `INSERT INTO worlds (name, description, landmarks, organizations, npcs, image_url, created_by_user_id)
             VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
            [worldData.name, worldData.description, JSON.stringify(worldData.landmarks), JSON.stringify(worldData.organizations), JSON.stringify(worldData.npcs), imageUrl, userId]
        );
        
        await pool.query('UPDATE users SET last_world_creation = CURRENT_TIMESTAMP WHERE id = $1', [userId]);

        return res.status(201).json({ message: '새로운 세계가 성공적으로 저장되었습니다!', world: newWorld.rows[0] });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: '세계관 저장 중 오류가 발생했습니다.' });
    }
}
