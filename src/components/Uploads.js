import React, { useState, useEffect } from 'react';
import { renderUploads, editWebinar, deleteWebinar } from '../app/webinars.js';
import {
  useRecoilState,
} from 'recoil';
import { useTranslation } from "react-i18next";
import { storedUploads } from '../atoms/posts.js';
import Loader from './Loader.js';
import Vimeo from '@vimeo/player';
import { Link } from 'react-router-dom';
import { Preview } from './Courses.js';

function Modal(props) {
  useEffect(() => {
    function close(e) {
      if (!document.querySelector("#_cinema").contains(e.target)) {
        props.close();
      }
    }
    document.addEventListener('click', close);
    return () => {
      document.removeEventListener('click', close);
    }
  }, []);

  useEffect(() => {
    var options = {
      url: props.post.url,
      controls: true,
      width: 500,
      height: 500,
    };
    new Vimeo.Player('uploaded_video', options);
  }, []);

  return (
    <>
      <div id="_cinema">
        <div id="uploaded_video"></div>
        <h3 className="postTitle">{props.title}</h3>
        <div className="statDiv">
          <Link to={`/user/${props.user_id}`} className="statName">{props.name}</Link>
          <p2 className="statCategory">{props.category}</p2>
          <p2 className="statLikes">{props.likes} likes</p2>
        </div>
      </div>
    </>
  )
}

function Edit(props) {
  const { t } = useTranslation();
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [desc, setDesc] = useState('');
  const [progress, setProgress] = useState('Update');

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

  const handleSubmit = async () => {
    setProgress('Updating...');
    await editWebinar(props.post.user, props.post._id, title, price, desc);
    setProgress('Done!');
  }

  return (
    <>
      <div id="editWebinar" style={{ padding: "10px" }}>
        <form>
          <h2>{t('Edit')}</h2>
          <a className='fas fa-close' onClick={props.close}></a>
          <i>{t('Leave_fields_blank_to_remain_unchanged')}</i><br /><br />
          <input className="input" placeholder={t('Update_title')} onChange={(e) => setTitle(e.target.value)} /><br /><br />
          <textArea placeholder={t('Update_description')} onChange={(e) => setDesc(e.target.value)} /><br /><br />
          <input className="input" placeholder={t('Update_price')} onChange={(e) => setPrice(e.target.value)} /><br /><br />
          <a id="update" onClick={handleSubmit}>{progress}</a><br />
        </form>
      </div>
    </>
  )
}

function Post(props) {
  const [modalShown, toggleModal] = useState(false);
  const [editShown, toggleEdit] = useState(false);
  const [course, setCourse] = useState(false);

  const open = () => {
    toggleModal(!modalShown);
  };

  const edit = () => {
    toggleEdit(!editShown);
  };

  const deleteVid = async () => {
    const response = await deleteWebinar(props.post.user, props.post._id);
    if (response == "deleted") props.remove(props.post.title);
  }

  const handleAddToCourse = (e) => {
    props.course(props.post);
    if (!course) {
      e.target.style.background = '#fbb44a';
      e.target.classList.remove('fa-plus');
      e.target.classList.add('fa-check');
    } else {
      e.target.style.background = '#fbecab';
      e.target.classList.remove('fa-check');
      e.target.classList.add('fa-plus');
    }
    setCourse(!course);
  }

  return (
    <>
      <div className="post">
        <iframe className="postThumbnail" src={props.post.videoURL} frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>
        <h3 className="postTitle">{props.title}</h3><br />
        {props.course ? <a className='fas fa-plus addToCourse' onClick={(e) => { handleAddToCourse(e) }}></a> :
          <>
            <div style={{ display: "flex", justifyContent: "space-around", position: "absolute", bottom: "-10px", left: "-10px", width: "75px", padding: "10px", borderRadius: "100px", background: "#fbb44a" }}>
              <a onClick={edit} className="fas fa-edit" style={{ cursor: "pointer" }}></a>
              <a id="delete" onClick={deleteVid} className="fas fa-trash" style={{ cursor: "pointer" }}></a>
            </div>
          </>
        }
      </div>
      {modalShown ?
        <Modal close={() => {
          toggleModal(!modalShown);
        }} post={props} />
        : null
      }
      {editShown ?
        <Edit close={() => {
          toggleEdit(!editShown);
        }} post={props.post} />
        : null
      }
    </>
  );
}

function Uploads(props) {
  const { t } = useTranslation();
  const [webinars, setPosts] = useRecoilState(storedUploads);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [display, setDisplay] = useState('posts');
  const [Active, setActive] = useState({
    stateA: 'selectionTabActive',
    stateB: 'selectionTabInactive'
  });

  const updateStateA = () => {
    setActive({
      stateA: 'selectionTabActive',
      stateB: 'selectionTabInactive'
    });
    setDisplay("posts");
  };

  const updateStateB = () => {
    setActive({
      stateA: 'selectionTabInactive',
      stateB: 'selectionTabActive'
    });
    setDisplay("courses");
  };

  const getUploads = async () => {
    if (webinars.length == 0) {
      setLoading(true);
      const list = await renderUploads();
      setPosts(list.data.post);
      setCourses(list.data.course);
      setLoading(false);
    }
  }

  useEffect(() => {
    getUploads().catch((err) => {
      setLoading(false);
      console.log(err);
    });
  }, []);

  useEffect(() => {
    function pushAds() {
      window._taboola = window._taboola || [];
      window._taboola.push({
        mode: 'thumbnails-Stream-mobile',
        container: `taboola-mobile-below-article-thumbnails`,
        placement: 'Homepage Recommendation Reel',
        target_type: 'mix'
      });
      window._taboola.push({ flush: true });
    }
    if (window.innerWidth < 850 && webinars.length > 0 && display == 'posts') setTimeout(pushAds, 2500);
  }, []);

  const remove = (title) => {
    let list = [];
    for (const post of webinars) {
      if (post.title != title) list.push(post);
    }
    setPosts(list);
  }

  return (
    <div>
      {(loading == false && window.innerWidth < 850 && webinars.length > 0 && display == 'posts') &&
        <div id={"taboola-mobile-below-article-thumbnails"} style={{ display: "block", width: '85vw', maxWidth: '500px', minHeight: '100px' }}></div>
      }

      {!props.course && <>
        <div id='displayToggle'>
          <span className={Active.stateA} onClick={updateStateA}>{t('Posts')}</span>
          <span className={Active.stateB} onClick={updateStateB}>{t('Courses')}</span>
        </div>
      </>}

      {display == 'courses' &&
        <>
          {
            courses.map(course => {
              return (
                <article>
                  <Preview course_id={course._id} course={course} title={course.title} description={course.description} length={course.posts.length} avatar={course.avatar} username={course.username} posts={course.posts} />
                </article>
              );
            })
          }
          <br /><br /><br /><br /><br /><br />
        </>
      }

      {display == 'posts' &&
        <>
          {
            webinars.map(post => {
              return (
                <article key={post._id}>
                  <Post title={post.title} remove={remove} url={`https://player.vimeo.com/video/${post.video_id}`} post={post} course={props.course} />
                </article>
              );
            })
          }
          <br /><br /><br /><br /><br /><br />
        </>
      }

      {loading ? <Loader /> : null}
      {(webinars.length == 0 && !loading && display == 'posts') && <h2 style={{ position: 'fixed', top: 'calc(50vh - 10px)', width: '100%', textAlign: 'center' }}>{t('Your_uploads_will_appear_here')}</h2>}
      {(courses.length == 0 && !loading && display == 'courses') && <h2 style={{ position: 'fixed', top: 'calc(50vh - 10px)', width: '100%', textAlign: 'center' }}>{t('Your_courses_will_appear_here')}</h2>}
    </div>
  );
}

export default Uploads;