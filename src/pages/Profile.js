import React, { useState, useEffect } from 'react';
import { useTranslation } from "react-i18next";
import Uploads from '../components/Uploads.js';
import { myProfile, editProfile, addAvatar } from '../app/authentication.js';
import avatar from '../assets/avatar.png';

export default function Profile() {
  const { t } = useTranslation();
  const [profile, setProfile] = useState({
    name: "loading..",
    username: "loading..",
    avatar: '',
    followers: 0,
    following: 0,
    credit: 0,
    verified: false,
  });

  const getMyProfile = async () => {
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
  }

  useEffect(() => {
    getMyProfile();
  }, []);

  const handleEdit = async () => {
    const response = await editProfile(profile.username);
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
  }

  return (
    <>
      <span id="page">
        <div id="profile">
          {profile.avatar ?
            <img onClick={addAvatar} id="avatar" src={profile.avatar}></img>
            : <>
              <span id='avatar-span'>
                <img onClick={addAvatar} id="avatar" src={avatar}></img>
                <figcaption onClick={addAvatar} id="avatar-text">{t('Add_Avatar')}</figcaption>
              </span>
            </>
          }
          <span id="profileName">
            <p1>{profile.name}</p1>
            <a className="fas fa-edit" onClick={handleEdit}></a>
          </span>
          <span id="profileHandle">
            <p2>@{profile.username}</p2>
            {profile.verified === true ? <img id="verified" src="https://www.piwebinars.co.uk/img/Verified_Icon.png"></img> : null}
          </span>
          <span id="profileStats">
            <p>{t('Followers')}: {profile.followers}</p>
            <p>{t('Following')}: {profile.following}</p>
            <p>{t('Credit')}: {profile.credit} <i>Pi</i></p>
          </span>
        </div>
        <Uploads />
      </span>
    </>
  );
}