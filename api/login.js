import { pool } from './db.js'; // 경로 수정
import bcrypt from 'bcryptjs'; // import 방식으로 변경
import jwt from 'jsonwebtoken'; // import 방식으로 변경

const jwtSecret = process.env.JWT_SECRET;

// Vercel이 이해하는 방식으로 함수를 export 합니다.
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { nickname, password } = req.body;

    if (!nickname || !password) {
        return res.status(400).json({ message: '닉네임과 비밀번호를 모두 입력해주세요.' });
    }
    
    if (!jwtSecret) {
        console.error('JWT_SECRET이 설정되지 않았습니다.');
        return res.status(500).json({ message: '서버 설정 오류가 발생했습니다.' });
    }

    try {
        const result = await pool.query('SELECT * FROM users WHERE nickname = $1', [nickname]);
        const user = result.rows[0];
        
        if (!user || !(await bcrypt.compare(password, user.password_hash))) {
            return res.status(401).json({ message: '닉네임 또는 비밀번호가 올바르지 않습니다.' });
        }

        const token = jwt.sign(
            { userId: user.id, nickname: user.nickname },
            jwtSecret,
            { expiresIn: '7d' }
        );

        console.log(`${nickname} 님이 로그인했습니다.`);
        return res.status(200).json({ message: '로그인 성공!', token: token });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
}
