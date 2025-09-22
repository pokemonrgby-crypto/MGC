import { navigateTo } from './router.js';
import { handleRegisterSubmit, handleLoginSubmit, handleLogout } from './auth.js';
import { saveApiKey, getApiKey } from './apiKey.js'; // apiKey.js에서 함수 import
import { saveWorld } from './api.js'; 

// 페이지가 로드될 때, 저장된 API 키가 있으면 입력창에 표시
function displayApiKey() {
    const apiKeyInput = document.getElementById('api-key-input');
    if (apiKeyInput) {
        const storedKey = getApiKey();
        if (storedKey) {
            apiKeyInput.value = storedKey;
        }
    }
}

// API 키 저장 로직
function handleSaveApiKey() {
    const apiKeyInput = document.getElementById('api-key-input');
    const messageDiv = document.getElementById('api-key-message');

    if (apiKeyInput && apiKeyInput.value) {
        saveApiKey(apiKeyInput.value);
        messageDiv.textContent = 'API 키가 성공적으로 저장되었습니다.';
        messageDiv.className = 'message-area success';
        messageDiv.style.display = 'block';
    } else {
        messageDiv.textContent = 'API 키를 입력해주세요.';
        messageDiv.className = 'message-area error';
        messageDiv.style.display = 'block';
    }
    // 2초 후에 메시지 숨기기
    setTimeout(() => { messageDiv.style.display = 'none'; }, 2000);
}


// --- 기존 이벤트 리스너들 ---

// 폼 제출 이벤트 리스너
document.addEventListener('submit', (event) => {
    if (event.target.id === 'register-form') {
        handleRegisterSubmit(event);
    }
    if (event.target.id === 'login-form') {
        handleLoginSubmit(event);
    }
});

// 클릭 이벤트 리스너
document.addEventListener('click', (event) => {
    if (event.target.id === 'logout-button') {
        handleLogout();
    }
    // API 키 저장 버튼 클릭 이벤트 처리 추가
    if (event.target.id === 'save-api-key-button') {
        handleSaveApiKey();
    }
});

document.addEventListener('click', async (event) => {
    if (event.target.id === 'logout-button') {
        handleLogout();
    }
    if (event.target.id === 'save-api-key-button') {
        handleSaveApiKey();
    }

    // --- 세계관 생성 버튼 로직 (완전 변경) ---
    if (event.target.id === 'generate-world-button') {
        const userApiKey = getApiKey();
        if (!userApiKey) {
            alert('먼저 내 정보 탭에서 Gemini API 키를 저장해주세요!');
            return;
        }

        const keyword = document.getElementById('world-keyword').value;
        if (!keyword) {
            alert('키워드를 입력해주세요!');
            return;
        }

        const statusDiv = document.getElementById('generation-status');
        const button = event.target;
        
        statusDiv.innerHTML = '<div class="spinner"></div><p>사용자 키로 세계를 창조하는 중입니다...</p>';
        statusDiv.className = 'message-area info';
        statusDiv.style.display = 'flex';
        button.disabled = true;

        try {
            // 1. (클라이언트) Google AI 호출
            const genAI = new GoogleGenerativeAI(userApiKey);
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            const prompt = `당신은 TRPG 마스터입니다. 다음 키워드를 기반으로 매력적인 판타지 세계관을 JSON 형식으로 생성해주세요. 키워드: ${keyword}. JSON 형식: {"name": "세계관 이름", "description": "세계관 설명", "landmarks": [{"name": "명소1", "description": "설명"}], "organizations": [{"name": "조직1", "description": "설명"}], "npcs": [{"name": "NPC1", "description": "설명"}]}`;

            const result = await model.generateContent(prompt);
            const responseText = result.response.text();
            const worldData = JSON.parse(responseText.replace(/```json|```/g, '').trim());

            // 2. (서버) 생성된 데이터를 서버에 저장 요청
            statusDiv.innerHTML = '<div class="spinner"></div><p>생성된 세계를 데이터베이스에 기록 중입니다...</p>';
            const saveResult = await saveWorld(worldData);

            if (saveResult.world) {
                statusDiv.style.display = 'none';
                renderWorldCard(saveResult.world);
            } else {
                // 쿨타임 에러 등 서버에서 보낸 메시지 표시
                statusDiv.textContent = saveResult.message;
                statusDiv.className = 'message-area error';
            }
        } catch (error) {
            console.error(error);
            // API 키가 잘못되었거나, AI 응답 파싱 실패 등
            statusDiv.textContent = '세계관 창조에 실패했습니다. API 키가 유효한지 확인해주세요.';
            statusDiv.className = 'message-area error';
        } finally {
            button.disabled = false;
        }
    }
});
