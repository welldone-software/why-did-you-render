import findObjectsDifferences from './findObjectsDifferences'

function getUpdateReason(prevProps, prevState, prevHook, nextProps, nextState, nextHook){
  return {
    propsDifferences: findObjectsDifferences(prevProps, nextProps),
    stateDifferences: findObjectsDifferences(prevState, nextState),
    hookDifferences: findObjectsDifferences(prevHook, nextHook)
  }
}

export default function getUpdateInfo({Component, displayName, hookName, prevProps, prevState, prevHook, nextProps, nextState, nextHook, options}){
  return {
    Component,
    displayName,
    hookName,
    prevProps,
    prevState,
    prevHook,
    nextProps,
    nextState,
    nextHook,
    options,
    reason: getUpdateReason(prevProps, prevState, prevHook, nextProps, nextState, nextHook)
  }
}
