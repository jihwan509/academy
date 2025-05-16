import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

function AcademyRegister() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const academyId = queryParams.get('id');

  const [academy, setAcademy] = useState({
    name: '',
    description: '',
    location: '',
    imageUrl: ''
  });

  useEffect(() => {
    if (academyId) {
      axios.get(`http://localhost:8080/api/academies/${academyId}`, { withCredentials: true })
        .then(res => setAcademy(res.data))
        .catch(() => alert('학원 정보를 불러오지 못했습니다.'));
    }
  }, [academyId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAcademy({ ...academy, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (academyId) {
        await axios.put(`http://localhost:8080/api/academies/${academyId}`, academy, {
          withCredentials: true
        });
        alert('학원 수정 완료!');
      } else {
        await axios.post('http://localhost:8080/api/academies', academy, {
          withCredentials: true
        });
        alert('학원 등록 완료!');
      }
      navigate('/admin');
    } catch (err) {
      alert('저장 실패');
    }
  };

  return (
    <div>
      <h2>{academyId ? '학원 수정' : '학원 등록'}</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" value={academy.name} onChange={handleChange} placeholder="학원명" required />
        <input name="description" value={academy.description} onChange={handleChange} placeholder="설명" required />
        <input name="location" value={academy.location} onChange={handleChange} placeholder="위치" required />
        <input name="imageUrl" value={academy.imageUrl} onChange={handleChange} placeholder="이미지 URL" />
        <button type="submit">{academyId ? '수정' : '등록'}</button>
      </form>
    </div>
  );
}

export default AcademyRegister;
