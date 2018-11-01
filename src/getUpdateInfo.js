import getDisplayName from './getDisplayName'
import findObjectsDifferences from './findObjectsDifferences'

function getUpdateReason(prevProps, prevState, nextProps, nextState){
  return {
    propsDifferences: findObjectsDifferences(prevProps, nextProps, 'props'),
    stateDifferences: findObjectsDifferences(prevState, nextState, 'state')
  }
}

export default function getUpdateInfo({Component, prevProps, prevState, nextProps, nextState, options}){
  const displayName = getDisplayName(Component)
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
