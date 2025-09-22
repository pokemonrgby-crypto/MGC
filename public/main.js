import { navigateTo } from './router.js';
import { saveApiKey, getApiKey } from './apiKey.js';
import { createWorld, likeWorld, uploadImage } from './api.js';
import { refreshWorlds } from './ui.js';

document.addEventListener('DOMContentLoaded', () => {
});

document.addEventListener('click', async (e) => {
  // 1) 세계관 생성 로직 변경
  if (e.target.id === 'generate-world-button') {
    const btn = e.target;
    const status = document.getElementById('generation-status');
    const kw = document.getElementById('world-keyword').value.trim();
    const imageInput = document.getElementById('world-image');
    const imageFile = imageInput.files[0];
    const apiKey = getApiKey();

    status.style.display = 'block';

    if (!apiKey) {
      status.textContent = '내 정보에서 API 키를 먼저 저장해주세요.';
      return;
    }
    if (!kw) {
      status.textContent = '세계관의 핵심 키워드를 입력해주세요.';
      return;
    }
    if (!imageFile) {
      status.textContent = '대표 이미지를 선택해주세요.';
      return;
    }

    btn.disabled = true;

    try {
      // 1단계: 이미지 업로드
      status.textContent = '이미지 업로드 중...';
      const uploadRes = await uploadImage(imageFile);
      if (!uploadRes.imageUrl) {
        throw new Error(uploadRes.message || '이미지 업로드에 실패했습니다.');
      }
      const imageUrl = uploadRes.imageUrl;

      // 2단계: 텍스트 생성 및 저장
      status.textContent = '세계관 생성 중... (1~2분 소요)';
      const createRes = await createWorld({ keyword: kw, userApiKey: apiKey, imageUrl });

      if (createRes?.world) {
        status.textContent = '완료! 목록을 새로고침 합니다.';
        await refreshWorlds();
      } else {
        throw new Error(createRes.message || '세계관 생성에 실패했습니다.');
      }

    } catch (err) {
      console.error(err);
      status.textContent = `오류: ${err.message}`;
    } finally {
      btn.disabled = false;
      if (status.textContent.includes('완료')) {
          setTimeout(() => (status.style.display = 'none'), 3000);
      } else {
          setTimeout(() => (status.style.display = 'none'), 8000);
      }
    }
    return;
  }

  // ... (좋아요, API 키 저장, 카드 클릭 핸들러는 기존과 동일) ...
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
  
  const worldCard = e.target.closest('.world-card');
  if (worldCard) {
      const worldId = worldCard.dataset.id;
      if (worldId) {
          navigateTo(`/world/${worldId}`);
      }
      return;
  }
});
