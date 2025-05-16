import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function PostForm() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      alert("제목과 내용을 입력해주세요.");
      return;
    }

    try {
      const response = await axios.post('http://localhost:8080/api/posts', {
        title,
        content
      }, { withCredentials: true });

      const createdPost = response.data;
      alert("게시글 등록 완료");

      // ✅ 작성된 게시글 상세페이지로 이동
      navigate(`/community/${createdPost.id}`);
    } catch (err) {
      console.error("게시글 등록 실패:", err);
      alert("게시글 등록 실패");
    }
  };

  return (
    <div>
      <h2>글쓰기</h2>
      <input
        type="text"
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="제목"
        style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
      />
      <br />
      <textarea
        value={content}
        onChange={e => setContent(e.target.value)}
        placeholder="내용"
        style={{ width: '100%', height: '200px', padding: '8px' }}
      />
      <br />
      <button onClick={handleSubmit}>등록</button>
    </div>
  );
}

export default PostForm;
