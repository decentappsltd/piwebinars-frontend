import React, { useState, useEffect } from "react";
import { Outlet, Link } from "react-router-dom";
import { appPageState } from "../atoms/states.js";
import { storedFollowing } from "../atoms/posts.js";
import {
  RecoilRoot,
  atom,
  selector,
  useRecoilState,
  useRecoilValue
} from "recoil";
import { renderFollowing, filter } from "../app/webinars.js";
import { logout, logoutAll, deleteAccount } from "../app/authentication.js";
import logo from '../assets/logo-text.png';

function NavTab(props) {
  const [page, setPage] = useRecoilState(appPageState);
  console.log(page);
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
  
  const handleClick = () => {
    if (localStorage.userSession && window.innerWidth < 850) {
      document.querySelector("#nav").style.width = "0px";
      document.querySelector("#tint").style.display = "none";
    } else if (!localStorage.userSession) {
      alert("Please login or register");
      window.location.href = "/";
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
  return (
    <RecoilRoot>
      <NavTab text="Dashboard" href="/" class="fas fa-home" type="home" />
      <NavTab
        text="Upload a Webinar"
        href="upload"
        class="fas fa-upload"
        type="upload"
      />
      <NavTab
        text="My Wishlist"
        href="wishlist"
        class="fas fa-heart"
        type="wishlist"
      />
      <NavTab
        text="My Profile"
        href="profile"
        class="fas fa-user"
        type="profile"
      />
    </RecoilRoot>
  );
}

function CategorySelection() {
  const [category, setCategory] = useState();

  const handleClick = (input) => {
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
            All
          </a>
          <a
            onClick={() => {
              handleClick("Cryptocurrency");
            }}
            className="filter categoryInactive"
          >
            Cryptocurrency
          </a>
          <a
            onClick={() => {
              handleClick("Pi Network");
            }}
            className="filter categoryInactive"
          >
            Pi Network
          </a>
          <a
            onClick={() => {
              handleClick("Education");
            }}
            className="filter categoryInactive"
          >
            Education
          </a>
          <a
            onClick={() => {
              handleClick("Finance");
            }}
            className="filter categoryInactive"
          >
            Finance
          </a>
          <a
            onClick={() => {
              handleClick("Fitness");
            }}
            className="filter categoryInactive"
          >
            Fitness
          </a>
          <a
            onClick={() => {
              handleClick("Food");
            }}
            className="filter categoryInactive"
          >
            Food
          </a>
          <a
            onClick={() => {
              handleClick("History");
            }}
            className="filter categoryInactive"
          >
            History
          </a>
          <a
            onClick={() => {
              handleClick("Music");
            }}
            className="filter categoryInactive"
          >
            Music
          </a>
          <a
            onClick={() => {
              handleClick("Pets");
            }}
            className="filter categoryInactive"
          >
            Pets
          </a>
          <a
            onClick={() => {
              handleClick("Sports");
            }}
            className="filter categoryInactive"
          >
            Sports
          </a>
          <a
            onClick={() => {
              handleClick("Technology");
            }}
            className="filter categoryInactive"
          >
            Technology
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
          Translate
        </a>
        <br /><br />
        
        { localStorage.userSession ? 
          <>
            <a className="navOption" id="logoutBtn" onClick={logout}><i className="fas fa-user-lock"></i> Logout</a><br /><br />
            <a className="navOption" id="logoutAllBtn" onClick={logoutAll}><i className="fas fa-user-shield"></i> Logout all</a><br /><br />
            <a className="navOption" id="deleteAccountBtn" onClick={deleteAccount}><i className="fas fa-trash"></i> Delete account</a><br /><br />
          </>
          : null }

        <a className="navOption" href="https://decentapps.co.uk/privicy.html"><i className="fas fa-eye-slash"></i> Privacy</a><br /><br />
        <a className="navOption" href="https://decentapps.co.uk/terms.html"><i className="fas fa-file"></i> Terms</a><br /><br />
        <a className="navOption" href="https://decentapps.co.uk/contact.html"><i className="fa-regular fa-message"></i> Contact</a><br /><br />

        </div>

        <div id="legal">
          <i>Copyright © 2022 All Rights Reserved by Decent Apps Ltd.</i>
        </div> 
      </span>
    </>
  );
}

function Categories() {
  const [Active, setActive] = useState({
    stateA: "true",
    arrowA: "⯅",
    stateB: "false",
    arrowB: "⯆",
    stateC: "false",
    arrowC: "⯆"
  });

  const updateStateA = () => {
    setActive({
      stateA: "true",
      arrowA: "⯅",
      stateB: "false",
      arrowB: "⯆",
      stateC: "false",
      arrowC: "⯆"
    });
  };

  const updateStateB = () => {
    setActive({
      stateA: "false",
      arrowA: "⯆",
      stateB: "true",
      arrowB: "⯅",
      stateC: "false",
      arrowC: "⯆"
    });
  };

  const updateStateC = () => {
    setActive({
      stateA: "false",
      arrowA: "⯆",
      stateB: "false",
      arrowB: "⯆",
      stateC: "true",
      arrowC: "⯅"
    });
  };

  return (
    <>
      <div className="popupNav">
        <h3 onClick={updateStateA}>
          Categories{" "}
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
          Following{" "}
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
          Menu{" "}
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
        <div id="tint"></div>
      </>
    );
  }
}

export default Nav;
