const { GoogleGenerativeAI } = require('@google/generative-ai');
const fetch = require('node-fetch');
const FormData = require('form-data'); // form-data 라이브러리 추가 필요

const genAI = new GoogleGenerativeAI(process.env.SERVER_GEMINI_API_KEY);
const IMGBB_API_KEY = process.env.IMGBB_API_KEY;

exports.handler = async function(event, context) {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const { prompt } = JSON.parse(event.body);
        if (!prompt) {
            return { statusCode: 400, body: JSON.stringify({ message: '이미지 생성을 위한 프롬프트가 없습니다.' }) };
        }

        // 1. Gemini에게 이미지 생성 요청 (이 부분은 이전과 동일하게 가정)
        // 실제로는 모델 이름과 응답 형식을 정확히 확인해야 합니다.
        const model = genAI.getGenerativeModel({ model: 'imagen-2' }); 
        const result = await model.generateContent(prompt);
        const base64ImageData = result.response.candidates[0].content.parts[0].inlineData.data;

        // 2. imgbb에 이미지 업로드 (FormData 사용)
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
        
        return {
            statusCode: 200,
            body: JSON.stringify({ imageUrl: imgbbData.data.url })
        };

    } catch (error) {
        console.error('이미지 생성 또는 업로드 실패:', error);
        return { statusCode: 500, body: JSON.stringify({ message: '이미지 생성 중 오류가 발생했습니다.' }) };
    }
};
