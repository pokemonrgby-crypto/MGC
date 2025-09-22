import { registerUser, loginUser } from './api.js';
import { navigateTo } from './router.js';
import { saveToken, removeToken } from './session.js';

/** 회원가입 폼 제출 이벤트를 처리합니다. */
export async function handleRegisterSubmit(event) {
    event.preventDefault();

    const nickname = document.getElementById('nickname').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;
    const messageDiv = document.getElementById('message');
    messageDiv.style.display = 'block';

    if (password !== passwordConfirm) {
        messageDiv.textContent = '비밀번호가 일치하지 않습니다.';
        messageDiv.className = 'message-area error';
        return;
    }
    if (password.length < 6) {
        messageDiv.textContent = '비밀번호는 6자 이상이어야 합니다.';
        messageDiv.className = 'message-area error';
        return;
    }

    messageDiv.textContent = '가입 처리 중...';
    messageDiv.className = 'message-area info';

    try {
        const result = await registerUser(nickname, password);
        
        if (result.message.includes('성공')) {
            messageDiv.textContent = result.message;
            messageDiv.className = 'message-area success';
            setTimeout(() => navigateTo('/login'), 2000);
        } else {
            messageDiv.textContent = '오류: ' + result.message;
            messageDiv.className = 'message-area error';
        }
    } catch (error) {
        messageDiv.textContent = '네트워크 오류 또는 서버에 문제가 발생했습니다.';
        messageDiv.className = 'message-area error';
    }
}

/** 로그인 폼 제출 이벤트를 처리합니다. */
export async function handleLoginSubmit(event) {
    event.preventDefault();

    const nickname = document.getElementById('nickname').value;
    const password = document.getElementById('password').value;
    const messageDiv = document.getElementById('message');
    messageDiv.style.display = 'block';

    messageDiv.textContent = '로그인 중...';
    messageDiv.className = 'message-area info';

    try {
        const result = await loginUser(nickname, password);
        
        if (result.token) {
            saveToken(result.token); // 응답받은 토큰을 저장
            messageDiv.textContent = result.message;
            messageDiv.className = 'message-area success';
            setTimeout(() => navigateTo('/main'), 1500); // 1.5초 후 메인 페이지로 이동
        } else {
            messageDiv.textContent = '오류: ' + result.message;
            messageDiv.className = 'message-area error';
        }
    } catch (error) {
        messageDiv.textContent = '네트워크 오류 또는 서버에 문제가 발생했습니다.';
        messageDiv.className = 'message-area error';
    }
}

/** 로그아웃을 처리합니다. */
export function handleLogout() {
    removeToken(); // 저장된 토큰 삭제
    navigateTo('/login'); // 로그인 페이지로 이동
    console.log('로그아웃 되었습니다.');
}
