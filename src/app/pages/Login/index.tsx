import { useState, FormEvent } from 'react';
import axios from 'axios';
import bcrypt from 'bcryptjs';
import { useNavigate } from 'react-router-dom';
import styles from './Login.module.css';
import { WEB_APP_ROUTE } from '../../global/WebAppRoute';

interface LoginForm {
  username: string;
  password: string;
}

export default function Login() {
  const [form, setForm] = useState<LoginForm>({ username: '', password: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      // Hash password in frontend
      const hashedPassword = await bcrypt.hash(form.password, 10);
      const response = await axios.post('http://localhost:8000/login', {
        username: form.username,
        password: hashedPassword,
      });
      localStorage.setItem('token', response.data.access_token);
      navigate(WEB_APP_ROUTE.User);
    } catch (error) {
      console.error('Login failed:', error);
      alert('Invalid credentials');
    } finally{
      sessionStorage.setItem('jwtToken',"aaaaaaaaaa");
    }

  };

  return (
    <div className={styles.container}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          className={styles.input}
        />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className={styles.input}
        />
        <button type="submit" className={styles.button}>
          Login
        </button>
      </form>
    </div>
  );
}