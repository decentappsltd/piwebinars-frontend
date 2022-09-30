import React from 'react';
import { createRoot } from 'react-dom/client';
import ReactDOM from 'react-dom';
import { BrowserRouter, Routes, Route, useParams } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import Layout from "./pages/Layout.js";
import Home from "./pages/Home.js";
import Upload from "./pages/Upload.js";
import Wishlist from "./pages/Wishlist.js";
import Profile from "./pages/Profile.js";
import User from "./pages/User.js";
import Login from "./pages/Login.js";
import Register from './pages/Register.js';
import NoPage from "./pages/NoPage.js"; 
// CSS:
import './index.scss';
import './profile.scss';
import './cinema.scss';
import './app/nav.js';
import './app/payment.js';

function UserProfile() {
  let { user_id } = useParams();
  return <User userId={user_id} />;
}

export default function App() {
  return (
    <RecoilRoot>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
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