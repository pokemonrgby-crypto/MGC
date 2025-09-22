import { getDbPool } from './db.js'; // getDbPool 함수를 import
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const jwtSecret = process.env.JWT_SECRET;

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { nickname, password } = req.body;

    if (!nickname || !password) {
        return res.status(400).json({ message: '닉네임과 비밀번호를 모두 입력해주세요.' });
    }
    
    try {
        const pool = getDbPool(); // ★★★ 요청이 들어온 후에야 DB 연결을 만듭니다.
        const result = await pool.query('SELECT * FROM users WHERE nickname = $1', [nickname]);
        const user = result.rows[0];
        
        if (!user || !(await bcrypt.compare(password, user.password_hash))) {
            return res.status(401).json({ message: '닉네임 또는 비밀번호가 올바르지 않습니다.' });
        }

        const token = jwt.sign({ userId: user.id, nickname: user.nickname }, jwtSecret, { expiresIn: '7d' });
        return res.status(200).json({ message: '로그인 성공!', token });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
}
