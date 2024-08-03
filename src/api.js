import axios from 'axios';

const baseURL = ''
// 환경에 따라 baseURL 설정
const host = window.location.hostname === "localhost"
    ? 'http://43.200.67.235:8080'
    : '';

export const apiClient = axios.create({
    baseURL: host,
});
console.log(baseURL);
// 로그인 API
export const login = async (id, pw) => {
    try {
        console.log(`Sending login request to ${apiClient.defaults.baseURL}/api/v1/login with id: ${id} and pw: ${pw}`); // 로그 추가
        const response = await apiClient.post('/api/v1/login', { id, pw }, { timeout: 5000 });
        console.log('Login response:', response); // 응답 로그 추가
        return response.data;
    } catch (error) {
        console.error('Error logging in:', error);
        throw error;
    }
};

// 메인페이지 게시물 API
export const getBoards = async (accessToken, categoryName) => {
    console.log("getBoards API 요청");
    try {
        const response = await apiClient.get('/api/v1/boards', {
            headers: {
                Authorization: `Bearer ${accessToken}`
            },
            params: {
                categoryName
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching boards:', error);
        throw error;
    }
};

// 마이페이지 게시물 API
export const getMyPageBoards = async (accessToken) => {
    try {
        const response = await apiClient.get('/api/v1/member/boards', {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching my page boards:', error);
        throw error;
    }
};

// 게시글 작성 API
export const createBoard = async (accessToken, title, content, category) => {
    try {
        const response = await apiClient.post('/api/v1/board', {
            title,
            content,
            category
        }, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error creating board:', error);
        throw error;
    }
};

// 게시물 삭제 API
export const deleteBoard = async (accessToken, boardId) => {
    try {
        const response = await apiClient.delete(`/api/v1/board/${boardId}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error deleting board:', error);
        throw error;
    }
};

// 게시물 추천 API
export const likePost = async (boardId, token) => {
    try {
        const response = await apiClient.post(`/api/v1/like/${boardId}`, null, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        console.log(response);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

// 게시물 추천 취소 API
export const unlikePost = async (boardId, token) => {
    try {
        const response = await apiClient.delete(`/api/v1/like/${boardId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

// 게시물 추천 수 가져오기 API
export const getLikeCount = async (boardId, accessToken) => {
    console.log(`Fetching like count for boardId: ${boardId} with token: ${accessToken}`); // 로그 추가
    try {
        const response = await apiClient.get(`/api/v1/like/${boardId}/count`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
        return response.data.data; // Assuming the API response structure
    } catch (error) {
        console.error('Error fetching like count:', error);
        throw error;
    }
};
