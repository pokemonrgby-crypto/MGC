import { pool } from './db.js';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { nickname, password } = req.body;

    if (!nickname || !password || password.length < 6) {
        return res.status(400).json({ message: '닉네임과 6자 이상의 비밀번호를 모두 입력해주세요.' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await pool.query(
            'INSERT INTO users (nickname, password_hash) VALUES ($1, $2) RETURNING id',
            [nickname, hashedPassword]
        );
        
        console.log(`새로운 사용자 등록: ${nickname}, ID: ${result.rows[0].id}`);
        return res.status(201).json({ message: '회원가입이 성공적으로 완료되었습니다.' });

    } catch (error) {
        console.error(error);
        if (error.code === '23505') {
            return res.status(409).json({ message: '이미 사용 중인 닉네임입니다.' });
        }
        return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
}
