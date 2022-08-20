import React, { useState, useEffect } from 'https://cdn.skypack.dev/react';
const urlApi = 'https://piwebinars-server.onrender.com';
import { renderWishlist, addWishlist } from '../app/webinars.js';
import { buyWebinar } from '../app/payment.js';
import {
  RecoilRoot,
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
} from 'https://cdn.skypack.dev/recoil';
import { storedWishlist } from '../atoms/posts.js';
import Cinema from '../components/Cinema.js';
import Loader from '../components/Loader.js';

// const getCurrentWishlist = selector({
//   key: 'getCurrentWishlist',
//   get: ({get}) => {
//     return get(storedWishlist);
//   },
// });

function Post(props) {  
  const [modalShown, toggleModal] = useState(false);
  const [webinars, setPosts] = useRecoilState(storedWishlist);
  
  const open = () => {
    toggleModal(!modalShown);
  };
  
  const purchase = async () => {
    const response = await buyWebinar();
  }
  
  const remove = async () => {
    let list = [];
    for (const post of webinars) {
      if (post.title != props.title) list.push(post);
    }
    setPosts(list);
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
  
  useEffect(async () => {
    if (webinars.length == 0) {
      const list = await renderWishlist();
      setPosts(list.data.wishlist);
      setLoading(false);
    } else setLoading(false);
  }, []);
  
  return (
    <>
      <span id="page">
        { loading ? <Loader /> : null }
        { webinars.map(post => { 
          return(
            <article>
              <Post key={post.upload} post_id={post._id} file_id={post.upload} user_id={post.user} video_id={post.video_id} title={post.title} name={post.name} description={post.description} category={post.category} date={post.dateAdded} amount={post.amount} post={post} />
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
      { !localStorage.userSession && <h2>Please login to see your wishlist of webinars</h2>}
    </RecoilRoot>
  )
}

export default Wishlist;