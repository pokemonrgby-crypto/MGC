import { RegisterView, LoginView } from './ui.js';

// 경로(URL)에 따라 어떤 화면을 보여줄지 정의하는 지도
const routes = {
    '/': RegisterView,
    '/login': LoginView,
};

/** 요청된 경로로 페이지를 이동시키는 함수 */
export const navigateTo = (url) => {
    history.pushState(null, null, url);
    router();
};

/** 현재 URL을 확인하고 올바른 화면을 그려주는 함수 */
const router = async () => {
    const path = location.pathname;
    // 경로에 맞는 함수를 찾아서 실행 (없으면 기본 경로로)
    const view = routes[path] || routes['/'];
    view();
};

// 웹페이지가 처음 로드되거나, 뒤로/앞으로 가기 버튼을 누를 때 라우터 실행
window.addEventListener('popstate', router);
document.addEventListener('DOMContentLoaded', () => {
    // data-link 속성을 가진 링크 클릭 시, 새로고침 대신 navigateTo 함수 호출
    document.body.addEventListener('click', (e) => {
        if (e.target.matches('[data-link]')) {
            e.preventDefault();
            navigateTo(e.target.href);
        }
    });
    router();
});
