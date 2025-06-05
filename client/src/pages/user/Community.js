import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../styles/Community.css';

function Community() {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:8080/api/posts')
      .then(res => {
        const data = res.data;
        setPosts(Array.isArray(data) ? data : []);
      })
      .catch(() => setPosts([]));
  }, []);

  return (
    <div className="community-container">
      <div className="community-header">
        <h2>📢 커뮤니티</h2>
        <button className="write-button" onClick={() => navigate('/community/new')}>글쓰기</button>
      </div>

      <div className="post-list">
        {posts.length > 0 ? posts.map(post => (
          <div
            key={post.id}
            className="post-card"
            onClick={() => navigate(`/community/${post.id}`)}
          >
            <div className="post-title">{post.title}</div>
            <div className="post-content">{post.content.slice(0, 100)}...</div>
            <div className="post-meta">✉ {post.authorEmail}</div>
          </div>
        )) : (
          <p>게시글이 없습니다.</p>
        )}
      </div>
    </div>
  );
}

export default Community;
