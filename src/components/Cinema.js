import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { useTranslation } from "react-i18next";
import { buyWebinar } from "../app/payment.js";
import { getPost, comment, likeWebinar, dislikeWebinar } from "../app/webinars.js";
import { manipulateComment } from "../app/authentication.js";
import avatar from '../assets/avatar.png';
import VideoJS from './Video.js';

function CommentReply(props) {
  return (
    <div className="comment-reply" style={{ borderTop: 'solid 1px #efc056' }}>
      <h5>{props.name}</h5>
      <p>{props.text}</p>
    </div>
  );
}

export function Comment(props) {
  const { t } = useTranslation();
  const [owner, setOwner] = useState(false);
  const [text, setText] = useState(props.text);
  const [likeText, setLike] = useState('like');
  const [replyText, setReply] = useState('reply');
  const [editText, setEdit] = useState('edit');
  const [deleteText, setDelete] = useState('delete');

  useEffect(() => {
    if (props.user === localStorage.user) {
      console.log(props);
      setOwner(true);
    }
  }, []);

  const like = async () => {
    console.log(props);
    setLike('loading...');
    const url_path = "like_unlike_comment";
    const api = "post";
    const response = await manipulateComment(
      url_path,
      api,
      props.user_id,
      props.post_id,
      props.id
    );
    setLike('unlike');
  };

  const reply = async () => {
    setReply('loading...');
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
    setReply('reply');
  };

  const deleteComment = async () => {
    setDelete('loading...');
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
    setText('');
    setDelete('Done!');
  };

  const editComment = async () => {
    setEdit('loading...');
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
    setText(text);
    setEdit('edit');
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
      <p className="commentText">{text}</p>
      <div className="interactiveDiv">
        <span className="interactiveDivCounts">
          {props.likes == 1 ? (
            <p className="commentLikes">{props.likes} {t('like')}</p>
          ) : (
            <p className="commentLikes">{props.likes} {t('likes')}</p>
          )}
          {props.replies == 1 ? (
            <p className="commentLikes">{props.replies} {t('reply')}</p>
          ) : (
            <p className="commentLikes">{props.replies} {t('replies')}</p>
          )}
        </span>
        <ul>
          <li className="likeComment" onClick={like}>
            <i className="fas fa-thumbs-up"></i> {likeText}
          </li>
          <li className="replyComment" onClick={reply}>
            <i className="fas fa-comment"></i> {replyText}
          </li>
        </ul>
        {owner && <>
          <ul>
            <li className="likeComment" onClick={editComment}>
              <i className="fas fa-edit"></i> {editText}
            </li>
            <li className="replyComment" onClick={deleteComment}>
              <i className="fas fa-trash"></i> {deleteText}
            </li>
          </ul>
          <div id="commentReplies">
            {props.commentReplies.map((comment) => {
              return (
                <article key={comment._id}>
                  <CommentReply
                    name={comment.name}
                    text={comment.text}
                  />
                </article>
              );
            })}
          </div>
        </>}
      </div>
    </>
  );
}

export default function Cinema(props) {
  const { t } = useTranslation();
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [isWebinarLiked, setWebinarLiked] = useState(false);
  const [isWebinarDisliked, setWebinarDisliked] = useState(false);
  const playerRef = React.useRef(null);

  const handleComment = async () => {
    console.log(props.post.user_id, props.post.post_id, text);
    if (!localStorage.userSession) alert("You must be logged in to comment");
    document.getElementById('postComment').disabled = 'true';
    document.getElementById('postComment').style.color = '#D3D3D3';
    document.getElementById('postComment').style.borderColor = '#D3D3D3';
    const response = await comment(
      props.post.user_id,
      props.post.post_id,
      text
    );
    document.getElementById('postComment').disabled = '';
    document.getElementById('text').value = '';
    document.getElementById('postComment').style.color = '#FBB44A';
    document.getElementById('postComment').style.borderColor = '#FBB44A';
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

  let width = 500;
  if (window.innerWidth < 500) width = window.innerWidth;
  const height = width * 0.5625;

  const videoJsOptions = {
    autoplay: false,
    controls: true,
    responsive: true,
    fluid: false,
    preload: 'none',
    width,
    height,
    sources: [{
      src: `https://api.dyntube.com/v1/live/videos/${props.post.post.videoId}.m3u8`,
      type: 'application/x-mpegURL'
    }]
  };

  const handlePlayerReady = (player) => {
    playerRef.current = player;

    player.on('timeupdate', () => {
      if (player.currentTime() >= 15) {
        player.pause();
        player.currentTime(0);
        // TODO: create payment
      }
    });
  };

  const getThePost = async () => {
    const post = await getPost(props.post.user_id, props.post.post_id);
    for (const item of post.comments) {
      setComments((oldComments) => [...oldComments, item]);
    }
    const { likes, dislikes } = JSON.parse(sessionStorage.profile);
    console.log(likes);
    let liked = likes.filter(function (e) {
      return e === localStorage.user;
    });
    let disLiked = dislikes.filter(function (e) {
      return e === localStorage.user;
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
        <div id="Video">
          <VideoJS options={videoJsOptions} onReady={handlePlayerReady} />
        </div>

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
            {props.post.dislikes !== undefined && (
              <p id="dislikes" onClick={handleDislike} className={`${isWebinarDisliked ? 'colourYellow' : 'colourBlack'}`}>
                <i className="fa fa-thumbs-down" id="dislikePost"></i>
                <span id="dislikesAmount">{props.post.dislikes}</span>
              </p>
            )}
            {window.innerWidth >= 850 && (<p id="category">{props.post.category}</p>)}
            {(props.post.date !== undefined && window.innerWidth >= 850) && (
              <p id="date">{props.post.date.substring(0, 10)}</p>
            )}
            <button id="pay" onClick={() => { buyWebinar(props.post) }}>
              {t('Buy_webinar')}
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

            { window.innerWidth <= 850 && <ins id='cinemaAdvert' className="adsbygoogle commentGoogleAd"
              style={{ display: "block", minWidth: '251px', minHeight: '50px' }}
              data-ad-format="fluid"
              data-ad-layout-key="-6f+d5-2h+50+bf"
              data-ad-client="ca-pub-7095325310319034"
              data-ad-slot="1627309222"></ins> }
          </span>
        </div>

        <div id="comments">
          <p2 style={{ borderTop: "solid 3px #fbb44a" }}>{t('Comments')}:</p2>
          <br />
          <br />
          <form className="commentField" id="commentForm">
            <input
              style={{ border: "none", padding: "5px" }}
              onChange={(e) => setText(e.target.value)}
              id="text"
              type="text"
              placeholder={t('Write_a_comment')}
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
              value={t('Comment')}
              id="postComment"
            />
          </form>
          <br />
          <div id="commentsContainer">
            { window.innerWidth > 850 && <ins className="adsbygoogle commentGoogleAd"
              style={{ display: "block", minWidth: '251px', minHeight: '50px' }}
              data-ad-format="fluid"
              data-ad-layout-key="-6f+d5-2h+50+bf"
              data-ad-client="ca-pub-7095325310319034"
              data-ad-slot="1627309222"></ins> }
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
                    commentReplies={comment.comment_reply}
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
