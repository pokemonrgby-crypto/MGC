export const LoginView = () => `
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
