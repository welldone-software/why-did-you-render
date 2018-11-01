import normalizeOptions from './normalizeOptions'
import getDisplayName from './getDisplayName'
import getUpdateInfo from './getUpdateInfo'
import shouldTrack from './shouldTrack'

const patchClassComponent = (Component, options) => {
  const PatchedComponent = class extends Component{
    componentDidUpdate(prevProps, prevState, snapshot){
      options.notifier(getUpdateInfo({Component, prevProps, prevState, nextProps: this.props, nextState: this.state, options}))
      if(typeof Component.prototype.componentDidUpdate === 'function'){
        Component.prototype.componentDidUpdate.call(this, prevProps, prevState, snapshot)
      }
    }
  }

  PatchedComponent.displayName = getDisplayName(Component)

  return PatchedComponent
}

const patchFunctionalComponent = (Fn, React, options) => {
  const PatchedComponent = class extends React.Component{
    render(){
      return Fn(this.props)
    }
    componentDidUpdate(prevProps){
      options.notifier(getUpdateInfo({Component: Fn, prevProps, nextProps: this.props, options}))
    }
  }

  PatchedComponent.displayName = getDisplayName(Fn)

  return PatchedComponent
}

function createPatchedComponent(componentsMapping, Component, React, options){
  if(Component.prototype && typeof Component.prototype.render === 'function'){
    return patchClassComponent(Component, options)
  }

  return patchFunctionalComponent(Component, React, options)
}

function getPatchedComponent(componentsMapping, Component, React, options){
  if(componentsMapping.has(Component)){
    return componentsMapping.get(Component)
  }

  const PatchedComponent = createPatchedComponent(componentsMapping, Component, React, options)

  componentsMapping.set(Component, PatchedComponent)
  return PatchedComponent
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

    const PatchedComponent = getPatchedComponent(componentsMapping, componentNameOrComponent, React, options)
    return origCreateElement.apply(React, [PatchedComponent, ...rest])
  }

  React.__REVERT_WHY_DID_YOU_RENDER_PATCH__ = () => {
    React.createElement = origCreateElement
    delete React.__REVERT_WHY_DID_YOU_RENDER_PATCH__
  }

  return React
}
