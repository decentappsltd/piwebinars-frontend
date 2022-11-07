import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCourses, createCourse } from '../app/webinars.js';
import Loader from './Loader.js';
import Uploads from './Uploads.js';
import avatar from '../assets/avatar.png';

function CreateCourse(props) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [posts, setPosts] = useState([]);
  const [created, setCreated] = useState(false);
  const [completedUserId, setCompletedUserId] = useState();
  const [completedCourseId, setCompletedCourseId] = useState();

  const createNewCourse = async () => {
    document.getElementById("createCourseButton").innerHTML = "Loading...";
    const response = await createCourse(title, description, posts);
    console.log(response);
    if (response.success == true) {
      document.getElementById("createCourseButton").innerHTML = "Done!";
      setCreated(true);
      setCompletedUserId(response.createdCourse.user);
      setCompletedCourseId(response.createdCourse._id);
    }
  }

  const addToCourse = async (post) => {
    // check for post in posts
    function mapPosts(x) {
      return x._id.toString();
    }
    const post_ids = posts.map(mapPosts);
    const postIndex = post_ids.indexOf(post._id.toString());
    // add or remove post
    if (postIndex < 0) {
      let filteredPost = {
        amount: post.amount,
        category: post.category,
        description: post.description,
        dateAdded: post.dateAdded,
        name: post.name,
        thumbnail: post.thumbnail,
        title: post.title,
        user: post.user,  
        upload: post.upload,
        video_id: post.video_id,
        _id: post._id
      }
      setPosts([...posts, filteredPost]);
    } else {
      let newPosts = posts;
      newPosts.splice(postIndex, 1);
      setPosts(newPosts);
    }
  }

  return (
    <div id="createCourse">
      <div className="createCourse">
        <h3 onClick={() => { console.log(posts) }}>Create a new course</h3>
        <br />
        <input type="text" placeholder="Give your course a title" onChange={e => setTitle(e.target.value)} /> <br /> <br />
        <textarea placeholder="Describe your course" onChange={e => setDescription(e.target.value)} /> <br /> <br />
        <p>Choose your webinars to add:</p> <br />
        <div id='courseUploads'>
          <Uploads course={(post) => { addToCourse(post) }} />
        </div> <br />
        <button id='createCourseButton' onClick={createNewCourse}>Create</button>
      </div>

      <a style={{ float: 'right' }} onClick={props.close} className='fas fa-arrow-left'></a>

      { created && <>
        <div id="courseSuccessModal">
          <h3>Course created successfully!</h3>
          <p><Link to={`/course/${completedUserId}/${completedCourseId}`}>View your new course</Link> or <a style={{ textDecoration: 'underlined', color: '#fbb44a' }} onClick={props.close}>return home</a>.</p>
        </div>
      </>}
    </div>
  );
}

export function Preview(props) {
  const handleOpen = () => {
    Storage.prototype.setObj = function (key, obj) {
      return this.setItem(key, JSON.stringify(obj));
    };
    sessionStorage.setObj('course', props.course);
    console.log('coures 1', sessionStorage.getObj('course'));
    window.location.href = `/course/${props.posts[0].user}/${props.course_id}`;
  }

  return (
    <>
      <div onClick={handleOpen} className="course">
        { props.posts[0] && <img src={`https://vumbnail.com/${props.posts[0].video_id}.jpg`} /> }
        <h3>{props.title}</h3>
        <p className='courseDescription'>{props.description}</p>
        <p className='courseLength'>Length: {props.length} webinars</p>
        {props.posts[0] &&
          <Link to={`/user/${props.posts[0].user}`} className='courseCreator'>
            <span>
              { props.avatar ? <img src={props.avatar} /> : <img src={avatar} /> }
              <p>{props.username}</p>
            </span>
          </Link>
        }
      </div>
    </>
  );
}

function Courses(props) {
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState([]);
  const [newCourse, setNewCourse] = useState(false);

  useEffect(() => {
    console.log(courses, props.courses);
    for (const course of props.courses) {
      setCourses((oldCourses) => [
        ...oldCourses,
        course,
      ]);
    };
  }, [props]);

  const getCoursesFromDB = async () => {
    const response = await getCourses(1);
    for (const course of response) {
      setCourses((oldCourses) => [
        ...oldCourses,
        course,
      ]);
    };
    console.log(response);
    setLoading(false);
  }

  useEffect(() => {
    getCoursesFromDB();
  }, [newCourse]);

  return (
    <>
      {loading === true ? <><div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', height: '200px', padding: '10px ' }}><h2>Explore courses to learn a new skill...</h2><Loader /></div></> :
        <>
          {courses.length == 0 && <h2>There are no courses yet, check again later...</h2>}
          {
            courses.map(course => {
              return (
                <article key={course._id}>
                  <Preview course_id={course._id} course={course} title={course.title} description={course.description} length={course.posts.length} avatar={course.avatar} username={course.username} posts={course.posts} />
                </article>
              );
            })
          }
        </>
      }

      {
        newCourse ? <CreateCourse close={() => { setNewCourse(false) }} /> :
          <a onClick={() => { setNewCourse(true) }} id='newCourseBtn'>
            <p>Create a course</p>
            <i className='fas fa-plus'></i>
          </a>
      }
    </>
  );
}

export default Courses;