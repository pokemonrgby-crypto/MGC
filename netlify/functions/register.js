// 이 코드는 서버(Netlify)에서 실행됩니다.

// const { db } = require('./db.js'); // DB 연결 (나중에 구현)
// const bcrypt = require('bcryptjs'); // 비밀번호 암호화 라이브러리

exports.handler = async function(event, context) {
    // 1. 프론트엔드에서 보낸 데이터 받기
    const { nickname, password } = JSON.parse(event.body);

    // 2. 입력값 검증 (닉네임, 비밀번호가 비어있는지 등)
    if (!nickname || !password) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: '닉네임과 비밀번호를 모두 입력해주세요.' })
        };
    }

    // 3. (중요) 비밀번호 암호화
    // const hashedPassword = await bcrypt.hash(password, 10);

    try {
        // 4. 데이터베이스에 사용자 정보 저장 (지금은 DB 연결이 없으므로 성공했다고 가정)
        // await db.query('INSERT INTO users (nickname, password_hash) VALUES ($1, $2)', [nickname, hashedPassword]);
        
        console.log(`새로운 사용자 등록: ${nickname}`);

        return {
            statusCode: 201, // 201: Created
            body: JSON.stringify({ message: '회원가입이 성공적으로 완료되었습니다.' })
        };

    } catch (error) {
        // 닉네임 중복 등 DB 에러 처리
        console.error(error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: '서버 오류가 발생했습니다. 닉네임이 중복될 수 있습니다.' })
        };
    }
};
