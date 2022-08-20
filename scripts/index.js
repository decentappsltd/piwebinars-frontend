import React from 'https://cdn.skypack.dev/react';
import ReactDOM from 'https://cdn.skypack.dev/react-dom';
import { BrowserRouter, Routes, Route, useParams } from 'https://cdn.skypack.dev/react-router-dom';
import { RecoilRoot } from 'https://cdn.skypack.dev/recoil';
import Layout from "./pages/Layout.js";
import Home from "./pages/Home.js";
import Upload from "./pages/Upload.js";
import Wishlist from "./pages/Wishlist.js";
import Profile from "./pages/Profile.js";
import User from "./pages/User.js";
import Login from "./pages/Login.js";
import NoPage from "./pages/NoPage.js"; 

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
          <Route path="upload" element={<Upload />} />
          <Route path="wishlist" element={<Wishlist />} />
          <Route path="profile" element={<Profile />} />
          <Route path="user/:user_id" element={<UserProfile />} />
          <Route path="login" element={<Login />} />
          <Route path="*" element={<NoPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
    </RecoilRoot>
  ); 
}

ReactDOM.render(
  <App />,
  document.getElementById("root")
);