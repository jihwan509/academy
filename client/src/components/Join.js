import React, { useState } from 'react';
import axios from 'axios';

function Join() {
  const [user, setUser] = useState({ name: '', email: '', password: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post('http://localhost:8080/api/join', user, {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true,
    });
    alert('가입 성공');
    window.location.href = '/';
  };

  return (
    <div>
      <h2>회원가입</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" value={user.name} onChange={handleChange} placeholder="이름" />
        <input name="email" value={user.email} onChange={handleChange} placeholder="이메일" />
        <input name="password" value={user.password} onChange={handleChange} placeholder="비밀번호" type="password" />
        <button type="submit">가입하기</button>
      </form>
    </div>
  );
}

export default Join;