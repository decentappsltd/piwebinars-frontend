import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { searchValue } from '../atoms/forms.js';
import {
  RecoilRoot,
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
} from 'recoil';
import { search, filter, addWishlist } from '../app/webinars.js';
import { login, register } from '../app/authentication.js';
import Loader from './Loader.js';
import Cinema from './Cinema.js';

function Post(props) {
  const [modalShown, toggleModal] = useState(false);
  const [isWishlist, setWishlist] = useState(false);

  useEffect(() => {
    if (props.wishlisted == true) {
      setWishlist(true);
    }
  }, []);

  const open = () => {
    toggleModal(!modalShown);
    document.getElementById("tint").style.display = "block";
  };

  const handleClose = () => {
    toggleModal(!modalShown);
    document.getElementById("tint").style.display = "none";
  }

  const add = async () => {
    setWishlist(!isWishlist);
    const response = await addWishlist(props);
  };


  return (
    <>
      <div className="post">
        <img onClick={open} className="postThumbnail" src={`https://vumbnail.com/${props.video_id}.jpg`}></img>
        <h3 className="postTitle">{props.title}</h3>
        <div className="statDiv">
          <Link to={`/user/${props.user_id}`} className="statName">{props.name}</Link>
          <p2 className="statCategory">{props.category}</p2>
          <p2 className="statLikes">{props.amount} <i>Pi</i></p2>
        </div>
        {isWishlist == false ?
          <i onClick={add} className="fas fa-plus addWishlist"></i>
          : <i onClick={add} className="fas fa-minus addWishlist"></i>
        }
      </div>

      {modalShown ?
        <Cinema close={() => {
          handleClose();
        }} post={props} />
        : null
      }
    </>
  );
}

function SearchResults(props) {
  useEffect(() => {
    console.log(props.posts);
    function close(e) {
      if (!document.querySelector("#results").contains(e.target) && !document.querySelector(".fa-search").contains(e.target) && !document.querySelector("#searchBar").contains(e.target) && !document.querySelector("#tint").contains(e.target)) {
        props.close();
        document.getElementById('tint').style.display = "none";
      }
    }
    document.addEventListener('click', close);
    return () => {
      document.removeEventListener('click', close);
    }
  }, []);

  return (
    <>
      <div id="results">
        {props.loading ? <Loader /> : null}
        {props.posts.map(post => {
          return (
            <article key={post.upload}>
              <Post key={post.upload} post_id={post._id} file_id={post.upload} user_id={post.user} video_id={post.video_id} title={post.title} name={post.name} description={post.description} category={post.category} likes={post.likes} dislike={post.dislike} date={post.dateAdded} amount={post.amount} wishlisted={post.wishlisted} />
            </article>
          );
        })
        }
        <a className='fas fa-close' id='closeSearchBtn' onClick={props.close}></a>
      </div>
    </>
  );
}

export function Search() {
  const [input, setInput] = useRecoilState(searchValue);
  const [results, setResults] = useState();
  const [searchActive, setSearchActive] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setInput(e.target.value);
    filter(input);
  }

  const handleSearch = async () => {
    setResults([]);
    setSearchActive(true);
    setLoading(true);
    const posts = await search(input);
    console.log(posts);
    setResults(posts);
    setLoading(false);
  }

  return (
    <>
      <form id="searchBar">
        <input id="searchInput" placeholder="Search topics..." onChange={(e) => handleChange(e)}></input>
        <a className="fas fa-search" onClick={handleSearch}></a>
      </form>
      {searchActive ? <SearchResults posts={results} loading={loading} close={() => { setSearchActive(false) }} /> : null}
    </>
  );
}

function AuthPopup(props) {
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const authenticate = async () => {
    if (props.type == 'login') {
      await login(username, password);
      props.toggle();
    } else {
      const response = await register(username, name, password, confirmPassword);
      props.toggle();
    }
  }

  const setClickEvent = () => {
    function close(e) {
      if (!document.querySelector(".popup").contains(e.target)) {
        document.removeEventListener('click', close);
        props.close();
      }
    }
    document.addEventListener('click', close);
  }

  useEffect(() => {
    setTimeout(setClickEvent, 500);
  }, []);

  return (
    <div className="popup">
      <h2>{props.header}</h2>
      <a onClick={props.close}>x</a>
      <input id="usernameInput" placeholder="Enter username" onChange={(e) => setUsername(e.target.value)}></input><br />
      {props.type == "register" && <><input id="nameInput" placeholder="Add your name" onChange={(e) => setName(e.target.value)}></input><br /></>}
      <input id="passwordInput" placeholder="Enter password" onChange={(e) => setPassword(e.target.value)}></input><br />
      {props.type == "register" && <><input id="confirmPassword" placeholder="Confirm password" onChange={(e) => setConfirmPassword(e.target.value)}></input><br /></>}
      <p onClick={authenticate}>submit</p>
    </div>
  );
}

function User(props) {
  const [modalShown, toggleModal] = useState(false);

  useEffect(() => {
    console.log(modalShown);
  }, [modalShown]);

  return (
    <div>
      <div id={props.type} onClick={() => {
        toggleModal(!modalShown);
      }}>
        <i className={props.class}></i>
        <a className="userLogin">{props.label}</a>
      </div>
      {modalShown &&
        <AuthPopup
          header={props.label}
          type={props.type}
          toggle={() => {
            props.toggle();
          }}
          close={() => {
            toggleModal(!modalShown);
          }}
        />
      }
    </div>
  );
}

function Bar() {
  const [authed, setAuth] = useState(false);

  useEffect(() => {
    if (localStorage.userSession) setAuth(true);
    else setAuth(false);
  }, []);

  return (
    <>
      <span id="bar">
        <Search />
        {
          authed === true ?
            <p2 id="welcomeMessage">Welcome, {localStorage.username}</p2> :
            <>
              <User toggle={() => { setAuth(true) }} type="register" class="fas fa-user-plus userLoginIcon" label="Register" />
              <User toggle={() => { setAuth(true) }} type="login" class="fas fa-user userLoginIcon" label="Login" />
            </>
        }
      </span>
    </>
  );
}

export default Bar;