import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

function AcademyList() {
  const navigate = useNavigate();
  const location = useLocation();
  const [academies, setAcademies] = useState([]);

  useEffect(() => {
    const query = new URLSearchParams(location.search).get('search') || '';
    axios.get(`http://localhost:8080/api/academies?search=${query}`, {
      withCredentials: true,
    })
      .then(res => setAcademies(res.data))
      .catch(() => setAcademies([]));
  }, [location.search]);

  return (
    <div>
      <h2>학원 목록</h2>
      {Array.isArray(academies) && academies.map(academy => (
        <div key={academy.id} onClick={() => navigate(`/academies/${academy.id}`)} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px', cursor: 'pointer' }}>
          <strong>{academy.name}</strong> - {academy.location}
          <p>{academy.description}</p>
          <p>⭐ 평균 별점: {academy.averageRating?.toFixed(1) || '리뷰 없음'}</p>
        </div>
      ))}
    </div>
  );
}

export default AcademyList;
