import React from 'react';
import { BrowserRouter, Route, Routes, useNavigate, useParams } from 'react-router-dom';
import HomePage from './pages/HomePage';
import GamesPage from './pages/GamesPage';
import GameDetailsPage from './pages/GameDetailsPage';
import SupportPage from './pages/SupportPage';
import LogInFormPage from './pages/forms/LogInFormPage';
import SignInFormPage from './pages/forms/SignInFormPage';
import ReportFormPage from './pages/forms/ReportFormPage';
import GameFormPage from './pages/forms/models/GameFormPage';
import CategoryFormPage from './pages/forms/models/CategoryFormPage';
import PlataformFormPage from './pages/forms/models/PlataformFormPage';
import LayoutPage from './pages/LayoutPage';

import '../node_modules/video-react/dist/video-react.css';
import '../node_modules/react-loading-skeleton/dist/skeleton.css';
import '../assets/css/App.css';
import 'bootstrap';

let RouterGamePage = withRouter(GamesPage);
let RouterGameFormPage = withRouter(GameFormPage);
let RouterCategoryFormPage = withRouter(CategoryFormPage);
let RouterPlataformFormPage = withRouter(PlataformFormPage);

export default function Main() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LayoutPage />}>
            <Route index element={<HomePage />} />
            <Route path="/games" element={<GamesPage />} />
            <Route path="/games/:name" element={<RouterGamePage/>} />
            <Route path="/details/:id" element={<GameDetailsPage />} />
            <Route path="/signin" element={<SignInFormPage />} />
            <Route path="/login" element={<LogInFormPage />} />
            <Route path="/support" element={<SupportPage />} />
            <Route path="/report" element={<ReportFormPage />} />
            
            <Route path="/admin/game" element={<GameFormPage />} />
            <Route path="/admin/game/:id" element={<RouterGameFormPage/>} />
            <Route path="/admin/category" element={<CategoryFormPage />} />
            <Route path="/admin/category/:id" element={<RouterCategoryFormPage />} />
            <Route path="/admin/plataform" element={<PlataformFormPage />} />
            <Route path="/admin/plataform/:id" element={<RouterPlataformFormPage />} />
            <Route path="*" element={<HomePage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}


export function withRouter(Child) {
  return (props) => <Child {...props} params={useParams()} navigate={useNavigate()}/>;
}