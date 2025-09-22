export const WorldDetailView = (world) => {
    if (!world) {
        return `<div class="view-container"><div class="spinner-container"><div class="spinner"></div><p>세계를 불러오는 중...</p></div></div>`;
    }

    return `
        <div class="world-detail-container">
            <button onclick="history.back()" class="btn-back">← 뒤로가기</button>
            <img src="${world.image_url || ''}" alt="${world.name}" class="world-detail-image"/>
            <h2 class="world-detail-title">${world.name}</h2>
            <p class="world-creator">창조자: ${world.creator_nickname || '알 수 없음'}</p>
            
            <div class="world-content-section">
                <h3>소개</h3>
                <p>${world.description || ''}</p>
            </div>

            <div class="world-content-section">
                <h3>주요 장소</h3>
                ${(world.landmarks && world.landmarks.length > 0) ? world.landmarks.map(l => `
                    <div class="detail-card">
                        <h4>${l.name}</h4>
                        <p>${l.description}</p>
                    </div>
                `).join('') : '<p>아직 알려진 장소가 없습니다.</p>'}
            </div>
            
            <div class="world-content-section">
                <h3>주요 조직</h3>
                ${(world.organizations && world.organizations.length > 0) ? world.organizations.map(o => `
                    <div class="detail-card">
                        <h4>${o.name}</h4>
                        <p>${o.description}</p>
                    </div>
                `).join('') : '<p>알려진 조직이 없습니다.</p>'}
            </div>

            <div class="world-content-section">
                <h3>주요 인물</h3>
                ${(world.npcs && world.npcs.length > 0) ? world.npcs.map(n => `
                    <div class="detail-card">
                        <h4>${n.name} (${n.role})</h4>
                        <p>${n.description}</p>
                    </div>
                `).join('') : '<p>알려진 인물이 없습니다.</p>'}
            </div>
        </div>
    `;
};
