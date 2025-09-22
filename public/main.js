// --- 상단 import 구문 ---
import { navigateTo } from './router.js';
import { handleRegisterSubmit, handleLoginSubmit, handleLogout } from './auth.js';
import { saveApiKey, getApiKey } from './apiKey.js';
import { saveWorld, generateImage, getWorlds, likeWorld } from './api.js'; // getWorlds, likeWorld 추가

const { GoogleGenerativeAI } = window;


// --- Helper Functions ---
function displayApiKey() { /* ... 기존과 동일 ... */ }
function handleSaveApiKey() { /* ... 기존과 동일 ... */ }

// 세계관 목록을 받아서 HTML로 변환하고 화면에 표시하는 함수
function renderWorldList(worlds) {
    const container = document.getElementById('world-list-container');
    if (!container) return;

    if (worlds.length === 0) {
        container.innerHTML = '<p class="empty-message">아직 창조된 세계가 없습니다. 첫 번째 세계를 만들어보세요!</p>';
        return;
    }

    container.innerHTML = worlds.map(world => `
        <div class="world-card">
            <img src="${world.image_url || 'https://via.placeholder.com/400x200.png?text=No+Image'}" alt="${world.name}" class="world-image">
            <div class="card-content">
                <h3>${world.name}</h3>
                <p>${world.description.substring(0, 100)}...</p>
                <div class="card-footer">
                    <button class="like-button" data-world-id="${world.id}">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                        <span class="like-count">${world.likes}</span>
                    </button>
                    <span class="creator">창조자: ???</span>
                </div>
            </div>
        </div>
    `).join('');
}

// --- 메인 로직 ---

// 1. 페이지가 처음 로드될 때 실행
document.addEventListener('DOMContentLoaded', () => {
    // MutationObserver를 이용해 화면이 바뀔 때마다 적절한 동작을 수행
    const observer = new MutationObserver(async (mutations) => {
        for (const mutation of mutations) {
            if (mutation.addedNodes.length) {
                // '내 정보' 화면이 보이면 API 키를 표시
                if (document.getElementById('api-key-input')) {
                    displayApiKey();
                }
                // '메인' 화면이 보이면 세계관 목록을 불러옴
                if (document.getElementById('world-list-container')) {
                    const data = await getWorlds();
                    if(data.worlds) {
                        renderWorldList(data.worlds);
                    }
                }
            }
        }
    });
    observer.observe(document.getElementById('app'), { childList: true, subtree: true });
});


// 2. 폼 제출 이벤트 처리
document.addEventListener('submit', (event) => { /* ... 기존과 동일 ... */ });


// 3. 클릭 이벤트 처리 (좋아요 기능 추가)
document.addEventListener('click', async (event) => {
    // --- 기존 클릭 이벤트들 ---
    if (event.target.id === 'logout-button') { handleLogout(); }
    if (event.target.id === 'save-api-key-button') { handleSaveApiKey(); }
    if (event.target.id === 'generate-world-button') { /* ... 세계관 생성 로직 ... */ }

    // --- '좋아요' 버튼 클릭 이벤트 ---
    const likeButton = event.target.closest('.like-button');
    if (likeButton) {
        const worldId = likeButton.dataset.worldId;
        likeButton.disabled = true; // 중복 클릭 방지

        try {
            const result = await likeWorld(worldId);
            if (typeof result.newLikes !== 'undefined') {
                const countSpan = likeButton.querySelector('.like-count');
                countSpan.textContent = result.newLikes;
                likeButton.classList.add('liked'); // 색상 변경을 위한 클래스 추가
            }
        } catch (error) {
            console.error('좋아요 실패:', error);
            likeButton.disabled = false; // 실패 시 다시 활성화
        }
    }
});
