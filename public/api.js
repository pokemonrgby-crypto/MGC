// 서버 함수를 호출하기 위한 헬퍼 함수들

// 1. 회원가입 요청
export async function registerUser(nickname, password) {
    const response = await fetch('/.netlify/functions/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nickname, password }),
    });
    return response.json();
}

// 2. 로그인 요청 (나중에 구현)
// export async function loginUser(nickname, password) { ... }

// 3. 세계관 생성 요청 (나중에 구현)
// export async function generateWorld() { ... }
