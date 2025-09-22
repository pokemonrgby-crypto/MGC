export const MyInfoView = () => `
    <div class="my-info-container">
        <h2>내 정보</h2>
        
        <div class="api-key-section">
            <h3>Gemini API 키 설정</h3>
            <p>API 키는 브라우저에만 저장되며 서버로 전송되지 않습니다.</p>
            <div class="input-group">
                <label for="api-key-input">API Key</label>
                <input type="password" id="api-key-input" placeholder="API 키를 입력하세요">
            </div>
            <button id="save-api-key-button" class="btn">키 저장하기</button>
            <div id="api-key-message" class="message-area" style="display:none; margin-top: 1rem;"></div>
        </div>

        <button id="logout-button" class="btn logout-btn">로그아웃</button>
    </div>
`;
