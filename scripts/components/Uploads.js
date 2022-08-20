import React, { useState, useEffect } from 'https://cdn.skypack.dev/react';
const urlApi = 'https://piwebinars-server.onrender.com';
import { renderUploads } from '../app/webinars.js';
import {
  RecoilRoot,
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
} from 'https://cdn.skypack.dev/recoil';
import { storedUploads } from '../atoms/posts.js';
import Loader from './Loader.js';

function Post(props) {
  return (
    <>
      <div className="post">
        <iframe className="postThumbnail" src={props.url} frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>
        <h3 className="postTitle">{props.title}</h3>
      </div>
    </>
  );
}

function Uploads() { 
  const [webinars, setPosts] = useRecoilState(storedUploads);
  const [loading, setLoading] = useState(false);
  
  useEffect(async () => {
    if (webinars.length == 0) {
      setLoading(true);
      const list = await renderUploads();
      setPosts(list.data.post);
      setLoading(false);
    }
  }, []);
  
  return (
    <>
      {webinars.map(post => { 
        return(
          <article>
            <Post title={post.title} url={`https://player.vimeo.com/video/${post.video_id}`} />
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