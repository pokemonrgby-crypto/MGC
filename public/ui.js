const app = document.getElementById('app');

/** 회원가입 뷰를 렌더링합니다. */
export const RegisterView = () => {
    app.innerHTML = `
        <div class="form-container">
            <h2>회원가입</h2>
            <form id="register-form">
                <div class="input-group">
                    <label for="nickname">닉네임</label>
                    <input type="text" id="nickname" name="nickname" required>
                </div>
                <div class="input-group">
                    <label for="password">비밀번호</label>
                    <input type="password" id="password" name="password" required>
                </div>
                <div class="input-group">
                    <label for="password-confirm">비밀번호 확인</label>
                    <input type="password" id="password-confirm" name="password-confirm" required>
                </div>
                <button type="submit" class="btn">가입하기</button>
            </form>
            <div id="message" class="message-area" style="display:none;"></div>
            <p class="switch-form">이미 계정이 있으신가요? <a href="/login" data-link>로그인</a></p>
        </div>
    `;
};

// 기존 LoginView 함수를 아래 내용으로 덮어쓰세요.
export const LoginView = () => {
    app.innerHTML = `
        <div class="form-container">
            <h2>로그인</h2>
            <form id="login-form">
                <div class="input-group">
                    <label for="nickname">닉네임</label>
                    <input type="text" id="nickname" name="nickname" required>
                </div>
                <div class="input-group">
                    <label for="password">비밀번호</label>
                    <input type="password" id="password" name="password" required>
                </div>
                <button type="submit" class="btn">로그인</button>
            </form>
            <div id="message" class="message-area" style="display:none;"></div>
            <p class="switch-form">계정이 없으신가요? <a href="/" data-link>회원가입</a></p>
        </div>
    `;
};

/** 로그인 후 보여질 메인 앱 레이아웃을 렌더링합니다. */
export const renderMainLayout = () => {
    const app = document.getElementById('app');
    app.innerHTML = `
        <main id="content-area" class="content-area">
            </main>
        <nav class="bottom-nav">
            <a href="/main" class="nav-item" data-link>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                <span class="label">메인</span>
            </a>
            <a href="/create" class="nav-item" data-link>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"></path><path d="M12 5v14"></path></svg>
                <span class="label">생성</span>
            </a>
            <a href="/my-info" class="nav-item" data-link>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                <span class="label">내 정보</span>
            </a>
        </nav>
    `;
}

/** 메인 뷰 */
export const MainView = () => {
    document.getElementById('content-area').innerHTML = '<h2>메인 화면</h2>';
}

/** 생성 뷰 */
export const CreateView = () => {
    document.getElementById('content-area').innerHTML = '<h2>생성 화면</h2>';
}

/** 내 정보 뷰 */
export const MyInfoView = () => {
    document.getElementById('content-area').innerHTML = '<h2>내 정보 화면</h2>';
}
