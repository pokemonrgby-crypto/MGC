// 각 View들을 import
import { RegisterView } from './views/RegisterView.js';
import { LoginView } from './views/LoginView.js';
import { MainLayout } from './views/MainLayout.js';
import { MainView } from './views/MainView.js';
import { CreateView } from './views/CreateView.js';
import { MyInfoView } from './views/MyInfoView.js';
// [수정] 누락되었던 api.js의 getWorlds와 views의 WorldDetailView를 import 합니다.
import { getWorld, getWorlds } from './api.js';
import { WorldDetailView } from './views/WorldDetailView.js';

const app = document.getElementById('app');

// 이제 각 함수는 해당하는 View의 HTML을 app에 그려주는 역할만 함
export const renderRegister = () => { app.innerHTML = RegisterView(); };
export const renderLogin = () => { app.innerHTML = LoginView(); };

// 메인 레이아웃을 그리고, 그 안의 content-area에 특정 뷰를 그림
export const renderAppLayout = () => { app.innerHTML = MainLayout(); };

// main.js에서 옮겨온 세계관 목록 렌더링 함수입니다.
function renderWorldList(worlds) {
  const container = document.getElementById('world-list-container');
  if (!container) return;
  
  // [수정] 카드 디자인이 style.css와 일치하도록 HTML 구조를 수정했습니다.
  container.innerHTML = (worlds && worlds.length > 0) ? worlds.map(w => `
    <div class="world-card" data-id="${w.id}">
      <img src="${w.image_url || 'https://via.placeholder.com/400x180.png?text=No+Image'}" alt="${w.name}" class="world-image"/>
      <div class="card-content">
        <h3>${w.name}</h3>
        <p>${w.description || '소개가 없습니다.'}</p>
        <div class="card-footer">
            <span class="creator">by ${w.creator_nickname || '익명'}</span>
            <button class="like-button" data-like="${w.id}">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                <span class="like-count">${w.likes ?? 0}</span>
            </button>
        </div>
      </div>
    </div>
  `).join('') : `<div class="empty-message"><p>아직 생성된 세계가 없어.</p></div>`;
}

// main.js에서 옮겨온 세계관 목록 새로고침 함수입니다.
export async function refreshWorlds() {
  try {
    const { worlds } = await getWorlds();
    renderWorldList(worlds);
  } catch (error) {
    console.error('세계관 목록을 불러오는데 실패했습니다.', error);
    const container = document.getElementById('world-list-container');
    if(container) {
      container.innerHTML = `<div class="empty-message"><p>세계관 목록을 불러오는 중 오류가 발생했습니다.</p></div>`;
    }
  }
}

// renderMain 함수는 MainView를 렌더링한 후, 목록을 바로 새로고침합니다.
export const renderMain = () => {
    document.getElementById('content-area').innerHTML = MainView();
    refreshWorlds();
};

export const renderCreate = () => { document.getElementById('content-area').innerHTML = CreateView(); };
export const renderMyInfo = () => { document.getElementById('content-area').innerHTML = MyInfoView(); };

// 상세 정보 페이지를 렌더링하는 함수입니다.
export const renderWorldDetail = async () => {
    const contentArea = document.getElementById('content-area');
    contentArea.innerHTML = WorldDetailView(null); // 로딩 스피너 먼저 표시

    try {
        const id = location.pathname.split('/').pop();
        const { world } = await getWorld(id);
        contentArea.innerHTML = WorldDetailView(world); // 데이터로 뷰 렌더링
    } catch (error) {
        console.error('Failed to load world details:', error);
        contentArea.innerHTML = `<div class="empty-message"><p>세계관 정보를 불러오는 데 실패했습니다.</p></div>`;
    }
};
