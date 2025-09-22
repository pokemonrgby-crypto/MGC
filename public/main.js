import { navigateTo } from './router.js';
import { handleRegisterSubmit, handleLoginSubmit, handleLogout } from './auth.js';
import { saveApiKey, getApiKey } from './apiKey.js';
import { saveWorld, generateImage } from './api.js'; // generateImage 추가

const { GoogleGenerativeAI } = window;

// --- Helper Functions ---
function displayApiKey() { /* ... 기존과 동일 ... */ }
function handleSaveApiKey() { /* ... 기존과 동일 ... */ }

function renderWorldCard(world) {
    const container = document.getElementById('world-card-container');
    if (!container || !world) return;
    const landmarksList = world.landmarks.map(l => `<li><strong>${l.name}</strong>: ${l.description}</li>`).join('');
    
    // 이미지 URL이 있으면 이미지 태그 추가
    const imageHTML = world.image_url ? `<img src="${world.image_url}" alt="${world.name} 대표 이미지" class="world-image">` : '';

    container.innerHTML = `
        <div class="world-card">
            ${imageHTML}
            <h2>${world.name}</h2>
            <p class="world-description">${world.description}</p>
            <h3>주요 명소</h3>
            <ul>${landmarksList}</ul>
        </div>
    `;
}

// --- Event Listeners ---
document.addEventListener('submit', (event) => {
    if (event.target.id === 'register-form') { handleRegisterSubmit(event); }
    if (event.target.id === 'login-form') { handleLoginSubmit(event); }
});

document.addEventListener('click', async (event) => {
    // 버튼 클릭 이벤트 통합
    if (event.target.id === 'logout-button') { handleLogout(); }
    if (event.target.id === 'save-api-key-button') { handleSaveApiKey(); }

    // 세계관 생성 버튼 로직
    if (event.target.id === 'generate-world-button') {
        const userApiKey = getApiKey();
        if (!userApiKey) { alert('먼저 내 정보 탭에서 Gemini API 키를 저장해주세요!'); return; }
        const keyword = document.getElementById('world-keyword').value;
        if (!keyword) { alert('키워드를 입력해주세요!'); return; }

        const statusDiv = document.getElementById('generation-status');
        const button = event.target;
        
        statusDiv.innerHTML = '<div class="spinner"></div><p>세계관 정보를 생성 중입니다...</p>';
        statusDiv.className = 'message-area info';
        statusDiv.style.display = 'flex';
        button.disabled = true;

        try {
            // 1. 텍스트 정보 생성 (Client-side)
            const response = await fetch('/prompts/world-prompt.txt');
            if (!response.ok) throw new Error('프롬프트 파일 로드 실패');
            const promptTemplate = await response.text();
            
            const genAI = new GoogleGenerativeAI(userApiKey);
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            const finalPrompt = promptTemplate.replace('{INPUT_KEYWORD}', keyword);

            const result = await model.generateContent(finalPrompt);
            const responseText = result.response.text();
            const worldData = JSON.parse(responseText.replace(/```json|```/g, '').trim());

            // 2. 이미지 생성 (Server-side)
            statusDiv.innerHTML = '<div class="spinner"></div><p>세계관 대표 이미지를 생성 중입니다...</p>';
            const imageResult = await generateImage(worldData.imagePrompt);
            if (!imageResult.imageUrl) throw new Error('이미지 생성에 실패했습니다.');
            
            // 3. 모든 정보 서버에 저장 (Server-side)
            statusDiv.innerHTML = '<div class="spinner"></div><p>생성된 세계를 기록 중입니다...</p>';
            const saveResult = await saveWorld(worldData, imageResult.imageUrl);

            if (saveResult.world) {
                statusDiv.style.display = 'none';
                renderWorldCard(saveResult.world);
            } else {
                statusDiv.textContent = saveResult.message;
                statusDiv.className = 'message-area error';
            }
        } catch (error) {
            console.error(error);
            statusDiv.textContent = '세계관 창조에 실패했습니다: ' + error.message;
            statusDiv.className = 'message-area error';
        } finally {
            button.disabled = false;
        }
    }
});

// --- Initial Load ---
document.addEventListener('DOMContentLoaded', () => {
    // MutationObserver를 이용해 동적으로 생성된 UI에도 API 키 표시
    const observer = new MutationObserver(() => {
        displayApiKey();
    });
    observer.observe(document.getElementById('app'), { childList: true, subtree: true });
});
