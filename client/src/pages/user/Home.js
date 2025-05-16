import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Home() {
  const navigate = useNavigate();
  const [topRated, setTopRated] = useState([]);
  const [mostReviewed, setMostReviewed] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    axios.get('http://localhost:8080/api/academies/top-rated')
      .then(res => setTopRated(res.data))
      .catch(() => setTopRated([]));

    axios.get('http://localhost:8080/api/academies/most-reviewed')
      .then(res => setMostReviewed(res.data))
      .catch(() => setMostReviewed([]));
  }, []);

  const handleSearch = () => {
    if (search.trim()) {
      navigate(`/academies?search=${search}`);
    }
  };

  return (
    <div>
      <h1>홈</h1>

      {/* 🔍 검색창 */}
      <div>
        <input
          type="text"
          value={search}
          placeholder="지역 또는 학원명을 입력하세요"
          onChange={(e) => setSearch(e.target.value)}
        />
        <button onClick={handleSearch}>검색</button>
      </div>

      {/* ⭐ 별점 높은 학원 */}
      <section>
        <h2>⭐ 별점 높은 학원</h2>
        {Array.isArray(topRated) && topRated.length > 0 ? (
          topRated.map(academy => (
            <div key={academy.id} onClick={() => navigate(`/academies/${academy.id}`)}>
              <strong>{academy.name}</strong> - {academy.location}
              <p>{academy.description}</p>
              {academy.imageUrl && (
                <img src={academy.imageUrl} alt={academy.name} width="150" />
              )}
            </div>
          ))
        ) : (
          <p>학원 정보가 없습니다.</p>
        )}
      </section>

      {/* 🔥 리뷰 많은 인기 학원 */}
      <section>
        <h2>🔥 인기 학원</h2>
        {Array.isArray(mostReviewed) && mostReviewed.length > 0 ? (
          mostReviewed.map(academy => (
            <div key={academy.id} onClick={() => navigate(`/academies/${academy.id}`)}>
              <strong>{academy.name}</strong> - {academy.location}
              <p>{academy.description}</p>
              {academy.imageUrl && (
                <img src={academy.imageUrl} alt={academy.name} width="150" />
              )}
            </div>
          ))
        ) : (
          <p>인기 학원이 없습니다.</p>
        )}
      </section>
    </div>
  );
}

export default Home;
