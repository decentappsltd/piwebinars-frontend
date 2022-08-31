import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { renderWebinars, addWishlist } from '../app/webinars.js';
import {
  RecoilRoot,
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
} from 'recoil';
import { storedPosts } from '../atoms/posts.js';
import { postsScrollState } from '../atoms/states.js';
import Cinema from './Cinema.js';
import Loader from './Loader.js';

const urlApi = 'https://piwebinars-server.onrender.com';

export function Post(props) {
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
          <Link to={`/user/${props.user_id}`} className="statName">{ props.name }</Link>
          <p2 className="statCategory">{props.category}</p2>
          <p2 className="statLikes">{props.amount} <i>Pi</i></p2>
        </div>
        { isWishlist == false ? 
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

function Posts(props) {  
  const [posts, setPosts] = useRecoilState(storedPosts);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    for (const post of props.posts) {
      // if (wishlist.length > 0) {
      //   for (const webinar of webinarUploads.data.list) {
      //     console.log(webinar);
      //     if (wishlist.some((e) => e._id === webinar.post._id)) {
      //       webinar.wishlisted = true;
      //     } else webinar.wishlisted = false;
      //   }
      // }
      setPosts((oldPosts) => [
        ...oldPosts,
        post,
      ]);
    };
  }, [props]);

  const getWebinars = async () => {
    if (posts.length == 0) {
      setLoading(true);
      const list = await renderWebinars();
      setLoading(false);
      setPosts(list.data.list);
    }
  }
  
  useEffect(() => {
    getWebinars();
  }, []);
  
  return (
    <>
      { loading ? <Loader /> : null }
      { posts.map(post => { 
        return(
          <article key={post.upload}>
            <Post key={post.upload} post_id={post._id} file_id={post.upload} user_id={post.user} video_id={post.video_id} title={post.title} name={post.name} description={post.description} category={post.category} likes={post.likes} dislike={post.dislike} date={post.dateAdded} amount={post.amount} wishlisted={post.wishlisted} />
          </article>
          );
        })
      }
    </>
    );
}

export default Posts;