import React, { useState, useEffect } from 'react';
import Selection from '../components/Selection.js';
import Posts from '../components/Posts.js';
import Purchases from '../components/Purchases.js';
import Uploads from '../components/Uploads.js';
import Collections from '../components/Collections.js';
import Courses from '../components/Courses.js';
import Bar from '../components/Bar.js';
import BarMobile from '../components/Bar_Mobile.js';
import {
  RecoilRoot,
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
} from 'recoil';
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
  const [matches, setMatches] = useState(
    window.matchMedia("(max-width: 850px)").matches
  )

  useEffect(() => {
    window
    .matchMedia("(max-width: 850px)")
    .addEventListener('change', e => setMatches( e.matches ));
  }, []);
  
  const handleScroll = async (e) => {
    const bottom = e.target.scrollHeight - (e.target.scrollTop + 75) <= e.target.clientHeight;
    if (bottom && loading == false) {
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
      {matches && (<BarMobile />)}
      {!matches && (<Bar />)}
      <span id="app" onScroll={handleScroll} style={{ cursor: loading && "wait" }}>
        <Selection />
        <Content posts={posts} />
      </span>
    </>
  );
} 

export default App;