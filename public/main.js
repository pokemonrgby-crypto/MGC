import { navigateTo } from './router.js';
import { handleRegisterSubmit, handleLoginSubmit, handleLogout } from './auth.js';
import { saveApiKey, getApiKey } from './apiKey.js';
import { createWorld, getWorlds, likeWorld } from './api.js';

function renderWorldList(worlds) {
  const container = document.getElementById('world-list-container');
  if (!container) return;
  container.innerHTML = (worlds || []).map(w => `
    <div class="world-card" data-id="${w.id}">
      <img src="${w.image_url || ''}" alt="" class="thumb"/>
      <div class="title">${w.name}</div>
      <div class="intro">${w.description ?? ''}</div>
      <button class="btn-like" data-like="${w.id}">♡ <span class="like-count">${w.likes ?? 0}</span></button>
    </div>
  `).join('') || `<p>아직 생성된 세계가 없어.</p>`;
}

async function refreshWorlds() {
  const { worlds } = await getWorlds();
  renderWorldList(worlds);
}

// 최초 로드
document.addEventListener('DOMContentLoaded', () => {
  refreshWorlds();
});

// 전역 클릭 핸들러
document.addEventListener('click', async (e) => {
  // 1) 세계관 생성
  if (e.target.id === 'generate-world-button') {
    const btn = e.target;
    const status = document.getElementById('generation-status');
    const kw = document.getElementById('world-keyword').value.trim();
    const apiKey = getApiKey();

    status.style.display = 'block';
    status.textContent = '생성 중… (1~2분)';
    btn.disabled = true;

    try {
      const res = await createWorld({ keyword: kw, userApiKey: apiKey });
      if (res?.world) {
        status.textContent = '완료! 목록을 새로고침 했어.';
        await refreshWorlds();
      } else {
        status.textContent = res?.message || '생성 실패';
      }
    } catch (err) {
      console.error(err);
      status.textContent = '네트워크 오류';
    } finally {
      btn.disabled = false;
      setTimeout(() => (status.style.display = 'none'), 2500);
    }
    return;
  }

  // 2) 좋아요
  const likeBtn = e.target.closest('[data-like]');
  if (likeBtn) {
    likeBtn.disabled = true;
    try {
      const worldId = likeBtn.getAttribute('data-like');
      const out = await likeWorld(worldId);
      if (typeof out.newLikes !== 'undefined') {
        likeBtn.querySelector('.like-count').textContent = out.newLikes;
      }
    } finally {
      likeBtn.disabled = false;
    }
  }

  // 3) API 키 저장 (추가된 부분)
  if (e.target.id === 'save-api-key-button') {
    const apiKeyInput = document.getElementById('api-key-input');
    const messageDiv = document.getElementById('api-key-message');
    const apiKey = apiKeyInput.value.trim();

    if (apiKey) {
      saveApiKey(apiKey);
      messageDiv.textContent = 'API 키가 성공적으로 저장되었습니다.';
      messageDiv.className = 'message-area success';
      messageDiv.style.display = 'block';
    } else {
      messageDiv.textContent = 'API 키를 입력해주세요.';
      messageDiv.className = 'message-area error';
      messageDiv.style.display = 'block';
    }

    setTimeout(() => {
        messageDiv.style.display = 'none';
    }, 3000); // 3초 후에 메시지 숨김
  }
});
