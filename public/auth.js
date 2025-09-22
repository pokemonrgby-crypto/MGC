import { registerUser } from './api.js';

/** 회원가입 폼 제출 이벤트를 처리합니다. */
export async function handleRegisterSubmit(event) {
    event.preventDefault(); // 폼의 기본 제출 동작(새로고침)을 막습니다.

    const nickname = document.getElementById('nickname').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;
    const messageDiv = document.getElementById('message');

    // 1. 입력값 검증 (클라이언트 측)
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
        // 2. 서버에 회원가입 요청
        const result = await registerUser(nickname, password);
        
        // 3. 서버 응답에 따른 메시지 표시
        if (result.message.includes('성공')) {
            messageDiv.textContent = result.message + ' 잠시 후 로그인 화면으로 이동합니다.';
            messageDiv.className = 'message-area success';
            // TODO: 성공 후 로그인 폼으로 자동 전환
        } else {
            messageDiv.textContent = '오류: ' + result.message;
            messageDiv.className = 'message-area error';
        }
    } catch (error) {
        messageDiv.textContent = '네트워크 오류가 발생했습니다.';
        messageDiv.className = 'message-area error';
    }
}
