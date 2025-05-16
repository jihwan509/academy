import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function AcademyDetail() {
  const { id } = useParams();
  const [academy, setAcademy] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [editMode, setEditMode] = useState(null); // reviewId
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:8080/api/academies/${id}`)
      .then(res => setAcademy(res.data));

    axios.get(`http://localhost:8080/api/academies/${id}/reviews`)
      .then(res => setReviews(res.data));

    axios.get('http://localhost:8080/api/user', { withCredentials: true })
      .then(res => setUser(res.data));
  }, [id]);

  const fetchReviews = () => {
    axios.get(`http://localhost:8080/api/academies/${id}/reviews`)
      .then(res => setReviews(res.data));
  };

  const handleSubmit = async () => {
    try {
      if (editMode) {
        await axios.put(`http://localhost:8080/api/reviews/${editMode}`, {
          academyId: id,
          rating,
          comment
        }, { withCredentials: true });
        setEditMode(null);
      } else {
        await axios.post(`http://localhost:8080/api/reviews`, {
          academyId: id,
          rating,
          comment
        }, { withCredentials: true });
      }
      setRating(0);
      setComment('');
      fetchReviews();
    } catch (err) {
      alert("리뷰 저장 실패");
    }
  };

  const handleEdit = (review) => {
    setEditMode(review.id);
    setRating(review.rating);
    setComment(review.comment);
  };

  const handleDelete = async (reviewId) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    try {
      await axios.delete(`http://localhost:8080/api/reviews/${reviewId}`, { withCredentials: true });
      fetchReviews();
    } catch (err) {
      alert("삭제 실패");
    }
  };

  if (!academy) return <p>로딩 중...</p>;

  return (
    <div>
      <h2>{academy.name}</h2>
      <p>{academy.description}</p>
      <p>{academy.location}</p>
      <p>⭐ 평균 별점: {academy.averageRating?.toFixed(1) || '리뷰 없음'}</p>

      <hr />

      <h3>리뷰 작성</h3>
      <input type="number" value={rating} min={1} max={5} onChange={e => setRating(Number(e.target.value))} placeholder="별점 (1~5)" />
      <br />
      <textarea value={comment} onChange={e => setComment(e.target.value)} placeholder="리뷰 작성" />
      <br />
      <button onClick={handleSubmit}>{editMode ? '수정 완료' : '리뷰 등록'}</button>

      <hr />

      <h3>리뷰 목록</h3>
      {reviews.length > 0 ? reviews.map(review => (
        <div key={review.id} style={{ borderBottom: '1px solid #ccc', marginBottom: 10 }}>
          <p>⭐ {review.rating}</p>
          <p>{review.comment}</p>
          <p style={{ fontSize: '0.9em', color: '#555' }}>{review.userEmail}</p>
          {user?.email === review.userEmail && (
            <>
              <button onClick={() => handleEdit(review)}>수정</button>
              <button onClick={() => handleDelete(review.id)}>삭제</button>
            </>
          )}
        </div>
      )) : <p>아직 리뷰가 없습니다.</p>}
    </div>
  );
}

export default AcademyDetail;
