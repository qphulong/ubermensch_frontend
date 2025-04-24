import { useState, FormEvent } from 'react';
import axios from 'axios';
import bcrypt from 'bcryptjs';
import { useNavigate } from 'react-router-dom';
import styles from './Register.module.css';
import { WEB_APP_ROUTE } from '../../global/WebAppRoute';

interface RegisterForm {
  username: string;
  password: string;
  role: 'normal_user' | 'manager' | 'admin';
}

export default function Register() {
  const [form, setForm] = useState<RegisterForm>({
    username: '',
    password: '',
    role: 'normal_user',
  });
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      // Hash password in frontend
      const hashedPassword = await bcrypt.hash(form.password, 10);
      await axios.post('http://localhost:8000/register', {
        username: form.username,
        password: hashedPassword,
        role: form.role,
      });
      navigate(WEB_APP_ROUTE.Login); // Redirect to login after registration
    } catch (error) {
      console.error('Registration failed:', error);
      alert('Registration failed');
    }
  };

  return (
    <div className={styles.container}>
      <h2>Register</h2>
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
        <select
          value={form.role}
          onChange={(e) =>
            setForm({ ...form, role: e.target.value as RegisterForm['role'] })
          }
          className={styles.input}
        >
          <option value="normal_user">Normal User</option>
          <option value="manager">Manager</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit" className={styles.button}>
          Register
        </button>
      </form>
    </div>
  );
}