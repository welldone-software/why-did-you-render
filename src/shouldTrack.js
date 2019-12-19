import {isMemoComponent} from './utils'

function shouldInclude(displayName, options){
  return (
    options.include &&
    options.include.length > 0 &&
    options.include.some(regex => regex.test(displayName))
  )
}

function shouldExclude(displayName, options){
  return (
    options.exclude &&
    options.exclude.length > 0 &&
    options.exclude.some(regex => regex.test(displayName))
  )
}

export default function shouldTrack({Component, displayName, options, React, isHookChange}){
  if(shouldExclude(displayName, options)){
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
      options.trackAllPureComponents && (
        (Component && Component.prototype instanceof React.PureComponent) ||
        isMemoComponent(Component)
      )
    ) ||
    shouldInclude(displayName, options)
  )
}
