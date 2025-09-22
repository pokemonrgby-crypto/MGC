import * as UI from './ui.js';

const routes = {
    '/':       { render: UI.renderRegister, layout: 'auth' },
    '/login':  { render: UI.renderLogin,    layout: 'auth' },
    '/main':   { render: UI.renderMain,     layout: 'app' },
    '/create': { render: UI.renderCreate,   layout: 'app' },
    '/my-info':{ render: UI.renderMyInfo,   layout: 'app' },
};
let currentLayout = null;

export const navigateTo = (url) => { /* ... (내용 동일) ... */ };

const router = async () => {
    const path = location.pathname;
    const route = routes[path] || routes['/'];

    if (currentLayout !== route.layout) {
        currentLayout = route.layout;
        if (route.layout === 'app') {
            UI.renderAppLayout(); // 메인 레이아웃을 먼저 그림
        }
    }
    
    route.render(); // 해당 경로의 콘텐츠를 그림
    
    if (route.layout === 'app') {
        updateNavActiveState(path);
    }
};

// 현재 레이아웃 상태를 추적
let currentLayout = null;

export const navigateTo = (url) => {
    history.pushState(null, null, url);
    router();
};

const router = async () => {
    const path = location.pathname;
    const route = routes[path] || routes['/'];

    // 레이아웃이 변경되어야 하는 경우에만 전체를 다시 그림
    if (currentLayout !== route.layout) {
        currentLayout = route.layout;
        if (route.layout === 'app') {
            renderMainLayout();
        }
    }
    
    // 레이아웃에 맞는 뷰(콘텐츠)를 그림
    route.view();
    
    // 하단 바의 활성 탭 업데이트
    if(route.layout === 'app') {
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
            navigateTo(navLink.href);
        }
    });
    router();
});
