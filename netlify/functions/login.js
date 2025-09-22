// 이 코드는 서버(Netlify)에서 실행됩니다.
// const { db } = require('./db.js'); // DB 연결 (나중에 구현)
// const bcrypt = require('bcryptjs'); // 비밀번호 암호화 라이브러리
// const jwt = require('jsonwebtoken'); // JWT 라이브러리

exports.handler = async function(event, context) {
    // 1. 프론트엔드에서 보낸 데이터 받기
    const { nickname, password } = JSON.parse(event.body);

    // 2. 입력값 검증
    if (!nickname || !password) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: '닉네임과 비밀번호를 모두 입력해주세요.' })
        };
    }

    try {
        // 3. (나중에 DB 구현 후) 데이터베이스에서 사용자 정보 조회
        // const user = await db.query('SELECT * FROM users WHERE nickname = $1', [nickname]);
        // if (!user) { throw new Error('존재하지 않는 닉네임입니다.'); }

        // 4. (나중에 DB 구현 후) 비밀번호 일치 여부 확인
        // const isPasswordMatch = await bcrypt.compare(password, user.password_hash);
        // if (!isPasswordMatch) { throw new Error('비밀번호가 일치하지 않습니다.'); }

        // 5. (중요) 로그인 성공 시, JWT(토큰) 생성
        // 지금은 실제 라이브러리 대신 간단한 형태로 토큰을 만듭니다.
        // 실제 운영 시에는 반드시 jwt 라이브러리를 사용해야 합니다.
        // const token = jwt.sign({ userId: user.id }, 'YOUR_SECRET_KEY', { expiresIn: '1h' });
        const token = `fake-jwt-token-for-${nickname}`; // 임시 토큰

        console.log(`${nickname} 님이 로그인했습니다.`);

        return {
            statusCode: 200,
            body: JSON.stringify({ message: '로그인 성공!', token: token })
        };

    } catch (error) {
        console.error(error);
        return {
            statusCode: 401, // 401: Unauthorized
            body: JSON.stringify({ message: error.message || '로그인에 실패했습니다.' })
        };
    }
};
