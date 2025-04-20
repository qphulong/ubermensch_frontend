import { useEffect, useState } from 'react';
import { useNavigate, Routes, Route } from 'react-router-dom';
import { WEB_APP_ROUTE } from './app/global/WebAppRoute';
import FirstPage from './app/pages/FirstPage';
import './App.css';

function App() {
  const [data, setData] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    if (backendUrl) {
      fetch(`${backendUrl}/`)
        .then((res) => res.json())
        .then((data) => setData(data.message))
        .catch((error) => console.error('Error fetching data:', error));
    } else {
      console.error('Backend URL is not defined in the environment variables.');
    }
  }, []);

  useEffect(() => {
    console.log(import.meta.env);
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    console.log('Backend URL:', backendUrl);
  }, []);

  const handleButtonClick = () => {
    navigate(WEB_APP_ROUTE.FIRST_PAGE);
  };

  return (
    <div className="full-screen">
      <Routes>
        <Route
          path="/"
          element={
            <div className="center-content">
              <h1>{data || 'Loading...'}</h1>
              <button onClick={handleButtonClick}>Click Me</button>
            </div>
          }
        />
        <Route path={WEB_APP_ROUTE.FIRST_PAGE} element={<FirstPage />} />
      </Routes>
    </div>
  );
}

export default App;