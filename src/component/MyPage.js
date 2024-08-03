import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { getMyPageBoards, deleteBoard } from '../api';
import '../assets/css/Main.css';
import '../assets/css/MyPage.css';
import { FaRegTrashAlt } from "react-icons/fa";
import { BsPersonSquare } from "react-icons/bs";
import SuggestionForm from './SuggestionForm';

function MyPage() {
  const { user } = useContext(AuthContext);
  const [selectedRow, setSelectedRow] = useState(null);
  const [boards, setBoards] = useState([]);

  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const response = await getMyPageBoards(user.accessToken); // api.js 호출
        console.log('API Response:', response); // API 응답 확인
        if (response.status === 200) { // 성공시
          const sortedBoards = response.data.boards.sort((a, b) => new Date(b.updateAt) - new Date(a.updateAt));
          setBoards(sortedBoards);
        } else {
          alert(response.message);
        }
      } catch (error) { // 실패시
        alert('Error fetching boards. Please try again.');
      }
    };
    if (user && user.accessToken) { // user.token 대신 user.accessToken
      fetchBoards();
    }
  }, [user]);

  const handleBoardCreated = async () => {
    try {
      const response = await getMyPageBoards(user.accessToken); // api.js 호출
      if (response.status === 200) { // 성공시
        const sortedBoards = response.data.boards.sort((a, b) => new Date(b.updateAt) - new Date(a.updateAt));
        setBoards(sortedBoards);
      } else {
        alert(response.message);
      }
    } catch (error) { // 실패시
      alert('Error fetching boards. Please try again.');
    }
  };

  const handleRowClick = (item) => {
    setSelectedRow(item);
  };

  const handleClose = () => {
    setSelectedRow(null);
  };

  const handleRecommend = () => {
    const confirmRecommend = window.confirm("이 건의사항을 추천하시겠습니까?");
    if (confirmRecommend) {
      console.log("추천 완료");
    } else {
      console.log("추천 취소");
    }
  };

  const handleReport = () => {
    const confirmReport = window.confirm("이 건의사항을 신고하시겠습니까?");
    if (confirmReport) {
      console.log("신고 완료");
    } else {
      console.log("신고 취소");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('정말로 이 게시물을 삭제하시겠습니까?')) {
      try {
        await deleteBoard(user.accessToken, id);
        setBoards((prevBoards) => {
          const updatedBoard = prevBoards.filter((item) => item.boardId !== id);
          return updatedBoard;
        });
        alert('게시글 삭제 성공');
      } catch (error) {
        alert('게시글 삭제 실패. 다시 시도해주세요.');
      }
    }
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000); // UTC 시간에서 로컬 타임존으로 변환
      const month = String(localDate.getMonth() + 1).padStart(2, '0');
      const day = String(localDate.getDate()).padStart(2, '0');
      const hours = String(localDate.getHours()).padStart(2, '0');
      const minutes = String(localDate.getMinutes()).padStart(2, '0');
      return `${month}/${day} ${hours}:${minutes}`;
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString; // 포맷팅 실패 시 원래 문자열 반환
    }
  };

  return (
    <div>
      <div className="table-container-wrapper">
        <div className="board-buttons-container">
          <button className="board-button selected" disabled>
            마이페이지
          </button>
        </div>
        <div className="table-container">
          <SuggestionForm onBoardCreated={handleBoardCreated} />
          {selectedRow ? (
            <div className="detailed-view-content">
              <div className="icon-container">
                <BsPersonSquare size={40} color="#4a5a6a" />
                <div className="icon-text-container">
                  <div id='c1'>{selectedRow.category} 게시판</div>
                  <div>{formatDate(selectedRow.updateAt)}</div>
                </div>
              </div>
              <p><h3>{selectedRow.title}</h3></p>
              <p>{selectedRow.content}</p>
              <p><strong>추천수:</strong> {selectedRow.likes}</p>
              <div className="inner-button-container">
                <button className="recommend-button" onClick={handleRecommend}>추천</button>
                <button className="report-button" onClick={handleReport}>신고</button>
                <button className="close-button" onClick={handleClose}>글목록</button>
              </div>
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th className="col1">추천수</th>
                  <th className="col2">제목</th>
                  <th className="col3">내용</th>
                  <th className="col4">생성 일자</th>
                  <th className="col_bin">삭제</th>
                </tr>
              </thead>
              <tbody>
                {boards.length > 0 ? boards.map(item => (
                  <tr key={item.boardId} onClick={() => handleRowClick(item)} className="clickable-row">
                    <td className="col1">{item.likes}</td>
                    <td className="col2">{item.title}</td>
                    <td className="col3">{item.content}</td>
                    <td className="col4">{formatDate(item.updateAt)}</td>
                    <td className="col_bin">
                      <button className="bin" onClick={(e) => { e.stopPropagation(); handleDelete(item.boardId); }}><FaRegTrashAlt /></button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="5">작성한 게시글이 없습니다.</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default MyPage;
