import React, { useState } from 'react';
import axios from 'axios';
import '../styles/Join.css';

function Join() {
  const [user, setUser] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8080/api/join', user, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      });
      alert('가입 성공');
      window.location.href = '/';
    } catch (err) {
      setError('가입 실패: ' + (err.response?.data || '서버 오류'));
    }
  };

  return (
    <div className="join-container">
      <div className="join-card">
        <h2>회원가입</h2>
        <form className="join-form" onSubmit={handleSubmit}>
          <input
            name="name"
            value={user.name}
            onChange={handleChange}
            placeholder="이름"
            required
          />
          <input
            name="email"
            value={user.email}
            onChange={handleChange}
            placeholder="이메일"
            type="email"
            required
          />
          <input
            name="password"
            value={user.password}
            onChange={handleChange}
            placeholder="비밀번호"
            type="password"
            required
          />
          <button type="submit">가입하기</button>
        </form>
        {error && <p className="error-msg">{error}</p>}
      </div>
    </div>
  );
}

export default Join;
