import { useEffect, useState } from 'react';
import { useNavigate, Routes, Route } from 'react-router-dom';
import { WEB_APP_ROUTE } from './app/global/WebAppRoute';
import FirstPage from './app/pages/FirstPage';
import SimpleAutoMailSend from '@/pages/SimpleAutoMailSend';
import './App.css';
import Login from '@/pages/auth/login';
import SearchEngine from '@/pages/SearchEngine';
import AuthLayout from '@/layouts/auth-layout';

function App() {
  return (
    <div className="full-screen">
      <Routes>
        <Route path={WEB_APP_ROUTE.SEARCH_ENGINE} element={<SearchEngine />} />
        <Route path={WEB_APP_ROUTE.FIRST_PAGE} element={<FirstPage />} />
        <Route path={WEB_APP_ROUTE.SIMPLE_AUTO_SEND_MAIL} element={<SimpleAutoMailSend />} />
        <Route element={<AuthLayout/>}>
          <Route path='/login' element={<Login/>}/>
        </Route>
      </Routes>
    </div>
  );
}

export default App;