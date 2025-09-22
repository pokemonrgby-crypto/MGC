import { navigateTo } from './router.js';
import { handleRegisterSubmit, handleLoginSubmit, handleLogout } from './auth.js';
import { saveApiKey, getApiKey } from './apiKey.js';
import { createWorld, likeWorld } from './api.js';
import { refreshWorlds } from './ui.js'; // ui.js에서 refreshWorlds 함수를 가져옵니다.

// 최초 로드 시 router가 refresh를 처리하므로 아래 코드는 삭제하거나 비워둡니다.
document.addEventListener('DOMContentLoaded', () => {
  // router()가 초기 렌더링 및 데이터 로딩을 모두 처리합니다.
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
        await refreshWorlds(); // ui.js에서 가져온 함수를 사용합니다.
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
    return; // 좋아요 클릭 시 상세 페이지로 넘어가지 않도록 여기서 이벤트를 종료합니다.
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
