import {defaults} from 'lodash'

import getUpdateInfo from '../getUpdateInfo'

export default function patchFunctionalComponent(FunctionalComponent, isPure, displayName, React, options){
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

  WDYRFunctionalComponent.displayName = displayName
  WDYRFunctionalComponent.ComponentForHooksTracking = FunctionalComponent
  defaults(WDYRFunctionalComponent, FunctionalComponent)

  return WDYRFunctionalComponent
}
