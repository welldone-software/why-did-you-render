import {diffTypes} from './consts'

const moreInfoUrl = 'http://bit.ly/wdyr02'

const diffTypesDescriptions = {
  [diffTypes.different]: 'different objects.',
  [diffTypes.deepEquals]: 'different objects that are equal by value.',
  [diffTypes.date]: 'different date objects with the same value.',
  [diffTypes.regex]: 'different regular expressions with the same value.',
  [diffTypes.reactElement]: 'different React elements with the same displayName.',
  [diffTypes.function]: 'different functions with the same name.'
}

function shouldLog(reason, Component, options){
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
  ))

  return !hasDifferentValues
}

function logDifference(Component, displayName, prefixMessage, propsOrSate, differences, values, options){
  if(differences && differences.length > 0){
    options.consoleLog({[displayName]: Component}, `${prefixMessage} of ${propsOrSate} changes:`)
    differences.forEach(({pathString, diffType, prevValue, nextValue}) => {
      options.consoleGroup(`%c${propsOrSate}.%c${pathString}%c`, 'color:blue;', 'color:red;', 'color:black;')
      options.consoleLog(`${diffTypesDescriptions[diffType]} (more info at ${moreInfoUrl})`)
      options.consoleLog({[`prev ${pathString}`]: prevValue}, '!==', {[`next ${pathString}`]: nextValue})
      options.consoleGroupEnd()
    })
  }
  else if(differences){
    options.consoleLog(
      {[displayName]: Component},
      `${prefixMessage} the ${propsOrSate} object itself changed but it's values are all equal.`,
      propsOrSate === 'props' ?
        'This could of been avoided by making the component pure, or by preventing it\'s father from re-rendering.' :
        'This usually means this component called setState when no changes in it\'s state actually occurred.',
      `more info at ${moreInfoUrl}`
    )
    options.consoleLog(`prev ${propsOrSate}:`, values.prev, ' !== ', values.next, `:next ${propsOrSate}`)
  }
}

export default function defaultNotifier(updateInfo){
  const{Component, displayName, prevProps, prevState, nextProps, nextState, reason, options} = updateInfo

  if(!shouldLog(reason, Component, options)){
    return
  }

  options.consoleGroup(`%c${displayName}`, 'color: #058;')

  let prefixMessage = 'Re-rendered because'

  if(reason.propsDifferences){
    logDifference(Component, displayName, prefixMessage, 'props', reason.propsDifferences, {prev: prevProps, next: nextProps}, options)
    prefixMessage = 'And because'
  }

  if(reason.stateDifferences){
    logDifference(Component, displayName, prefixMessage, 'state', reason.stateDifferences, {prev: prevState, next: nextState}, options)
  }

  if(!reason.propsDifferences && !reason.stateDifferences){
    options.consoleLog(
      {[displayName]: Component},
      'Re-rendered although props and state objects are the same.',
      'This usually means there was a call to this.forceUpdate() inside the component.',
      `more info at ${moreInfoUrl}`
    )
  }

  options.consoleGroupEnd()
}
