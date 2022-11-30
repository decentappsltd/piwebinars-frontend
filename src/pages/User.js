import React, { useState, useEffect } from 'react';
import { useTranslation } from "react-i18next";
import { getProfile, followUnfollow } from '../app/authentication.js';
import { renderCreator, renderFollowing, addWishlist } from '../app/webinars.js';
import Cinema from '../components/Cinema.js';
import Loader from '../components/Loader.js';
import avatar from '../assets/avatar.png';
import { Preview } from '../components/Courses.js';

function Post(props) {
  const { t } = useTranslation();
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
          <p2 className="statLikes">{props.likes} {t('likes')}</p2>
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

<<<<<<< Updated upstream
function Uploads(props) { 
=======
function Uploads(props) {
  const { t } = useTranslation();
>>>>>>> Stashed changes
  const [webinars, setPosts] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [display, setDisplay] = useState('posts');
  const [Active, setActive] = useState({
    stateA: 'selectionTabActive',
    stateB: 'selectionTabInactive'
  });
  
  const updateStateA = () => {
    setActive({
      stateA: 'selectionTabActive',
      stateB: 'selectionTabInactive'
    });
    setDisplay("posts");
  };
  
  const updateStateB = () => {
    setActive({
      stateA: 'selectionTabInactive',
      stateB: 'selectionTabActive'
    });
    setDisplay("courses");
  };

  const getUploads = async () => {
    if (webinars.length == 0) {
      setLoading(true);
      const list = await renderCreator(props.userId);
      setPosts(list.data.posts);
      setCourses(list.data.courses);
      setLoading(false);
    }
  }
  
  useEffect(() => {
    getUploads();
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
      <div id='displayToggle'>
        <span className={Active.stateA} onClick={updateStateA}>{t('Posts')}</span>
        <span className={Active.stateB} onClick={updateStateB}>{t('Courses')}</span>
      </div>

      { display == 'posts' && <>{webinars.map(post => { 
        return(
          <article>
            <Post key={post.upload} post={post} post_id={post._id} file_id={post.upload} user_id={post.user} video_id={post.video_id} title={post.title} name={post.name} description={post.description} category={post.category} likes={post.likes.length} date={post.dateAdded} amount={post.amount} wishlisted={post.wishlisted} />
          </article>
          );
        })
      }</> }

      { display == 'courses' && <>{courses.map(course => {
        return(
          <article>
            <Preview course_id={course._id} course={course} title={course.title} description={course.description} length={course.posts.length} avatar={course.avatar} username={course.username} posts={course.posts} />
          </article>
          );
        })
      }</> }

      {loading ? <Loader /> : null}
<<<<<<< Updated upstream
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
      {(webinars.length == 0 && !loading && display == 'posts') && <h2 style={{ position: 'fixed', top: 'calc(50vh - 10px)', width: '100%', textAlign: 'center' }}>There are no webinars here, yet</h2>}
      {(courses.length == 0 && !loading && display == 'courses') && <h2 style={{ position: 'fixed', top: 'calc(50vh - 10px)', width: '100%', textAlign: 'center' }}>There are no courses here, yet</h2>}
=======
      {(webinars.length == 0 && !loading && display == 'posts') && <h2 style={{ position: 'fixed', top: 'calc(50vh - 10px)', width: '100%', textAlign: 'center' }}>{t('no_webinars')}</h2>}
      {(courses.length == 0 && !loading && display == 'courses') && <h2 style={{ position: 'fixed', top: 'calc(50vh - 10px)', width: '100%', textAlign: 'center' }}>{t('no_courses')}</h2>}
>>>>>>> Stashed changes
    </>
  );
}

export default function User(props) {
  const { t } = useTranslation();
  const [profile, setProfile] = useState({
    name: "loading..",
    username: "loading..",
    avatar: '',
    followers: 0,
    following: 0,
    verified: false,
  });
  const [follow, setFollow] = useState('Follow');

  const findFollowing = async () => {
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
    const list = await renderFollowing();
    const following = list.data.profile.following;
    console.log(following);
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
  }
  
  useEffect(() => {
    findFollowing();
  }, []);
  
  const handleFollow = async () => {
    const response = await followUnfollow(props.userId);
    setFollow(response);
  }
  
  return (
    <>
      <span id="page" style={{ paddingBottom: '50px', height: 'calc(100vh - 50px)'}}>
        <div id="profile">
          { profile.avatar ?
            <img id="avatar" src={profile.avatar}></img>
           : <img id="avatar" src={avatar}></img>
          }
          <span id="profileName">
            <p1>{profile.name}</p1>
          </span>
          <span id="profileHandle">
            <p2>@{profile.username}</p2> 
            { profile.verified === true ? <img id="verified" src="https://www.piwebinars.co.uk/img/Verified_Icon.png"></img> : null }
          </span>
          <span id="profileStats">
            <p>{t('Followers')}: {profile.followers}</p>
            <p>{t('Following')}: {profile.following}</p>
          </span>
          <button id="followBtn" onClick={handleFollow}>{follow}</button>
        </div>
        <Uploads userId={props.userId} />
      </span>
    </>
  );
}