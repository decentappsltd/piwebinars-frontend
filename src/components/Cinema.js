import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { buyWebinar } from "../app/payment.js";
import { getPost, comment, likeWebinar, dislikeWebinar } from "../app/webinars.js";
import { manipulateComment } from "../app/authentication.js";
import Player from '@vimeo/player';
import avatar from '../assets/avatar.png';

function Comment(props) {
  const like = async () => {
    const url_path = "like_unlike_comment";
    const api = "post";
    const response = await manipulateComment(
      url_path,
      api,
      props.user_id,
      props.post_id,
      props.id
    );
  };

  const reply = async () => {
    const url_path = "comment";
    const api = "post";
    const text = prompt("Write reply:", "");
    const body = {
      text
    };
    const response = await manipulateComment(
      url_path,
      api,
      props.user_id,
      props.post_id,
      props.id,
      body
    );
  };

  const deleteComment = async () => {
    const url_path = "comment";
    const api = "delete";
    const response = await manipulateComment(
      url_path,
      api,
      props.user_id,
      props.post_id,
      props.id
    );
    console.log(response);
  };

  const editComment = async () => {
    const url_path = "comment";
    const api = "put";
    const text = prompt("Update text:", `${props.text}`);
    const body = {
      text
    };
    const response = await manipulateComment(
      url_path,
      api,
      props.user_id,
      props.post_id,
      props.id,
      body
    );
    console.log(response);
  };

  return (
    <>
      <div className="commentDiv">
        {props.avatar ? (
          <img className="commentAvatar" src={props.avatar}></img>
        ) : (
          <img
            className="commentAvatar"
            src={avatar}
          ></img>
        )}
        <h4 className="commentName">{props.name}</h4>
        <h6 className="commentDate">{props.date}</h6>
      </div>
      <p className="commentText">{props.text}</p>
      <div className="interactiveDiv">
        <span className="interactiveDivCounts">
          {props.likes == 1 ? (
            <p className="commentLikes">{props.likes} like</p>
          ) : (
            <p className="commentLikes">{props.likes} likes</p>
          )}
          {props.replies == 1 ? (
            <p className="commentLikes">{props.replies} reply</p>
          ) : (
            <p className="commentLikes">{props.replies} replies</p>
          )}
        </span>
        <ul>
          <li className="likeComment" onClick={like}>
            <i className="fas fa-thumbs-up"></i> like
          </li>
          <li className="replyComment" onClick={reply}>
            <i className="fas fa-comment"></i> reply
          </li>
        </ul>
      </div>
    </>
  );
}

export default function Cinema(props) {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [isWebinarLiked, setWebinarLiked] = useState(false);
  const [isWebinarDisliked, setWebinarDisliked] = useState(false);

  const handleComment = async () => {
    console.log(props.post.user_id, props.post.post_id, text);
    const response = await comment(
      props.post.user_id,
      props.post.post_id,
      text
    );
  };

  const handleLike = async () => {
    const response = await likeWebinar(props.post.user_id, props.post.post_id);
    if (response == 'success' && isWebinarLiked == false) {
      setWebinarDisliked(false);
      setWebinarLiked(true);
      props.post.likes++;
      let amount = document.getElementById('likesAmount').textContent;
      amount = Number(amount) + 1;
      document.getElementById('likesAmount').textContent = amount;
    } else if (response == 'success') {
      setWebinarDisliked(false);
      setWebinarLiked(false);
      props.post.likes--;
      let amount = document.getElementById('likesAmount').textContent;
      amount = Number(amount) - 1;
      document.getElementById('likesAmount').textContent = amount;
    } else alert("Please login to like a webinar");
  };

  const handleDislike = async () => {
    const response = await dislikeWebinar(props.post.user_id, props.post.post_id);
    if (response == 'success' && isWebinarDisliked == false) {
      setWebinarLiked(false);
      setWebinarDisliked(true);
      props.post.dislike++;
      let amount = document.getElementById('dislikesAmount').textContent;
      amount = Number(amount) + 1;
      document.getElementById('dislikesAmount').textContent = amount;
    } else if (response == 'success') {
      setWebinarLiked(false);
      setWebinarDisliked(false);
      props.post.dislike--;
      let amount = document.getElementById('dislikesAmount').textContent;
      amount = Number(amount) - 1;
      document.getElementById('dislikesAmount').textContent = amount;
    } else alert('Please login to dislike a webinar');
  };

  const setClickEvent = () => {
    function close(e) {
      if (!document.querySelector("#cinema").contains(e.target)) {
        document.removeEventListener('click', close);
        props.close();
      }
    }
    document.addEventListener('click', close);
  }

  useEffect(() => {
    setTimeout(setClickEvent, 500);
  }, []);

  useEffect(() => {
    const url = "https://player.vimeo.com/video/" + props.post.video_id;
    let options;
    if (window.innerWidth < 850) {
      options = {
        url: url,
        controls: true,
        width: window.innerWidth,
        height: 250
      };
    } else {
      options = {
        url: url,
        controls: true,
        width: 500,
        height: 290
      };
    }
    var videoPlayer = new Player("Video", options);
    setInterval(function () {
      videoPlayer.on("timeupdate", function (getAll) {
        let currentPos = getAll.seconds;
        if (currentPos >= 30) {
          videoPlayer.pause();
          videoPlayer.setCurrentTime(0);
        }
      });
    }, 1000);
  }, []);

  const getThePost = async () => {
    const post = await getPost(props.post.user_id, props.post.post_id);
    for (const item of post.comments) {
      setComments((oldComments) => [...oldComments, item]);
    }
    const { likes, dislike } = post;
    console.log(likes);
    let liked = likes.filter(function (e) {
      return e.user === localStorage.user;
    });
    let disLiked = dislike.filter(function (e) {
      return e.user === localStorage.user;
    });
    if (liked.length) setWebinarLiked(true);
    if (disLiked.length) setWebinarDisliked(true);
  }

  useEffect(() => {
    getThePost();
  }, []);

  useEffect(() => {
    function pushAds() {
      let adsbygoogle;
      (adsbygoogle = window.adsbygoogle || []).push({});
    }
    setTimeout(pushAds, 2000);
  }, []);

  return (
    <>
      <div id="cinema">
        <div id="Video"></div>

        <div id="info">
          <span>
            <h3 id="title">{props.post.title}</h3>
            <p5 id="description">{props.post.description}</p5>
            {props.post.likes !== undefined && (
              <p id="likes" onClick={handleLike} className={`${isWebinarLiked ? 'colourYellow' : 'colourBlack'}`}>
                <i className="fa fa-thumbs-up" id="likePost"></i>
                <span id="likesAmount">{props.post.likes}</span>
              </p>
            )}
            {props.post.dislike !== undefined && (
              <p id="dislikes" onClick={handleDislike} className={`${isWebinarDisliked ? 'colourYellow' : 'colourBlack'}`}>
                <i className="fa fa-thumbs-down" id="dislikePost"></i>
                <span id="dislikesAmount">{props.post.dislike}</span>
              </p>
            )}
            {window.innerWidth >= 850 && (<p id="category">{props.post.category}</p>)}
            {(props.post.date !== undefined && window.innerWidth >= 850) && (
              <p id="date">{props.post.date.substring(0, 10)}</p>
            )}
            <button id="pay" onClick={() => { buyWebinar(props.post) }}>
              Buy webinar
            </button>
            <Link to={`/user/${props.post.user_id}`} id="creatorProfile">
              {props.post.avatar ? (
                <img id="avatar" src={props.post.avatar}></img>
              ) : (
                <img
                  id="avatar"
                  src={avatar}
                ></img>
              )}
              <p id="name">{props.post.name}</p>
            </Link>
          </span>
        </div>

        <div id="comments">
          <p2 style={{ borderTop: "solid 3px #fbb44a" }}>Comments:</p2>
          <br />
          <br />
          <form className="commentField" id="commentForm">
            <input
              style={{ border: "none", padding: "5px" }}
              onChange={(e) => setText(e.target.value)}
              id="text"
              type="text"
              placeholder="Write a comment.."
            />
            <input
              style={{
                textAlign: "center",
                border: "solid 2px #fbb44a",
                color: "#fbb44a",
                fontWeight: "bold",
                padding: "3px 5px",
                background: "none",
                marginLeft: "5px"
              }}
              onClick={handleComment}
              type="button"
              value="Comment"
              id="postComment"
            />
          </form>
          <br />
          <div id="commentsContainer">
            <ins className="adsbygoogle commentGoogleAd"
              style={{ display: "block", minWidth: '251px', minHeight: '50px' }}
              data-ad-format="fluid"
              data-ad-layout-key="-6f+d5-2h+50+bf"
              data-ad-client="ca-pub-7095325310319034"
              data-ad-slot="1627309222"></ins>
            {comments.map((comment) => {
              return (
                <article key={comment._id}>
                  <Comment
                    id={comment._id}
                    user={comment.user}
                    avatar={comment.avatar}
                    name={comment.name}
                    date={comment.dateAdded.substring(0, 10)}
                    text={comment.text}
                    likes={comment.comment_likes.length}
                    replies={comment.comment_reply.length}
                    post_id={props.post.post_id}
                    user_id={props.post.user_id}
                  />
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
