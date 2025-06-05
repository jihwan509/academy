import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import '../../styles/AcademyList.css';

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
    <div className="academy-list-container">
      <h2 className="academy-title">📚 학원 목록</h2>
      {Array.isArray(academies) && academies.length > 0 ? (
        <div className="academy-grid">
          {academies.map(academy => (
            <div
              key={academy.id}
              className="academy-card"
              onClick={() => navigate(`/academies/${academy.id}`)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && navigate(`/academies/${academy.id}`)}
            >
              {academy.imageUrl && (
                <img src={academy.imageUrl} alt={academy.name} className="academy-image" />
              )}
              <div className="academy-info">
                <h3>{academy.name}</h3>
                <p className="location">📍 {academy.location}</p>
                <p className="description">{academy.description}</p>
                <p className="rating">⭐ 평균 별점: {academy.averageRating?.toFixed(1) || '리뷰 없음'}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>검색된 학원이 없습니다.</p>
      )}
    </div>
  );
}

export default AcademyList;
