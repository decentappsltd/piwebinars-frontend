import React, { useEffect, useState } from 'react';
import i18n from "i18next";
import { Search } from './Bar.js';

export function TranlateDropdown(props) {
  const languages = [
    { code: 'en', name: 'English', country_code: 'gb' },
    { code: 'es', name: 'Español', country_code: 'es' },
    { code: 'kr', name: '한국어', country_code: 'kr' },
    // { code: 'hi', name: 'हिन्दी', country_code: 'in' },
    { code: 'zh', name: '中文', country_code: 'cn' }
  ];

  return (
    <div id='translate' >
      {languages.map((lang) => (
        <>
          <a
            key={lang.code}
            onClick={() => {i18n.changeLanguage(lang.code); props.setTranslate(false)}}
          >
            <img
              src={`/assets/flags/${lang.country_code}.svg`}
              alt="flag"
            />
            <span>{lang.name}</span>
          </a>
          <br />
        </>
      ))}
    </div>
  );
}

function BarMobile() {
  const [authed, setAuth] = useState(false);
  const [translate, setTranslate] = useState(false);

  useEffect(() => {
    if (sessionStorage.userSession) setAuth(true);
    else setAuth(false);
  }, []);

  return (
    <>
      <span id="bar">
      <Search class={(authed ? 'expandedSearch' : 'smallSearch')} />
        <i onClick={() => setTranslate(!translate)} id='openTranslate' className="fas fa-globe"><i className='fas fa-caret-down' style={{ marginLeft: '5px' }}></i></i>
      </span>

      {translate && <TranlateDropdown setTranslate={setTranslate} />}
    </>
  );
}

export default BarMobile;
