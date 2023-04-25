import React, { useState, useEffect } from 'react';
import { renderWishlist, addWishlist } from '../app/webinars.js';
import { buyWebinar } from '../app/payment.js';
import {
  RecoilRoot,
  useRecoilState,
} from 'recoil';
import { storedWishlist } from '../atoms/posts.js';
import Cinema from '../components/Cinema.js';
import Loader from '../components/Loader.js';

const urlApi = 'https://piwebinars-server.onrender.com';

function Post(props) {
  const [modalShown, toggleModal] = useState(false);
  const [webinars, setPosts] = useRecoilState(storedWishlist);
  const [img, setImg] = useState('https://assets.codepen.io/6636213/empty.png');

  useEffect(() => {
    if (props.post.videoImg) setImg(props.post.videoImg);
  }, []);

  const open = () => {
    toggleModal(!modalShown);
  };

  const purchase = async () => {
    const post = {
      user: props.post.user_id,
      _id: props.post.post_id,
      videoId: props.post.videoId,
      amount: props.post.amount,
      title: props.post.title,
    }
    await buyWebinar(post);
  }

  const remove = async () => {
    let list = [];
    for (const post of webinars) {
      if (post.title != props.title) list.push(post);
    }
    setPosts(list);
    console.log(props);
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
          <p2 className="statName">{props.name}</p2>
          <span>•</span>
          <p2 className="statLikes">Watch for <b>{props.amount} Pi</b></p2>
        </div>
        <div className="wishlistOptions">
          <i onClick={purchase} className="fas fa-cart-plus"></i>
          <i onClick={remove} className="fas fa-minus"></i>
        </div>
      </div>

      {modalShown ?
        <Cinema close={() => {
          toggleModal(!modalShown);
        }} post={props} />
        : null
      }
    </>
  );
}

function RenderedList() {
  const [webinars, setPosts] = useRecoilState(storedWishlist);
  const [loading, setLoading] = useState(true);

  const getWishlist = async () => {
    if (webinars.length == 0) {
      const list = await renderWishlist();
      console.log(list);
      setPosts(list.data.wishlist);
      setLoading(false);
    } else setLoading(false);
  }

  useEffect(() => {
    getWishlist();
  }, []);

  useEffect(() => {
    function pushAds() {
      let adsbygoogle;
      (adsbygoogle = window.adsbygoogle || []).push({});
    }
    setTimeout(pushAds, 5000);
  }, []);

  return (
    <>
      <span id="page">
        {(loading && localStorage.userSession) ? <Loader /> : null}
        {webinars.map((post, index) => {
          function pushAds() {
            window._taboola = window._taboola || [];
            window._taboola.push({
              mode: 'thumbnails-home-mobile',
              container: `taboola-mobile-below-article-thumbnails-${index}`,
              placement: 'Mobile Below Article Thumbnails',
              target_type: 'mix'
            });
            window._taboola.push({ flush: true });
          }

          let ad = false;
          // if (index % 4 == 0) ad = true;
          if (ad === true && window.innerWidth < 850) setTimeout(pushAds, 3000);

          return (
            <>
              <article key={post.upload}>
                <Post key={post.upload} post_id={post.post_id} file_id={post.upload} user_id={post.user_id} video_id={post.videoId} title={post.title} name={post.name} description={post.description} category={post.category} date={post.dateAdded} amount={post.amount} post={post} />
              </article>
              {
                (ad === true && window.innerWidth < 850) &&
                <>
                  <div id={"taboola-mobile-below-article-thumbnails-" + index} style={{ display: "block", width: '85vw', maxWidth: '500px', minHeight: '100px' }}></div>
                </>
              }
            </>
          );
        })
        }
        {(webinars.length == 0 && localStorage.userSession && !loading) && <h2>Webinars in your wishlist will appear here...</h2>}
      </span>
    </>
  );
}

function Wishlist() {
  return (
    <RecoilRoot>
      <RenderedList />
      {!localStorage.userSession && <h2>Please login to see your wishlist of webinars</h2>}
    </RecoilRoot>
  )
}

export default Wishlist;