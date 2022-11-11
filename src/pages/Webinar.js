import React, { useState, useEffect } from "react";
import { createPath, Link } from 'react-router-dom';
import { buyWebinar } from "../app/payment.js";
import { getPost, comment, likeWebinar, dislikeWebinar } from "../app/webinars.js";
import { manipulateComment } from "../app/authentication.js";
import Player from '@vimeo/player';
import avatar from '../assets/avatar.png';
import { Comment } from '../components/Cinema.js';
import Loader from "../components/Loader.js";
import VideoJS from "../components/Video.js";
import videojs from "video.js";

function Webinar(props) {
    const [post, setPost] = useState({ title: '', description: '', price: '', video_url: '', user_id: '', post_id: '', likes: 0, dislike: 0, comments: [], commentReplies: [] });
    const [loading, setLoading] = useState(true);
    const [comments, setComments] = useState([]);
    const [commentsScroll, setCommentsScroll] = useState(0);
    const [text, setText] = useState("");
    const [isWebinarLiked, setWebinarLiked] = useState(false);
    const [isWebinarDisliked, setWebinarDisliked] = useState(false);
    const [isPurchased, setPurchased] = useState(false);

    const playerRef = React.useRef(null);
    let width = window.innerWidth - 260;
    if (window.innerWidth < 850) width = window.innerWidth;
    else if (window.innerWidth > 1000) width = 730;
    const height = width * 0.5625;
    const [videoJsOptions, setVideoJsOptions] = useState({
        autoplay: false,
        controls: true,
        responsive: true,
        fluid: false,
        preload: 'none',
        width,
        height
    });

    const handleComment = async () => {
        console.log(post.user_id, post.post_id, text);
        if (!sessionStorage.userSession) {
            window.location.href = "/login";
            return;
        }
        document.getElementById('postComment').disabled = 'true';
        document.getElementById('postComment').style.color = '#D3D3D3';
        document.getElementById('postComment').style.borderColor = '#D3D3D3';
        const response = await comment(
            post.user_id,
            post.post_id,
            text
        );
        document.getElementById('postComment').disabled = '';
        document.getElementById('text').value = '';
        document.getElementById('postComment').style.color = '#FBB44A';
        document.getElementById('postComment').style.borderColor = '#FBB44A';
    };

    const handleLike = async () => {
        if (!sessionStorage.userSession) {
            window.location.href = "/login";
            return;
        }
        const response = await likeWebinar(props.userId, props.postId);
        if (response == 'success' && isWebinarLiked == false) {
            setWebinarDisliked(false);
            setWebinarLiked(true);
            post.likes++;
            let amount = document.getElementById('likesAmount').textContent;
            amount = Number(amount) + 1;
            document.getElementById('likesAmount').textContent = amount;
        } else if (response == 'success') {
            setWebinarDisliked(false);
            setWebinarLiked(false);
            post.likes--;
            let amount = document.getElementById('likesAmount').textContent;
            amount = Number(amount) - 1;
            document.getElementById('likesAmount').textContent = amount;
        } else alert("Please login to like a webinar");
    };

    const handleDislike = async () => {
        if (!sessionStorage.userSession) {
            window.location.href = "/login";
            return;
        }
        const response = await dislikeWebinar(props.userId, props.postId);
        if (response == 'success' && isWebinarDisliked == false) {
            setWebinarLiked(false);
            setWebinarDisliked(true);
            post.dislike++;
            let amount = document.getElementById('dislikesAmount').textContent;
            amount = Number(amount) + 1;
            document.getElementById('dislikesAmount').textContent = amount;
        } else if (response == 'success') {
            setWebinarLiked(false);
            setWebinarDisliked(false);
            post.dislike--;
            let amount = document.getElementById('dislikesAmount').textContent;
            amount = Number(amount) - 1;
            document.getElementById('dislikesAmount').textContent = amount;
        } else alert('Please login to dislike a webinar');
    };

    const handlePlayerReady = (player) => {
        playerRef.current = player;

        player.on('timeupdate', () => {
            if (player.currentTime() >= 15 && isPurchased == false) {
                player.pause();
                player.currentTime(0);
                // TODO: create payment
            }
        });
    };

    const getThePost = async () => {
        let user, sessionPost;
        if (sessionStorage.profile && sessionStorage.profile !== 'undefined') user = JSON.parse(sessionStorage.profile);
        if (sessionStorage.post && sessionStorage.post !== 'undefined') sessionPost = JSON.parse(sessionStorage.post);
        let playing = false;

        if (sessionPost) {
            setPost(prev => ({ ...prev, ...sessionPost }));
            setLoading(false);
            setVideoJsOptions(prev => ({
                ...prev,
                sources: [{
                    src: `https://api.dyntube.com/v1/live/videos/${sessionPost.videoId}.m3u8`,
                    type: 'application/x-mpegURL'
                }]
            }));
        }
        const foundPost = await getPost(props.userId, props.postId);
        setPost(prev => ({
            ...prev,
            ...foundPost
        }));
        setPost(prev => ({
            ...prev,
            likes: foundPost.likes.length,
            dislike: foundPost.dislike.length,
        }));
        setLoading(false);
        console.log(foundPost);
        for (const item of foundPost.comments) {
            setComments((oldComments) => [...oldComments, item]);
        }
        const { likes, dislike } = foundPost;
        let liked = likes.filter(function (e) {
            return e.user === localStorage.user;
        });
        let disLiked = dislike.filter(function (e) {
            return e.user === localStorage.user;
        });
        if (liked.length) setWebinarLiked(true);
        if (disLiked.length) setWebinarDisliked(true);
        if (playing == false) {
            setVideoJsOptions(prev => ({
                ...prev,
                sources: [{
                    src: `https://api.dyntube.com/v1/live/videos/${foundPost.videoId}.m3u8`,
                    type: 'application/x-mpegURL'
                }]
            }));
        }
        // getting arrays from session storage
        if (user) {
            for (const item of user.purchased) {
                if (item.post_id == props.postId) {
                    setPurchased(true);
                    console.log('purchased');
                }
            }
        }
    }

    const handleCommentsScroll = () => {
        const comments = document.getElementById('comments');
        if (commentsScroll === 0) {
            document.getElementById('comments').style.top = (window.innerHeight - 200) + 'px';
        }
        if (comments.scrollTop > commentsScroll) {
            if (parseInt(comments.style.top) > 50) comments.style.top = (parseInt(comments.style.top) - 100) + 'px';
            else comments.style.top = '0px';
        } else {
            if (parseInt(comments.style.top) < ((window.innerWidth - 250) * 0.7 * 0.5625 - 100)) comments.style.top = (parseInt(comments.style.top) + 100) + 'px';
            else comments.style.top = (window.innerHeight - 200) + 'px';
        }
        setCommentsScroll(comments.scrollTop);
    }

    const handlePurchase = async (post) => {
        if (!sessionStorage.userSession) {
            window.location.href = "/login";
            return;
        }
        const response = await buyWebinar(post);
        if (response.data.success == 'true') {
            setPurchased(true);
            alert('Purchase successful. You can now watch the webinar here, or in your purchases page.');
        }
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
            <div id="webinarPage">

                <div id="Video">
                    <VideoJS options={videoJsOptions} onReady={handlePlayerReady} />
                </div>

                {loading ? <Loader /> :
                    <>
                        <div id="info">
                            <span>
                                <h3 id="title">{post.title}</h3>
                                <p id="description">{post.description}</p>
                                {post.likes !== undefined && (
                                    <p id="likes" onClick={handleLike} className={`${isWebinarLiked ? 'colourYellow' : 'colourBlack'}`}>
                                        <i className="fa fa-thumbs-up" id="likePost"></i>
                                        <span id="likesAmount">{post.likes}</span>
                                    </p>
                                )}
                                {post.dislike !== undefined && (
                                    <p id="dislikes" onClick={handleDislike} className={`${isWebinarDisliked ? 'colourYellow' : 'colourBlack'}`}>
                                        <i className="fa fa-thumbs-down" id="dislikePost"></i>
                                        <span id="dislikesAmount">{post.dislike}</span>
                                    </p>
                                )}
                                {window.innerWidth >= 850 && (<p id="category">{post.category}</p>)}
                                {(post.date !== undefined && window.innerWidth >= 850) && (
                                    <p id="date">{post.date.substring(0, 10)}</p>
                                )}
                                <button id="pay" onClick={() => { handlePurchase(post) }}>
                                    Buy webinar
                                </button>
                                <Link to={`/user/${props.userId}`} id="creatorProfile">
                                    {post.avatar ? (
                                        <img id="avatar" src={post.avatar}></img>
                                    ) : (
                                        <img
                                            id="avatar"
                                            src={avatar}
                                        ></img>
                                    )}
                                    <p id="name">{post.name}</p>
                                </Link>
                                {window.innerWidth < 850 && <a className="fas fa-arrow-left" id='postBackBtn' onClick={() => { window.history.back() }}></a>}
                            </span>
                        </div>

                        <div id="comments" onScroll={handleCommentsScroll}>
                            <p style={{ borderTop: "solid 3px #36454f", color: '#36454f' }}>Comments:</p>
                            <form className="commentField" id="commentForm">
                                <input
                                    style={{ border: "none", padding: "5px", color: '#36454f' }}
                                    onChange={(e) => setText(e.target.value)}
                                    id="text"
                                    type="text"
                                    placeholder="Write a comment.."
                                />
                                <input
                                    style={{
                                        textAlign: "center",
                                        border: "solid 2px #36454f",
                                        color: "#36454f",
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
                                                commentReplies={comment.comment_reply}
                                                post_id={post.post_id}
                                                user_id={post.user_id}
                                            />
                                        </article>
                                    );
                                })}
                            </div>
                        </div>
                    </>}
            </div>
        </>
    );
}

export default Webinar;