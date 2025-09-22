import { GoogleGenerativeAI } from '@google/generative-ai';
import fetch from 'node-fetch';
import FormData from 'form-data';

const IMGBB_API_KEY = process.env.IMGBB_API_KEY;

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        const { prompt, userApiKey } = req.body;
        if (!prompt || !userApiKey) {
            return res.status(400).json({ message: '프롬프트와 API 키가 모두 필요합니다.' });
        }

        const genAI = new GoogleGenerativeAI(userApiKey);
        const model = genAI.getGenerativeModel({ model: "imagen-2" });
        const imageResult = await model.generateContent([prompt]);
        const base64ImageData = imageResult.response.candidates[0].content.parts[0].inlineData.data;

        const form = new FormData();
        form.append('image', base64ImageData);

        const imgbbResponse = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
            method: 'POST',
            body: form,
        });
        
        if (!imgbbResponse.ok) {
            const errorBody = await imgbbResponse.json();
            throw new Error(`imgbb 업로드 실패: ${errorBody.error.message}`);
        }

        const imgbbData = await imgbbResponse.json();
        return res.status(200).json({ imageUrl: imgbbData.data.url });

    } catch (error) {
        console.error('이미지 생성 또는 업로드 실패:', error);
        return res.status(500).json({ message: `이미지 생성 중 오류가 발생했습니다: ${error.message}` });
    }
}
