import {diffTypes} from './consts'

const moreInfoUrl = 'http://bit.ly/wdyr02'
const moreInfoHooksUrl = 'http://bit.ly/wdyr3'

const diffTypesDescriptions = {
  [diffTypes.different]: 'different objects.',
  [diffTypes.deepEquals]: 'different objects that are equal by value.',
  [diffTypes.date]: 'different date objects with the same value.',
  [diffTypes.regex]: 'different regular expressions with the same value.',
  [diffTypes.reactElement]: 'different React elements (remember that the <jsx/> syntax always produces a *NEW* immutable React element so a component that receives <jsx/> as props always re-renders.).',
  [diffTypes.function]: 'different functions with the same name.'
}

let inHotReload = false

function shouldLog(reason, Component, options){
  if(inHotReload){
    return false
  }

  if(options.logOnDifferentValues){
    return true
  }

  if(Component.whyDidYouRender && Component.whyDidYouRender.logOnDifferentValues){
    return true
  }

  const hasDifferentValues = ((
    reason.propsDifferences &&
    reason.propsDifferences.some(diff => diff.diffType === diffTypes.different)
  ) || (
    reason.stateDifferences &&
    reason.stateDifferences.some(diff => diff.diffType === diffTypes.different)
  ) || (
    reason.hookDifferences &&
    reason.hookDifferences.some(diff => diff.diffType === diffTypes.different)
  ))

  return !hasDifferentValues
}

function logDifference({Component, displayName, hookName, prefixMessage, diffObjType, differences, values, options}){
  if(differences && differences.length > 0){
    options.consoleLog({[displayName]: Component}, `${prefixMessage} of ${diffObjType} changes:`)
    differences.forEach(({pathString, diffType, prevValue, nextValue}) => {
      options.consoleGroup(
        `%c${diffObjType === 'hook' ? `[hook ${hookName} result]` : `${diffObjType}.`}%c${pathString}%c`,
        `color:${options.diffNameColor};`, `color:${options.diffPathColor};`, 'color:default;'
      )
      options.consoleLog(
        `${diffTypesDescriptions[diffType]} (more info at ${hookName ? moreInfoHooksUrl : moreInfoUrl})`,
      )
      options.consoleLog({[`prev ${pathString}`]: prevValue}, '!==', {[`next ${pathString}`]: nextValue})
      options.consoleGroupEnd()
    })
  }
  else if(differences){
    options.consoleLog(
      {[displayName]: Component},
      `${prefixMessage} the ${diffObjType} object itself changed but its values are all equal.`,
      diffObjType === 'props' ?
        'This could have been avoided by making the component pure, or by preventing its father from re-rendering.' :
        'This usually means this component called setState when no changes in its state actually occurred.',
      `More info at ${moreInfoUrl}`
    )
    options.consoleLog(`prev ${diffObjType}:`, values.prev, ' !== ', values.next, `:next ${diffObjType}`)
  }
}

export default function defaultNotifier(updateInfo){
  const {Component, displayName, hookName, prevProps, prevState, prevHook, nextProps, nextState, nextHook, reason, options, ownerDataMap} = updateInfo

  if(!shouldLog(reason, Component, options)){
    return
  }

  options.consoleGroup(`%c${displayName}`, `color: ${options.titleColor};`)

  let prefixMessage = 'Re-rendered because'

  if(reason.propsDifferences){
    logDifference({
      Component,
      displayName,
      prefixMessage,
      diffObjType: 'props',
      differences: reason.propsDifferences,
      values: {prev: prevProps, next: nextProps},
      options
    })
    prefixMessage = 'And because'
  }

  if(reason.stateDifferences){
    logDifference({
      Component,
      displayName,
      prefixMessage,
      diffObjType: 'state',
      differences: reason.stateDifferences,
      values: {prev: prevState, next: nextState},
      options
    })
  }

  if(reason.hookDifferences){
    logDifference({
      Component,
      displayName,
      prefixMessage,
      diffObjType: 'hook',
      differences: reason.hookDifferences,
      values: {prev: prevHook, next: nextHook},
      hookName,
      options
    })
  }


  if(reason.propsDifferences && reason.ownerDifferences){
    const prevOwnerData = ownerDataMap.get(prevProps)
    const nextOwnerData = ownerDataMap.get(nextProps)

    options.consoleGroup(`Rendered by ${nextOwnerData.displayName}`)
    let prefixMessage = 'Re-rendered because'

    if(reason.ownerDifferences.propsDifferences){
      logDifference({
        Component: nextOwnerData.Component,
        displayName: nextOwnerData.displayName,
        prefixMessage,
        diffObjType: 'props',
        differences: reason.ownerDifferences.propsDifferences,
        values: {prev: prevOwnerData.props, next: nextOwnerData.props},
        options
      })
      prefixMessage = 'And because'
    }

    if(reason.ownerDifferences.stateDifferences){
      logDifference({
        Component: nextOwnerData.Component,
        displayName: nextOwnerData.displayName,
        prefixMessage,
        diffObjType: 'state',
        differences: reason.ownerDifferences.stateDifferences,
        values: {prev: prevOwnerData.state, next: nextOwnerData.state},
        options
      })
    }

    if(reason.ownerDifferences.hookDifferences){
      reason.ownerDifferences.hookDifferences.forEach(({hookName, differences}, i) =>
        logDifference({
          Component: nextOwnerData.Component,
          displayName: nextOwnerData.displayName,
          prefixMessage,
          diffObjType: 'hook',
          differences,
          values: {prev: prevOwnerData.hooks[i].result, next: nextOwnerData.hooks[i].result},
          hookName,
          options
        })
      )
    }
    options.consoleGroupEnd()
  }

  if(!reason.propsDifferences && !reason.stateDifferences && !reason.hookDifferences){
    options.consoleLog(
      {[displayName]: Component},
      'Re-rendered although props and state objects are the same.',
      'This usually means there was a call to this.forceUpdate() inside the component.',
      `more info at ${moreInfoUrl}`
    )
  }

  options.consoleGroupEnd()
}

export function createDefaultNotifier(hotReloadBufferMs){
  if(hotReloadBufferMs){
    if(typeof(module) !== 'undefined' && module.hot && module.hot.addStatusHandler){
      module.hot.addStatusHandler(status => {
        if(status === 'idle'){
          inHotReload = true
          setTimeout(() => {
            inHotReload = false
          }, hotReloadBufferMs)
        }
      })
    }
  }

  return defaultNotifier
}
