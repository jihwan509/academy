import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Header({ user }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:8080/logout', {}, { withCredentials: true });
      localStorage.removeItem('user');
      navigate('/');
      window.location.reload();
    } catch (error) {
      console.error('로그아웃 실패:', error);
      alert('로그아웃 중 오류 발생');
    }
  };

  return (
    <header style={{ padding: '1rem', backgroundColor: '#eee' }}>
      <nav>
        <Link to="/home">홈</Link> |{' '}
        {user && <Link to="/community">커뮤니티</Link>} |{' '}
        {user && <Link to="/academies">학원 찾기</Link>} |{' '}
        {user?.role === 'ROLE_ADMIN' && <Link to="/admin">관리자</Link>} |{' '}
        <Link to="/userInfo">내 정보</Link> |{' '}
        <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: 'blue', cursor: 'pointer' }}>
          로그아웃
        </button>
      </nav>
    </header>
  );
}

export default Header;