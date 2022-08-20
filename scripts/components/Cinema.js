import React, { useState, useEffect } from 'https://cdn.skypack.dev/react';

export default function Cinema(props) {
  useEffect(() => {
    console.log(props.post.date);
    function close(e) {
      if (!document.querySelector("#cinema").contains(e.target)) {
        props.close();
      }
    }
    document.addEventListener('click', close);
    return () => {
      document.removeEventListener('click', close);
    }
  }, []);
  
  useEffect(() => {
    const url = "https://player.vimeo.com/video/" + props.post.video_id;
    var options = {
      url: url,
      controls: true,
      width: 500,
      height: 500,
    };
      var videoPlayer = new Vimeo.Player('Video', options);
      setInterval(function() {
        videoPlayer.on('timeupdate', function(getAll) {
          let currentPos = getAll.seconds;
          if (currentPos >= 30) {
            videoPlayer.pause();
            videoPlayer.setCurrentTime(0);
            // const payTimeout = setTimeout(endPreview, 1000);
          }
        });
      }, 1000);
  }, []);

  return (
    <>
      <div id="cinema">
        <div id="Video"></div>
        <h2>{props.post.title}</h2>
        <p4>{props.post.description}</p4>
        { props.post.likes !== undefined && <p id="likes">Likes: {props.post.likes}</p> }
        { props.post.dislikes !== undefined && <p id="dislikes">Dislikes: {props.post.dislikes}</p> }
        <p id="category">{props.post.category}</p>
        { props.post.date !== undefined && <p id="date">{props.post.date.substring(0, 10)}</p> }
        <div id="creatorProfile">
          { props.post.avatar ? 
             <img id="avatar" src={props.post.avatar}></img>
             : <img id="avatar" src="https://piwebinars.co.uk/img/avatar.png"></img>
          }
          <p id="name">{props.post.name}</p>
        </div>
      </div>
    </>
  );
}