import React, { useState } from 'https://cdn.skypack.dev/react';
import Selection from '../components/Selection.js';
import Posts from '../components/Posts.js';
import Purchases from '../components/Purchases.js';
import Uploads from '../components/Uploads.js';
import Collections from '../components/Collections.js';
import Courses from '../components/Courses.js';
import Bar from '../components/Bar.js';
import {
  RecoilRoot,
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
} from 'https://cdn.skypack.dev/recoil';
import {appSelectionState, postsScrollState} from '../atoms/states.js';
import { storedPosts } from '../atoms/posts.js';
import { renderWebinars, renderMore } from '../app/webinars.js';

function Content(props) {
  const selectionState = useRecoilValue(appSelectionState);
  const posts = props.posts;
  return (
    <RecoilRoot>
      { selectionState == 'explore' && <Posts posts={posts} /> }
      { selectionState == 'purchases' && <Purchases /> }
      { selectionState == 'uploads' && <Uploads /> }
      { selectionState == 'courses' && <Courses /> }
      { selectionState == 'collections' && <Collections /> }
    </RecoilRoot>
  );
}

function App() { 
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const handleScroll = async (e) => {
    const bottom = e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
    if (bottom) {
      setLoading(true);
      const response = await renderMore();
      const morePosts = response.data.list;
      let list = [];
      for (const post of morePosts) {
        list.push(post);
      }
      setPosts(list);
      setLoading(false);
    }
  }
    
  return (
    <>
      <Bar />
      <span id="app" onScroll={handleScroll} style={{ cursor: loading && "wait" }}>
        <Selection />
        <Content posts={posts} />
      </span>
    </>
  );
}

export default App;