const API_KEY_NAME = 'gemini_api_key';

/** 사용자가 입력한 API 키를 브라우저 저장소에 저장합니다. */
export const saveApiKey = (apiKey) => {
    if (!apiKey) {
        console.error("저장할 API 키가 없습니다.");
        return;
    }
    localStorage.setItem(API_KEY_NAME, apiKey);
};

/** 저장된 API 키를 가져옵니다. */
export const getApiKey = () => {
    return localStorage.getItem(API_KEY_NAME);
};

/** 저장된 API 키를 삭제합니다. */
export const removeApiKey = () => {
    localStorage.removeItem(API_KEY_NAME);
};
