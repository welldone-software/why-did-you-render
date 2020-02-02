import {defaults} from 'lodash'

import getUpdateInfo from '../getUpdateInfo'

const getFunctionalComponentFromStringComponent = (componentTypeStr, React) => props => (
  React.createElement(componentTypeStr, props)
)

export default function patchFunctionalOrStrComponent(FunctionalOrStringComponent, isPure, displayName, React, options){
  const FunctionalComponent = typeof(FunctionalOrStringComponent) === 'string' ?
    getFunctionalComponentFromStringComponent(FunctionalOrStringComponent, React) :
    FunctionalOrStringComponent

  function WDYRFunctionalComponent(){
    const nextProps = arguments[0]
    const ref = React.useRef()

    const prevProps = ref.current
    ref.current = nextProps

    if(prevProps){
      const updateInfo = getUpdateInfo({
        Component: FunctionalComponent,
        displayName,
        prevProps,
        nextProps,
        options
      })

      const shouldNotify = (
        updateInfo.reason.propsDifferences && (
          !(isPure && updateInfo.reason.propsDifferences.length === 0)
        )
      )

      if(shouldNotify){
        options.notifier(updateInfo)
      }
    }

    return FunctionalComponent(...arguments)
  }

  try{
    WDYRFunctionalComponent.displayName = displayName
  }catch(e){
    // not crucial if displayName couldn't be set
  }

  WDYRFunctionalComponent.ComponentForHooksTracking = FunctionalComponent
  defaults(WDYRFunctionalComponent, FunctionalComponent)

  return WDYRFunctionalComponent
}
