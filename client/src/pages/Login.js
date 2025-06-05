import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/Login.css'; // ✅ CSS 파일 import

function Login() {
  const navigate = useNavigate();
  const [user, setUser] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

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
        localStorage.setItem('user', JSON.stringify(res.data));

        navigate(role?.toUpperCase() === 'ROLE_ADMIN' ? '/admin' : '/home');
        window.location.reload();
      }
    } catch (error) {
      setError('이메일 또는 비밀번호가 올바르지 않습니다.');
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:8080/oauth2/authorization/google?prompt=login";
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">로그인</h1>
        <p className="login-subtext">AI 학원 추천 플랫폼에 오신 걸 환영합니다</p>

        {error && <p className="login-error">{error}</p>}

        <form onSubmit={handleSubmit}>
          <input
            name="email"
            type="email"
            placeholder="이메일"
            value={user.email}
            onChange={handleChange}
            className="login-input"
          />
          <input
            name="password"
            type="password"
            placeholder="비밀번호"
            value={user.password}
            onChange={handleChange}
            className="login-input"
          />
          <button type="submit" className="login-button">로그인</button>
        </form>

        <div className="login-footer">
          <Link to="/join">회원가입</Link>
          <Link to="/admin/join" className="text-blue-500 hover:underline">
            관리자 회원가입
          </Link>

          <button onClick={handleGoogleLogin} className="link-button">Google로 로그인</button>
        </div>
      </div>
    </div>
  );
}

export default Login;
