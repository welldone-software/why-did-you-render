import React from 'react';
import ReactDom from 'react-dom/client';

import whyDidYouRender from '@welldone-software/why-did-you-render';

import Menu from './Menu';

import bigList from './bigList';
import propsChanges from './propsChanges';
import stateChanges from './stateChanges';
import childOfPureComponent from './childOfPureComponent';
import bothChanges from './bothChanges';
import noChanges from './noChanges';
import specialChanges from './specialChanges';
import ssr from './ssr';
import hotReload from './hotReload';
import createFactory from './createFactory';
import cloneElement from './cloneElement';
import useState from './hooks/useState';
import useContext from './hooks/useContext';
import useMemoAndCallbackChild from './hooks/useMemoAndCallbackChild';
import useReducer from './hooks/useReducer';
import reactReduxHOC from './reactReduxHOC';
import strict from './strict';
import reactRedux from './reactRedux';
import styledComponents from './styledComponents';
import logOwnerReasons from './logOwnerReasons';

const demosList = {
  bigList,
  propsChanges,
  stateChanges,
  childOfPureComponent,
  bothChanges,
  noChanges,
  specialChanges,
  ssr,
  hotReload,
  createFactory,
  cloneElement,
  useState,
  useContext,
  useMemoAndCallbackChild,
  useReducer,
  strict,
  reactRedux,
  reactReduxHOC,
  styledComponents,
  logOwnerReasons,
};

const defaultDemoName = 'bigList';

const domElement = document.getElementById('demo');
let reactDomRoot;

function changeDemo(demoFn, {shouldCreateRoot = true} = {}) {
  console.clear && console.clear(); // eslint-disable-line no-console
  React.__REVERT_WHY_DID_YOU_RENDER__ && React.__REVERT_WHY_DID_YOU_RENDER__();
  reactDomRoot?.unmount();
  if (shouldCreateRoot) {
    reactDomRoot = ReactDom.createRoot(domElement);
  }
  setTimeout(() => {
    const reactDomRootPromise = demoFn({whyDidYouRender, domElement, reactDomRoot});
    if (reactDomRootPromise) {
      reactDomRootPromise.then(r => reactDomRoot = r);
    }
  }, 1);
}

const demoFromHash = demosList[window.location.hash.substr(1)];
const initialDemo = demoFromHash || demosList[defaultDemoName];
if (!demoFromHash) {
  window.location.hash = defaultDemoName;
}

changeDemo(initialDemo.fn, initialDemo.settings);

const DemoLink = ({name, description, fn, settings}) => (
  <li><a href={`#${name}`} onClick={() => changeDemo(fn, settings)}>{description}</a></li>
);

const App = () => (
  <Menu>
    {
      Object
        .entries(demosList)
        .map(([demoName, demoData]) => <DemoLink key={demoName} name={demoName} {...demoData}/>)
    }
  </Menu>
);

export default App;


