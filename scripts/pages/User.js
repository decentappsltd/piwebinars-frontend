import React, { useState, useEffect } from 'https://cdn.skypack.dev/react';
import { getProfile } from '../app/authentication.js';
import { renderCreator } from '../app/webinars.js';
import Cinema from '../components/Cinema.js';
import Loader from '../components/Loader.js';

function Post(props) {
  const [modalShown, toggleModal] = useState(false);
  const [isWishlist, setWishlist] = useState(false);
  
  useEffect(() => {
    if (props.wishlisted == true) {
      setWishlist(true);
    }
  }, []);
  
  const open = () => {
    toggleModal(!modalShown);
  };
  
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
          <p2 className="statCategory">{props.category}</p2>
          <p2 className="statLikes">{props.likes} likes</p2>
        </div>
        { isWishlist == false ? 
           <i onClick={add} className="fas fa-plus addWishlist"></i>
          : <i onClick={add} className="fas fa-minus addWishlist"></i>
        }
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

function Uploads(props) { 
  const [webinars, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  
  useEffect(async () => {
    if (webinars.length == 0) {
      setLoading(true);
      const list = await renderCreator(props.userId);
      setPosts(list.data.posts);
      setLoading(false);
    }
  }, []);
  
  return (
    <>
      {webinars.map(post => { 
        return(
          <article>
            <Post key={post.upload} post_id={post._id} file_id={post.upload} user_id={post.user} video_id={post.video_id} title={post.title} name={post.name} description={post.description} category={post.category} likes={post.likes.length} date={post.dateAdded} amount={post.amount} wishlisted={post.wishlisted} />
          </article>
          );
        })
      }
      {loading ? <Loader /> : null}
      {(webinars.length == 0 && !loading) && <h2>Loading webinars...</h2>}
    </>
  );
}

export default function User(props) {
  const [profile, setProfile] = useState({
    name: "loading..",
    username: "loading..",
    avatar: '',
    followers: 0,
    following: 0,
    verified: false,
  });
  
  useEffect(async () => {
    const userId = props.userId;
    const data = await getProfile(userId);
    setProfile({
      name: data.user.name,
      username: data.handle,
      avatar: data.avatar,
      followers: data.people_Who_Follow_Me,
      following: data.people_Who_I_Follow,
      verified: data.verified,
    });
  }, [])
  
  return (
    <>
      <span id="page">
        <div id="profile">
          { profile.avatar ?
            <img id="avatar" src={profile.avatar}></img>
           : <img id="avatar" src='https://piwebinars.co.uk/img/avatar.png'></img>
          }
          <h2>{profile.name}</h2>
          <span>
            <p2>@{profile.username}</p2> 
            { profile.verified === true ? <img id="verified" src="https://www.piwebinars.co.uk/img/Verified_Icon.png"></img> : null }
          </span>
          <p>Followers: {profile.followers}</p>
          <p>Following: {profile.following}</p>
        </div>
        <Uploads userId={props.userId} />
      </span>
    </>
  );
}