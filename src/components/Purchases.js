import React, { useState, useEffect } from 'react';
import { renderPurchases } from '../app/webinars.js';
import {
  RecoilRoot,
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
} from 'recoil';
import { storedPurchases } from '../atoms/posts.js';
import Loader from './Loader.js';
import Player from '@vimeo/player';

function Modal(props) {
  const setClickEvent = () => {
    function close(e) {
      if (!document.querySelector("#_cinema").contains(e.target)) {
        document.removeEventListener('click', close);
        props.close();
      }
    }
    document.addEventListener('click', close);
  }
  
  useEffect(() => {
    setTimeout(setClickEvent, 1000);
  }, []);
  
  useEffect(() => {
    let options;
    if (window.innerWidth < 850) {
      const width = Number(window.innerWidth);
      options = {
        url: props.post.url,
        controls: true,
        width: width,
        height: 250
      };
    } else {
      options = {
        url: props.post.url,
        controls: true,
        width: 500,
        height: 290
      };
    }
    new Player('_cinema', options);
  }, []);
  
  return (
    <>
      <div id="_cinema" style={{ height: "250px", position: "absolute", left: "0px", top: "calc(50vh - 125px)" }}></div>
    </>
  )
}

function Post(props) {
  const [modalShown, toggleModal] = useState(false);
  
  const open = () => {
    toggleModal(true);
    document.getElementById("tint").style.display = "block";
  };
  
  return (
    <>
      <div onClick={open} className="post">
        <iframe className="postThumbnail" src={props.url} frameBorder="0" webkitallowfullscreen="true" mozallowfullscreen="true" allowFullScreen></iframe>
        <h3 className="postTitle">{props.title}</h3>
      </div>
      
      {modalShown && 
        <Modal close={() => {
            toggleModal(false);
            document.getElementById("tint").style.display = "none";
          }} post={props} />
      }
    </>
  );
}

function Purchases() { 
  const [webinars, setPosts] = useRecoilState(storedPurchases);
  const [loading, setLoading] = useState(false);

  const getPurchases = async () => {
    if (webinars.length == 0) {
      setLoading(true);
      const list = await renderPurchases();
      console.log(list);
      setPosts(list.data.posts);
      setLoading(false);
    }
  }
  
  useEffect(() => {
    getPurchases();
  }, []);
  
  return (
    <>
      { webinars.map(post => { 
        return(
          <article key={post._id}>
            <Post title={post.title} url={post.url} />
          </article>
          );
        })
      }
      {loading ? <Loader /> : null}
      {(webinars.length == 0 && !loading) && <h2>Your purchases will appear here...</h2>}
    </>
  );
}

export default Purchases;