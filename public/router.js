// (기존 내용과 동일)
import * as UI from './ui.js';
import { isLoggedIn } from './session.js'; // isLoggedIn 함수 import

const routes = {
    '/':       { render: UI.renderRegister, layout: 'auth', public: true },
    '/login':  { render: UI.renderLogin,    layout: 'auth', public: true },
    '/main':   { render: UI.renderMain,     layout: 'app',  public: false },
    '/create': { render: UI.renderCreate,   layout: 'app',  public: false },
    '/my-info':{ render: UI.renderMyInfo,   layout: 'app',  public: false },
    '/world/:id': { render: UI.renderWorldDetail, layout: 'app', public: false }, // 상세 페이지 라우트 추가
};
// (기존 내용과 동일)
let currentLayout = null;

export const navigateTo = (url) => {
    history.pushState(null, null, url);
    router();
};

const router = async () => {
    const path = location.pathname;
    const route = routes[path] || routes['/'];

    // 1. 페이지 접근 권한 확인
    if (!route.public && !isLoggedIn()) {
        // 로그인이 필요한 페이지인데, 로그인이 안 되어있으면
        navigateTo('/login'); // 로그인 페이지로 강제 이동
        return; // 아래 코드 실행 중단
    }
    // 반대로, 로그인 되어 있는데 로그인/회원가입 페이지로 가려고 하면
    if (route.public && isLoggedIn()) {
        navigateTo('/main'); // 메인 페이지로 강제 이동
        return;
    }

    // 2. 레이아웃 렌더링
    if (currentLayout !== route.layout) {
        currentLayout = route.layout;
        if (route.layout === 'app') {
            UI.renderAppLayout(); // 메인 레이아웃을 먼저 그림
        }
    }
    
    // 3. 콘텐츠 렌더링
    route.render(); 
    
    // 4. 네비게이션 상태 업데이트
    if (route.layout === 'app') {
        updateNavActiveState(path);
    }
};

function updateNavActiveState(path) {
    document.querySelectorAll('.nav-item').forEach(item => {
        if (item.getAttribute('href') === path) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

window.addEventListener('popstate', router);

document.addEventListener('DOMContentLoaded', () => {
    document.body.addEventListener('click', (e) => {
        const navLink = e.target.closest('[data-link]');
        if (navLink) {
            e.preventDefault();
            navigateTo(navLink.getAttribute('href')); // href 속성에서 URL을 가져오도록 수정
        }
    });
    router(); // 페이지 첫 로드 시 라우터 실행
});
