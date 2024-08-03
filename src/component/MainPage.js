// src/component/MainPage.js
import React, { useEffect, useState, useContext, useCallback } from 'react';
import { AuthContext } from '../context/AuthContext';
import { getBoards, likePost, unlikePost } from '../api';
import '../assets/css/Main.css';
import { BsPersonSquare } from "react-icons/bs";
import SuggestionForm from './SuggestionForm';
import BoardForm from './BoardForm';

function MainPage() {
  const { user } = useContext(AuthContext);
  const [selectedBoard, setSelectedBoard] = useState('ALL');
  const [selectedRow, setSelectedRow] = useState(null);
  const [boards, setBoards] = useState([]);
  const [isBoardFormOpen, setIsBoardFormOpen] = useState(false);
  const [likedBoards, setLikedBoards] = useState(new Set());

  const fetchBoards = useCallback(async () => {
    try {
      const response = await getBoards(user.accessToken, selectedBoard);
      if (response.status === 200) {
        const sortedBoards = response.data.boards.sort((a, b) => new Date(b.updateAt) - new Date(a.updateAt));
        setBoards(sortedBoards);
        // 사용자가 이미 추천한 게시물 로드
        const liked = new Set(response.data.likedBoards); // likedBoards가 API 응답에 포함된다고 가정
        setLikedBoards(liked);
      } else {
        alert(response.message);
      }
    } catch (error) {
      alert('Error fetching boards. Please try again.');
    }
  }, [user.accessToken, selectedBoard]);

  useEffect(() => {
    if (user && user.accessToken) {
      fetchBoards();
    }
  }, [user, selectedBoard, fetchBoards]);

  const handleBoardCreated = () => {
    fetchBoards();
  };

  const handleRowClick = (item) => {
    setSelectedRow(item);
  };

  const handleRecommend = async (boardId) => {
    try {
      if (likedBoards.has(boardId)) {
        // 이미 추천한 경우 추천 취소
        const confirmUnrecommend = window.confirm("이 건의사항에 대한 추천을 취소하시겠습니까?");
        if (confirmUnrecommend) {
          await unlikePost(boardId, user.accessToken);
          setLikedBoards(prev => {
            const newSet = new Set(prev);
            newSet.delete(boardId);
            return newSet;
          });
          setBoards(prevBoards => prevBoards.map(board => 
            board.boardId === boardId ? { ...board, likes: board.likes - 1 } : board
          ));
          console.log("추천 취소 완료");
        }
      } else {
        // 추천하지 않은 경우 추천 등록
        const confirmRecommend = window.confirm("이 건의사항을 추천하시겠습니까?");
        if (confirmRecommend) {
          await likePost(boardId, user.accessToken);
          setLikedBoards(prev => new Set(prev).add(boardId));
          setBoards(prevBoards => prevBoards.map(board => 
            board.boardId === boardId ? { ...board, likes: board.likes + 1 } : board
          ));
          console.log("추천 완료");
        }
      }
    } catch (error) {
      alert(error.message || '추천 작업 중 오류가 발생했습니다.');
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

  const handleClose = () => {
    setSelectedRow(null);
  };

  const handleBoardSelection = (board) => {
    if (board !== selectedBoard) {
      setSelectedBoard(board);
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
          {[
            ['ALL', '전체 게시판'], 
            ['EMPLOYMENT', '취업 게시판'], 
            ['DEGREE', '학사 게시판'], 
            ['SCHOLARSHIP', '장학 게시판']
          ].map(([value, label]) => (
            <button
              key={value}
              onClick={() => handleBoardSelection(value)}
              className={`board-button ${selectedBoard === value ? 'selected' : ''}`}
              disabled={selectedRow !== null}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="table-container">
          <SuggestionForm onBoardCreated={handleBoardCreated} />
          {isBoardFormOpen && <BoardForm onClose={() => setIsBoardFormOpen(false)} onBoardCreated={handleBoardCreated} />}
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
                <button 
                  className={`recommend-button ${likedBoards.has(selectedRow.boardId) ? 'liked' : ''}`}
                  onClick={() => handleRecommend(selectedRow.boardId)}
                >
                  {likedBoards.has(selectedRow.boardId) ? '추천 취소' : '추천'}
                </button>
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
                  <th className="col5">카테고리</th>
                </tr>
              </thead>
              <tbody>
                {boards.map(item => (
                  <tr key={item.boardId} onClick={() => handleRowClick(item)} className="clickable-row">
                    <td className="col1">{item.likes}</td>
                    <td className="col2">{item.title}</td>
                    <td className="col3">{item.content}</td>
                    <td className="col4">{formatDate(item.updateAt)}</td>
                    <td className="col5">{item.category}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default MainPage;
