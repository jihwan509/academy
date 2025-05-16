import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Login from '../pages/Login';
import Join from '../pages/Join';
import Home from '../pages/user/Home';
import Community from '../pages/user/Community';
import UserInfo from '../pages/user/UserInfo';
import PostForm from '../pages/user/PostForm';
import PostDetail from '../pages/user/PostDetail';
import AcademyList from '../pages/user/AcademyList';
import AcademyDetail from '../pages/user/AcademyDetail';
import AdminHome from '../pages/admin/AdminHome';
import AcademyRegister from '../pages/admin/AcademyRegister';
import NotFound from '../pages/NotFound';
import OauthRedirect from '../pages/OauthRedirect';
import useAuth from '../hooks/useAuth';
import PrivateRoute from './PrivateRoute';
import Header from '../components/Header';
import Footer from '../components/Footer';

function Main() {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <div>로딩 중...</div>;

  const hideLayout = location.pathname === '/' || location.pathname === '/join';

  return (
    <>
      {!hideLayout && <Header user={user} />}
      <Routes>
        {/* 🔐 인증 관련 */}
        <Route path="/" element={<Login />} />
        <Route path="/join" element={<Join />} />
        <Route path="/oauth2/redirect" element={<OauthRedirect />} />

        {/* 🏠 사용자 메인 */}
        <Route path="/home" element={
          <PrivateRoute user={user} role="ROLE_USER">
            <Home />
          </PrivateRoute>
        } />

        {/* 🔍 학원 찾기 */}
        <Route path="/academies" element={
          <PrivateRoute user={user} role="ROLE_USER">
            <AcademyList />
          </PrivateRoute>
        } />
        <Route path="/academies/:id" element={
          <PrivateRoute user={user} role="ROLE_USER">
            <AcademyDetail />
          </PrivateRoute>
        } />

        {/* 👤 내 정보 */}
        <Route path="/userInfo" element={
          <PrivateRoute user={user}>
            <UserInfo />
          </PrivateRoute>
        } />

        {/* 📝 커뮤니티 - 💡 순서 중요! new → :id → 목록 */}
        <Route path="/community/new" element={
          <PrivateRoute user={user} role="ROLE_USER">
            <PostForm />
          </PrivateRoute>
        } />
        <Route path="/community/:id" element={
          <PrivateRoute user={user} role="ROLE_USER">
            <PostDetail />
          </PrivateRoute>
        } />
        <Route path="/community" element={
          <PrivateRoute user={user} role="ROLE_USER">
            <Community />
          </PrivateRoute>
        } />

        {/* 👑 관리자 페이지 */}
        <Route path="/admin" element={
          <PrivateRoute user={user} role="ROLE_ADMIN">
            <AdminHome />
          </PrivateRoute>
        } />
        <Route path="/admin/register" element={
          <PrivateRoute user={user} role="ROLE_ADMIN">
            <AcademyRegister />
          </PrivateRoute>
        } />

        {/* ❌ Not found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      {!hideLayout && <Footer />}
    </>
  );
}

export default Main;
