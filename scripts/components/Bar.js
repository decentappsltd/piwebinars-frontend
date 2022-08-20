import React, { useEffect, useState } from 'https://cdn.skypack.dev/react';
const urlAPI = 'https://piwebinars-server.onrender.com';
import { searchValue } from '../atoms/forms.js';
import {
  RecoilRoot,
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
} from 'https://cdn.skypack.dev/recoil';
import { search, filter } from '../app/webinars.js';
import { login, register } from '../app/authentication.js';
import Post from './Posts.js';
import Loader from './Loader.js';

function SearchResults(props) {
  useEffect(() => {
    function close(e) {
      if (!document.querySelector("#results").contains(e.target)) {
        props.close();
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
        { props.loading ? <Loader /> : null }
        { props.posts.map(post => { 
          return (
            <article>
              <Post key={post.upload} post_id={post._id} file_id={post.upload} user_id={post.user} video_id={post.video_id} title={post.title} name={post.name} description={post.description} category={post.category} likes={post.likes.length} date={post.dateAdded} amount={post.amount} wishlisted={post.wishlisted} />
            </article>
            );
          })
        }
      </div>
    </>
  );
}

function Search() {
  const [input, setInput] = useRecoilState(searchValue);
  const [results, setResults] = useState([]);
  const [searchActive, setSearchActive] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const handleChange = (e) => {
    setInput(e.target.value);
    filter(input);
  }
  
  const handleSearch = async () => {
    // setSearchActive(true);
    // setLoading(true);
    // const posts = await search(input);
    // setResults(posts);
    // setLoading(false);
  }
  
  return (
    <>
      <form id="searchBar">
        <input id="searchInput" placeholder="Search topics..." onChange={(e) => handleChange(e)}></input>
        <a className="fas fa-search" onClick={handleSearch}></a>
      </form>
      {searchActive ? <SearchResults posts={results} loading={loading} close={() => {setSearchActive(false)}} /> : null }
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
  
  useEffect(() => {
    function close(e) {
      if (!document.querySelector(".popup").contains(e.target)) {
        props.close();
      }
    }
    document.addEventListener('click', close);
    return () => {
      document.removeEventListener('click', close);
    }
  }, []);

  return(
      <div className="popup">
        <h2>{props.header}</h2>
        <a onClick={props.close}>x</a>
        <input id="usernameInput" placeholder="Enter username" onChange={(e) => setUsername(e.target.value)}></input><br />
        { props.type == "register" && <><input id="nameInput" placeholder="Add your name" onChange={(e) => setName(e.target.value)}></input><br /></> }
        <input id="passwordInput" placeholder="Enter password" onChange={(e) => setPassword(e.target.value)}></input><br />
        { props.type == "register" && <><input id="confirmPassword" placeholder="Confirm password" onChange={(e) => setConfirmPassword(e.target.value)}></input><br /></> }
        <p onClick={authenticate}>submit</p>
      </div>
  );
}

function User(props) {
  const [modalShown, toggleModal] = useState(false);
  
  return (
    <div>
      <div id={props.type} onClick={() => {
          toggleModal(!modalShown);
        }}>
        <i className={props.class}></i>
        <a className="userLogin">{props.label}</a>
      </div>
      {modalShown ? 
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
        : null
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