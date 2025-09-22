export const CreateView = () => `
    <div class="creation-container">
        <h2>세계관 창조</h2>
        <p>AI를 통해 새로운 세계를 만듭니다. 생성은 하루에 한 번만 가능합니다.</p>
        
        <div class="input-group">
            <label for="world-keyword">세계관의 핵심 키워드</label>
            <input type="text" id="world-keyword" placeholder="예: 스팀펑크, 마법, 사막">
        </div>
        
        <button id="generate-world-button" class="btn">창조 시작</button>

        <div id="generation-status" style="display:none;"></div>
        <div id="world-card-container"></div>
    </div>
`;
