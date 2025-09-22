import { getToken } from './session.js';

// ... (registerUser, loginUser, getWorlds, likeWorld 함수는 동일)
export async function registerUser(nickname, password) {
  const r = await fetch('/api/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nickname, password })
  });
  return r.json();
}

export async function loginUser(nickname, password) {
  const r = await fetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nickname, password })
  });
  return r.json();
}

export async function getWorlds() {
  const r = await fetch('/api/get-worlds');
  return r.json();
}

export async function likeWorld(worldId) {
  const token = getToken();
  const r = await fetch('/api/like-world', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify({ worldId })
  });
  return r.json();
}

// (신규) 이미지 업로드 함수
export async function uploadImage(imageFile) {
  const formData = new FormData();
  formData.append('image', imageFile);

  const r = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
    // 'Content-Type' 헤더는 FormData 사용 시 브라우저가 자동으로 설정하므로 생략합니다.
  });
  return r.json();
}

// createWorld 함수 수정: imageUrl을 파라미터로 받음
export async function createWorld({ keyword, userApiKey, imageUrl }) {
  const token = getToken();
  const r = await fetch('/api/worlds/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify({ keyword, userApiKey, imageUrl })
  });
  return r.json();
}

export async function getWorld(id) {
  const r = await fetch(`/api/get-world?id=${id}`);
  return r.json();
}
