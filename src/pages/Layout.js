import React from 'react';
import { Outlet, Link } from 'react-router-dom';

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