import axios from 'axios';

const BASE_URL = 'http://43.200.67.235:8080/api/v1';

// 로그인 api
export const login = async (id, pw) => {
    try {
        console.log(`Sending login request to ${BASE_URL}/login with id: ${id} and pw: ${pw}`); // 로그 추가
        const response = await axios.post(`${BASE_URL}/login`, { id, pw }, { timeout: 5000 });
        console.log('Login response:', response); // 응답 로그 추가
        return response.data;
    } catch (error) {
        console.error('Error logging in:', error);
        throw error;
    }
};

// 메인페이지 게시물 Borad api
export const getBoards = async (accessToken, categoryName) => {
    console.log("getBoards api 요청");
    try {
        const response = await axios.get(`${BASE_URL}/boards`, {
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

// 마이페이지 게시물 Board api
export const getMyPageBoards = async (accessToken) => {
    try {
        const response = await axios.get(`${BASE_URL}/member/boards`, {
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

// 게시글 작성 api
export const createBoard = async (accessToken, title, content, category) => {
    try {
        const response = await axios.post(`${BASE_URL}/board`, {
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

// 게시물 삭제 api
export const deleteBoard = async (accessToken, boardId) => {
    try {
      const response = await axios.delete(`${BASE_URL}/board/${boardId}`, {
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

// 게시물 추천
export const likePost = async (boardId, token) => {
    try {
        const response = await axios.post(`${BASE_URL}/like/${boardId}`, null, {
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

// 게시물 추천 취소
export const unlikePost = async (boardId, token) => {
    try {
        const response = await axios.delete(`${BASE_URL}/like/${boardId}`, {    
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};