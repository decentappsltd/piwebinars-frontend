import React, { useState, useEffect } from 'https://cdn.skypack.dev/react';
import Uploads from '../components/Uploads.js';
import {myProfile} from '../app/authentication.js';

export default function Profile() {
  const [profile, setProfile] = useState({
    name: "loading..",
    username: "loading..",
    avatar: '',
    followers: 0,
    following: 0,
    credit: 0,
    verified: false,
  });
  
  useEffect(async () => {
    const data = await myProfile();
    setProfile({
      name: data.user.name,
      username: data.handle,
      avatar: data.avatar,
      followers: data.people_Who_Follow_Me,
      following: data.people_Who_I_Follow,
      credit: data.credit,
      verified: data.verified,
    });
  }, [])
  
  return (
    <>
      <span id="page">
        <div  id="profile">
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
          <p>Credit: {profile.credit} <i>Pi</i></p>
        </div>
        <Uploads />
      </span>
    </>
  );
}