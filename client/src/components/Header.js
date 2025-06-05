import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Header({ user }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // 1️⃣ 백엔드 로그아웃 처리
      await axios.post('http://localhost:8080/logout', {}, { withCredentials: true });
      localStorage.removeItem('user');

      // 2️⃣ 구글 로그아웃을 팝업으로 처리 (사용자에게 Landing Page가 보이지 않도록)
      const googleLogoutUrl =
        'https://accounts.google.com/Logout?continue=https://appengine.google.com/_ah/logout?continue=http://localhost:3000';
      const logoutWindow = window.open(googleLogoutUrl, '_blank', 'width=500,height=600');

      // 3️⃣ 2초 후 팝업 닫고 로그인 페이지로 이동
      setTimeout(() => {
        if (logoutWindow) {
          logoutWindow.close();
        }
        window.location.href = '/';
      }, 2000);
    } catch (error) {
      console.error('로그아웃 실패:', error);
      alert('로그아웃 중 오류 발생');
    }
  };

  const renderStudentMenu = () => (
    <>
      <Link to="/home">홈</Link> |{' '}
      <Link to="/community">커뮤니티</Link> |{' '}
      <Link to="/academies">학원 찾기</Link> |{' '}
      <Link to="/userInfo">내 정보</Link> |{' '}
      <button onClick={handleLogout} style={buttonStyle}>로그아웃</button>
    </>
  );

  const renderAdminMenu = () => (
    <>
      <Link to="/home">홈</Link> |{' '}
      <Link to="/admin">관리자 홈</Link> |{' '}
      <Link to="/admin-mypage">관리자 마이페이지</Link> |{' '}
      <button onClick={handleLogout} style={buttonStyle}>로그아웃</button>
    </>
  );

  const buttonStyle = {
    background: 'none',
    border: 'none',
    color: 'blue',
    cursor: 'pointer'
  };

  return (
    <header style={{ padding: '1rem', backgroundColor: '#eee' }}>
      <nav>
        {!user && (
          <>
            <Link to="/login">로그인</Link> | <Link to="/signup">회원가입</Link>
          </>
        )}
        {user?.role === 'ROLE_USER' && renderStudentMenu()}
        {user?.role === 'ROLE_ADMIN' && renderAdminMenu()}
      </nav>
    </header>
  );
}

export default Header;
