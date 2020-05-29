import findObjectsDifferences from './findObjectsDifferences'

function getOwnerDifferences({prevOwnerData, nextOwnerData}){
  if(!prevOwnerData || !nextOwnerData){
    return false
  }

  const hookDifferences = prevOwnerData.hooks.map(({hookName, result}, i) => ({
    hookName,
    differences: findObjectsDifferences(result, nextOwnerData.hooks[i].result, {shallow: false})
  }))

  return {
    propsDifferences: findObjectsDifferences(prevOwnerData.props, nextOwnerData.props),
    stateDifferences: findObjectsDifferences(prevOwnerData.state, nextOwnerData.state),
    hookDifferences: hookDifferences.length > 0 ? hookDifferences : false
  }
}

function getUpdateReason(prevProps, prevState, prevHook, nextProps, nextState, nextHook, ownerDataMap){
  const prevOwnerData = ownerDataMap.get(prevProps)
  const nextOwnerData = ownerDataMap.get(nextProps)

  return {
    propsDifferences: findObjectsDifferences(prevProps, nextProps),
    stateDifferences: findObjectsDifferences(prevState, nextState),
    hookDifferences: findObjectsDifferences(prevHook, nextHook, {shallow: false}),
    ownerDifferences: getOwnerDifferences({prevOwnerData, nextOwnerData})
  }
}

export default function getUpdateInfo({Component, displayName, hookName, prevProps, prevState, prevHook, nextProps, nextState, nextHook, options, ownerDataMap}){
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
    ownerDataMap,
    reason: getUpdateReason(prevProps, prevState, prevHook, nextProps, nextState, nextHook, ownerDataMap)
  }
}
