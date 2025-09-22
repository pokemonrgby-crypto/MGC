const { pool } = require('./db');
const jwt = require('jsonwebtoken');

const jwtSecret = process.env.JWT_SECRET;

exports.handler = async function(event, context) {
    // ... (httpMethod, 사용자 인증, 쿨타임 확인 로직은 기존과 동일) ...
    try {
        const token = event.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, jwtSecret);
        const userId = decoded.userId;
        
        // ... (쿨타임 확인 로직) ...

        // 클라이언트가 생성한 세계관 데이터와 이미지 URL을 받음
        const { worldData, imageUrl } = JSON.parse(event.body);
        if (!worldData || !worldData.name || !worldData.description) {
            return { statusCode: 400, body: JSON.stringify({ message: '올바른 세계관 데이터가 아닙니다.' }) };
        }

        // DB에 세계관 저장 (image_url 추가)
        const newWorld = await pool.query(
            `INSERT INTO worlds (name, description, landmarks, organizations, npcs, image_url, created_by_user_id)
             VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
            [worldData.name, worldData.description, JSON.stringify(worldData.landmarks), JSON.stringify(worldData.organizations), JSON.stringify(worldData.npcs), imageUrl, userId]
        );
        
        await pool.query('UPDATE users SET last_world_creation = CURRENT_TIMESTAMP WHERE id = $1', [userId]);

        return {
            statusCode: 201,
            body: JSON.stringify({ message: '새로운 세계가 성공적으로 저장되었습니다!', world: newWorld.rows[0] })
        };

    } catch (error) {
        // ... (에러 처리 로직은 기존과 동일) ...
    }
};
