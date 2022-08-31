import React, { useState, useEffect } from 'react';
import { getProfile, followUnfollow } from '../app/authentication.js';
import { renderCreator, renderFollowing, addWishlist } from '../app/webinars.js';
import Cinema from '../components/Cinema.js';
import Loader from '../components/Loader.js';
import {
  RecoilRoot,
  atom,
  selector,
  useRecoilState,
  useRecoilValue
} from "recoil";
import { storedFollowing } from "../atoms/posts.js";

function Post(props) {
  const [modalShown, toggleModal] = useState(false);
  const [isWishlist, setWishlist] = useState(false);
  
  useEffect(() => {
    document.getElementById("tint").style.display = "none";
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
  const [follow, setFollow] = useState('Follow');
  // const [following, setFollowing] = useRecoilState(storedFollowing);
  
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
    const creatorFollowing = data.following;
    // if (following.length == 0) {
      const list = await renderFollowing();
      const following = list.data.profile.following;
      console.log(following);
      // for (const item of following) {
      //   console.log(following);
      //   setFollowing((oldItems) => [
      //     ...oldItems, 
      //     item,
      //   ]);
      // };
    // }
    if (props.userId == localStorage.user) {
      document.getElementById("followBtn").style.display = "none";
    } else {
      console.log("two", creatorFollowing);
      console.log("three", following);
      const self_id = localStorage.user;
      const userId = props.userId;
      const amFollowed = creatorFollowing.map(x => x.user).indexOf(self_id);
      const amFollowing = following.map(x => x.user).indexOf(userId);
      console.log(amFollowed, amFollowing);
      if (amFollowed >= 0 && amFollowing < 0) setFollow("Follow Back");
      else if (amFollowing >= 0)  setFollow('Unfollow');
      else setFollow('Follow');
    }
  }, []);
  
  const handleFollow = async () => {
    const response = await followUnfollow(props.userId);
    setFollow(response);
  }
  
  return (
    <>
      <span id="page">
        <div id="profile">
          { profile.avatar ?
            <img id="avatar" src={profile.avatar}></img>
           : <img id="avatar" src='https://piwebinars.co.uk/img/avatar.png'></img>
          }
          <span id="profileName">
            <p1>{profile.name}</p1>
          </span>
          <span id="profileHandle">
            <p2>@{profile.username}</p2> 
            { profile.verified === true ? <img id="verified" src="https://www.piwebinars.co.uk/img/Verified_Icon.png"></img> : null }
          </span>
          <span id="profileStats">
            <p>Followers: {profile.followers}</p>
            <p>Following: {profile.following}</p>
          </span>
          <button id="followBtn" onClick={handleFollow}>{follow}</button>
        </div>
        <Uploads userId={props.userId} />
      </span>
    </>
  );
}