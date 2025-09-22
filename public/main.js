import { navigateTo } from './router.js';
import { handleRegisterSubmit, handleLoginSubmit } from './auth.js'; // handleLoginSubmit 추가

document.addEventListener('submit', (event) => {
    if (event.target.id === 'register-form') {
        handleRegisterSubmit(event);
    }
    // 로그인 폼 제출 이벤트 처리 추가
    if (event.target.id === 'login-form') {
        handleLoginSubmit(event);
    }
});
