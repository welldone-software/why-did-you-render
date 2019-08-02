import {get, mapValues} from 'lodash'

import normalizeOptions from './normalizeOptions'
import getDisplayName from './getDisplayName'
import getUpdateInfo from './getUpdateInfo'
import shouldTrack from './shouldTrack'

import patchClassComponent from './patches/patchClassComponent'
import patchFunctionalComponent from './patches/patchFunctionalComponent'
import patchMemoComponent from './patches/patchMemoComponent'
import patchForwardRefComponent from './patches/patchForwardRefComponent'

import {REACT_MEMO_TYPE, REACT_FORWARD_REF_TYPE} from './consts'

function trackHookChanges(hookName, {path: hookPath}, hookResult, React, options){
  const nextHook = hookResult

  const ComponentHookDispatchedFromInstance = React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner.current

  if(!ComponentHookDispatchedFromInstance){
    return nextHook
  }

  const Component = ComponentHookDispatchedFromInstance.type.ComponentForHooksTracking || ComponentHookDispatchedFromInstance.type
  const displayName = getDisplayName(Component)

  const isShouldTrack = shouldTrack(Component, displayName, options)
  if(!isShouldTrack){
    return nextHook
  }

  const ref = React.useRef()
  const prevHook = ref.current
  ref.current = nextHook

  if(prevHook){
    const notification = getUpdateInfo({
      Component: Component,
      displayName,
      hookName,
      prevHook: hookPath ? get(prevHook, hookPath) : prevHook,
      nextHook: hookPath ? get(nextHook, hookPath) : nextHook,
      options
    })

    if(notification.reason.hookDifferences){
      options.notifier(notification)
    }
  }

  return ref.current
}

function createPatchedComponent(componentsMap, Component, displayName, React, options){
  if(Component.$$typeof === REACT_MEMO_TYPE){
    return patchMemoComponent(Component, displayName, React, options)
  }

  if(Component.$$typeof === REACT_FORWARD_REF_TYPE){
    return patchForwardRefComponent(Component, displayName, React, options)
  }

  if(Component.prototype && Component.prototype.isReactComponent){
    return patchClassComponent(Component, displayName, React, options)
  }

  return patchFunctionalComponent(Component, displayName, React, options)
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
          componentNameOrComponent.$$typeof === REACT_MEMO_TYPE ||
          componentNameOrComponent.$$typeof === REACT_FORWARD_REF_TYPE
        ) &&
        shouldTrack(componentNameOrComponent, getDisplayName(componentNameOrComponent), options)
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

  let origHooks

  if(options.trackHooks){
    const patchedHooks = mapValues(hooksConfig, (hookConfig, hookName) => {
      return (...args) => {
        const origHook = origHooks[hookName]
        if(!origHook){
          throw new Error('[WhyDidYouRender] A problem with React Hooks patching occurred.')
        }
        const hookResult = origHook(...args)
        if(hookConfig){
          trackHookChanges(hookName, hookConfig === true ? {} : hookConfig, hookResult, React, options)
        }
        return hookResult
      }
    })

    Object.defineProperty(
      React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentDispatcher,
      'current',
      {
        set(newHooks){
          origHooks = newHooks && {
            ...newHooks,
            ...newHooks.origHooks
          }
        },
        get(){
          return origHooks && {
            ...origHooks,
            ...patchedHooks,
            origHooks
          }
        }
      }
    )
  }

  React.__REVERT_WHY_DID_YOU_RENDER__ = () => {
    Object.assign(React, {
      createElement: origCreateElement,
      createFactory: origCreateFactory
    })
    componentsMap = null
    Object.defineProperty(
      React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentDispatcher,
      'current',
      {
        writable: true,
        value: origHooks
      }
    )
    delete React.__REVERT_WHY_DID_YOU_RENDER__
  }

  return React
}
