import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../styles/UserInfo.css';

function UserInfo() {
  const [user, setUser] = useState(null);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState('');
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '' });
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:8080/api/user', { withCredentials: true })
      .then(res => {
        setUser(res.data);
        setPreview(res.data.profileImageUrl || 'https://cdn-icons-png.flaticon.com/512/1358/1358034.png');
      })
      .catch(() => alert('사용자 정보를 불러오지 못했습니다.'));
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const uploadImage = async () => {
    const formData = new FormData();
    formData.append('file', image);
    try {
      await axios.put('http://localhost:8080/api/user/image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true
      });
      alert('프로필 이미지가 변경되었습니다.');
    } catch {
      alert('이미지 업로드 실패');
    }
  };

  const handlePasswordChange = async () => {
    try {
      await axios.put('http://localhost:8080/api/user/password', passwordData, { withCredentials: true });
      alert('비밀번호가 변경되었습니다.');
      setPasswordData({ currentPassword: '', newPassword: '' });
      setIsChangingPassword(false);
    } catch (err) {
      alert('비밀번호 변경 실패: 현재 비밀번호가 틀렸을 수 있습니다.');
    }
  };

  if (!user) return <p>로딩 중...</p>;

  return (
    <div className="user-info-container">
      <div className="user-card">
        <h2 className="user-title">마이페이지</h2>
        <div className="profile-section">
          <img src={preview} alt="프로필" className="profile-image" />
          <input type="file" accept="image/*" onChange={handleImageChange} />
          {image && <button className="upload-btn" onClick={uploadImage}>이미지 저장</button>}
        </div>

        <div className="user-detail"><label>이름</label><p>{user.name}</p></div>
        <div className="user-detail"><label>이메일</label><p>{user.email}</p></div>
        <div className="user-detail"><label>권한</label><p>{user.role}</p></div>

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

export default UserInfo;
