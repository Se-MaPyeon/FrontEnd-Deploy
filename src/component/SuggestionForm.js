import React, { useState, useContext } from 'react';
import { BsChevronDown, BsChevronUp } from "react-icons/bs";
import '../assets/css/SuggestionForm.css';
import { AuthContext } from '../context/AuthContext';
import { createBoard } from '../api';

function SuggestionForm({ onBoardCreated }) {
  const { user } = useContext(AuthContext);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [category, setCategory] = useState('ALL');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState(null);

  const toggleForm = () => {
    setIsFormOpen(!isFormOpen);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const confirmSubmit = window.confirm("해당 건의함에 제출하시겠습니까?");
    if (confirmSubmit) {
      try {
        const response = await createBoard(user.accessToken, title, content, category);
        if (response.status === 201) {
          alert('제출 완료');
          setIsFormOpen(false);
          setCategory('ALL');
          setTitle('');
          setContent('');
          setError(null); // 성공시 에러 메시지 초기화
          onBoardCreated(); // 게시글 작성 후 전체 테이블 다시 호출
        } else {
          setError(response.message); // 서버로부터 받은 에러 메시지 설정
        }
      } catch (error) {
        setError('제출 실패. 다시 시도해주세요.'); // 네트워크 에러 등의 경우 에러 메시지 설정
      }
    } else {
      console.log("제출 취소");
    }
  };

  return (
    <div className={`suggestion-form-container ${isFormOpen ? 'open' : ''}`}>
      <div className="toggle-button-container" onClick={toggleForm}>
        건의사항 작성
        {isFormOpen ? <BsChevronUp size={20} /> : <BsChevronDown size={20} />}
      </div>
      {isFormOpen && (
        <form className="suggestion-form" onSubmit={handleSubmit}>
          <div className="form-group form-group-inline">
            <select id="category" name="category" value={category} onChange={(e) => setCategory(e.target.value)} required>
              <option value="ALL">전체</option>
              <option value="EMPLOYMENT">취업</option>
              <option value="DEGREE">학사</option>
              <option value="SCHOLARSHIP">장학</option>
            </select>
            <button type="submit" className="submit-button">제출</button>
          </div>
          <div className="form-group">
            <input type="text" id="title" placeholder="제목" name="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <div className="form-group">
            <textarea 
              id="content" 
              placeholder=" ▶ 게시판 게시글 삭제 기준
               특정 개인 및 단체를 비방하거나 왜곡, 선동 또는 허위 및 확인되지 않은 사실을 유포하는 경우
               제목, 내용 또는 게시자명 등 욕설, 음란한 표현을 담고 있는 경우
               광고 및 상업적인 게시물에 해당하는 경우
               동일한 내용을 반복하여 올리는 경우
               상식 및 통신 예절에 어긋난다고 판단되는 경우
               기타 관계법령을 위배하거나 정상적인 홈페이지 운영을 저해한다고 판단되는 경우" 
              name="content" 
              value={content} 
              onChange={(e) => setContent(e.target.value)} 
              required 
            ></textarea>
          </div>
          {error && <div className="error-message">{error}</div>} {/* 에러 메시지 출력 */}
        </form>
      )}
    </div>
  );
}

export default SuggestionForm;
