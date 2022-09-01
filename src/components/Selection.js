import React, { useState } from 'react';
import {
  RecoilRoot,
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
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
    setSelectionState("purchases");
  };
  
  const updateStateC = () => {
    setActive({
      stateA: 'selectionTabInactive',
      stateB: 'selectionTabInactive',
      stateC: 'selectionTabActive',
      stateD: 'selectionTabInactive',
      stateE: 'selectionTabInactive',
    });
    setSelectionState("uploads");
  };
  
  const updateStateD = () => {
    setActive({
      stateA: 'selectionTabInactive',
      stateB: 'selectionTabInactive',
      stateC: 'selectionTabInactive',
      stateD: 'selectionTabActive',
      stateE: 'selectionTabInactive',
    });
    setSelectionState("courses");
  };
  
  const updateStateE = () => {
    setActive({
      stateA: 'selectionTabInactive',
      stateB: 'selectionTabInactive',
      stateC: 'selectionTabInactive',
      stateD: 'selectionTabInactive',
      stateE: 'selectionTabActive',
    });
    setSelectionState("collections");
  };
  
  return (
    <>
      <div id="selectionTabs">
        <a className={Active.stateA} onClick={updateStateA}>Explore</a>
        <a className={Active.stateB} onClick={updateStateB}>Purchases</a>
        <a className={Active.stateC} onClick={updateStateC}>Uploads</a>
        <a className={Active.stateD} onClick={updateStateD}>Courses</a>
        <a className={Active.stateE} onClick={updateStateE}>Collections</a>
      </div>
    </>
  );
}

export default Selection;