import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../styles/AdminHome.css'; // 스타일 파일 import

function AdminHome() {
  const navigate = useNavigate();
  const [academies, setAcademies] = useState([]);

  const fetchAcademies = () => {
    axios.get('http://localhost:8080/api/academies', { withCredentials: true })
      .then(res => setAcademies(res.data))
      .catch(err => console.error('학원 목록 불러오기 실패:', err));
  };

  useEffect(() => {
    fetchAcademies();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;
    try {
      await axios.delete(`http://localhost:8080/api/academies/${id}`, { withCredentials: true });
      alert('삭제 완료');
      fetchAcademies();
    } catch (err) {
      alert('삭제 실패');
    }
  };

  return (
    <div className="admin-dashboard">
      <h2>관리자 대시보드</h2>
      <button className="register-button" onClick={() => navigate('/admin/register')}>학원 등록하기</button>

      <div className="academy-list">
        {academies.map(academy => (
          <div key={academy.id} className="academy-card">
            <h3>{academy.name}</h3>
            <p>{academy.location}</p>
            <p>{academy.description}</p>
            {academy.imageUrl && (
              <img src={academy.imageUrl} alt={academy.name} className="academy-img" />
            )}
            <div className="card-actions">
              <button className="edit-btn" onClick={() => navigate(`/admin/register?id=${academy.id}`)}>수정</button>
              <button className="delete-btn" onClick={() => handleDelete(academy.id)}>삭제</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminHome;
