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
import Vimeo from '@vimeo/player';

const urlApi = 'https://piwebinars-server.onrender.com';

function Modal(props) {
  useEffect(() => {
    function close(e) {
      if (!document.querySelector("#_cinema").contains(e.target)) {
        props.close();
      }
    }
    document.addEventListener('click', close);
    return () => {
      document.removeEventListener('click', close);
    }
  }, []);
  
  useEffect(() => {
    let options;
    if (window.innerWidth < 850) {
      const width = Number(window.innerWidth);
      const size = width*0.85;
      options = {
        url: props.url,
        controls: true,
        width: size,
        height: 250
      };
    } else {
      options = {
        url: props.url,
        controls: true,
        width: 500,
        height: 290
      };
    }
    var videoPlayer = new Vimeo.Player('_cinema', options);
  }, []);
  
  return (
    <>
      <div id="_cinema"></div>
    </>
  )
}

function Post(props) {
  const [modalShown, toggleModal] = useState(false);
  
  const open = () => {
    toggleModal(!modalShown);
  };
  
  return (
    <>
      <div onClick={open} className="post">
        <iframe className="postThumbnail" src={props.url} frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>
        <h3 className="postTitle">{props.title}</h3>
      </div>
      
      {modalShown ? 
        <Modal close={() => {
            toggleModal(!modalShown);
          }} post={props} />
        : null
      }
    </>
  );
}

let posts = [];

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