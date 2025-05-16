import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function OauthRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:8080/api/user', { withCredentials: true })
      .then(res => {
        localStorage.setItem('user', JSON.stringify(res.data));
        const role = res.data.role;
        if (role && role.toUpperCase() === 'ROLE_ADMIN') {
          navigate('/admin');
        } else {
          navigate('/home');
        }
        window.location.reload();
      })
      .catch(() => {
        alert('OAuth 인증 실패');
        navigate('/');
      });
  }, [navigate]);

  return <div>OAuth 로그인 처리 중...</div>;
}

export default OauthRedirect;