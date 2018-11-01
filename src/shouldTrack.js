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

export default function shouldTrack(Component, displayName, options){
  if(shouldExclude(displayName, options)){
    return false
  }

  return !!(
    Component.whyDidYouRender ||
    shouldInclude(displayName, options)
  )
}
