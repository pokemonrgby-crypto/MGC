import { registerUser } from './api.js';
import { navigateTo } from './router.js';

export async function handleRegisterSubmit(event) {
    event.preventDefault();

    const nickname = document.getElementById('nickname').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;
    const messageDiv = document.getElementById('message');
    messageDiv.style.display = 'block'; // 메시지 창 보이기

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
            setTimeout(() => navigateTo('/login'), 2000); // 2초 후 로그인 페이지로 이동
        } else {
            messageDiv.textContent = '오류: ' + result.message;
            messageDiv.className = 'message-area error';
        }
    } catch (error) {
        messageDiv.textContent = '네트워크 오류 또는 서버에 문제가 발생했습니다.';
        messageDiv.className = 'message-area error';
    }
}

// import { loginUser } from './api.js'; // 나중에 실제 로그인 API와 연동

/** 로그인 폼 제출 이벤트를 처리합니다. */
export async function handleLoginSubmit(event) {
    event.preventDefault();
    const messageDiv = document.getElementById('message');
    messageDiv.style.display = 'block';
    
    // 지금은 실제 서버 연동 없이 성공했다고 가정
    messageDiv.textContent = '로그인 성공! 메인 화면으로 이동합니다.';
    messageDiv.className = 'message-area success';

    // 1.5초 후 메인 화면으로 이동
    setTimeout(() => navigateTo('/main'), 1500);
}
