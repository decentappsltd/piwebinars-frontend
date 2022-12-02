import React, {useState, useEffect} from 'react';
import { Outlet } from 'react-router-dom';

import Nav from '../components/Nav.js';

function Consent(props) {
  // useEffect(() => {
  //   setTimeout(() => {
  //     props.accept();
  //   }, 10000);
  // }, []);

  return (
    <div className="consent">
      <p>
        By using this website, you agree to our <a href='https://decentapps.co.uk/terms.html'>Terms of Service</a>, <a href="https://decentapps.co.uk/privacy.html">Privacy Policy</a> and use of cookies for analytics and marketing purposes.
      </p>
      {/* <a style={{ float: 'right' }} onClick={props.accept} className='fas fa-close'></a> */}
      <span style={{ breakInside: 'avoid' }}>
        <button id='declineCookies' onClick={props.decline}>Decline</button>
        <button id='acceptCookies' onClick={props.accept}>Accept</button>
      </span>
    </div>
  )
}

const Layout = () => {
  const [consent, setConsent] = useState(true);

  useEffect(() => {
    if (localStorage.consent === 'false' || !localStorage.consent) {
      setTimeout(setConsent(false), 1000);
    }
  }, []);

  const accept = () => {
    localStorage.consent = 'true';
    setConsent(true);
  }

  const decline = () => {
    localStorage.consent = 'false';
    window.location.href = 'https://www.decentapps.co.uk/privacy.html';
  }

  return (
    <>
      <Nav />
      <Outlet />
      { consent === false && <Consent accept={accept} decline={decline} />}
    </>
  )
};

export default Layout;