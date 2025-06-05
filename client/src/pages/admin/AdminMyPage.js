import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../styles/UserInfo.css'; // 기존 스타일 재활용

function AdminMyPage() {
  const [user, setUser] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [profilePreview, setProfilePreview] = useState('');
  const [businessImage, setBusinessImage] = useState(null);
  const [businessPreview, setBusinessPreview] = useState('');
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '' });
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:8080/api/user', { withCredentials: true })
      .then(res => {
        setUser(res.data);
        setProfilePreview(res.data.profileImageUrl || 'https://cdn-icons-png.flaticon.com/512/1358/1358034.png');
        setBusinessPreview(res.data.businessImageUrl || '');
      })
      .catch(() => alert('사용자 정보를 불러오지 못했습니다.'));
  }, []);

  const handleProfileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      setProfilePreview(URL.createObjectURL(file));
    }
  };

  const handleBusinessImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBusinessImage(file);
      setBusinessPreview(URL.createObjectURL(file));
    }
  };

  const uploadImage = async (type) => {
    const formData = new FormData();
    const file = type === 'profile' ? profileImage : businessImage;
    if (!file) return alert('파일을 선택해주세요.');

    formData.append('file', file);

    try {
      const endpoint = type === 'profile'
        ? 'http://localhost:8080/api/user/image'
        : 'http://localhost:8080/api/user/business-image';

      await axios.put(endpoint, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true
      });

      alert(`${type === 'profile' ? '프로필' : '사업자등록증'} 이미지가 업로드되었습니다.`);
    } catch {
      alert(`${type === 'profile' ? '프로필' : '사업자등록증'} 이미지 업로드 실패`);
    }
  };

  const handlePasswordChange = async () => {
    try {
      await axios.put('http://localhost:8080/api/user/password', passwordData, { withCredentials: true });
      alert('비밀번호가 변경되었습니다.');
      setPasswordData({ currentPassword: '', newPassword: '' });
      setIsChangingPassword(false);
    } catch {
      alert('비밀번호 변경 실패: 현재 비밀번호가 틀렸을 수 있습니다.');
    }
  };

  if (!user) return <p>로딩 중...</p>;

  return (
    <div className="user-info-container">
      <div className="user-card">
        <h2 className="user-title">관리자 마이페이지</h2>

        {/* 프로필 이미지 */}
        <div className="profile-section">
          <h4>프로필 이미지</h4>
          <img src={profilePreview} alt="프로필" className="profile-image" />
          <input type="file" accept="image/*" onChange={handleProfileChange} />
          {profileImage && <button className="upload-btn" onClick={() => uploadImage('profile')}>저장</button>}
        </div>

        {/* 사업자등록증 이미지 */}
        <div className="profile-section">
          <h4>사업자등록증 이미지</h4>
          {businessPreview && <img src={businessPreview} alt="사업자등록증" className="profile-image" />}
          <input type="file" accept="image/*" onChange={handleBusinessImageChange} />
          {businessImage && <button className="upload-btn" onClick={() => uploadImage('business')}>저장</button>}
        </div>

        <div className="user-detail"><label>이름</label><p>{user.name}</p></div>
        <div className="user-detail"><label>이메일</label><p>{user.email}</p></div>
        <div className="user-detail"><label>권한</label><p>{user.role}</p></div>

        {/* 비밀번호 변경 */}
        <div className="password-section">
          <button className="toggle-password-btn" onClick={() => setIsChangingPassword(!isChangingPassword)}>
            {isChangingPassword ? '비밀번호 변경 취소' : '비밀번호 변경'}
          </button>
          {isChangingPassword && (
            <div className="password-form">
              <input
                type="password"
                placeholder="현재 비밀번호"
                value={passwordData.currentPassword}
                onChange={e => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
              />
              <input
                type="password"
                placeholder="새 비밀번호"
                value={passwordData.newPassword}
                onChange={e => setPasswordData({ ...passwordData, newPassword: e.target.value })}
              />
              <button className="save-password-btn" onClick={handlePasswordChange}>변경하기</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminMyPage;
