/**
 * File: index.js
 * Purpose: the main file for client side, creates the App view.
 * DB Access: No
 * Used from:
 *  - None
 * Uses files:
 *  - The following imported files:
 */
import '../node_modules/video-react/dist/video-react.css';
import '../node_modules/react-loading-skeleton/dist/skeleton.css';
import './assets/css/App.css';
import 'bootstrap';

import React from 'react';
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
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
import { withRouter } from './routes/Routes';

let RouterGamePage = withRouter(GamesPage);
let RouterGameFormPage = withRouter(GameFormPage);
let RouterGameDetailsPage = withRouter(GameDetailsPage);
let RouterCategoryFormPage = withRouter(CategoryFormPage);
let RouterPlataformFormPage = withRouter(PlataformFormPage);

export default function App() {
  return (
    <>
      <BrowserRouter basename={process.env.REACT_APP_BASEHOME}>
        <Routes>
          <Route path="/" element={<LayoutPage />}>
            <Route index element={<HomePage />} />
            <Route path="/games" element={<RouterGamePage />} />
            <Route path="/details/:id" element={<RouterGameDetailsPage />} />
            <Route path="/signin" element={<SignInFormPage />} />
            <Route path="/login" element={<LogInFormPage />} />
            <Route path="/support" element={<SupportPage />} />
            <Route path="/report" element={<ReportFormPage />} />
            
            <Route path="/admin/game" element={<RouterGameFormPage />} />
            <Route path="/admin/game/:id" element={<RouterGameFormPage/>} />
            <Route path="/admin/category" element={<RouterCategoryFormPage />} />
            <Route path="/admin/category/:id" element={<RouterCategoryFormPage />} />
            <Route path="/admin/plataform" element={<RouterPlataformFormPage />} />
            <Route path="/admin/plataform/:id" element={<RouterPlataformFormPage />} />
            <Route path="*" element={<HomePage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

ReactDOM.render(<App/>, document.getElementById("root"));
