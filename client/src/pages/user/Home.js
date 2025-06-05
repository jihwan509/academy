import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../styles/Home.css';
import AiRecommend from './AiRecommend'; // AI 추천 컴포넌트 불러오기

function Home() {
  const navigate = useNavigate();
  const [topRated, setTopRated] = useState([]);
  const [mostReviewed, setMostReviewed] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchAcademyData = async () => {
      try {
        const topRes = await axios.get('http://localhost:8080/api/academies/top-rated');
        setTopRated(topRes.data || []);

        const mostRes = await axios.get('http://localhost:8080/api/academies/most-reviewed');
        setMostReviewed(mostRes.data || []);
      } catch (error) {
        console.error('데이터 불러오기 오류:', error);
        setTopRated([]);
        setMostReviewed([]);
      }
    };

    fetchAcademyData();
  }, []);

  const handleSearch = () => {
    if (search.trim()) {
      navigate(`/academies?search=${search}`);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  const renderAcademyCard = (academy) => (
    <div
      key={academy.id}
      className="academy-card"
      onClick={() => navigate(`/academies/${academy.id}`)}
    >
      {academy.imageUrl && <img src={academy.imageUrl} alt={academy.name} />}
      <h3>{academy.name}</h3>
      <p>{academy.location}</p>
      <p>{academy.description}</p>
    </div>
  );

  return (
    <div className="home-container">
      <h1 className="section-title">🏠 홈</h1>

      {/* 🤖 AI 학원 추천 도우미 삽입 */}
      <section className="ai-helper-section">
        <AiRecommend />
      </section>

      {/* 🔍 검색창 */}
      <div className="home-search">
        <input
          type="text"
          value={search}
          placeholder="지역 또는 학원명을 입력하세요"
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button onClick={handleSearch}>검색</button>
      </div>

      {/* ⭐ 별점 높은 학원 */}
      <section>
        <h2 className="section-title">⭐ 별점 높은 학원</h2>
        {topRated.length > 0 ? (
          <div className="academy-list grid-3">
            {topRated.slice(0, 3).map(renderAcademyCard)}
          </div>
        ) : (
          <p>별점 높은 학원이 없습니다.</p>
        )}
      </section>

      {/* 🔥 리뷰 많은 학원 */}
      <section>
        <h2 className="section-title">🔥 리뷰 많은 인기 학원</h2>
        {mostReviewed.length > 0 ? (
          <div className="academy-list grid-3">
            {mostReviewed.slice(0, 3).map(renderAcademyCard)}
          </div>
        ) : (
          <p>리뷰 많은 인기 학원이 없습니다.</p>
        )}
      </section>
    </div>
  );
}

export default Home;
