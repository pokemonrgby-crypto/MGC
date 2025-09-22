export const RegisterView = () => `
    <div class="form-container">
        <h2>회원가입</h2>
        <form id="register-form">
            <div class="input-group">
                <label for="nickname">닉네임</label>
                <input type="text" id="nickname" name="nickname" required>
            </div>
            <div class="input-group">
                <label for="password">비밀번호</label>
                <input type="password" id="password" name="password" required minlength="6">
            </div>
            <div class="input-group">
                <label for="password-confirm">비밀번호 확인</label>
                <input type="password" id="password-confirm" name="password-confirm" required minlength="6">
            </div>
            <button type="submit" class="btn">가입하기</button>
        </form>
        <div id="message" class="message-area" style="display:none;"></div>
        <p class="switch-form">이미 계정이 있으신가요? <a href="/login" data-link>로그인</a></p>
    </div>
`;
