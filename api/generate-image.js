const { GoogleGenerativeAI } = require('@google/generative-ai');
const fetch = require('node-fetch');
const FormData = require('form-data');

// 서버용 키가 아닌, imgbb 업로드 키만 사용합니다.
const IMGBB_API_KEY = process.env.IMGBB_API_KEY;

exports.handler = async function(event, context) {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        // 1. (중요) 클라이언트로부터 프롬프트와 '사용자의 API 키'를 받습니다.
        const { prompt, userApiKey } = JSON.parse(event.body);
        if (!prompt || !userApiKey) {
            return { statusCode: 400, body: JSON.stringify({ message: '프롬프트와 API 키가 모두 필요합니다.' }) };
        }

        // 2. 사용자의 키로 Google AI 객체를 생성합니다.
        const genAI = new GoogleGenerativeAI(userApiKey);
        
        // 3. Google의 Imagen 모델로 이미지 생성을 요청합니다.
        const model = genAI.getGenerativeModel({ model: "imagen-2" });
        const imageResult = await model.generateContent([prompt]);
        
        // Google API의 응답 구조에 따라 이미지 데이터(base64)를 추출합니다.
        // 이 부분은 Google의 공식 응답 형식을 기반으로 합니다.
        const base64ImageData = imageResult.response.candidates[0].content.parts[0].inlineData.data;

        // 4. 생성된 이미지를 imgbb에 업로드합니다.
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
        
        // 5. 최종 이미지 URL을 클라이언트에 돌려줍니다.
        return {
            statusCode: 200,
            body: JSON.stringify({ imageUrl: imgbbData.data.url })
        };

    } catch (error) {
        console.error('이미지 생성 또는 업로드 실패:', error);
        return { statusCode: 500, body: JSON.stringify({ message: `이미지 생성 중 오류가 발생했습니다: ${error.message}` }) };
    }
};
