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

    // 3) 1일 1회(KST 자정 리셋) 확인
    const pool = getDbPool();
    const ures = await pool.query('SELECT last_world_creation FROM users WHERE id = $1', [userId]);
    const last = ures.rows?.[0]?.last_world_creation;
    if (last && isSameKSTDate(last, nowKST())) {
      return res.status(429).json({ message: '오늘은 이미 세계를 창조했어. 자정(KST) 이후에 다시 시도해줘.' });
    }

    // 4) 프롬프트 파일 읽기 (하드코딩 금지)
    const promptPath = path.join(process.cwd(), 'prompts', 'world_generate.md');
    const systemMd = await fs.readFile(promptPath, 'utf8');
    const prompt = systemMd.replace('{{KEYWORD}}', String(keyword ?? '').trim());

    // 5) 모델 호출 (랜덤+폴백)
    const genAI = new GoogleGenerativeAI(userApiKey);
    const { primary, fallback } = pickModels();
    async function run(modelName) {
      const model = genAI.getGenerativeModel({ model: modelName });
      const res1 = await model.generateContent(prompt + '\n\n[응답은 JSON만]');
      return res1.response.text();
    }
    let text;
    try { text = await run(primary); } catch (_) { text = await run(fallback); }

    let world;
    try { world = JSON.parse(text); }
    catch (e) {
      return res.status(500).json({ message: '모델 응답이 유효 JSON이 아니야.', raw: (text || '').slice(0, 400) });
    }

    // 6) 이미지 생성 (기본: Imagen 3; 업로드는 imgbb 재사용)
    const proto = req.headers['x-forwarded-proto'] || 'https';
    const host = req.headers.host;
    const imgRes = await fetch(`${proto}://${host}/api/generate-image`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: `1:1 world profile illustration of "${world.name}". 한 장의 상징적 전경, UI 카드용.`,
        userApiKey
      })
    });
    const imgJson = await imgRes.json();
    const imageUrl = imgJson?.imageUrl || '';

    // 7) DB 저장(현재 스키마 유지: description/landmarks/organizations/npcs)
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
    return res.status(500).json({ message: '세계관 생성 중 오류가 발생했어.' });
  }
}
