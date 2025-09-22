// 앱의 메인 컨테이너
const app = document.getElementById('app');

/** 회원가입 폼을 화면에 그립니다. */
export function renderRegisterForm() {
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
            <div id="message" class="message-area"></div>
            <p class="switch-form">이미 계정이 있으신가요? <a href="#" id="show-login">로그인</a></p>
        </div>
    `;
}

/** 로그인 폼을 화면에 그립니다. (나중에 구현) */
export function renderLoginForm() {
    // TODO: 로그인 UI 구현
    console.log('로그인 폼을 여기에 표시합니다.');
}
