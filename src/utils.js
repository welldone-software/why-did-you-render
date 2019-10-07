// copied from https://github.com/facebook/react/blob/master/packages/react-reconciler/src/ReactTypeOfMode.js
import {REACT_FORWARD_REF_TYPE, REACT_MEMO_TYPE} from './consts'

const StrictMode = 0b0001

// based on "findStrictRoot" from https://github.com/facebook/react/blob/master/packages/react-reconciler/src/ReactStrictModeWarnings.js
// notice: this is only used for class components. functional components doesn't re-rendered inside strict mode
export function checkIfInsideAStrictModeTree(reactComponentInstance){
  let reactInternalFiber = reactComponentInstance && reactComponentInstance._reactInternalFiber
  while(reactInternalFiber){
    if(reactInternalFiber.mode & StrictMode){
      return true
    }
    reactInternalFiber = reactInternalFiber.return
  }
  return false
}

export function isReactClassComponent(Component){
  return Component.prototype && !!Component.prototype.isReactComponent
}

export function isMemoComponent(Component){
  return Component.$$typeof === REACT_MEMO_TYPE
}

export function isForwardRefComponent(Component){
  return Component.$$typeof === REACT_FORWARD_REF_TYPE
}
