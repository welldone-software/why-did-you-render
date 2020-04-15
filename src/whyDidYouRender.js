import {get} from 'lodash'

import normalizeOptions from './normalizeOptions'
import getDisplayName from './getDisplayName'
import getUpdateInfo from './getUpdateInfo'
import shouldTrack from './shouldTrack'

import patchClassComponent from './patches/patchClassComponent'
import patchFunctionalOrStrComponent from './patches/patchFunctionalOrStrComponent'
import patchMemoComponent from './patches/patchMemoComponent'
import patchForwardRefComponent from './patches/patchForwardRefComponent'

import {isForwardRefComponent, isMemoComponent, isReactClassComponent} from './utils'

const initialHookValue = Symbol('initial-hook-value')
function trackHookChanges(hookName, {path: hookPath}, hookResult, React, options){
  const ComponentHookDispatchedFromInstance = React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner.current
  const prevHookResultRef = React.useRef(initialHookValue)

  if(!ComponentHookDispatchedFromInstance){
    return hookResult
  }

  const Component = ComponentHookDispatchedFromInstance.type.ComponentForHooksTracking || ComponentHookDispatchedFromInstance.type
  const displayName = getDisplayName(Component)

  const isShouldTrack = shouldTrack({Component, displayName, options, React, isHookChange: true})
  if(!isShouldTrack){
    return hookResult
  }

  const prevHookResult = prevHookResultRef.current
  prevHookResultRef.current = hookResult

  if(prevHookResult !== initialHookValue){
    const notification = getUpdateInfo({
      Component: Component,
      displayName,
      hookName,
      prevHook: hookPath ? get(prevHookResult, hookPath) : prevHookResult,
      nextHook: hookPath ? get(hookResult, hookPath) : hookResult,
      options
    })

    if(notification.reason.hookDifferences){
      options.notifier(notification)
    }
  }

  return hookResult
}

function createPatchedComponent(componentsMap, Component, displayName, React, options){
  if(isMemoComponent(Component)){
    return patchMemoComponent(Component, displayName, React, options)
  }

  if(isForwardRefComponent(Component)){
    return patchForwardRefComponent(Component, displayName, React, options)
  }

  if(isReactClassComponent(Component)){
    return patchClassComponent(Component, displayName, React, options)
  }

  return patchFunctionalOrStrComponent(Component, false, displayName, React, options)
}

function getPatchedComponent(componentsMap, Component, displayName, React, options){
  if(componentsMap.has(Component)){
    return componentsMap.get(Component)
  }

  const WDYRPatchedComponent = createPatchedComponent(componentsMap, Component, displayName, React, options)

  componentsMap.set(Component, WDYRPatchedComponent)
  return WDYRPatchedComponent
}

export const hooksConfig = {
  useState: {path: '0'},
  useReducer: {path: '0'},
  useContext: true,
  useMemo: true
}

export default function whyDidYouRender(React, userOptions){
  const options = normalizeOptions(userOptions)

  const origCreateElement = React.createElement
  const origCreateFactory = React.createFactory

  let componentsMap = new WeakMap()

  React.createElement = function(componentNameOrComponent, ...rest){
    let isShouldTrack = null
    let displayName = null
    let WDYRPatchedComponent = null

    try{
      isShouldTrack = (
        (
          typeof componentNameOrComponent === 'function' ||
          isMemoComponent(componentNameOrComponent) ||
          isForwardRefComponent(componentNameOrComponent)
        ) &&
        shouldTrack({Component: componentNameOrComponent, displayName: getDisplayName(componentNameOrComponent), React, options})
      )

      if(isShouldTrack){
        displayName = (
          componentNameOrComponent &&
          componentNameOrComponent.whyDidYouRender &&
          componentNameOrComponent.whyDidYouRender.customName ||
          getDisplayName(componentNameOrComponent)
        )

        WDYRPatchedComponent = getPatchedComponent(componentsMap, componentNameOrComponent, displayName, React, options)
        return origCreateElement.apply(React, [WDYRPatchedComponent, ...rest])
      }
    }
    catch(e){
      options.consoleLog('whyDidYouRender error. Please file a bug at https://github.com/welldone-software/why-did-you-render/issues.', {
        errorInfo: {
          error: e,
          componentNameOrComponent,
          rest,
          options,
          isShouldTrack,
          displayName,
          WDYRPatchedComponent
        }
      })
    }

    return origCreateElement.apply(React, [componentNameOrComponent, ...rest])
  }

  Object.assign(React.createElement, origCreateElement)

  React.createFactory = type => {
    const factory = React.createElement.bind(null, type)
    factory.type = type
    return factory
  }

  Object.assign(React.createFactory, origCreateFactory)

  if(options.trackHooks){
    const nativeHooks = Object.entries(hooksConfig).map(([hookName, hookTrackingConfig]) => {
      return [React, hookName, hookTrackingConfig]
    })

    const hooksToTrack = [
      ...nativeHooks,
      ...options.trackExtraHooks
    ]

    hooksToTrack.forEach(([hookParent, hookName, hookTrackingConfig = {}]) => {
      const originalHook = hookParent[hookName]
      const newHookName = hookName[0].toUpperCase() + hookName.slice(1)
      const newHook = function(...args){
        const hookResult = originalHook.call(this, ...args)
        trackHookChanges(hookName, hookTrackingConfig, hookResult, React, options)
        return hookResult
      }
      Object.defineProperty(newHook, 'name', {value: newHookName, writable: false})
      Object.assign(newHook, {originalHook})
      hookParent[hookName] = newHook
    })
  }

  React.__REVERT_WHY_DID_YOU_RENDER__ = () => {
    Object.assign(React, {
      createElement: origCreateElement,
      createFactory: origCreateFactory
    })

    componentsMap = null

    const hooksToRevert = [
      ...Object.keys(hooksConfig).map(hookName => [React, hookName]),
      ...options.trackExtraHooks
    ]
    hooksToRevert.forEach(([hookParent, hookName]) => {
      if(hookParent[hookName].originalHook){
        hookParent[hookName] = hookParent[hookName].originalHook
      }
    })

    delete React.__REVERT_WHY_DID_YOU_RENDER__
  }

  return React
}
