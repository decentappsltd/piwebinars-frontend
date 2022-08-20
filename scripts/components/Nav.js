import React from 'https://cdn.skypack.dev/react';
import { useState, useEffect } from 'https://cdn.skypack.dev/react';
import { Outlet, Link } from 'https://cdn.skypack.dev/react-router-dom';
import { appPageState } from '../atoms/states.js';
import { storedFollowing } from '../atoms/posts.js';
import {
  RecoilRoot,
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
} from 'https://cdn.skypack.dev/recoil';
import { renderFollowing, filter } from '../app/webinars.js';

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
  }
  
  return (
    <RecoilRoot>
      <span onClick={highlight}>
        <Link to={props.href} className={classes} style={{ textDecoration: 'none', color: 'white' }}>
          <i className={iClass}></i>
          { props.text }
        </Link>
      </span>
    </RecoilRoot>
    )
}

function CategorySelection() {
  const [category, setCategory] = useState();
  
  const handleClick = (input) => {
    filter(input);
  }
  
  return (
    <>
      <div id="categoriesSelection" style={{ zIndex: "5"}} className="popupNavContent">
        <a onClick={() => {handleClick('')}} className="filter categoryActive">All</a>
        <a onClick={() => {handleClick('Cryptocurrency')}} className="filter categoryInactive">Cryptocurrency</a>
        <a onClick={() => {handleClick('Pi Network')}} className="filter categoryInactive">Pi Network</a>
        <a onClick={() => {handleClick('Education')}} className="filter categoryInactive">Education</a>
        <a onClick={() => {handleClick('Finance')}} className="filter categoryInactive">Finance</a>
        <a onClick={() => {handleClick('Fitness')}} className="filter categoryInactive">Fitness</a>
        <a onClick={() => {handleClick('Food')}} className="filter categoryInactive">Food</a>
        <a onClick={() => {handleClick('History')}} className="filter categoryInactive">History</a>
        <a onClick={() => {handleClick('Music')}} className="filter categoryInactive">Music</a>
        <a onClick={() => {handleClick('Pets')}} className="filter categoryInactive">Pets</a>
        <a onClick={() => {handleClick('Sports')}} className="filter categoryInactive">Sports</a>
        <a onClick={() => {handleClick('Technology')}} className="filter categoryInactive">Technology</a>
        <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
      </div>
    </>
  );
}

function Following() {
  const [following, setFollowing] = useRecoilState(storedFollowing);
  
  useEffect(async () => {
    if (following.length == 0) {
      const list = await renderFollowing();
      console.log(list.data.profile.following);
      setFollowing(list.data.profile.following);
    }
  }, []);
  
  return (
    <>
      <span className="popupNavContent" id="followingList">
        { following.map(user => { 
          return(
            <article>
              <Link to={`/user/${user.user}`} className="followingName">{user.handle}</Link>
              <br /><br />
            </article>
            );
          })
        }
        <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
      </span>
    </>
  );
}

function Help() {
  const darkMode = () => {
    // TODO
  }
  
  const translate = () => {
    function googleTranslateElementInit() {
      new google.translate.TranslateElement({
        pageLanguage: 'en'
      }, 'google_translate');
    }
    googleTranslateElementInit();
  }
  
  return (
    <>
      <span className="popupNavContent">
      <a style={{fontSize: "12px"}} onClick={darkMode}>Dark Mode |</a>
      <a id="translate" onClick={translate} style={{fontSize: "12px", background: "none"}}>Translate</a><br /><br />
      <div id="google_translate"></div>

      <a style={{color: "#b44afb"}}>Privacy |</a>
      <a style={{color: "#b44afb"}}>Terms |</a>
      <a style={{color: "#b44afb"}}>Contact</a>
      </span>
    </>
  );
}

function Categories() {
  const [Active, setActive] = useState({
    stateA: 'true',
    arrowA: '⯅',
    stateB: 'false',
    arrowB: '⯆',
    stateC: 'false',
    arrowC: '⯆',
  });
  
  const updateStateA = () => {
    setActive({
      stateA: 'true',
      arrowA: '⯅',
      stateB: 'false',
      arrowB: '⯆',
      stateC: 'false',
      arrowC: '⯆',
    });
  }
  
  const updateStateB = () => {
    setActive({
      stateA: 'false',
      arrowA: '⯆',
      stateB: 'true',
      arrowB: '⯅',
      stateC: 'false',
      arrowC: '⯆',
    });
  }
  
  const updateStateC = () => {
    setActive({
      stateA: 'false',
      arrowA: '⯆',
      stateB: 'false',
      arrowB: '⯆',
      stateC: 'true',
      arrowC: '⯅',
    });
  }
  
  return (
    <>
      <div className="popupNav">
        <h3 onClick={updateStateA}>Categories <a style={{float: "right", paddingRight: "15px", cursor: "pointer"}}>{Active.arrowA}</a></h3>
        { Active.stateA == 'true' && <CategorySelection /> }
      </div>
      <div className="popupNav">
        <h3 onClick={updateStateB}>Following <a style={{float: "right", paddingRight: "15px", cursor: "pointer"}}>{Active.arrowB}</a></h3>
        { Active.stateB == 'true' && <Following /> }
      </div>
      <div className="popupNav">
        <h3 onClick={updateStateC}>Help <a style={{float: "right", paddingRight: "15px", cursor: "pointer"}}>{Active.arrowC}</a></h3>
        { Active.stateC == 'true' && <Help /> }
      </div>
    </>
  );
}

function Navigation() {
  return (
    <RecoilRoot>
      <NavTab text="Dashboard" href="/" class="fas fa-home" type="home" />
      <NavTab text="Upload a Webinar" href="upload" class="fas fa-upload" type="upload" />
      <NavTab text="My Wishlist" href="wishlist" class="fas fa-heart" type="wishlist" />
      <NavTab text="My Profile" href="profile" class="fas fa-user" type="profile" />
    </RecoilRoot>
  );
}

class Nav extends React.Component {
  render(){
    return (
      <>
        <span id="nav">
          <img id="logoText" src="/img/logo-text.png"></img>
          <Navigation />
          <br />
          <Categories />
        </span>
      </>
      );
  }
}

export default Nav;