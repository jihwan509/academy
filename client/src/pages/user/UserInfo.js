import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function UserInfo() {
  const navigate = useNavigate();
  const [user, setUser] = useState({ name: '', email: '', role: '' });

  useEffect(() => {
    axios.get('http://localhost:8080/api/user', { withCredentials: true })
      .then(res => setUser(res.data))
      .catch(() => {
        alert('로그인이 필요합니다.');
        navigate('/');
      });
  }, []);

  return (
    <div>
      <h2>마이페이지</h2>
      <p>이름: {user.name}</p>
      <p>이메일: {user.email}</p>
      <p>권한: {user.role}</p>
    </div>
  );
}

export default UserInfo;