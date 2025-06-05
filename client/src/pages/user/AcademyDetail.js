import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import '../../styles/AcademyDetail.css';

function AcademyDetail() {
  const { id } = useParams();
  const [academy, setAcademy] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [editMode, setEditMode] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:8080/api/academies/${id}`)
      .then(res => setAcademy(res.data));

    fetchReviews();

    axios.get('http://localhost:8080/api/user', { withCredentials: true })
      .then(res => setUser(res.data));
  }, [id]);

  const fetchReviews = () => {
    axios.get(`http://localhost:8080/api/academies/${id}/reviews`)
      .then(res => setReviews(res.data));
  };

  const handleSubmit = async () => {
    if (rating === 0 || comment.trim() === '') {
      alert('별점과 내용을 모두 입력해주세요.');
      return;
    }

    const payload = { academyId: Number(id), rating, comment };

    try {
      if (editMode) {
        await axios.put(`http://localhost:8080/api/reviews/${editMode}`, payload, { withCredentials: true });
        setEditMode(null);
      } else {
        await axios.post(`http://localhost:8080/api/reviews`, payload, { withCredentials: true });
      }
      setRating(0);
      setHoverRating(0);
      setComment('');
      fetchReviews();
    } catch {
      alert('리뷰 저장 실패');
    }
  };

  const handleEdit = (review) => {
    setEditMode(review.id);
    setRating(review.rating);
    setHoverRating(review.rating);
    setComment(review.comment);
  };

  const handleDelete = async (reviewId) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    try {
      await axios.delete(`http://localhost:8080/api/reviews/${reviewId}`, { withCredentials: true });
      fetchReviews();
    } catch {
      alert('삭제 실패');
    }
  };

  const calculateAverageRating = () => {
    if (reviews.length === 0) return null;
    const total = reviews.reduce((sum, r) => sum + r.rating, 0);
    return (total / reviews.length).toFixed(1);
  };

  const renderStars = (value, editable = false, onClick = () => {}) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      const filled = editable ? hoverRating >= i : value >= i;
      stars.push(
        <span
          key={i}
          className={`star ${filled ? 'filled' : 'empty'} ${editable ? 'clickable' : ''}`}
          onClick={() => editable && onClick(i)}
          onMouseEnter={() => editable && setHoverRating(i)}
          onMouseLeave={() => editable && setHoverRating(rating)}
        >
          {filled ? '★' : '☆'}
        </span>
      );
    }
    return <div className="stars">{stars}</div>;
  };

  if (!academy) return <p>로딩 중...</p>;

  return (
    <div className="academy-detail">
      <h2>{academy.name}</h2>
      <p>{academy.description}</p>
      <p>{academy.location}</p>
      <p className="average-rating">⭐ 평균 별점: {calculateAverageRating() || '리뷰 없음'}</p>

      <hr />

      <div className="review-form">
        <h3>{editMode ? '리뷰 수정' : '리뷰 작성'}</h3>
        {renderStars(rating, true, setRating)}
        <textarea
          value={comment}
          onChange={e => setComment(e.target.value)}
          placeholder="리뷰를 입력하세요"
          rows={3}
        />
        <button onClick={handleSubmit}>{editMode ? '수정 완료' : '리뷰 등록'}</button>
      </div>

      <hr />

      <h3>리뷰 목록</h3>
      {reviews.length > 0 ? reviews.map(review => (
        <div key={review.id} className="review-card">
          {renderStars(review.rating, false)}
          <p>{review.comment}</p>
          <p className="review-meta">{review.userEmail}</p>
          {user?.email === review.userEmail && (
            <div className="review-actions">
              <button onClick={() => handleEdit(review)}>수정</button>
              <button onClick={() => handleDelete(review.id)}>삭제</button>
            </div>
          )}
        </div>
      )) : <p>아직 리뷰가 없습니다.</p>}
    </div>
  );
}

export default AcademyDetail;
