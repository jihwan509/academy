import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState('');
  const [editId, setEditId] = useState(null);
  const [user, setUser] = useState(null);

  // ✅ 게시글 수정 상태
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  // ✅ 게시글, 댓글, 사용자 불러오기
  useEffect(() => {
    if (isNaN(id)) return; // 잘못된 접근 차단

    axios.get(`http://localhost:8080/api/posts/${id}`)
      .then(res => {
        setPost(res.data);
        setTitle(res.data.title);
        setContent(res.data.content);
      });

    axios.get(`http://localhost:8080/api/comments/${id}`)
      .then(res => setComments(res.data));

    axios.get('http://localhost:8080/api/user', { withCredentials: true })
      .then(res => setUser(res.data));
  }, [id]);

  const fetchComments = () => {
    axios.get(`http://localhost:8080/api/comments/${id}`)
      .then(res => setComments(res.data));
  };

  // ✅ 댓글 등록 / 수정
  const handleCommentSubmit = async () => {
    try {
      if (editId) {
        await axios.put(`http://localhost:8080/api/comments/${editId}`, {
          postId: id,
          content: comment
        }, { withCredentials: true });
        setEditId(null);
      } else {
        await axios.post(`http://localhost:8080/api/comments`, {
          postId: id,
          content: comment
        }, { withCredentials: true });
      }
      setComment('');
      fetchComments();
    } catch {
      alert('댓글 작성 실패');
    }
  };

  // ✅ 댓글 수정/삭제
  const handleEdit = (c) => {
    setEditId(c.id);
    setComment(c.content);
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;
    await axios.delete(`http://localhost:8080/api/comments/${commentId}`, { withCredentials: true });
    fetchComments();
  };

  // ✅ 게시글 수정 완료
  const handleUpdatePost = async () => {
    try {
      await axios.put(`http://localhost:8080/api/posts/${id}`, {
        title,
        content
      }, { withCredentials: true });

      alert('게시글 수정 완료');
      setPost({ ...post, title, content });
      setIsEditing(false);
    } catch {
      alert('수정 실패');
    }
  };

  // ✅ 게시글 삭제
  const handleDeletePost = async () => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;
    try {
      await axios.delete(`http://localhost:8080/api/posts/${id}`, { withCredentials: true });
      alert('삭제 완료');
      navigate('/community');
    } catch {
      alert('삭제 실패');
    }
  };

  // 🚫 잘못된 접근 방지
  if (isNaN(id)) return <p>잘못된 접근입니다.</p>;
  if (!post) return <p>로딩 중...</p>;

  return (
    <div>
      {/* ✅ 게시글 수정 모드 */}
      {isEditing ? (
        <div>
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            style={{ width: '100%', marginBottom: 8 }}
          />
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            style={{ width: '100%', height: '150px' }}
          />
          <br />
          <button onClick={handleUpdatePost}>수정 완료</button>
          <button onClick={() => setIsEditing(false)}>취소</button>
        </div>
      ) : (
        <>
          <h2>{post.title}</h2>
          <p>{post.content}</p>
          <p style={{ fontSize: '0.8em', color: '#555' }}>{post.authorEmail}</p>

          {/* ✅ 작성자만 수정/삭제 */}
          {user?.email === post.authorEmail && (
            <div style={{ marginTop: 10 }}>
              <button onClick={() => setIsEditing(true)}>수정</button>
              <button onClick={handleDeletePost}>삭제</button>
            </div>
          )}
        </>
      )}

      <hr />
      <h3>댓글</h3>
      <textarea value={comment} onChange={e => setComment(e.target.value)} placeholder="댓글 작성" />
      <br />
      <button onClick={handleCommentSubmit}>{editId ? '수정 완료' : '등록'}</button>

      <ul>
        {comments.map(c => (
          <li key={c.id}>
            <p>{c.content}</p>
            <p style={{ fontSize: '0.8em', color: '#666' }}>{c.authorEmail}</p>
            {user?.email === c.authorEmail && (
              <>
                <button onClick={() => handleEdit(c)}>수정</button>
                <button onClick={() => handleDeleteComment(c.id)}>삭제</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PostDetail;
