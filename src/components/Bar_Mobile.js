import React, { useEffect, useState } from "react";
import { searchValue } from "../atoms/forms.js";
import {
  RecoilRoot,
  atom,
  selector,
  useRecoilState,
  useRecoilValue
} from "recoil";
import { search, filter } from "../app/webinars.js";
import { login, register } from "../app/authentication.js";
import Post from "./Posts.js";
import Loader from "./Loader.js";

const urlAPI = "https://piwebinars-server.onrender.com";

function SearchResults(props) {
  useEffect(() => {
    function close(e) {
      if (!document.querySelector("#results").contains(e.target)) {
        props.close();
      }
    }
    document.addEventListener("click", close);
    return () => {
      document.removeEventListener("click", close);
    };
  }, []);

  return (
    <>
      <div id="results">
        {props.loading ? <Loader /> : null}
        {props.posts.map((post) => {
          return (
            <article>
              <Post
                key={post.upload}
                post_id={post._id}
                file_id={post.upload}
                user_id={post.user}
                video_id={post.video_id}
                title={post.title}
                name={post.name}
                description={post.description}
                category={post.category}
                likes={post.likes.length}
                date={post.dateAdded}
                amount={post.amount}
                wishlisted={post.wishlisted}
              />
            </article>
          );
        })}
      </div>
    </>
  );
}

function Search(props) {
  const [input, setInput] = useRecoilState(searchValue);
  const [results, setResults] = useState([]);
  const [searchActive, setSearchActive] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setInput(e.target.value);
    filter(input);
  };

  const handleSearch = async () => {
    // setSearchActive(true);
    // setLoading(true);
    // const posts = await search(input);
    // setResults(posts);
    // setLoading(false);
  };

  return (
    <>
      <form id="searchBar">
        <input
          id="searchInput"
          className={props.class}
          placeholder="Search topics..."
          onChange={(e) => handleChange(e)}
        ></input>
        <a className="fas fa-search" onClick={handleSearch}></a>
      </form>
      {searchActive ? (
        <SearchResults
          posts={results}
          loading={loading}
          close={() => {
            setSearchActive(false);
          }}
        />
      ) : null}
    </>
  );
}

function AuthPopup(props) {
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const authenticate = async () => {
    if (props.type == "login") {
      await login(username, password);
      props.toggle();
    } else {
      const response = await register(
        username,
        name,
        password,
        confirmPassword
      );
      props.toggle();
    }
  };

  useEffect(() => {
    function close(e) {
      if (!document.querySelector(".popup").contains(e.target)) {
        props.close();
      }
    }
    document.addEventListener("click", close);
    return () => {
      document.removeEventListener("click", close);
    };
  }, []);

  return (
    <div className="popup">
      <h2>{props.header}</h2>
      <a onClick={props.close}>x</a>
      <input
        id="usernameInput"
        placeholder="Enter username"
        onChange={(e) => setUsername(e.target.value)}
      ></input>
      <br />
      {props.type == "register" && (
        <>
          <input
            id="nameInput"
            placeholder="Add your name"
            onChange={(e) => setName(e.target.value)}
          ></input>
          <br />
        </>
      )}
      <input
        id="passwordInput"
        placeholder="Enter password"
        onChange={(e) => setPassword(e.target.value)}
      ></input>
      <br />
      {props.type == "register" && (
        <>
          <input
            id="confirmPassword"
            placeholder="Confirm password"
            onChange={(e) => setConfirmPassword(e.target.value)}
          ></input>
          <br />
        </>
      )}
      <p onClick={authenticate}>submit</p>
    </div>
  );
}

function User(props) {
  const [modalShown, toggleModal] = useState(false);

  return (
    <div>
      <div
        id={props.type}
        onClick={() => {
          toggleModal(!modalShown);
        }}
      >
        <i className={props.class}></i>
      </div>
      {modalShown ? (
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
      ) : null}
    </div>
  );
}

function BarMobile() {
  const [authed, setAuth] = useState(false);

  useEffect(() => {
    if (localStorage.userSession) setAuth(true);
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
  
//   useEffect(() => {
//     if (document.querySelector("#nav").style.width > 0) {
//     function close(e) {
//       if (!document.querySelector("#nav").contains(e.target)) {
//         document.querySelector("#nav").style.width = "0px";
//       }
//     }
//     document.addEventListener("click", close);
//     return () => {
//       document.removeEventListener("click", close);
//     };
//     }
//   });

  return (
    <>
      <span id="bar">
        <i className="fas fa-bars" id="openNav" onClick={openNav}></i>
        <Search class={( authed ? 'expandedSearch' : 'smallSearch' )} />
        {authed === true ? null : (
          <>
            <User
              toggle={() => {
                setAuth(true);
              }}
              type="register"
              class="fas fa-user-plus userLoginIcon"
            />
            <User
              toggle={() => {
                setAuth(true);
              }}
              type="login"
              class="fas fa-user userLoginIcon"
            />
          </>
        )}
      </span>
    </>
  );
}

export default BarMobile;
