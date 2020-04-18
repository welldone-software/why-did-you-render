/* eslint-disable no-console */
import {createDefaultNotifier} from './defaultNotifier'

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

  const notifier = userOptions.notifier || (
    createDefaultNotifier(
      ('hotReloadBufferMs' in userOptions) ? userOptions.hotReloadBufferMs : 500
    )
  )

  return {
    include: null,
    exclude: null,
    notifier,
    onlyLogs: false,
    consoleLog: console.log,
    consoleGroup,
    consoleGroupEnd,
    logOnDifferentValues: false,
    logOwnerReasons: false,
    trackHooks: true,
    titleColor: '#058',
    diffNameColor: 'blue',
    diffPathColor: 'red',
    trackExtraHooks: [],
    trackAllPureComponents: false,
    ...userOptions
  }
}
