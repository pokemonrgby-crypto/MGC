import { renderRegisterForm, renderLoginForm } from './ui.js';
import { handleRegisterSubmit } from './auth.js';

// 페이지 로드가 완료되면 실행
document.addEventListener('DOMContentLoaded', () => {
    // 1. 초기 화면으로 회원가입 폼을 그립니다.
    renderRegisterForm();

    // 2. 폼 제출(submit) 이벤트에 우리가 만든 함수를 연결합니다.
    // document.body.addEventListener를 사용하는 이유는,
    // 폼이 동적으로 생성되므로 안정적으로 이벤트를 잡기 위함입니다.
    document.body.addEventListener('submit', (event) => {
        if (event.target.id === 'register-form') {
            handleRegisterSubmit(event);
        }
    });

    // 3. '로그인' 링크 클릭 이벤트 처리
    document.body.addEventListener('click', (event) => {
        if (event.target.id === 'show-login') {
            event.preventDefault();
            renderLoginForm(); // 로그인 폼 그리기 (아직 미구현)
        }
    });
});
