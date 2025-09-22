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

// (기존 내용과 동일)
const router = async () => {
    // 1. 경로 매칭 로직 수정
    const potentialMatches = Object.keys(routes).map(routePath => {
        return {
            route: routes[routePath],
            isMatch: location.pathname === routePath
        };
    });

    // 동적 경로를 위한 정규식 매칭 추가
    const pathToRegex = path => new RegExp("^" + path.replace(/\//g, "\\/").replace(/:\w+/g, "(.+)") + "$");
    
    const potentialDynamicMatches = Object.keys(routes).map(routePath => {
        return {
            route: routes[routePath],
            result: location.pathname.match(pathToRegex(routePath))
        };
    });

    let match = potentialDynamicMatches.find(potentialMatch => potentialMatch.result !== null);

    if (!match) {
        // 일치하는 경로가 없으면 기본 경로로 설정
        match = {
            route: routes['/'],
            result: [location.pathname]
        };
    }

    const route = match.route;

    // 2. 페이지 접근 권한 확인 (기존 로직과 동일)
    if (!route.public && !isLoggedIn()) {
        navigateTo('/login');
        return;
    }
    if (route.public && isLoggedIn()) {
        navigateTo('/main');
        return;
    }

    // 3. 레이아웃 렌더링 (기존 로직과 동일)
    if (currentLayout !== route.layout) {
        currentLayout = route.layout;
        if (route.layout === 'app') {
            UI.renderAppLayout();
        }
    }
    
    // 4. 콘텐츠 렌더링 (기존 로직과 동일)
    route.render(); 
    
    // 5. 네비게이션 상태 업데이트 (기존 로직과 동일)
    if (route.layout === 'app') {
        updateNavActiveState(location.pathname);
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
