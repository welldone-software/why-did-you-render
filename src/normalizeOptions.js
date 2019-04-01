/* eslint-disable no-console */
import {createDefaultNotifier} from './defaultNotifier'

const emptyFn = () => {}

export default function normalizeOptions(userOptions = {}, React){
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
      userOptions.hasOwnProperty('hotReloadBufferMs') ?
        userOptions.hotReloadBufferMs : 500
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
    trackHooks: {
      useState: {
        fn: React.useState,
        allowShallow: true
      },
      useReducer: {
        fn: React.useReducer
      },
      ...userOptions.userHooks
    },
    ...userOptions
  }
}
