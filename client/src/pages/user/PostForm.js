import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../styles/PostForm.css';

function PostForm() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!title || !content) {
      alert("제목과 내용을 입력해주세요.");
      return;
    }

    try {
      await axios.post('http://localhost:8080/api/posts', {
        title,
        content
      }, { withCredentials: true });
      alert("작성 완료!");
      navigate('/community');
    } catch {
      alert("글 작성 실패");
    }
  };

  return (
    <div className="post-form-container">
      <h2 className="form-title">✍ 글쓰기</h2>
      <input
        type="text"
        className="form-input"
        placeholder="제목을 입력하세요"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <textarea
        className="form-textarea"
        placeholder="내용을 입력하세요"
        rows={10}
        value={content}
        onChange={e => setContent(e.target.value)}
      />
      <button className="form-button" onClick={handleSubmit}>등록</button>
    </div>
  );
}

export default PostForm;
