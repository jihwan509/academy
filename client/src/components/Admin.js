import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Admin() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:8080/api/admin', { withCredentials: true })
      .then(() => setIsAdmin(true))
      .catch(() => setIsAdmin(false));
  }, []);

  return (
    <div>
      {isAdmin ? '어드민 권한 확인됨' : '권한이 없습니다.'}
    </div>
  );
}

export default Admin;