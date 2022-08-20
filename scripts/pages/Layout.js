import React from 'https://cdn.skypack.dev/react';
import { Outlet, Link } from 'https://cdn.skypack.dev/react-router-dom';

import Nav from '../components/Nav.js';

const Layout = () => {
  return (
    <>
      <Nav />
      <Outlet />
    </>
  )
};

export default Layout;