import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import '../../styles/PostDetail.css';

function PostDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState('');
  const [editId, setEditId] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:8080/api/posts/${id}`).then(res => setPost(res.data));
    axios.get(`http://localhost:8080/api/comments/${id}`).then(res => setComments(res.data));
    axios.get(`http://localhost:8080/api/user`, { withCredentials: true }).then(res => setUser(res.data));
  }, [id]);

  const fetchComments = () => {
    axios.get(`http://localhost:8080/api/comments/${id}`).then(res => setComments(res.data));
  };

  const handleSubmit = async () => {
    try {
      if (editId) {
        await axios.put(`http://localhost:8080/api/comments/${editId}`, { postId: id, content: comment }, { withCredentials: true });
        setEditId(null);
      } else {
        await axios.post(`http://localhost:8080/api/comments`, { postId: id, content: comment }, { withCredentials: true });
      }
      setComment('');
      fetchComments();
    } catch {
      alert("댓글 등록 실패");
    }
  };

  const handleEdit = (c) => {
    setEditId(c.id);
    setComment(c.content);
  };

  const handleDelete = async (commentId) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    await axios.delete(`http://localhost:8080/api/comments/${commentId}`, { withCredentials: true });
    fetchComments();
  };

  if (!post) return <p>로딩 중...</p>;

  return (
    <div className="post-detail-container">
      <div className="post-card">
        <h2 className="post-title">{post.title}</h2>
        <p className="post-content">{post.content}</p>
        <p className="post-author">✉ {post.authorEmail}</p>
      </div>

      <div className="comment-section">
        <h3 className="comment-title">💬 댓글</h3>
        <textarea
          value={comment}
          onChange={e => setComment(e.target.value)}
          placeholder="댓글을 입력하세요"
          rows={4}
        />
        <button onClick={handleSubmit}>
          {editId ? '수정 완료' : '댓글 등록'}
        </button>

        <ul className="comment-list">
          {comments.map(c => (
            <li key={c.id}>
              <p>{c.content}</p>
              <div className="comment-meta">
                <span>✉ {c.authorEmail}</span>
                {user?.email === c.authorEmail && (
                  <span className="comment-actions">
                    <button onClick={() => handleEdit(c)}>수정</button>
                    <button onClick={() => handleDelete(c.id)}>삭제</button>
                  </span>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default PostDetail;
