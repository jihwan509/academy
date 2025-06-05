import React, { useState } from 'react';
import axios from 'axios';
import '../../styles/AdminJoin.css'; // CSS 분리 적용

function AdminJoin() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    businessNumber: ''
  });

  const [verified, setVerified] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [resultMsg, setResultMsg] = useState('');
  const [error, setError] = useState('');
  const [joined, setJoined] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));

    // 사업자번호 변경 시 인증 초기화
    if (name === 'businessNumber') {
      setVerified(false);
      setResultMsg('');
    }
  };

  const verifyBusinessNumber = async () => {
    const bn = form.businessNumber.replace(/[^0-9]/g, '');
    if (bn.length !== 10) {
      setResultMsg('❌ 사업자등록번호는 10자리 숫자여야 합니다.');
      setVerified(false);
      return;
    }

    try {
      setVerifying(true);
      const res = await axios.post('http://localhost:8080/api/business/verify', {
        businessNumber: bn
      }, {
        headers: { 'Content-Type': 'application/json' }
      });

      setResultMsg(res.data);
      setVerified(res.data.startsWith('✅'));
    } catch (err) {
      console.error(err);
      setResultMsg('❌ 서버 오류: 인증 실패');
      setVerified(false);
    } finally {
      setVerifying(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!verified) {
      alert('사업자등록번호 인증이 필요합니다.');
      return;
    }

    try {
      await axios.post('http://localhost:8080/api/admin/join', form, {
        headers: { 'Content-Type': 'application/json' }
      });
      setJoined(true);
      setError('');
      setResultMsg('🎉 관리자 가입이 완료되었습니다.');
    } catch (err) {
      console.error(err);
      setError(err.response?.data || '❌ 회원가입 실패');
    }
  };

  return (
    <div className="admin-join-container">
      <div className="admin-join-card">
        <h2>관리자 회원가입</h2>

        {joined ? (
          <p className="success-msg">🎉 가입이 완료되었습니다. 로그인 페이지로 이동하세요.</p>
        ) : (
          <form className="admin-join-form" onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="이름"
              value={form.name}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="이메일"
              value={form.email}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="비밀번호"
              value={form.password}
              onChange={handleChange}
              required
            />

            <div className="business-number-group">
              <input
                type="text"
                name="businessNumber"
                placeholder="사업자등록번호 (10자리)"
                value={form.businessNumber}
                onChange={handleChange}
                maxLength={10}
                required
              />
              <button
                type="button"
                onClick={verifyBusinessNumber}
                disabled={verifying}
              >
                {verifying ? '인증 중...' : verified ? '✅ 인증완료' : '사업자 인증'}
              </button>
            </div>

            {resultMsg && (
              <p className={resultMsg.startsWith('✅') ? 'success-msg' : 'error-msg'}>
                {resultMsg}
              </p>
            )}

            <button type="submit" disabled={!verified}>
              회원가입
            </button>
          </form>
        )}

        {error && <p className="error-msg">{error}</p>}
      </div>
    </div>
  );
}

export default AdminJoin;
