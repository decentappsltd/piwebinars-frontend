import React, { useState, useEffect } from 'react';
import { renderUploads, editWebinar, deleteWebinar } from '../app/webinars.js';
import {
  RecoilRoot,
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
} from 'recoil';
import { storedUploads } from '../atoms/posts.js';
import Loader from './Loader.js';
import Vimeo from '@vimeo/player';
import { Link } from 'react-router-dom';

const urlApi = 'https://piwebinars-server.onrender.com';

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
    var videoPlayer = new Vimeo.Player('uploaded_video', options);
  }, []);
  
  return (
    <>
      <div id="_cinema">
        <div id="uploaded_video"></div>
        <h3 className="postTitle">{props.title}</h3>
        <div className="statDiv">
          <Link to={`/user/${props.user_id}`} className="statName">{ props.name }</Link>
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
  
  return (
    <>
      <div className="post">
        <iframe className="postThumbnail" src={props.url} frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>
        <h3 className="postTitle">{props.title}</h3><br />
        <div style={{ display: "flex", justifyContent: "space-around" }}>
          <a onClick={edit} className="fas fa-edit"></a>
          <a id="delete" onClick={deleteVid} className="fas fa-trash"></a>
        </div>
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

function Uploads() {
  const [webinars, setPosts] = useRecoilState(storedUploads);
  const [loading, setLoading] = useState(false);

  const getUploads = async () => {
    if (webinars.length == 0) {
      setLoading(true);
      const list = await renderUploads();
      setPosts(list.data.post);
      setLoading(false);
    }
  }
  
  useEffect(() => {
    getUploads();
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
      {webinars.map(post => { 
        return(
          <article key={post._id}>
            <Post title={post.title} remove={remove} url={`https://player.vimeo.com/video/${post.video_id}`} post={post} />
          </article>
          );
        })
      }
      {loading ? <Loader /> : null}
      {(webinars.length == 0 && !loading) && <h2>Your uploads will appear here...</h2>}
    </>
  );
}

export default Uploads;