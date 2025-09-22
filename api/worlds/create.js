import { getDbPool } from '../db.js';
import jwt from 'jsonwebtoken';
import fs from 'fs/promises';
import path from 'path';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { nowKST, isSameKSTDate } from '../utils/kst.js';
import { pickModels } from '../utils/modelPool.js';

const jwtSecret = process.env.JWT_SECRET;

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method Not Allowed' });

  try {
    // 1) 인증
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: '로그인이 필요합니다.' });
    const { userId } = jwt.verify(token, jwtSecret);

    // 2) 입력
    const { keyword, userApiKey } = req.body || {};
    if (!userApiKey) return res.status(400).json({ message: '브라우저에 저장된 Gemini API 키가 필요합니다.' });

    // 3) 1일 1회(KST 자정 리셋) 확인 (주석 처리됨)
    const pool = getDbPool();
    
    // 4) 프롬프트 파일 읽기
    const promptPath = path.join(process.cwd(), 'prompts', 'world_generate.md');
    const systemMd = await fs.readFile(promptPath, 'utf8');
    const prompt = systemMd.replace('{{KEYWORD}}', String(keyword ?? '').trim());

    // 5) 텍스트 모델 호출
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

    // 6) 이미지 생성
    const proto = req.headers['x-forwarded-proto'] || 'https';
    const host = req.headers.host;
    const imgRes = await fetch(`${proto}://${host}/api/generate-image`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: `Concept art for a UI card, a symbolic landscape of a fantasy world named "${world.name}". vibrant, epic, 1:1 aspect ratio.`,
        userApiKey
      })
    });
    const imgJson = await imgRes.json();

    // 이미지 생성 실패 시, 받은 에러 메시지를 포함하여 요청을 중단하고 클라이언트에 알립니다.
    if (!imgRes.ok) {
        console.error('이미지 생성 실패:', imgJson.error);
        return res.status(500).json({ 
            message: `세계관 텍스트는 생성되었으나, 이미지 생성에 실패했습니다.`,
            error: imgJson.error || '알 수 없는 이미지 생성 오류'
        });
    }
    const imageUrl = imgJson.imageUrl;

    // 7) DB 저장
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
        imageUrl,
        userId
      ]
    );

    await pool.query('UPDATE users SET last_world_creation = NOW() WHERE id = $1', [userId]);

    return res.status(201).json({ world: insert.rows[0] });
  } catch (err) {
    console.error('[worlds/create] error', err);
    // 이제 클라이언트는 더 구체적인 에러 메시지를 받게 됩니다.
    return res.status(500).json({ message: '세계관 생성 중 오류가 발생했어.', error: err.message });
  }
}
