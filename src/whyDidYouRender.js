import normalizeOptions from './normalizeOptions'
import getDisplayName from './getDisplayName'
import getUpdateInfo from './getUpdateInfo'
import shouldTrack from './shouldTrack'

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

  Object.assign(WDYRPatchedClassComponent, ClassComponent, {displayName})

  return WDYRPatchedClassComponent
}

function patchFunctionalComponent(FunctionalComponent, displayName, React, options){
  class WDYRPatchedFunctionalComponent extends React.Component{
    componentDidUpdate(prevProps){
      options.notifier(getUpdateInfo({
        Component: FunctionalComponent,
        displayName,
        prevProps,
        nextProps: this.props,
        options
      }))
    }
    render(){
      return FunctionalComponent(this.props)
    }
  }

  Object.assign(WDYRPatchedFunctionalComponent, FunctionalComponent, {displayName})

  return WDYRPatchedFunctionalComponent
}

function createPatchedComponent(componentsMapping, Component, displayName, React, options){
  if(Component.prototype && Component.prototype.isReactComponent){
    return patchClassComponent(Component, displayName, React, options)
  }

  return patchFunctionalComponent(Component, displayName, React, options)
}

function getPatchedComponent(componentsMapping, Component, displayName, React, options){
  if(componentsMapping.has(Component)){
    return componentsMapping.get(Component)
  }

  const WDYRPatchedComponent = createPatchedComponent(componentsMapping, Component, displayName, React, options)

  componentsMapping.set(Component, WDYRPatchedComponent)
  return WDYRPatchedComponent
}

export default function whyDidYouRender(React, userOptions){
  const options = normalizeOptions(userOptions)

  const origCreateElement = React.createElement

  const componentsMapping = new Map()

  React.createElement = function(componentNameOrComponent, ...rest){
    const isShouldTrack = (
      typeof componentNameOrComponent === 'function' &&
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

    const WDYRPatchedComponent = getPatchedComponent(componentsMapping, componentNameOrComponent, displayName, React, options)
    return origCreateElement.apply(React, [WDYRPatchedComponent, ...rest])
  }

  React.__REVERT_WHY_DID_YOU_RENDER__ = () => {
    React.createElement = origCreateElement
    delete React.__REVERT_WHY_DID_YOU_RENDER__
    componentsMapping.clear()
  }

  return React
}
