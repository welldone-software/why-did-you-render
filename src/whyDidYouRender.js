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
function trackHookChanges(hookName, {path: hookPath}, hookResult, React, options, ownerDataMap, hooksRef){
  const nextHook = hookPath ? get(hookResult, hookPath) : hookResult
  const renderNumber = React.useRef(1)
  if(hooksRef.current[0] != null && renderNumber.current !== hooksRef.current[0].renderNumber){
    hooksRef.current = []
  }
  hooksRef.current.push({hookName, result: nextHook, renderNumber: renderNumber.current})
  renderNumber.current++
  const ComponentHookDispatchedFromInstance = (
    React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED &&
    React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner.current
  )

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
      nextHook,
      options,
      ownerDataMap
    })

    if(notification.reason.hookDifferences){
      options.notifier(notification)
    }
  }

  return hookResult
}

function createPatchedComponent(componentsMap, Component, displayName, React, options, ownerDataMap){
  if(isMemoComponent(Component)){
    return patchMemoComponent(Component, displayName, React, options, ownerDataMap)
  }

  if(isForwardRefComponent(Component)){
    return patchForwardRefComponent(Component, displayName, React, options, ownerDataMap)
  }

  if(isReactClassComponent(Component)){
    return patchClassComponent(Component, displayName, React, options, ownerDataMap)
  }

  return patchFunctionalOrStrComponent(Component, false, displayName, React, options, ownerDataMap)
}

function getPatchedComponent(componentsMap, Component, displayName, React, options, ownerDataMap){
  if(componentsMap.has(Component)){
    return componentsMap.get(Component)
  }

  const WDYRPatchedComponent = createPatchedComponent(componentsMap, Component, displayName, React, options, ownerDataMap)

  componentsMap.set(Component, WDYRPatchedComponent)
  return WDYRPatchedComponent
}

function getIsSupportedComponentType(Comp){
  if(!Comp){
    return false
  }

  if(isMemoComponent(Comp)){
    return getIsSupportedComponentType(Comp.type)
  }

  if(isForwardRefComponent(Comp)){
    return getIsSupportedComponentType(Comp.render)
  }

  if(typeof Comp === 'function'){
    return true
  }
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
  const origCloneElement = React.cloneElement

  let componentsMap = new WeakMap()
  const ownerDataMap = new WeakMap()
  const hooksRef = {current: []}

  function storeOwnerData(element){
    const OwnerInstance = React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner.current
    if(OwnerInstance){
      const Component = OwnerInstance.type.ComponentForHooksTracking || OwnerInstance.type
      const displayName = getDisplayName(Component)
      ownerDataMap.set(element.props, {
        Component,
        displayName,
        props: OwnerInstance.pendingProps,
        state: OwnerInstance.stateNode != null ? OwnerInstance.stateNode.state : null,
        hooks: hooksRef.current
      })
    }
  }

  // Intercept assignments to ReactCurrentOwner.current and reset hooksRef
  let currentOwner = null
  if(React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED){
    Object.defineProperty(React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, 'current', {
      get(){
        return currentOwner
      },
      set(value){
        currentOwner = value
        hooksRef.current = []
      }
    })
  }

  React.createElement = function(componentNameOrComponent, ...rest){
    let isShouldTrack = null
    let displayName = null
    let WDYRPatchedComponent = null

    try{
      isShouldTrack = (
        getIsSupportedComponentType(componentNameOrComponent) &&
        shouldTrack({Component: componentNameOrComponent, displayName: getDisplayName(componentNameOrComponent), React, options})
      )

      if(isShouldTrack){
        displayName = (
          componentNameOrComponent &&
          componentNameOrComponent.whyDidYouRender &&
          componentNameOrComponent.whyDidYouRender.customName ||
          getDisplayName(componentNameOrComponent)
        )

        WDYRPatchedComponent = getPatchedComponent(componentsMap, componentNameOrComponent, displayName, React, options, ownerDataMap)

        const element = origCreateElement.apply(React, [WDYRPatchedComponent, ...rest])
        if(options.logOwnerReasons){
          storeOwnerData(element)
        }

        return element
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

  React.cloneElement = (...args) => {
    const element = origCloneElement.apply(React, args)
    if(options.logOwnerReasons){
      storeOwnerData(element)
    }

    return element
  }

  Object.assign(React.cloneElement, origCloneElement)

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
        trackHookChanges(hookName, hookTrackingConfig, hookResult, React, options, ownerDataMap, hooksRef)
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
      createFactory: origCreateFactory,
      cloneElement: origCloneElement
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
