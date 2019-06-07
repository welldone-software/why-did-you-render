// copied from https://github.com/facebook/react/blob/master/packages/react-reconciler/src/ReactTypeOfMode.js
const StrictMode = 0b010

// based on "findStrictRoot" from https://github.com/facebook/react/blob/master/packages/react-reconciler/src/ReactStrictModeWarnings.js
// notice: this is only used for class components. functional components doesn't re-rendered inside strict mode
export function checkIfInsideAStrictModeTree(reactComponentInstance){
  let reactInternalFiber = reactComponentInstance._reactInternalFiber
  while(reactInternalFiber !== null){
    if(reactInternalFiber.mode & StrictMode){
      return true
    }
    reactInternalFiber = reactInternalFiber.return
  }
  return false
}
