import { useEffect, useState } from 'react';
import axios from 'axios';
import { Navigate } from 'react-router-dom';
import styles from './ProtectedPage.module.css';
import { WEB_APP_ROUTE } from '../../global/WebAppRoute';

interface User {
  username: string;
  role: 'admin' | 'manager' | 'normal_user';
}

interface ProtectedPageProps {
  roleRequired: 'admin' | 'manager' | 'normal_user';
  children: React.ReactNode;
}

export default function ProtectedPage({ roleRequired, children }: ProtectedPageProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios
        .get(`http://localhost:8000/protected/${roleRequired}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          setUser(response.data);
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
    //setUser({username:'a',role:'admin'});//testing purpose
  }, [roleRequired]);

  if (loading) return <div className={styles.loading}>Loading...</div>;
  
  if (!user) return <Navigate to={WEB_APP_ROUTE.Login} />;

  // RBAC logic
  if (
    (roleRequired === 'admin' && user.role !== 'admin') ||
    (roleRequired === 'manager' && !['admin', 'manager'].includes(user.role))
  ) {
    return <div className={styles.error}>Access Denied</div>;
  }

  return <div className={styles.container}>{children}</div>;
}