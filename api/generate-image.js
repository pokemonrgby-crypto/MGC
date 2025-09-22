import { GoogleGenerativeAI } from '@google/generative-ai';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
  try {
    const { prompt, userApiKey } = req.body || {};
    if (!prompt || !userApiKey) {
      return res.status(400).json({ message: 'prompt와 userApiKey가 필요합니다.' });
    }

    const genAI = new GoogleGenerativeAI(userApiKey);

    // ★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★
    // 공식 문서에 명시된 정확한 모델 'gemini-2.5-flash-image-preview'로 변경합니다.
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-image-preview' });
    // ★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★

    const result = await model.generateContent(prompt);
    const imgBase64 = result?.response?.candidates?.[0]?.content?.parts?.[0]?.inline_data?.data;

    if (!imgBase64) {
      const failureReason = result?.response?.promptFeedback || 'Gemini가 이미지 데이터를 반환하지 않았습니다.';
      console.error('이미지 생성 실패 원인:', failureReason);
      return res.status(500).json({ message: '이미지 생성 실패', error: JSON.stringify(failureReason) });
    }

    // base64 데이터를 Data URL 형태로 만들어 바로 반환합니다.
    const imageUrl = `data:image/png;base64,${imgBase64}`;
    return res.status(200).json({ imageUrl: imageUrl });

  } catch (err) {
    console.error('[generate-image] FATAL ERROR:', err);
    const errorMessage = err.details || String(err?.message || err);
    return res.status(500).json({
      message: '이미지 생성 API 호출 중 심각한 오류가 발생했습니다.',
      error: errorMessage
    });
  }
}
