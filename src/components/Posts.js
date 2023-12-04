import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { renderMore, renderWebinars, addWishlist } from '../app/webinars.js';
import {
  useRecoilState,
} from 'recoil';
import { storedPosts } from '../atoms/posts.js';
import Cinema from './Cinema.js';
import Loader from './Loader.js';

export function Post(props) {
  const [modalShown, toggleModal] = useState(false);
  const [isWishlist, setWishlist] = useState(false);
  const [img, setImg] = useState('https://assets.codepen.io/6636213/empty.png');

  useEffect(() => {
    if (props.wishlisted == true) setWishlist(true);
    if (props.post.videoImg) setImg(props.post.videoImg);
  }, []);

  const open = () => {
    // toggleModal(!modalShown);
    // document.getElementById("tint").style.display = "block";
    // window.history.pushState(null, null, `/post/${props.user_id}/${props.post_id}`);
    Storage.prototype.setObj = function (key, obj) {
      return this.setItem(key, JSON.stringify(obj));
    };
    sessionStorage.setObj('post', props.post);
    console.log('post 1', sessionStorage.getObj('post'));
    window.location.href = `/post/${props.user_id}/${props.post_id}`;
  };

  const handleClose = () => {
    toggleModal(!modalShown);
    document.getElementById("tint").style.display = "none";
    window.history.pushState(null, null, `/`);
  }

  const add = async () => {
    setWishlist(!isWishlist);
    const response = await addWishlist(props);
  };

  const handleMouseEnter = () => {
    if (props.post.videoGif) setImg(props.post.videoGif);
  }

  const handleMouseLeave = () => {
    if (props.post.videoImg) setImg(props.post.videoImg);
  }


  return (
    <>
      <div className="post">
        <img onClick={open} className="postThumbnail" src={img} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}></img>
        <h3 className="postTitle">{props.title}</h3>
        <div className="statDiv">
          <Link to={`/user/${props.user_id}`} className="statName">{props.name.toString().substring(0, 7)}{props.name.length > 7 && <span>...</span>}</Link>
          <span>•</span>
          <p2 className="statCategory">
            {props.category.toLowerCase() === 'cryptocurrency' && 'Crypto'}
            {props.category.toLowerCase() === 'technology' && 'Tech'}
            {(props.category.toLowerCase() !== 'cryptocurrency' && props.category.toLowerCase() !== 'technology') && `${props.category}`}
          </p2>
          <span>•</span>
          <p2 className="statLikes">{props.amount} <i>Pi</i></p2>
        </div>
        {props.remove ? <i onClick={props.remove} className="fas fa-minus addWishlist"></i> : <>
          {isWishlist == false ?
            <i onClick={add} className="fas fa-plus addWishlist"></i>
            : <i onClick={add} className="fas fa-minus addWishlist"></i>
          } </>
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
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalShown, toggleModal] = useState(false);

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

  const applyCategory = async () => {
    setPosts([]);
    setLoading(true);
    const category = localStorage.category;
    const response = await renderMore(category);
    const morePosts = response.data.list;
    let list = [];
    for (const post of morePosts) {
      list.push(post);
    }
    setPosts(list);
    setLoading(false);
  }

  useEffect(() => {
    if (props.postId) {
      window.history.pushState(null, null, `/post/${props.userId}/${props.postId}`);
      toggleModal(true);
    }
    getWebinars();

    window.addEventListener('category', () => {
      if (localStorage.category !== '') applyCategory();
      else {
        setPosts([]);
        getWebinars();
      }
    });
  }, []);

  return (
    <>
      {loading ? <Loader /> : null}

      {
        posts.map((post, index) => {
          let ad = false;
          if (index % 4 == 0) ad = true;

          return (
            <>
              <article style={{ display: 'flex' }} key={post.upload}>
                <Post key={post.upload} post={post} post_id={post._id} file_id={post.upload} user_id={post.user} video_id={post.video_id} title={post.title} name={post.name} description={post.description} category={post.category} likes={post.likes} dislike={post.dislike} date={post.dateAdded} amount={post.amount} wishlisted={post.wishlisted} />
              </article>
              {
                ad === true &&
                <>
                  {
                    index !== 0 ?
                      <iframe src="//www.topcreativeformat.com/31321ce92233d755671e4488afe05bf4/invoke.js" style={{ width: '300px', height: '250px', margin: '50px', border: '0px', padding: '0', overflow: 'hidden', backgroundColor: 'transparent' }}></iframe> :
                      <a id="epimall" href='https://www.epimall.io'>
                        <img  src='https://piwebinars.co.uk/epimall.png' style={{ width: '300px', height: '250px', margin: '50px', border: '0px', padding: '0', overflow: 'hidden', backgroundColor: 'transparent', cursor: 'pointer' }}></img>
                      </a>
                  }
                </>
              }
            </>
          );
        })
      }

      {posts.length == 0 && !loading && <h2>No posts found</h2>}
      {modalShown ?
        <Cinema close={() => {
          toggleModal(false);
          window.history.pushState(null, null, `/`);
        }} postId={props.postId} userId={props.userId} />
        : null
      }
    </>
  );
}

export default Posts;