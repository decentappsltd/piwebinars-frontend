import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { renderWebinars, addWishlist } from '../app/webinars.js';
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
          <Link to={`/user/${props.user_id}`} className="statName">{props.name}</Link>
          <p2 className="statCategory">{props.category}</p2>
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
  const [posts, setPosts] = useRecoilState(storedPosts);
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

  useEffect(() => {
    if (props.postId) {
      window.history.pushState(null, null, `/post/${props.userId}/${props.postId}`);
      toggleModal(true);
    }
    getWebinars();
  }, []);

  useEffect(() => {
    function pushAds() {
      let adsbygoogle;
      (adsbygoogle = window.adsbygoogle || []).push({});
    }
    setTimeout(pushAds, 2500);
  }, [props]);

  return (
    <>
      {loading ? <Loader /> : null}
      {posts.map((post, index) => {
        let ad = false;
        if (index % 4 == 0 ) ad = true;
        function pushAds() {
          let adsbygoogle;
          (adsbygoogle = window.adsbygoogle || []).push({});
        }
        if (ad === true) setTimeout(pushAds, 2500);
        return (
          <>
            <article style={{ display: 'flex' }} key={post.upload}>
              <Post key={post.upload} post={post} post_id={post._id} file_id={post.upload} user_id={post.user} video_id={post.video_id} title={post.title} name={post.name} description={post.description} category={post.category} likes={post.likes} dislike={post.dislike} date={post.dateAdded} amount={post.amount} wishlisted={post.wishlisted} />
            </article>
            {ad === true && <>
              <ins className="adsbygoogle"
                style={{ display: "block", minWidth: '251px', minHeight: '50px' }}
                data-ad-format="fluid"
                data-ad-layout-key="-6f+d5-2h+50+bf"
                data-ad-client="ca-pub-7095325310319034"
                data-ad-slot="1627309222"></ins>
            </>
            }
          </>
        );
      })
      }
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