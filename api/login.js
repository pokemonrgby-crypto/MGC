const { pool } = require('./db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Netlify 환경 변수에서 JWT 시크릿 키를 가져옵니다.
// 이 값은 Netlify 사이트 설정에서 직접 추가해주셔야 합니다.
const jwtSecret = process.env.JWT_SECRET;

exports.handler = async function(event, context) {
    const { nickname, password } = JSON.parse(event.body);

    if (!nickname || !password) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: '닉네임과 비밀번호를 모두 입력해주세요.' })
        };
    }
    
    // JWT_SECRET이 설정되지 않았다면 에러를 반환합니다.
    if (!jwtSecret) {
        console.error('JWT_SECRET이 설정되지 않았습니다.');
        return {
            statusCode: 500,
            body: JSON.stringify({ message: '서버 설정 오류가 발생했습니다.' })
        };
    }

    try {
        // 1. 닉네임으로 사용자 정보 조회 (SQL 쿼리 사용)
        const result = await pool.query('SELECT * FROM users WHERE nickname = $1', [nickname]);
        const user = result.rows[0];
        
        if (!user) {
            return { statusCode: 401, body: JSON.stringify({ message: '닉네임 또는 비밀번호가 올바르지 않습니다.' }) };
        }

        // 2. (중요) 암호화된 비밀번호 비교
        const isPasswordMatch = await bcrypt.compare(password, user.password_hash);
        if (!isPasswordMatch) {
            return { statusCode: 401, body: JSON.stringify({ message: '닉네임 또는 비밀번호가 올바르지 않습니다.' }) };
        }

        // 3. (중요) 로그인 성공 시, JWT 생성
        const token = jwt.sign(
            { userId: user.id, nickname: user.nickname },
            jwtSecret,
            { expiresIn: '7d' }
        );

        console.log(`${nickname} 님이 로그인했습니다.`);
        return {
            statusCode: 200,
            body: JSON.stringify({ message: '로그인 성공!', token: token })
        };

    } catch (error) {
        console.error(error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: '서버 오류가 발생했습니다.' })
        };
    }
};
