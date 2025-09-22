import { getDbPool } from '../db.js';
import jwt from 'jsonwebtoken';
import fs from 'fs/promises';
import path from 'path';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { pickModels } from '../utils/modelPool.js';

const jwtSecret = process.env.JWT_SECRET;

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method Not Allowed' });

  try {
    // 1) 인증
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: '로그인이 필요합니다.' });
    const { userId } = jwt.verify(token, jwtSecret);

    // 2) 입력 (imageUrl 추가)
    const { keyword, userApiKey, imageUrl } = req.body || {};
    if (!userApiKey) return res.status(400).json({ message: '브라우저에 저장된 Gemini API 키가 필요합니다.' });
    if (!imageUrl) return res.status(400).json({ message: '이미지 URL이 필요합니다.' });

    const pool = getDbPool();
    
    // 3) 프롬프트 파일 읽기
    const promptPath = path.join(process.cwd(), 'prompts', 'world_generate.md');
    const systemMd = await fs.readFile(promptPath, 'utf8');
    const prompt = systemMd.replace('{{KEYWORD}}', String(keyword ?? '').trim());

    // 4) 텍스트 모델 호출
    const genAI = new GoogleGenerativeAI(userApiKey);
    const { primary, fallback } = pickModels();
    async function run(modelName) {
      const model = genAI.getGenerativeModel({
        model: modelName,
        generationConfig: { responseMimeType: "application/json" },
      });
      const res1 = await model.generateContent(prompt + '\n\n[응답은 JSON만]');
      return res1.response.text();
    }
    
    let text;
    try { text = await run(primary); } catch (_) { text = await run(fallback); }

    let world;
    try {
      const cleanedText = text.replace(/```json\n?([\s\S]*?)\n?```/g, '$1').trim();
      world = JSON.parse(cleanedText); 
    }
    catch (e) {
      return res.status(500).json({ message: '모델 응답이 유효 JSON이 아니야.', raw: (text || '').slice(0, 400) });
    }

    // 5) DB 저장 (이미지 생성 로직 삭제, 전달받은 imageUrl 사용)
    const insert = await pool.query(
      `INSERT INTO worlds (name, description, landmarks, organizations, npcs, image_url, created_by_user_id, created_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7, NOW())
       RETURNING *`,
      [
        world.name,
        world.intro || world.description || '',
        JSON.stringify(world.detail?.sites || []),
        JSON.stringify(world.detail?.orgs  || []),
        JSON.stringify(world.detail?.npcs  || []),
        imageUrl, // 전달받은 URL 사용
        userId
      ]
    );

    await pool.query('UPDATE users SET last_world_creation = NOW() WHERE id = $1', [userId]);

    return res.status(201).json({ world: insert.rows[0] });
  } catch (err) {
    console.error('[worlds/create] error', err);
    return res.status(500).json({ message: '세계관 생성 중 오류가 발생했어.', error: err.message });
  }
}
