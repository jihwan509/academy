import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function PostWrite() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      await axios.post('http://localhost:8080/api/posts', { title, content }, { withCredentials: true });
      alert('게시글 등록 완료');
      navigate('/community');
    } catch {
      alert('등록 실패');
    }
  };

  return (
    <div>
      <h2>게시글 작성</h2>
      <input value={title} onChange={e => setTitle(e.target.value)} placeholder="제목" />
      <br />
      <textarea value={content} onChange={e => setContent(e.target.value)} placeholder="내용" />
      <br />
      <button onClick={handleSubmit}>등록</button>
    </div>
  );
}

export default PostWrite;
