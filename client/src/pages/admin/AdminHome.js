import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

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
      fetchAcademies(); // 목록 갱신
    } catch (err) {
      alert('삭제 실패');
    }
  };

  return (
    <div>
      <h2>관리자 대시보드</h2>
      <button onClick={() => navigate('/admin/register')}>학원 등록하기</button>

      <ul>
        {academies.map(academy => (
          <li key={academy.id}>
            <strong>{academy.name}</strong> - {academy.location}
            <p>{academy.description}</p>
            {academy.imageUrl && <img src={academy.imageUrl} alt={academy.name} width="150" />}
            <div>
              <button onClick={() => navigate(`/admin/register?id=${academy.id}`)}>수정</button>
              <button onClick={() => handleDelete(academy.id)}>삭제</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AdminHome;
