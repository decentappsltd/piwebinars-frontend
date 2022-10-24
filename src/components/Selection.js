import React, { useState } from 'react';
import {
  useRecoilState,
} from 'recoil';
import { appSelectionState } from '../atoms/states.js';

function Selection() {
  const [selectionState, setSelectionState] = useRecoilState(appSelectionState);
  const [Active, setActive] = useState({
    stateA: 'selectionTabActive',
    stateB: 'selectionTabInactive',
    stateC: 'selectionTabInactive',
    stateD: 'selectionTabInactive',
    stateE: 'selectionTabInactive',
  });
  
  const updateStateA = () => {
    setActive({
      stateA: 'selectionTabActive',
      stateB: 'selectionTabInactive',
      stateC: 'selectionTabInactive',
      stateD: 'selectionTabInactive',
      stateE: 'selectionTabInactive',
    });
    sessionStorage.setItem('home', 'posts');
    setSelectionState("explore");
  };
  
  const updateStateB = () => {
    setActive({
      stateA: 'selectionTabInactive',
      stateB: 'selectionTabActive',
      stateC: 'selectionTabInactive',
      stateD: 'selectionTabInactive',
      stateE: 'selectionTabInactive',
    });
    sessionStorage.setItem('home', 'courses');
    setSelectionState("courses");
  };
  
  const updateStateC = () => {
    setActive({
      stateA: 'selectionTabInactive',
      stateB: 'selectionTabInactive',
      stateC: 'selectionTabActive',
      stateD: 'selectionTabInactive',
      stateE: 'selectionTabInactive',
    });
    sessionStorage.setItem('home', 'collections');
    setSelectionState("collections");
  };
  
  const updateStateD = () => {
    if (!sessionStorage.userSession) window.location.href = '/login';
    setActive({
      stateA: 'selectionTabInactive',
      stateB: 'selectionTabInactive',
      stateC: 'selectionTabInactive',
      stateD: 'selectionTabActive',
      stateE: 'selectionTabInactive',
    });
    sessionStorage.setItem('home', 'purchases');
    setSelectionState("purchases");
  };
  
  const updateStateE = () => {
    if (!sessionStorage.userSession) window.location.href = '/login';
    setActive({
      stateA: 'selectionTabInactive',
      stateB: 'selectionTabInactive',
      stateC: 'selectionTabInactive',
      stateD: 'selectionTabInactive',
      stateE: 'selectionTabActive',
    });
    sessionStorage.setItem('home', 'uploads');
    setSelectionState("uploads");
  };
  
  return (
    <>
      <div id="selectionTabs">
        <a className={Active.stateA} onClick={updateStateA}>Explore</a>
        <a className={Active.stateB} onClick={updateStateB}>Courses</a>
        <a className={Active.stateC} onClick={updateStateC}>Collections</a>
        <a className={Active.stateD} onClick={updateStateD}>Purchases</a>
        <a className={Active.stateE} onClick={updateStateE}>Uploads</a>
      </div>
    </>
  );
}

export default Selection;