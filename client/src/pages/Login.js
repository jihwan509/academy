import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

function Login() {
  const navigate = useNavigate();
  const [user, setUser] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('email', user.email);
      formData.append('password', user.password);

      const response = await axios.post('http://localhost:8080/loginProc', formData, {
        withCredentials: true,
      });

      if (response.status === 200) {
        const res = await axios.get('http://localhost:8080/api/user', { withCredentials: true });
        const role = res.data.role;
        console.log("로그인된 역할:", role);
        localStorage.setItem('user', JSON.stringify(res.data));

        if (role && role.toUpperCase() === 'ROLE_ADMIN') {
          navigate('/admin');
        } else {
          navigate('/home');
        }
        window.location.reload();
      }
    } catch (error) {
      alert('로그인 실패');
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:8080/oauth2/authorization/google?prompt=login";
  };

  return (
    <div>
      <h2>로그인</h2>
      <form onSubmit={handleSubmit}>
        <input name="email" value={user.email} onChange={handleChange} placeholder="이메일" />
        <input name="password" type="password" value={user.password} onChange={handleChange} placeholder="비밀번호" />
        <button type="submit">로그인</button>
      </form>
      <Link to="/join">회원가입</Link>
      <button onClick={handleGoogleLogin}>구글로 로그인</button>
    </div>
  );
}

export default Login;
