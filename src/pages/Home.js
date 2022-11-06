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
  useRecoilValue,
} from 'recoil';
import { appSelectionState } from '../atoms/states.js';
import { renderMore, getCourses } from '../app/webinars.js';

function Content(props) {
  const selectionState = useRecoilValue(appSelectionState);
  const posts = props.posts;
  return (
    <RecoilRoot>
      {selectionState == 'explore' && <Posts postId={props.postId} userId={props.userId} posts={posts} />}
      {selectionState == 'courses' && <Courses courses={props.courses} />}
      {selectionState == 'collections' && <Collections />}
      {selectionState == 'purchases' && <Purchases />}
      {selectionState == 'uploads' && <Uploads />}
    </RecoilRoot>
  );
}

function App(props) {
  const [posts, setPosts] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [matches, setMatches] = useState(
    window.matchMedia("(max-width: 850px)").matches
  )

  useEffect(() => {
    window
      .matchMedia("(max-width: 850px)")
      .addEventListener('change', e => setMatches(e.matches));
    sessionStorage.category = '';
    window.addEventListener('storage', () => {
      console.log('storage changed');
      if (localStorage.category !== '') applyFilter();
    });
  }, []);

  const handleScroll = async (e) => {
    const bottom = e.target.scrollHeight - (e.target.scrollTop + 75) <= e.target.clientHeight;
    if (bottom && loading == false) {
      setLoading(true);
      if (sessionStorage.home = 'posts' || !sessionStorage.home) {
        let category = localStorage.category;
        if (category === '' || category === undefined) category = 'all';
        const response = await renderMore(category);
        const morePosts = response.data.list;
        let list = [];
        for (const post of morePosts) {
          list.push(post);
        }
        setPosts(list);
      } else if (sessionStorage.home = 'courses') {
        const response = await getCourses(2);
        const moreCourses = response.data.list;
        let list = [];
        for (const course of moreCourses) {
          list.push(course);
        }
        setCourses(list);
      }
      setLoading(false);
    }
  }

  const applyFilter = async () => {
    setLoading(true);
    const category = localStorage.category;
    const response = await renderMore(category);
    const morePosts = response.data.list;
    let list = [];
    for (const post of morePosts) {
      list.push(post);
    }
    if (localStorage.category === category) setPosts(list);
    setLoading(false);
  }

  return (
    <>
      {matches && (<BarMobile />)}
      {!matches && (<Bar />)}
      <span id="app" onScroll={handleScroll} style={{ cursor: loading && "wait" }}>
        <Selection />
        <Content postId={props.postId} userId={props.userId} posts={posts} courses={courses} />
      </span>
    </>
  );
}

export default App;