import { RegisterView, LoginView, renderMainLayout, MainView, CreateView, MyInfoView } from './ui.js';

// 경로 지도 확장
const routes = {
    // Auth routes
    '/': { view: RegisterView, layout: 'auth' },
    '/login': { view: LoginView, layout: 'auth' },
    // App routes
    '/main': { view: MainView, layout: 'app' },
    '/create': { view: CreateView, layout: 'app' },
    '/my-info': { view: MyInfoView, layout: 'app' },
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
