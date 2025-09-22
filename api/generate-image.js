import { GoogleGenerativeAI } from '@google/generative-ai';
import fetch from 'node-fetch';
import FormData from 'form-data';

const IMGBB_API_KEY = process.env.IMGBB_API_KEY; // .env에 필요

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method Not Allowed' });
  try {
    const { prompt, userApiKey } = req.body || {};
    if (!prompt || !userApiKey) return res.status(400).json({ message: 'prompt와 userApiKey가 필요합니다.' });

// (기존 내용과 동일)
    // 현재 SDK에서 안정적인 이미지 생성 모델은 "imagen-3.0-generate"
    const genAI = new GoogleGenerativeAI(userApiKey);
    const model = genAI.getGenerativeModel({ model: 'imagen-3.0-generate' });
    const result = await model.generateContent(prompt); // <- 올바른 함수로 수정
    const imgBase64 = result?.response?.candidates?.[0]?.content?.parts?.[0]?.inline_data?.data;
    if (!imgBase64) return res.status(500).json({ message: '이미지 생성 실패' });
// (기존 내용과 동일)

    if (!IMGBB_API_KEY) {
      // 업로드 키 없으면 data URL 그대로 반환(개발 중 임시)
      return res.status(200).json({ imageUrl: `data:image/png;base64,${imgBase64}` });
    }

    // imgbb 업로드
    const form = new FormData();
    form.append('key', IMGBB_API_KEY);
    form.append('image', imgBase64);

    // [수정] form-data가 생성한 헤더를 포함하여 요청합니다.
    const uploadRes = await fetch('https://api.imgbb.com/1/upload', { 
        method: 'POST', 
        headers: form.getHeaders(), // 이 줄을 추가하세요.
        body: form 
    });
    
    const uploadRes = await fetch('https://api.imgbb.com/1/upload', { method: 'POST', body: form });
    const uploadJson = await uploadRes.json();
    if (!uploadRes.ok) throw new Error(uploadJson?.error?.message || 'imgbb 업로드 실패');
    return res.status(200).json({ imageUrl: uploadJson.data.url });
  } catch (err) {
    console.error('[generate-image] error', err);
    return res.status(500).json({ message: '이미지 생성 오류', error: String(err?.message || err) });
  }
}
