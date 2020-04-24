import {defaults} from 'lodash'

import {checkIfInsideAStrictModeTree} from '../utils'
import getUpdateInfo from '../getUpdateInfo'

export default function patchClassComponent(ClassComponent, displayName, React, options, ownerDataMap){
  class WDYRPatchedClassComponent extends ClassComponent{
    constructor(props, context){
      super(props, context)

      this._WDYR = {
        renderNumber: 0
      }

      const origRender = super.render || this.render
      // this probably means render is an arrow function or this.render.bind(this) was called on the original class
      const renderIsABindedFunction = origRender !== ClassComponent.prototype.render
      if(renderIsABindedFunction){
        this.render = () => {
          WDYRPatchedClassComponent.prototype.render.apply(this)
          return origRender()
        }
      }
    }
    render(){
      this._WDYR.renderNumber++

      if(!('isStrictMode' in this._WDYR)){
        this._WDYR.isStrictMode = checkIfInsideAStrictModeTree(this)
      }

      // in strict mode- ignore every other render
      if(!(this._WDYR.isStrictMode && this._WDYR.renderNumber % 2 === 1)){
        if(this._WDYR.prevProps){
          const updateInfo = getUpdateInfo({
            Component: ClassComponent,
            displayName,
            prevProps: this._WDYR.prevProps,
            prevState: this._WDYR.prevState,
            nextProps: this.props,
            nextState: this.state,
            options,
            ownerDataMap
          })

          options.notifier(updateInfo)
        }

        this._WDYR.prevProps = this.props
        this._WDYR.prevState = this.state
      }

      return super.render ? super.render() : null
    }
  }

  try{
    WDYRPatchedClassComponent.displayName = displayName
  }catch(e){
    // not crucial if displayName couldn't be set
  }

  defaults(WDYRPatchedClassComponent, ClassComponent)

  return WDYRPatchedClassComponent
}
