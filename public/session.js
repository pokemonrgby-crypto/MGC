const TOKEN_KEY = 'auth_token';

/** 서버에서 받은 토큰을 브라우저 저장소(localStorage)에 저장합니다. */
export const saveToken = (token) => {
    localStorage.setItem(TOKEN_KEY, token);
};

/** 저장된 토큰을 가져옵니다. */
export const getToken = () => {
    return localStorage.getItem(TOKEN_KEY);
};

/** 저장된 토큰을 삭제합니다. (로그아웃 시 사용) */
export const removeToken = () => {
    localStorage.removeItem(TOKEN_KEY);
};

/** 현재 로그인 상태인지 확인합니다. (토큰 존재 유무로 판단) */
export const isLoggedIn = () => {
    return !!getToken(); // 토큰이 있으면 true, 없으면 false 반환
};
