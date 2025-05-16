import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

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
    <div>
      <h2>커뮤니티</h2>
      <button onClick={() => navigate('/community/new')}>글쓰기</button>
      <ul>
        {posts.map(post => (
          <li key={post.id} onClick={() => navigate(`/community/${post.id}`)} style={{ cursor: 'pointer' }}>
            <strong>{post.title}</strong>
            <p>{post.content.slice(0, 50)}...</p>
            <p style={{ fontSize: '0.8em', color: '#666' }}>{post.authorEmail}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Community;
