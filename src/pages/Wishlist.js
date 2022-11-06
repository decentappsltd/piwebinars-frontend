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

  const open = () => {
    toggleModal(!modalShown);
  };

  const purchase = async () => {
    const response = await buyWebinar(props.post);
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

  return (
    <>
      <div className="post">
        <img onClick={open} className="postThumbnail" src={`https://vumbnail.com/${props.video_id}.jpg`}></img>
        <h3 className="postTitle">{props.title}</h3>
        <div className="statDiv">
          <p2 className="statName">{props.name}</p2>
          <p2 className="statCategory">{props.category}</p2>
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
        {loading ? null :
          <>
            <ins className="adsbygoogle"
              style={{ display: "block", minWidth: '251px', minHeight: '50px' }}
              data-ad-format="fluid"
              data-ad-layout-key="-6f+d5-2h+50+bf"
              data-ad-client="ca-pub-7095325310319034"
              data-ad-slot="1627309222"></ins>
          </>
        }
        {webinars.map(post => {
          return (
            <article key={post.upload}>
              <Post key={post.upload} post_id={post.post_id} file_id={post.upload} user_id={post.user_id} video_id={post.video_id} title={post.title} name={post.name} description={post.description} category={post.category} date={post.dateAdded} amount={post.amount} post={post} />
            </article>
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