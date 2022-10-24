import React, { useState, useEffect } from 'react';
import { renderUploads, editWebinar, deleteWebinar } from '../app/webinars.js';
import {
  useRecoilState,
} from 'recoil';
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
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [desc, setDesc] = useState('');

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
    await editWebinar(props.post.user, props.post._id, title, price, desc);
  }

  return (
    <>
      <div id="cinema" style={{ padding: "10px" }}>
        <form>
          <i>Leave fields blank to remain unchanged</i><br /><br />
          <input className="input" placeholder="Update title" onChange={(e) => setTitle(e.target.value)} /><br /><br />
          <textArea placeholder="Update description" onChange={(e) => setDesc(e.target.value)} /><br /><br />
          <input className="input" placeholder="Update price" onChange={(e) => setPrice(e.target.value)} /><br /><br />
          <a id="update" onClick={handleSubmit}>Update</a><br />
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
        <iframe className="postThumbnail" src={props.url} frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>
        <h3 className="postTitle">{props.title}</h3><br />
        {props.course ? <a className='fas fa-plus addToCourse' onClick={(e) => { handleAddToCourse(e) }}></a> :
          <>
            <div style={{ display: "flex", justifyContent: "space-around" }}>
              <a onClick={edit} className="fas fa-edit"></a>
              <a id="delete" onClick={deleteVid} className="fas fa-trash"></a>
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
      let adsbygoogle;
      (adsbygoogle = window.adsbygoogle || []).push({});
    }
    setTimeout(pushAds, 5000);
  }, []);

  const remove = (title) => {
    let list = [];
    for (const post of webinars) {
      if (post.title != title) list.push(post);
    }
    setPosts(list);
  }

  return (
    <>
      {loading ? null :
        <>
          <ins className="adsbygoogle"
            style={{ display: "block", minWidth: '251px', minHeight: '50px' }}
            data-ad-format="fluid"
            data-ad-layout-key="-6f+d5-2h+50+bf"
            data-ad-client="ca-pub-7095325310319034"
            data-ad-slot="1627309222"></ins>
        </>
      }

      {!props.course && <>
        <div id='displayToggle'>
          <span className={Active.stateA} onClick={updateStateA}>Posts</span>
          <span className={Active.stateB} onClick={updateStateB}>Courses</span>
        </div>
      </>}

      {display == 'courses' && <>{courses.map(course => {
        return (
          <article>
            <Preview course_id={course._id} course={course} title={course.title} description={course.description} length={course.posts.length} avatar={course.avatar} username={course.username} posts={course.posts} />
          </article>
        );
      })
      }</>}

      {display == 'posts' &&
        <> {
          webinars.map(post => {
            return (
              <article key={post._id}>
                <Post title={post.title} remove={remove} url={`https://player.vimeo.com/video/${post.video_id}`} post={post} course={props.course} />
              </article>
            );
          })
        }</>
      }

      {loading ? <Loader /> : null}
      {(webinars.length == 0 && !loading && display == 'posts') && <h2 style={{ position: 'fixed', top: 'calc(50vh - 10px)', width: '100%', textAlign: 'center' }}>Your uploads will appear here...</h2>}
      {(courses.length == 0 && !loading && display == 'courses') && <h2 style={{ position: 'fixed', top: 'calc(50vh - 10px)', width: '100%', textAlign: 'center' }}>Your courses will appear here...</h2>}
    </>
  );
}

export default Uploads;