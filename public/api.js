import { getToken } from './session.js';

// 1. 회원가입 요청
export async function registerUser(nickname, password) { /* ... 기존과 동일 ... */ }

// 2. 로그인 요청
export async function loginUser(nickname, password) { /* ... 기존과 동일 ... */ }

// 3. (신규) 이미지 생성 요청
export async function generateImage(prompt, userApiKey) {
    const response = await fetch('/api/generate-image', { // Vercel 경로(/api/)로 수정
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt, userApiKey }), // 사용자의 키를 함께 전송
    });
    return response.json();
}

// 4. 생성된 세계관 저장 요청 (Vercel 경로로 수정)
export async function saveWorld(worldData, imageUrl) {
    const token = getToken();
    const response = await fetch('/api/save-world', { // Vercel 경로(/api/)로 수정
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ worldData, imageUrl }),
    });
    return response.json();
}
