import { navigateTo } from './router.js';
import { handleRegisterSubmit, handleLoginSubmit, handleLogout } from './auth.js';
import { saveApiKey, getApiKey } from './apiKey.js'; // apiKey.js에서 함수 import

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

// 라우터가 렌더링을 마친 후 API 키를 표시하도록 수정
// (router.js에서 직접 호출하는 대신, 전역 이벤트 등을 사용할 수도 있지만 지금은 간단하게 처리)
document.addEventListener('DOMContentLoaded', () => {
    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            if (mutation.addedNodes.length) {
                displayApiKey();
            }
        }
    });
    observer.observe(document.getElementById('app'), { childList: true, subtree: true });
});
