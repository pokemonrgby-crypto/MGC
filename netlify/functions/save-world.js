// 이 코드는 서버(Netlify)에서 실행됩니다.
const { pool } = require('./db');
const jwt = require('jsonwebtoken');

const jwtSecret = process.env.JWT_SECRET;

exports.handler = async function(event, context) {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        // 1. 사용자 인증
        const token = event.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, jwtSecret);
        const userId = decoded.userId;

        // 2. 생성 쿨타임 확인 (로직은 동일)
        const userResult = await pool.query('SELECT last_world_creation FROM users WHERE id = $1', [userId]);
        const lastCreation = userResult.rows[0].last_world_creation;

        if (lastCreation) {
            const now = new Date();
            const last = new Date(lastCreation);
            last.setHours(0, 0, 0, 0); 
            now.setHours(0, 0, 0, 0);
            if (now <= last) {
                 return { statusCode: 429, body: JSON.stringify({ message: '세계관은 하루에 한 번만 생성할 수 있습니다.' }) };
            }
        }
        
        // 3. (중요) 클라이언트가 생성한 세계관 데이터를 받음
        const { worldData } = JSON.parse(event.body);
        if (!worldData || !worldData.name || !worldData.description) {
            return { statusCode: 400, body: JSON.stringify({ message: '올바른 세계관 데이터가 아닙니다.' }) };
        }

        // 4. DB에 세계관 저장
        const newWorld = await pool.query(
            `INSERT INTO worlds (name, description, landmarks, organizations, npcs, created_by_user_id)
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [worldData.name, worldData.description, JSON.stringify(worldData.landmarks), JSON.stringify(worldData.organizations), JSON.stringify(worldData.npcs), userId]
        );
        
        // 5. 사용자 생성 시간 업데이트
        await pool.query('UPDATE users SET last_world_creation = CURRENT_TIMESTAMP WHERE id = $1', [userId]);

        return {
            statusCode: 201,
            body: JSON.stringify({ message: '새로운 세계가 성공적으로 저장되었습니다!', world: newWorld.rows[0] })
        };

    } catch (error) {
        console.error(error);
        if (error.name === 'JsonWebTokenError') {
            return { statusCode: 401, body: JSON.stringify({ message: '인증에 실패했습니다.' }) };
        }
        return { statusCode: 500, body: JSON.stringify({ message: '세계관 저장 중 오류가 발생했습니다.' }) };
    }
};
