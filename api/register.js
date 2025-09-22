const { pool } = require('./db');
const bcrypt = require('bcryptjs');

exports.handler = async function(event, context) {
    const { nickname, password } = JSON.parse(event.body);

    if (!nickname || !password || password.length < 6) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: '닉네임과 6자 이상의 비밀번호를 모두 입력해주세요.' })
        };
    }

    try {
        // 1. (중요) 비밀번호 암호화
        const hashedPassword = await bcrypt.hash(password, 10);

        // 2. 데이터베이스에 사용자 정보 저장 (SQL 쿼리 사용)
        const result = await pool.query(
            'INSERT INTO users (nickname, password_hash) VALUES ($1, $2) RETURNING id',
            [nickname, hashedPassword]
        );
        
        console.log(`새로운 사용자 등록: ${nickname}, ID: ${result.rows[0].id}`);
        return {
            statusCode: 201,
            body: JSON.stringify({ message: '회원가입이 성공적으로 완료되었습니다.' })
        };

    } catch (error) {
        console.error(error);
        // 닉네임 중복 시 'duplicate key' 오류가 발생합니다.
        if (error.code === '23505') { // Postgres의 unique 제약 조건 위반 코드
            return {
                statusCode: 409,
                body: JSON.stringify({ message: '이미 사용 중인 닉네임입니다.' })
            };
        }
        return {
            statusCode: 500,
            body: JSON.stringify({ message: '서버 오류가 발생했습니다.' })
        };
    }
};
