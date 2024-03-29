import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { useTranslation } from "react-i18next";
import { buyWebinar } from "../app/payment.js";
import { getPost, comment, likeWebinar, dislikeWebinar } from "../app/webinars.js";
import { manipulateComment } from "../app/authentication.js";
import avatar from '../assets/avatar.png';
import { Comment } from '../components/Cinema.js';
import Loader from "../components/Loader.js";
import VideoJS from "../components/Video.js";
import Ad from "../components/Ad.js";

function Webinar(props) {
    const { t } = useTranslation();
    const [post, setPost] = useState({ title: '', description: '', price: '', video_url: '', videoImg: 'https://assets.codepen.io/6636213/empty.png', user_id: '', post_id: '', likes: 0, dislikes: 0, comments: [], commentReplies: [] });
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
        if (!sessionStorage.userSession) {
            window.location.href = "/login";
            return;
        }
        document.getElementById('postComment').disabled = 'true';
        document.getElementById('postComment').style.color = '#D3D3D3';
        document.getElementById('postComment').style.borderColor = '#D3D3D3';
        const response = await comment(
            props.userId,
            props.postId,
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
            post.dislikes++;
            let amount = document.getElementById('dislikesAmount').textContent;
            amount = Number(amount) + 1;
            document.getElementById('dislikesAmount').textContent = amount;
        } else if (response == 'success') {
            setWebinarLiked(false);
            setWebinarDisliked(false);
            post.dislikes--;
            let amount = document.getElementById('dislikesAmount').textContent;
            amount = Number(amount) - 1;
            document.getElementById('dislikesAmount').textContent = amount;
        } else alert('Please login to dislike a webinar');
    };

    const getThePost = async () => {
        let sessionPost;
        if (sessionStorage.post && sessionStorage.post !== 'undefined') sessionPost = JSON.parse(sessionStorage.post);

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
        setLoading(false);
        console.log(foundPost);
        for (const item of foundPost.comments) {
            setComments((oldComments) => [...oldComments, item]);
        }
        if (sessionStorage.profile) {
            const { likes, dislikes } = JSON.parse(sessionStorage.profile);
            let liked = likes.filter(function (e) {
                return e === props.postId;
            });
            let disLiked = dislikes.filter(function (e) {
                return e === props.postId;
            });
            if (liked.length) setWebinarLiked(true);
            if (disLiked.length) setWebinarDisliked(true);
        }
        setVideoJsOptions(prev => ({
            ...prev,
            sources: [{
                src: `https://api.dyntube.com/v1/live/videos/${foundPost.videoId}.m3u8`,
                type: 'application/x-mpegURL'
            }]
        }));
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
    }

    useEffect(() => {
        getThePost();
    }, []);

    const handlePlayerReady = async (player) => {
        let user;
        let purchased = false;
        if (sessionStorage.profile && sessionStorage.profile !== 'undefined') user = JSON.parse(sessionStorage.profile);
        if (user) {
            for (const item of user.purchases) {
                if (item.webinar == props.postId) {
                    purchased = true;
                    document.getElementById('pay').style.display = 'none';
                }
            }
        }
        playerRef.current = player;
        if (!purchased) setPurchased(false);

        player.on('timeupdate', async () => {
            if (player.currentTime() >= 15 && purchased == false && props.userId !== '61ed4c16d45bdef7bd5a9a95') {
                player.currentTime(0);
                player.pause();
                const foundPost = await getPost(props.userId, props.postId);
                const paymentPost = {
                    user: props.userId,
                    _id: props.postId,
                    videoId: foundPost.videoId,
                    amount: foundPost.amount,
                    title: foundPost.title,
                }
                await handlePurchase(paymentPost);
            }
        });
    };

    return (
        <>
            <div id="webinarPage">

                <div id="Video">
                    {
                        isPurchased ?
                            <VideoJS options={videoJsOptions} onReady={handlePlayerReady} /> :
                            <div onClick={() => { handlePurchase(post) }} id="payWebinarThumb">
                                <img src={post.videoImg} id="webinarThumb" />
                                <i class="fas fa-play-circle"></i>
                                <span id="playBtnThumbBacking"></span>
                            </div>
                    }
                </div>

                {loading ? <Loader /> :
                    <>
                        <div id="info">
                            <span>
                                <h3 id="title" onClick={() => window.location.href = `/post/${props.userId}/${props.postId}`}>{post.title}</h3>
                                <p id="description">{post.description}</p>
                                {post.likes !== undefined && (
                                    <p id="likes" onClick={handleLike} className={`${isWebinarLiked ? 'colourYellow' : 'colourBlack'}`}>
                                        <i className="fa fa-thumbs-up" id="likePost"></i>
                                        <span id="likesAmount">{post.likes}</span>
                                    </p>
                                )}
                                {post.dislikes !== undefined && (
                                    <p id="dislikes" onClick={handleDislike} className={`${isWebinarDisliked ? 'colourYellow' : 'colourBlack'}`}>
                                        <i className="fa fa-thumbs-down" id="dislikePost"></i>
                                        <span id="dislikesAmount">{post.dislikes}</span>
                                    </p>
                                )}
                                {window.innerWidth >= 850 && (<p id="category">{post.category}</p>)}
                                {(post.date !== undefined && window.innerWidth >= 850) && (
                                    <p id="date">{post.date.substring(0, 10)}</p>
                                )}
                                <button id="pay" onClick={() => { handlePurchase(post) }}>
                                    {t('Buy_webinar')}
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
                            <p style={{ borderTop: "solid 3px #36454f", color: '#36454f' }}>{t('Comments')}:</p>
                            <form className="commentField" id="commentForm">
                                <input
                                    style={{ border: "none", padding: "5px", color: '#36454f' }}
                                    onChange={(e) => setText(e.target.value)}
                                    id="text"
                                    type="text"
                                    placeholder={t('Write_a_comment')}
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
                                    value={t('Comment')}
                                    id="postComment"
                                />
                            </form>
                            <br />
                            <div id="commentsContainer">
                                {window.innerWidth > 850 &&
                                    <Ad />
                                }
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
                                                post_id={props.postId}
                                                user_id={props.userId}
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