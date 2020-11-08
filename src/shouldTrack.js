import wdyrStore from './wdyrStore'

import {isMemoComponent} from './utils'
import getDisplayName from './getDisplayName'

function shouldInclude(displayName){
  return (
    wdyrStore.options.include &&
    wdyrStore.options.include.length > 0 &&
    wdyrStore.options.include.some(regex => regex.test(displayName))
  )
}

function shouldExclude(displayName){
  return (
    wdyrStore.options.exclude &&
    wdyrStore.options.exclude.length > 0 &&
    wdyrStore.options.exclude.some(regex => regex.test(displayName))
  )
}

export default function shouldTrack(Component, {isHookChange}){
  const displayName = getDisplayName(Component)

  if(shouldExclude(displayName)){
    return false
  }

  if(Component.whyDidYouRender === false){
    return false
  }

  if(isHookChange && (
    Component.whyDidYouRender && Component.whyDidYouRender.trackHooks === false
  )){
    return false
  }

  return !!(
    Component.whyDidYouRender || (
      wdyrStore.options.trackAllPureComponents && (
        (Component && Component.prototype instanceof wdyrStore.React.PureComponent) ||
        isMemoComponent(Component)
      )
    ) ||
    shouldInclude(displayName)
  )
}
