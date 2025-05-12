import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Home() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({ name: '', email: '', role: '' });

  useEffect(() => {
    axios.get('http://localhost:8080/api/user', { withCredentials: true })
      .then(res => setUserData(res.data))
      .catch(() => {
        alert('로그인이 필요합니다.');
        navigate('/');
      });
  }, []);

  const handleLogout = async () => {
  try {
    await axios.post('http://localhost:8080/logout', {}, { withCredentials: true });
  } catch (error) {
    console.error('로그아웃 실패:', error); // 실패해도 무시 가능
  } finally {
    alert('로그아웃 되었습니다.');
    navigate('/'); // 로그인 페이지로 이동
  }
};


  return (
    <div>
      <h1>홈</h1>
      <p>이름: {userData.name}</p>
      <p>이메일: {userData.email}</p>
      <p>권한: {userData.role}</p>
      <button onClick={handleLogout}>로그아웃</button>
      <button onClick={() => navigate('/userInfo')}>마이페이지</button>
      {userData.role === 'ROLE_ADMIN' && <button onClick={() => navigate('/admin')}>어드민 페이지</button>}
    </div>
  );
}

export default Home;