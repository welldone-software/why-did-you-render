import findObjectsDifferences from './findObjectsDifferences'

function getUpdateReason(prevProps, prevState, prevHook, nextProps, nextState, nextHook, ownerDataMap){
  const prevOwnerData = ownerDataMap.get(prevProps)
  const nextOwnerData = ownerDataMap.get(nextProps)

  return {
    propsDifferences: findObjectsDifferences(prevProps, nextProps),
    stateDifferences: findObjectsDifferences(prevState, nextState),
    hookDifferences: findObjectsDifferences(prevHook, nextHook, {shallow: false}),
    ownerDifferences: prevOwnerData != null && nextOwnerData != null ? {
      propsDifferences: findObjectsDifferences(prevOwnerData.props, nextOwnerData.props),
      stateDifferences: findObjectsDifferences(prevOwnerData.state, nextOwnerData.state),
      hookDifferences: prevOwnerData.hooks.map(({hookName, result}, i) => ({
        hookName,
        differences: findObjectsDifferences(result, nextOwnerData.hooks[i].result, {shallow: false})
      }))
    } : false
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
