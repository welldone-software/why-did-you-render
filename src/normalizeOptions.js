/* eslint-disable no-console */
import defaultNotifier from './defaultNotifier'

const emptyFn = () => {}

export default function normalizeOptions(userOptions = {}){
  let consoleGroup = console.group
  let consoleGroupEnd = console.groupEnd

  if(userOptions.collapseGroups){
    consoleGroup = console.groupCollapsed
  }
  else if(userOptions.onlyLogs){
    consoleGroup = console.log
    consoleGroupEnd = emptyFn
  }

  return {
    include: null,
    exclude: null,
    notifier: defaultNotifier,
    onlyLogs: false,
    consoleLog: console.log,
    consoleGroup,
    consoleGroupEnd,
    logOnDifferentValues: false,
    ...userOptions
  }
}
