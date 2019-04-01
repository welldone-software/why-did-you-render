import {defaults, capitalize} from 'lodash'

import normalizeOptions from './normalizeOptions'
import getDisplayName from './getDisplayName'
import getUpdateInfo from './getUpdateInfo'
import shouldTrack from './shouldTrack'

const hasSymbol = typeof Symbol === 'function' && Symbol.for
const REACT_MEMO_TYPE = hasSymbol ? Symbol.for('react.memo') : 0xead3

function patchClassComponent(ClassComponent, displayName, React, options){
  class WDYRPatchedClassComponent extends ClassComponent{
    constructor(props, context){
      super(props, context)
      const renderIsAnArrowFunction = this.render && !ClassComponent.prototype.render
      if(renderIsAnArrowFunction){
        const origRender = this.render
        this.render = () => {
          WDYRPatchedClassComponent.prototype.render.apply(this)
          return origRender()
        }
      }
    }
    render(){
      if(this._prevProps){
        options.notifier(getUpdateInfo({
          Component: ClassComponent,
          displayName,
          prevProps: this._prevProps,
          prevState: this._prevState,
          nextProps: this.props,
          nextState: this.state,
          options
        }))
      }

      this._prevProps = this.props
      this._prevState = this.state

      return super.render && super.render()
    }
  }

  WDYRPatchedClassComponent.displayName = displayName
  defaults(WDYRPatchedClassComponent, ClassComponent)

  return WDYRPatchedClassComponent
}

function patchFunctionalComponent(FunctionalComponent, displayName, React, options){
  function WDYRFunctionalComponent(nextProps){
    const ref = React.useRef()

    const prevProps = ref.current
    ref.current = nextProps

    if(prevProps){
      const notification = getUpdateInfo({
        Component: FunctionalComponent,
        displayName,
        prevProps,
        nextProps,
        options
      })

      // if a functional component re-rendered without a props change
      // it was probably caused by a hook and we should not care about it
      if(notification.reason.propsDifferences){
        options.notifier(notification)
      }
    }

    return FunctionalComponent(nextProps)
  }

  WDYRFunctionalComponent.displayName = displayName
  defaults(WDYRFunctionalComponent, FunctionalComponent)

  return WDYRFunctionalComponent
}

function patchMemoComponent(MemoComponent, displayName, React, options){
  const WDYRMemoizedFunctionalComponent = React.memo(nextProps => {
    const ref = React.useRef()

    const prevProps = ref.current
    ref.current = nextProps

    if(prevProps){
      const notification = getUpdateInfo({
        Component: MemoComponent,
        displayName,
        prevProps,
        nextProps,
        options
      })

      // if a functional component re-rendered without a props change
      // it was probably caused by a hook and we should not care about it
      if(notification.reason.propsDifferences){
        options.notifier(notification)
      }
    }

    return MemoComponent.type(nextProps)
  })

  WDYRMemoizedFunctionalComponent.displayName = displayName
  defaults(WDYRMemoizedFunctionalComponent, MemoComponent)

  return WDYRMemoizedFunctionalComponent
}

function getPatchedHook(hookName, hookConfig, React, options){
  const newHook = function(...args){
    const nextHook = hookConfig.fn(...args)

    const Component = React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner.current.type
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
        prevHook,
        nextHook,
        options
      })
      const shouldNotifyHookDifference = (
        notification.reason.hookDifferences && (
          notification.reason.hookDifferences.length > 0 ||
          !hookConfig.allowShallow
        )
      )
      if(shouldNotifyHookDifference){
        options.notifier(notification)
      }
    }

    return ref.current
  }

  const newHookName = `patched${capitalize(hookName[0])}${hookName.substr(1)}`
  Object.defineProperty(newHook, 'name', {value: newHookName})

  return newHook
}

function createPatchedComponent(componentsMap, Component, displayName, React, options){
  if(Component.$$typeof === REACT_MEMO_TYPE){
    return patchMemoComponent(Component, displayName, React, options)
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

export default function whyDidYouRender(React, userOptions){
  const options = normalizeOptions(userOptions, React)

  const origCreateElement = React.createElement
  const origCreateFactory = React.createFactory
  const origHooks = {}

  let componentsMap = new WeakMap()

  React.createElement = function(componentNameOrComponent, ...rest){
    const isShouldTrack = (
      (
        typeof componentNameOrComponent === 'function' ||
        componentNameOrComponent.$$typeof === REACT_MEMO_TYPE
      ) &&
      shouldTrack(componentNameOrComponent, getDisplayName(componentNameOrComponent), options)
    )

    if(!isShouldTrack){
      return origCreateElement.apply(React, [componentNameOrComponent, ...rest])
    }

    const displayName = (
      componentNameOrComponent &&
      componentNameOrComponent.whyDidYouRender &&
      componentNameOrComponent.whyDidYouRender.customName ||
      getDisplayName(componentNameOrComponent)
    )

    const WDYRPatchedComponent = getPatchedComponent(componentsMap, componentNameOrComponent, displayName, React, options)
    return origCreateElement.apply(React, [WDYRPatchedComponent, ...rest])
  }

  Object.assign(React.createElement, origCreateElement)

  React.createFactory = type => {
    const factory = React.createElement.bind(null, type)
    factory.type = type
    return factory
  }

  Object.assign(React.createFactory, origCreateFactory)

  if(options.trackHooks){
    Object.entries(options.trackHooks).forEach(([hookName, hookConfig]) => {
      origHooks[hookName] = React[hookName]
      React[hookName] = getPatchedHook(hookName, hookConfig, React, options)
    })
  }

  React.__REVERT_WHY_DID_YOU_RENDER__ = () => {
    Object.assign(React, {
      createElement: origCreateElement,
      createFactory: origCreateFactory,
      ...origHooks
    })
    componentsMap = null
    delete React.__REVERT_WHY_DID_YOU_RENDER__
  }

  return React
}
