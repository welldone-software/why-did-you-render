import findObjectsDifferences from './findObjectsDifferences'

function getUpdateReason(prevProps, prevState, nextProps, nextState){
  return {
    propsDifferences: findObjectsDifferences(prevProps, nextProps, 'props'),
    stateDifferences: findObjectsDifferences(prevState, nextState, 'state')
  }
}

export default function getUpdateInfo({Component, displayName, prevProps, prevState, nextProps, nextState, options}){
  return {
    Component,
    displayName,
    prevProps,
    prevState,
    nextProps,
    nextState,
    options,
    reason: getUpdateReason(prevProps, prevState, nextProps, nextState)
  }
}
