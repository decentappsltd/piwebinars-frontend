import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { appPageState } from "../atoms/states.js";
import { storedFollowing } from "../atoms/posts.js";
import {
  RecoilRoot,
  useRecoilState,
} from "recoil";
import { useTranslation } from "react-i18next";
import { renderFollowing, filter } from "../app/webinars.js";
import { logout, logoutAll, deleteAccount } from "../app/authentication.js";
import logo from '../assets/logo-text.png';

function NavTab(props) {
  const [page, setPage] = useRecoilState(appPageState);

  let classes = "navTab";
  let iClass = props.class;
  if (page == props.type) {
    classes = "navTab tabActive";
    iClass = `${props.class} iconActive`;
  } else {
    classes = "navTab tabInactive";
    iClass = `${props.class} iconInactive`;
  }

  const highlight = () => {
    setPage(`${props.type}`);
  };

  useEffect(() => {
    // get base route from url part
    const route = window.location.href.split("/")[3];
    if (route !== '') setPage(route);
    if (route === 'post' || route === 'user' || route === 'course') setPage('home');
  }, []);


  const handleClick = () => {
    if (window.innerWidth < 850) {
      document.querySelector("#nav").style.width = "0px";
      document.querySelector("#tint").style.display = "none";
      window.dispatchEvent(new Event("nav"));
    }
  }

  return (
    <RecoilRoot>
      <span onClick={highlight}>
        <Link
          to={props.href}
          className={classes}
          style={{ textDecoration: "none", color: "white" }}
          onClick={handleClick}
        >
          <i className={iClass}></i>
          {props.text}
        </Link>
      </span>
    </RecoilRoot>
  );
}

function Navigation() {
  const { t } = useTranslation();
  const [userSession, setSession] = useState(localStorage.userSession);

  useEffect(() => {
    window.addEventListener("storage", () => {
      setSession(localStorage.userSession);
    });
  });

  return (
    <RecoilRoot>
      <NavTab text={t('Dashboard')} href="/" class="fas fa-home" type="home" />
      {userSession ? <>
        <NavTab
          text={t('Upload_a_Webinar')}
          href="upload"
          class="fas fa-upload"
          type="upload"
        />
        <NavTab
          text={t('My_Wishlist')}
          href="wishlist"
          class="fas fa-heart"
          type="wishlist"
        />
        <NavTab
          text={t('My_Profile')}
          href="profile"
          class="fas fa-user"
          type="profile"
        />
      </> : <>
        <NavTab
          text={t('Login')}
          href="login"
          class="fas fa-sign-in-alt"
          type="login"
        />
        <NavTab
          text={t('Register')}
          href="register"
          class="fas fa-user-plus"
          type="register"
        />
        <br /><br />
      </>}
    </RecoilRoot>
  );
}

function CategorySelection() {
  const { t } = useTranslation();
  const [category, setCategory] = useState();

  const handleClick = (input) => {
    localStorage.category = input;
    window.dispatchEvent(new Event("storage"));
    filter(input);
  };

  return (
    <>
      <span>
        <div
          id="categoriesSelection"
          style={{ zIndex: "5" }}
          className="popupNavContent"
        >
          <a
            onClick={() => {
              handleClick("");
            }}
            className="filter categoryActive"
          >
            {t('All')}
          </a>
          <a
            onClick={() => {
              handleClick("Cryptocurrency");
            }}
            className="filter categoryInactive"
          >
            {t('Cryptocurrency')}
          </a>
          <a
            onClick={() => {
              handleClick("Pi Network");
            }}
            className="filter categoryInactive"
          >
            {t('Pi Network')}
          </a>
          <a
            onClick={() => {
              handleClick("Education");
            }}
            className="filter categoryInactive"
          >
            {t('Education')}
          </a>
          <a
            onClick={() => {
              handleClick("Finance");
            }}
            className="filter categoryInactive"
          >
            {t('Finance')}
          </a>
          <a
            onClick={() => {
              handleClick("Fitness");
            }}
            className="filter categoryInactive"
          >
            {t('Fitness')}
          </a>
          <a
            onClick={() => {
              handleClick("Food");
            }}
            className="filter categoryInactive"
          >
            {t('Food')}
          </a>
          <a
            onClick={() => {
              handleClick("History");
            }}
            className="filter categoryInactive"
          >
            {t('History')}
          </a>
          <a
            onClick={() => {
              handleClick("Music");
            }}
            className="filter categoryInactive"
          >
            {t('Music')}
          </a>
          <a
            onClick={() => {
              handleClick("Pets");
            }}
            className="filter categoryInactive"
          >
            {t('Pets')}
          </a>
          <a
            onClick={() => {
              handleClick("Sports");
            }}
            className="filter categoryInactive"
          >
            {t('Sports')}
          </a>
          <a
            onClick={() => {
              handleClick("Technology");
            }}
            className="filter categoryInactive"
          >
            {t('Technology')}
          </a>
        </div>
      </span>
    </>
  );
}

function Following() {
  const [following, setFollowing] = useRecoilState(storedFollowing);

  const getFollowing = async () => {
    if (following.length == 0) {
      const list = await renderFollowing();
      console.log(list.data.profile.following);
      setFollowing(list.data.profile.following);
    }
  }

  useEffect(() => {
    getFollowing();
  }, []);

  return (
    <>
      <span className="popupNavContent" id="followingList">
        {following.map((user) => {
          return (
            <article>
              <Link to={`/user/${user.user}`} className="followingName">
                {user.handle}
              </Link>
              <br />
              <br />
            </article>
          );
        })}
      </span>
    </>
  );
}

function Menu() {
  const { t } = useTranslation();
  const [userSession, setSession] = useState(localStorage.userSession);

  useEffect(() => {
    window.addEventListener("storage", () => {
      setSession(localStorage.userSession);
    });
  });

  const translate = () => {
    function googleTranslateElementInit() {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: "en"
        },
        "google_translate"
      );
    }
    googleTranslateElementInit();
  };

  return (
    <>
      <span className="popupNavContent">
        <div id="google_translate"></div><br />
        <div id="navOptions">
          <a
            className="navOption"
            onClick={translate}
          >
            <i className="fas fa-language"></i>
            {t('Translate')}
          </a>
          <br /><br />

          {userSession ?
            <>
              <a className="navOption" id="logoutBtn" onClick={logout}><i className="fas fa-user-lock"></i> {t('Logout')}</a><br /><br />
              <a className="navOption" id="logoutAllBtn" onClick={logoutAll}><i className="fas fa-user-shield"></i> {t('Logout_all')}</a><br /><br />
              <a className="navOption" id="deleteAccountBtn" onClick={deleteAccount}><i className="fas fa-trash"></i> {t('Delete_account')}</a><br /><br />
            </>
            : null}

          <a className="navOption" href="https://decentapps.co.uk/privicy.html"><i className="fas fa-eye-slash"></i> {t('Privacy')}</a><br /><br />
          <a className="navOption" href="https://decentapps.co.uk/terms.html"><i className="fas fa-file"></i> {t('Terms')}</a><br /><br />
          <a className="navOption" href="https://decentapps.co.uk/contact.html"><i className="fa-regular fa-message"></i> {t('Contact')}</a><br /><br />

        </div>

        <div id="legal">
          <i>{t('Copyright')}</i>
        </div>
      </span>
    </>
  );
}

function Categories() {
  const { t } = useTranslation();
  const [Active, setActive] = useState({
    stateA: "true",
    arrowA: "▲",
    stateB: "false",
    arrowB: "▼",
    stateC: "false",
    arrowC: "▼"
  });

  const updateStateA = () => {
    setActive({
      stateA: "true",
      arrowA: "▲",
      stateB: "false",
      arrowB: "▼",
      stateC: "false",
      arrowC: "▼"
    });
  };

  const updateStateB = () => {
    if (!sessionStorage.userSession) window.location.href = '/login';
    setActive({
      stateA: "false",
      arrowA: "▼",
      stateB: "true",
      arrowB: "▲",
      stateC: "false",
      arrowC: "▼"
    });
  };

  const updateStateC = () => {
    setActive({
      stateA: "false",
      arrowA: "▼",
      stateB: "false",
      arrowB: "▼",
      stateC: "true",
      arrowC: "▲"
    });
  };

  return (
    <>
      <div className="popupNav">
        <h3 onClick={updateStateA}>
          {t('Categories')}{" "}
          <a
            style={{ float: "right", paddingRight: "15px", cursor: "pointer" }}
          >
            {Active.arrowA}
          </a>
        </h3>
        {Active.stateA == "true" && <CategorySelection />}
      </div>
      <div className="popupNav">
        <h3 onClick={updateStateB}>
          {t('Following')}{" "}
          <a
            style={{ float: "right", paddingRight: "15px", cursor: "pointer" }}
          >
            {Active.arrowB}
          </a>
        </h3>
        {Active.stateB == "true" && <Following />}
      </div>
      <div className="popupNav">
        <h3 onClick={updateStateC}>
          {t('Menu')}{" "}
          <a
            style={{ float: "right", paddingRight: "15px", cursor: "pointer" }}
          >
            {Active.arrowC}
          </a>
        </h3>
        {Active.stateC == "true" && <Menu />}
      </div>
    </>
  );
}

function MobileTab() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    window.addEventListener("nav", () => {
      if (document.getElementById('nav').style.width == "250px") setOpen(true);
      else setOpen(false);
    });
  }, []);

  const toggleOpen = () => {
    if (open === false) {
      document.getElementById("nav").style.width = "250px";
      document.querySelector("#tint").style.display = "block";
      setOpen(true);
    } else {
      document.getElementById("nav").style.width = "0";
      document.querySelector("#tint").style.display = "none";
      setOpen(false);
    }
  };

  return (
    <>
      <div id="mobileTab" onClick={toggleOpen}  className={ open ? 'mobileTabOpen' : 'mobileTabClosed' }>
        <a className='fas fa-bars'>
          {open ? <i className="fas fa-caret-left"></i>
            : <i className="fas fa-caret-right"></i>}
        </a>
      </div>
    </>
  );
}

class Nav extends React.Component {
  render() {
    return (
      <>
        <span id="nav">
          <img id="logoText" src={logo}></img>
          <Navigation />
          <br />
          <Categories />
        </span>
        {window.innerWidth < 650 && <MobileTab />}
        <div id="tint"></div>
      </>
    );
  }
}

export default Nav;
