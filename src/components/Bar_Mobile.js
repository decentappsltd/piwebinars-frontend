import React, { useEffect, useState } from 'react';
import { Search } from './Bar.js';

function BarMobile() {
  const [authed, setAuth] = useState(false);

  useEffect(() => {
    if (sessionStorage.userSession) setAuth(true);
    else setAuth(false);
  }, []);
  
  function close(e) {
    if (!document.querySelector("#nav").contains(e.target)) {
      document.querySelector("#nav").style.width = "0px";
      document.querySelector("#tint").style.display = "none";
      document.removeEventListener("click", close);
    }
  }
  
  const listener = () => {
    document.addEventListener("click", close);
  }
  
  const openNav = () => {
    document.getElementById("nav").style.width = "250px";
    document.querySelector("#tint").style.display = "block";
    const myTimeout = setTimeout(listener, 600);
  }

  return (
    <>
      <span id="bar">
        <i className="fas fa-bars" id="openNav" onClick={openNav}></i>
        <Search class={( authed ? 'expandedSearch' : 'smallSearch' )} />
      </span>
    </>
  );
}

export default BarMobile;
