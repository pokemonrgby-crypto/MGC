import { GoogleGenerativeAI } from '@google/generative-ai';

// 사용할 모델 목록
const TEXT_MODELS = [
    "gemini-1.5-flash-latest", // 사용 가능한 최신 플래시 모델
    "gemini-pro" // 안정적인 프로 모델
];

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        const { prompt, userApiKey } = req.body;
        if (!prompt || !userApiKey) {
            return res.status(400).json({ message: '프롬프트와 API 키가 모두 필요합니다.' });
        }

        // 랜덤으로 모델 선택
        const selectedModel = TEXT_MODELS[Math.floor(Math.random() * TEXT_MODELS.length)];
        
        const genAI = new GoogleGenerativeAI(userApiKey);
        const model = genAI.getGenerativeModel({ 
            model: selectedModel,
            generationConfig: {
                responseMimeType: "application/json", // 항상 JSON으로 응답받도록 설정
            },
        });

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        
        // JSON 형식인지 한번 더 확인
        JSON.parse(responseText);

        return res.status(200).json({ result: responseText });

    } catch (error) {
        console.error('텍스트 생성 실패:', error);
        // 에러 메시지에 어떤 모델을 사용했는지 포함하여 디버깅 용이하게 함
        return res.status(500).json({ 
            message: `텍스트 생성 중 오류가 발생했습니다. (Model: ${error.model || 'unknown'})`,
            error: error.message 
        });
    }
}
