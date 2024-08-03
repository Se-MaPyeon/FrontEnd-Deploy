import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/css/Header.css';
import mapyeniImage from '../assets/img/마편이.jpg';
import { AuthContext } from '../context/AuthContext'

function Header() {
  const { isLogin, handleLogout } = useContext(AuthContext);
  const navigate = useNavigate();

  // 우측 버튼1: 메인페이지 이동 구현
  const handleNavigateToMain = () => {
    if(isLogin){
      navigate('/main');
    }
    else{
      alert('로그인이 필요합니다.');
      navigate('/login');
    }
  };
  // 우측 버튼2: 마이페이지 이동 구현
  const handleNavigateToMyPage = () => {
    if (isLogin) {
      navigate('/mypage')
    }
    else{
      alert('로그인이 필요합니다.');
      navigate('/login');
    }
  };
  // 우측 버튼 3: 로그아웃도 나중에 구현
  const handleLogoutClick = () => {
    handleLogout();
    navigate('/login');
  };
  // left-section 클릭시 메인페이지 이동
  const handleLeftSectionClick = () => {
    if (isLogin) {
      navigate('/main');
    }
  };

  return (
    <div className="header">
      <div className="left-section" onClick={handleLeftSectionClick} style={{ cursor: isLogin ? 'pointer' : 'default' }}>
        <img src={mapyeniImage} alt="Example Logo" className="logo" />
        <div className="text-container">
          <span className="title">SE-MAPYEON</span>
          <span className="subtitle">SUGGESTION BOX FOR SEJONG UNIV</span>
        </div>
      </div>
      <div className="right-section">
        <button className='right-button' disabled={!isLogin} onClick={handleNavigateToMain}>건의함</button>
        <button className='right-button' disabled={!isLogin} onClick={handleNavigateToMyPage}>마이페이지</button>
        <button className='right-button' disabled={!isLogin} onClick={handleLogoutClick}>로그아웃</button>
      </div>
    </div>
  );
}

export default Header;