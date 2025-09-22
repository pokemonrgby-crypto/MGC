import { navigateTo } from './router.js';
import { handleRegisterSubmit } from './auth.js';
// import { handleLoginSubmit } from './auth.js'; // 나중에 추가

// 모든 이벤트는 document.body에 한 번만 연결해서 관리
document.addEventListener('submit', (event) => {
    if (event.target.id === 'register-form') {
        handleRegisterSubmit(event);
    }
    // if (event.target.id === 'login-form') {
    //     handleLoginSubmit(event);
    // }
});
