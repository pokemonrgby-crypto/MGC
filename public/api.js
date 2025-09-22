import { getToken } from './session.js';

// 1. 회원가입 요청
export async function registerUser(nickname, password) { /* ... 기존과 동일 ... */ }

// 2. 로그인 요청
export async function loginUser(nickname, password) { /* ... 기존과 동일 ... */ }

// 3. (신규) 이미지 생성 요청
export async function generateImage(prompt) {
    const token = getToken(); // 인증이 필요할 경우를 대비해 토큰 전송
    const response = await fetch('/.netlify/functions/generate-image', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ prompt }),
    });
    return response.json();
}

// 4. 생성된 세계관 저장 요청 (imageUrl 파라미터 추가)
export async function saveWorld(worldData, imageUrl) {
    const token = getToken();
    const response = await fetch('/.netlify/functions/save-world', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ worldData, imageUrl }), // 이미지 URL도 함께 보냄
    });
    return response.json();
}
