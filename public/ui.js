// 각 View들을 import
import { RegisterView } from './views/RegisterView.js';
import { LoginView } from './views/LoginView.js';
import { MainLayout } from './views/MainLayout.js';
import { MainView } from './views/MainView.js';
import { CreateView } from './views/CreateView.js';
import { MyInfoView } from './views/MyInfoView.js';
import { getWorld } from './api.js';

const app = document.getElementById('app');

// 이제 각 함수는 해당하는 View의 HTML을 app에 그려주는 역할만 함
export const renderRegister = () => { app.innerHTML = RegisterView(); };
export const renderLogin = () => { app.innerHTML = LoginView(); };

// 메인 레이아웃을 그리고, 그 안의 content-area에 특정 뷰를 그림
export const renderAppLayout = () => { app.innerHTML = MainLayout(); };


function renderWorldList(worlds) {
  const container = document.getElementById('world-list-container');
  if (!container) return;
  container.innerHTML = (worlds || []).map(w => `
    <div class="world-card" data-id="${w.id}">
      <img src="${w.image_url || ''}" alt="" class="thumb"/>
      <div class="title">${w.name}</div>
      <div class="intro">${w.description ?? ''}</div>
      <button class="btn-like" data-like="${w.id}">♡ <span class="like-count">${w.likes ?? 0}</span></button>
    </div>
  `).join('') || `<p>아직 생성된 세계가 없어.</p>`;
}
export async function refreshWorlds() {
  const { worlds } = await getWorlds();
  renderWorldList(worlds);
}


// renderMain 함수 수정: MainView를 렌더링한 후, 목록을 바로 새로고침합니다.
export const renderMain = () => {
    document.getElementById('content-area').innerHTML = MainView();
    refreshWorlds();
};
export const renderCreate = () => { document.getElementById('content-area').innerHTML = CreateView(); };
export const renderMyInfo = () => { document.getElementById('content-area').innerHTML = MyInfoView(); };

// renderWorldDetail 함수를 아래 코드로 교체
export const renderWorldDetail = async () => {
    const contentArea = document.getElementById('content-area');
    contentArea.innerHTML = WorldDetailView(null); // 로딩 스피너 먼저 표시

    try {
        const id = location.pathname.split('/').pop();
        const { world } = await getWorld(id);
        contentArea.innerHTML = WorldDetailView(world); // 데이터로 뷰 렌더링
    } catch (error) {
        console.error('Failed to load world details:', error);
        contentArea.innerHTML = `<p>세계관 정보를 불러오는 데 실패했습니다.</p>`;
    }
};
