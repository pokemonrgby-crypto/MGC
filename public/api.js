import { getToken } from './session.js';

// 1. 회원가입 요청
export async function registerUser(nickname, password) {
    const response = await fetch('/.netlify/functions/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nickname, password }),
    });
    return response.json();
}

// 2. 로그인 요청
export async function loginUser(nickname, password) {
    const response = await fetch('/.netlify/functions/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nickname, password }),
    });
    return response.json();
}

// 3. 생성된 세계관 저장 요청
export async function saveWorld(worldData) {
    const token = getToken();
    const response = await fetch('/.netlify/functions/save-world', { // 호출 주소 변경
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ worldData }), // AI가 생성한 데이터를 통째로 보냄
    });
    return response.json();
}
