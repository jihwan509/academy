import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './Login';
import Join from './Join';
import Home from './Home';
import UserInfo from './UserInfo';
import Admin from './Admin';

function Main() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/join" element={<Join />} />
      <Route path="/home" element={<Home />} />
      <Route path="/userInfo" element={<UserInfo />} />
      <Route path="/admin" element={<Admin />} />
    </Routes>
  );
}

export default Main;