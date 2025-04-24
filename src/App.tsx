import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import FirstPage from './app/pages/FirstPage';
import Login from './app/pages/Login';
import Register from './app/pages/Register';
import ProtectedPage from './app/pages/ProtectedPage';
import { WEB_APP_ROUTE } from './app/global/WebAppRoute';
import Home from './app/pages/Home';
import './App.css';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path={WEB_APP_ROUTE.FirstPage} element={<FirstPage />} />
        <Route path={WEB_APP_ROUTE.Home} element={<Home />} />
        <Route path={WEB_APP_ROUTE.Login} element={<Login />} />
        <Route path={WEB_APP_ROUTE.Register} element={<Register />} />
        <Route
          path={WEB_APP_ROUTE.Admin}
          element={
            <ProtectedPage roleRequired="admin">
              <h1>Admin Dashboard</h1>
              <p>Welcome, Admin!</p>
            </ProtectedPage>
          }
        />
        <Route
          path={WEB_APP_ROUTE.Manager}
          element={
            <ProtectedPage roleRequired="manager">
              <h1>Manager Dashboard</h1>
              <p>Welcome, Manager!</p>
            </ProtectedPage>
          }
        />
        <Route
          path={WEB_APP_ROUTE.User}
          element={
            <ProtectedPage roleRequired="normal_user">
              <h1>User Dashboard</h1>
              <p>Welcome, User!</p>
            </ProtectedPage>
          }
        />
      </Routes>
    </Router>
  );
}