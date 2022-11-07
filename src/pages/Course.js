import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { addPostToCourse, getCourse, removePostFromCourse, editCourse, renderUploads } from '../app/webinars.js';
import Loader from '../components/Loader.js';
import { Post } from '../components/Posts.js';
import avatar from '../assets/avatar.png';

function Uploads(props) {
    const [uploads, setUploads] = useState([]);
    const [loading, setLoading] = useState(true);

    const getUploads = async () => {
        if (uploads.length == 0) {
            setLoading(true);
            const list = await renderUploads();
            setUploads(list.data.post);
            setLoading(false);
        }
    }

    useEffect(() => {
        getUploads()
            .catch((err) => {
                setLoading(false);
                console.log(err);
            });
    }, []);

    return (
        <>
            {loading ? <Loader /> : <>
                <div id='uploads'>
                    {uploads.map(upload => {
                        let owner = false;
                        for (const post of props.posts) {
                            if (post._id === upload._id) owner = true;
                        }

                        return (
                            <div key={upload._id} className='courseOwnPost'>
                                <img src={upload.thumbnail} />
                                <h4>{upload.title}</h4>
                                {owner === false ? <button onClick={() => { document.getElementById('course').style.cursor = 'wait'; props.addPost(upload).then(() => { owner = true }); document.getElementById('course').style.cursor = 'initial'; }} className='fas fa-plus'></button> :
                                    <button onClick={() => { document.getElementById('course').style.cursor = 'wait'; props.removePost(upload).then(() => { owner = false }); document.getElementById('course').style.cursor = 'initial'; }} className='fas fa-minus'></button>}
                            </div>
                        );
                    })}
                </div>
            </>}
        </>
    );
}

function Course(props) {
    const [course, setCourse] = useState({ title: 'Loading...', description: '', username: '', avatar: '', posts: [] });
    const [owner, setOwner] = useState(false);
    const [addingPosts, setAddingPosts] = useState(false);

    useEffect(() => {
        if (props.userId === localStorage.user) setOwner(true);
        Storage.prototype.getObj = function (key) {
            return JSON.parse(this.getItem(key));
        };
        const sessionCourse = sessionStorage.getObj('course');
        if (!sessionCourse || sessionCourse._id !== props.courseId) {
            getCourse(props.userId, props.courseId).then((response) => {
                console.log(response);
                setCourse(prev => ({ ...prev, ...response }));
            });
        } else {
            setCourse(prev => ({ ...prev, ...sessionCourse }));
            sessionStorage.removeItem('course');
        }
    }, []);

    const addPost = async (post) => {
        const response = await addPostToCourse(props.courseId, post);
        if (response.success == true) {
            setCourse(prev => ({ ...prev, posts: [...prev.posts, post] }));
        }
    }

    const removePost = async (post) => {
        if (course.posts.length <= 1) alert('There must be at least one post in a course.');
        else {
            const response = await removePostFromCourse(props.courseId, post);
            console.log(response);
            if (response.success == true) {
                const postIndex = course.posts.indexOf(post);
                console.log(postIndex);
                let newPosts = course.posts;
                console.log(newPosts);
                newPosts.splice(postIndex, 1);
                console.log(newPosts);
                setCourse(prev => ({ ...prev, posts: newPosts }));
            }
        }
    }

    const editTitle = async () => {
        if (owner) {
            const update = prompt('Enter new title', course.title);
            if (update) {
                const type = 'title';
                const response = await editCourse(type, update, props.userId, props.courseId);
                console.log(response);
                if (response.success == true) setCourse(prev => ({ ...prev, title: update }));
                else alert(response.message);
            }
        }
    }

    const editDescription = async () => {
        if (owner) {
            const update = prompt('Enter new description', course.description);
            if (update) {
                const type = 'description';
                const response = await editCourse(type, update, props.userId, props.courseId);
                if (response.success == true) setCourse(prev => ({ ...prev, description: update }));
                else alert(response.message);
            }
        }
    }

    return (
        <>
            <div id="course">
                <h2>{course.title} {owner && <a onClick={editTitle} className='fas fa-edit'></a>}</h2>
                <div id="courseHeader">
                    <h4>About this course:</h4>
                    <p>{course.description} {owner && <a onClick={editDescription} className='fas fa-edit'></a>}</p>
                    {course.posts.length > 1 ? <p id='courseLength'>Length: {course.posts.length} webinars</p> : <p id='courseLength'>Length: {course.posts.length} webinar</p>} <br />
                    <Link to={`/user/${props.userId}`} id='courseCreator'>
                        {course.avatar ? <img src={course.avatar} /> : <img src={avatar} />}
                        <p>{course.username}</p>
                    </Link>
                </div>

                {addingPosts ? <>
                    <div id='addingPostsToCourseDiv'>
                        <Uploads addPost={addPost} removePost={removePost} posts={course.posts} />
                    </div>

                    <button onClick={() => { setAddingPosts(false) }} id='addPostsToCourse' className='fas fa-window-close'></button>
                </> : <>
                    <div id="coursePosts">
                        {
                            course.posts.map(post => {
                                return (
                                    <article key={post.upload}>
                                        {owner ?
                                            <Post remove={() => { removePost(post) }} post={post} key={post.upload} post_id={post._id} file_id={post.upload} user_id={post.user} video_id={post.video_id} title={post.title} name={post.name} description={post.description} category={post.category} date={post.dateAdded} amount={post.amount} />
                                            : <Post post={post} key={post.upload} post_id={post._id} file_id={post.upload} user_id={post.user} video_id={post.video_id} title={post.title} name={post.name} description={post.description} category={post.category} date={post.dateAdded} amount={post.amount} />
                                        }
                                    </article>
                                );
                            })
                        }
                    </div>

                    {owner && <button onClick={() => { setAddingPosts(true) }} id='addPostsToCourse' className='fas fa-plus'></button>} <br />
                </>}

            </div>
        </>
    );
}

export default Course;