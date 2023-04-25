import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from "react-i18next";
import { getCourses, createCourse } from '../app/webinars.js';
import Loader from './Loader.js';
import Uploads from './Uploads.js';
import avatar from '../assets/avatar.png';

function CreateCourse(props) {
  const { t } = useTranslation();
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
        videoImg: post.videoImg,
        videoId: post.videoId,
        videoURL: post.videoURL,
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
        <h3 onClick={() => { console.log(posts) }}>{t('Create_a_new_course')}</h3>
        <br />
        <input type="text" placeholder={t('Give_your_course_a_title')} onChange={e => setTitle(e.target.value)} /> <br /> <br />
        <textarea placeholder={t('Describe_your_course')} onChange={e => setDescription(e.target.value)} /> <br /> <br />
        <p>{t('Choose_your_webinars_to_add')}:</p> <br />
        <div id='courseUploads'>
          <Uploads course={(post) => { addToCourse(post) }} />
        </div> <br />
        <button id='createCourseButton' onClick={createNewCourse}>{t('Create')}</button>
      </div>

      <a style={{ float: 'right' }} onClick={props.close} className='fas fa-arrow-left'></a>

      {created && <>
        <div id="courseSuccessModal">
          <h3>{t('Course_created_successfully')}</h3>
          <p><Link to={`/course/${completedUserId}/${completedCourseId}`}>{t('View_your_new_course')}</Link> {t('or')} <a style={{ textDecoration: 'underlined', color: '#fbb44a' }} onClick={props.close}>{t('return_home')}</a>.</p>
        </div>
      </>}
    </div>
  );
}

export function Preview(props) {
  const { t } = useTranslation();
  const [img, setImg] = useState('');

  useEffect(() => {
    if (props.posts[0]) {
      if (props.posts[0].videoImg) setImg(props.posts[0].videoImg);
      else setImg('https://assets.codepen.io/6636213/empty.png');
    } else setImg('https://assets.codepen.io/6636213/empty.png');
  }, []);

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
        <img src={img} />
        <h3>{props.title}</h3>
        <p className='courseDescription'>{props.description}</p>
        {props.length > 1 ? <p className='courseLength'>{t('Length_webinars', { length: props.length })}</p> : <p className='courseLength'>{t('Length_webinar', { length: props.length })}</p>}
        {props.posts[0] &&
          <Link to={`/user/${props.posts[0].user}`} className='courseCreator'>
            <span>
              {props.avatar ? <img src={props.avatar} /> : <img src={avatar} />}
              <p>{props.username}</p>
            </span>
          </Link>
        }
      </div>
    </>
  );
}

function Courses(props) {
  const { t } = useTranslation();
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
      {loading === true ? <><div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', height: '200px', padding: '10px ' }}><h2>{t('Explore_courses_to_learn_a_new_skill')}</h2><Loader /></div></> :
        <>
          {courses.length == 0 && <h2>There are no courses yet, check again later...</h2>}
          {
            courses.map((course, index) => {
              function pushAds() {
                window._taboola = window._taboola || [];
                window._taboola.push({
                  mode: 'thumbnails-home-mobile',
                  container: `taboola-mobile-below-article-thumbnails-${index}`,
                  placement: 'Mobile Below Article Thumbnails',
                  target_type: 'mix'
                });
                window._taboola.push({ flush: true });
              }

              let ad = false;
              // if (index % 3 == 0) ad = true;
              if (ad === true && window.innerWidth < 850) setTimeout(pushAds, 2500);

              return (
                <>
                  <article key={course._id}>
                    <Preview course_id={course._id} course={course} title={course.title} description={course.description} length={course.posts.length} avatar={course.avatar} username={course.username} posts={course.posts} />
                  </article>
                  {
                    (ad === true && window.innerWidth < 850) &&
                    <>
                      <div id={"taboola-mobile-below-article-thumbnails-" + index} style={{ display: "block", width: '85vw', maxWidth: '500px', minHeight: '100px' }}></div>
                    </>
                  }
                </>
              );
            })
          }
        </>
      }

      {
        newCourse ? <CreateCourse close={() => { setNewCourse(false) }} /> :
          <a onClick={() => { setNewCourse(true) }} id='newCourseBtn'>
            <p>{t('Create_a_course')}</p>
            <i className='fas fa-plus'></i>
          </a>
      }
    </>
  );
}

export default Courses;