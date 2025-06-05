import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import '../../styles/AcademyRegister.css';

function AcademyRegister() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const academyId = queryParams.get('id');

  const [academy, setAcademy] = useState({
    name: '',
    description: '',
    location: '',
    phone: '' // ✅ 전화번호 추가
  });

  const [coverImage, setCoverImage] = useState(null);
  const [coverPreview, setCoverPreview] = useState('');
  const [images, setImages] = useState([]);
  const [dragOver, setDragOver] = useState(false);

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
        await axios.put(`http://localhost:8080/api/academies/${academyId}`, academy, { withCredentials: true });
        alert('학원 수정 완료!');
      } else {
        await axios.post('http://localhost:8080/api/academies', academy, { withCredentials: true });
        alert('학원 등록 완료!');
      }
      navigate('/admin');
    } catch (err) {
      alert('저장 실패');
    }
  };

  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverImage(file);
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(prev => [...prev, ...files]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    setImages(prev => [...prev, ...files]);
    setDragOver(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  // ✅ AI 홍보 문구 생성 (전화번호도 포함)
  const generatePromo = async () => {
  try {
    const prompt = `
아래 학원 정보를 바탕으로 강력하고 인상적인 홍보 멘트를 만들어줘.
학원명: ${academy.name}
설명: ${academy.description}
위치: ${academy.location}
전화번호: ${academy.phone}
`;

    const response = await axios.post('https://api.openai.com/v1/chat/completions',
      {
        model: "gpt-4o",
        messages: [
          { role: "system", content: "당신은 마케팅 전문가입니다." },
          { role: "user", content: prompt }
        ]
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`
        }
      }
    );

    const aiMessage = response.data.choices[0].message.content.trim();

    // ✅ description에 바로 입력
    setAcademy(prev => ({
      ...prev,
      description: aiMessage
    }));

    alert('AI 홍보 문구가 설명에 입력되었습니다!');
  } catch (error) {
    console.error(error);
    alert('AI 홍보 문구 생성 실패');
  }
};


  return (
    <div className="academy-register-container">
      <div className="academy-register-card">
        <h2 className="academy-register-title">
          {academyId ? '학원 정보 수정' : '학원 등록'}
        </h2>
        <form onSubmit={handleSubmit} className="academy-form">
          <input
            type="text"
            name="name"
            value={academy.name}
            onChange={handleChange}
            placeholder="학원명"
            required
          />
          <textarea
            name="description"
            value={academy.description}
            onChange={handleChange}
            placeholder="학원 설명"
            rows={15}
            required
          />
          <input
            type="text"
            name="location"
            value={academy.location}
            onChange={handleChange}
            placeholder="학원 위치"
            required
          />
          {/* ✅ 전화번호 입력란 */}
          <input
            type="text"
            name="phone"
            value={academy.phone}
            onChange={handleChange}
            placeholder="학원 전화번호"
          />

          {/* ✅ AI 홍보 멘트 생성 버튼 */}
          <button
            type="button"
            onClick={generatePromo}
            className="ai-generate-btn"
          >
            AI 홍보 멘트 생성
          </button>

          <label>대표 이미지 업로드</label>
          <input type="file" accept="image/*" onChange={handleCoverChange} />
          {coverPreview && <img src={coverPreview} alt="대표 이미지 미리보기" className="cover-preview" />}

          <label>상세 이미지 업로드 (여러 장 가능)</label>
          <div
            className={`drop-zone ${dragOver ? 'drag-over' : ''}`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <p>여기로 이미지를 드래그하거나 클릭하여 업로드하세요</p>
            <input type="file" accept="image/*" multiple onChange={handleFileChange} />
          </div>

          {images.length > 0 && (
            <div className="image-preview">
              {images.map((img, index) => (
                <img
                  key={index}
                  src={URL.createObjectURL(img)}
                  alt={`preview-${index}`}
                  className="preview-img"
                />
              ))}
            </div>
          )}

          <button type="submit" className="academy-submit-btn">
            {academyId ? '수정하기' : '등록하기'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AcademyRegister;
