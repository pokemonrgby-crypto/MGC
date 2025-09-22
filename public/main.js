import { navigateTo } from './router.js';
import { handleRegisterSubmit, handleLoginSubmit, handleLogout } from './auth.js';
import { saveApiKey, getApiKey } from './apiKey.js';
import { createWorld, likeWorld } from './api.js';
import { refreshWorlds } from './ui.js';

document.addEventListener('DOMContentLoaded', () => {
});

document.addEventListener('click', async (e) => {
  // 1) 세계관 생성
  if (e.target.id === 'generate-world-button') {
    const btn = e.target;
    const status = document.getElementById('generation-status');
    const kw = document.getElementById('world-keyword').value.trim();
    const apiKey = getApiKey();

    if (!apiKey) {
        status.style.display = 'block';
        status.textContent = 'API 키를 먼저 저장해주세요.';
        setTimeout(() => (status.style.display = 'none'), 3000);
        return;
    }

    status.style.display = 'block';
    status.textContent = '생성 중… (1~2분 소요)';
    btn.disabled = true;

    try {
      const res = await createWorld({ keyword: kw, userApiKey: apiKey });
      if (res?.world) {
        status.textContent = '완료! 목록을 새로고침 합니다.';
        await refreshWorlds();
      } else {
        // 서버에서 온 구체적인 에러 메시지를 표시
        status.textContent = `생성 실패: ${res.message} ${res.error ? `(${res.error})` : ''}`;
      }
    } catch (err) {
      console.error(err);
      status.textContent = '네트워크 또는 서버 통신 오류';
    } finally {
      btn.disabled = false;
      // 성공 메시지는 잠시 보여주고, 실패 메시지는 더 길게 보여주도록 수정
      if (status.textContent.includes('완료')) {
          setTimeout(() => (status.style.display = 'none'), 3000);
      } else {
          setTimeout(() => (status.style.display = 'none'), 8000);
      }
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
    return;
  }

  // 3) API 키 저장
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
    }, 3000);
    return;
  }

  // 4) 세계관 카드 클릭
  const worldCard = e.target.closest('.world-card');
  if (worldCard) {
      const worldId = worldCard.dataset.id;
      if (worldId) {
          navigateTo(`/world/${worldId}`);
      }
      return;
  }
});
