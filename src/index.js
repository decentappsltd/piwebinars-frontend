import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, useParams } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import HttpApi from 'i18next-http-backend';
import LanguageDetector from "i18next-browser-languagedetector";
import Layout from "./pages/Layout.js";
import Home from "./pages/Home.js";
import Upload from "./pages/Upload.js";
import Wishlist from "./pages/Wishlist.js";
import Profile from "./pages/Profile.js";
import User from "./pages/User.js";
import Webinar from "./pages/Webinar.js";
import Course from "./pages/Course.js";
import Login from "./pages/Login.js";
import Register from './pages/Register.js';
import NoPage from "./pages/NoPage.js";
// CSS:
import './styles/index.scss';
import './styles/profile.scss';
import './styles/cinema.scss';
import './styles/courses.scss';
// Scripts
import './app/nav.js';
import './app/payment.js';

i18n
  .use(HttpApi)
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    supportedLngs: ['en', 'es', 'kr', 'hi', 'zh'],
    fallbackLng: "en",
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage']
    },
    backend: {
      loadPath: '/assets/locales/{{lng}}.json'
    },
    react: { useSuspense: false }
  });

function UserProfile() {
  let { user_id } = useParams();
  return <User userId={user_id} />;
}

function ShowWebinar() {
  let { webinar_id, user_id } = useParams();
  return <Webinar postId={webinar_id} userId={user_id} />;
}

function ShowCourse() {
  let { course_id, user_id } = useParams();
  return <Course courseId={course_id} userId={user_id} />;
}

export default function App() {
  return (
    <RecoilRoot>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route exact path="/post/:user_id/:webinar_id" element={<ShowWebinar />} />
            <Route exact path="/course/:user_id/:course_id" element={<ShowCourse />} />
            <Route exact path="/upload" element={<Upload />} />
            <Route exact path="/wishlist" element={<Wishlist />} />
            <Route exact path="/profile" element={<Profile />} />
            <Route exact path="/user/:user_id" element={<UserProfile />} />
            <Route exact path="/login" element={<Login />} />
            <Route exact path="/register" element={<Register />} />
            <Route exact path="/*" element={<NoPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </RecoilRoot>
  );
}

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);