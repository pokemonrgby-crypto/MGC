import { navigateTo } from './router.js';
import { handleRegisterSubmit, handleLoginSubmit, handleLogout } from './auth.js'; // handleLogout 추가

// 폼 제출 이벤트 리스너
document.addEventListener('submit', (event) => {
    if (event.target.id === 'register-form') {
        handleRegisterSubmit(event);
    }
    if (event.target.id === 'login-form') {
        handleLoginSubmit(event);
    }
});

// 클릭 이벤트 리스너 (로그아웃 등)
document.addEventListener('click', (event) => {
    if (event.target.id === 'logout-button') {
        handleLogout();
    }
});
