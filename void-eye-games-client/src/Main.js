import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import HeaderComponent from './components/HeaderComponent';
import FooterComponent from './components/FooterComponent';
import HomePage from './pages/HomePage';
import GamesPage from './pages/GamesPage';
import GameDetailsPage from './pages/GameDetailsPage';
import SupportPage from './pages/SupportPage';
import LogInFormPage from './pages/LogInFormPage';
import SignInFormPage from './pages/SignInFormPage';
import ReportFormPage from './pages/ReportFormPage';
import LayoutPage from './pages/LayoutPage';

import '../assets/css/App.css';
import '../node_modules/bootstrap/dist/js/bootstrap';

export default function Main() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LayoutPage />}>
            <Route index element={<HomePage />} />
            <Route path="/games" element={<GamesPage />} />
            <Route path="/games/{plataform}/{category}/{name}" element={<GamesPage />} />
            <Route path="/details/{id}" element={<GameDetailsPage />} />
            <Route path="/signin" element={<SignInFormPage />} />
            <Route path="/login" element={<LogInFormPage />} />
            <Route path="/support" element={<SupportPage />} />
            <Route path="/report" element={<ReportFormPage />} />
            <Route path="*" element={<HomePage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}
/*
<StatusBar style="auto" />
<HeaderComponent/>
      <FooterComponent/>*/