import { getToken } from './session.js';

// 1. 회원가입 요청
export async function registerUser(nickname, password) {
    const response = await fetch('/api/register', { // 경로 수정
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nickname, password }),
    });
    return response.json();
}

// 2. 로그인 요청
export async function loginUser(nickname, password) {
    const response = await fetch('/api/login', { // 경로 수정
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nickname, password }),
    });
    return response.json();
}

// 3. 이미지 생성 요청
export async function generateImage(prompt, userApiKey) {
    const response = await fetch('/api/generate-image', { // 경로 수정
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, userApiKey }),
    });
    return response.json();
}

// 4. 세계관 저장 요청
export async function saveWorld(worldData, imageUrl) {
    const token = getToken();
    const response = await fetch('/api/save-world', { // 경로 수정
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ worldData, imageUrl }),
    });
    return response.json();
}

// 5. 모든 세계관 목록 가져오기
export async function getWorlds() {
    const response = await fetch('/api/get-worlds');
    return response.json();
}

// 6. 특정 세계관에 '좋아요' 보내기
export async function likeWorld(worldId) {
    const token = getToken();
    const response = await fetch('/api/like-world', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ worldId }),
    });
    return response.json();
}
