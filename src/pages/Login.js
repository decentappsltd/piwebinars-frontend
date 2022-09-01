import React, { useState, useEffect } from 'react';
import { login } from '../app/authentication.js';

export default function Profile() {
  const signin = async () => {
    await login();
  }
  
  return (
    <>
      <span id="page">
        <button onClick={login}>Login</button>
      </span>
    </>
  );
}