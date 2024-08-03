import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { createBoard } from '../api';

const BoardForm = ({ onClose, onBoardCreated }) => {
    const { user } = useContext(AuthContext);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [category, setCategory] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await createBoard(user.accessToken, title, content, category);
            if (response.status === 201) {
                alert('게시글 작성 성공');
                onBoardCreated();
                onClose();
            } else {
                alert(response.message);
            }
        } catch (error) {
            alert('게시글 작성 실패. 다시 시도해주세요.');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>제목:</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>
            <div>
                <label>내용:</label>
                <textarea value={content} onChange={(e) => setContent(e.target.value)} required />
            </div>
            <div>
                <label>카테고리:</label>
                <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} required />
            </div>
            <button type="submit">작성</button>
            <button type="button" onClick={onClose}>취소</button>
        </form>
    );
};

export default BoardForm;
