import React, {useState, useEffect} from 'react';
import { Outlet } from 'react-router-dom';

import Nav from '../components/Nav.js';
import { HackathonNotice } from '../components/Notices.js';

function Consent(props) {
  return (
    <div className="consent">
      <p>
        By using this website, you agree to our <a href='https://decentapps.co.uk/terms.html'>Terms of Service</a>, 
        <a href="https://decentapps.co.uk/privacy.html"> Privacy Policy</a> and use of cookies for analytics and marketing purposes.
        <button id='closeCookies' onClick={props.accept}>X</button>
      </p>
    </div>
  )
}

const Layout = () => {
  const [consent, setConsent] = useState(true);
  const [notice, setNotice] = useState(true);

  useEffect(() => {
    if (localStorage.consent === 'false' || !localStorage.consent) {
      setTimeout(setConsent(false), 1000);
    }
    if (localStorage.notice === 'false' || !localStorage.notice) {
      setTimeout(setNotice(false), 4000);
    }
  }, []);

  const accept = () => {
    localStorage.consent = 'true';
    setConsent(true);
  }

  return (
    <>
      <Nav />
      <Outlet />
      { consent === false && <Consent accept={accept} />}
      {/* { notice === false && <HackathonNotice close={() => {setNotice(true); localStorage.notice = 'true'}} />} */}
    </>
  )
};

export default Layout;