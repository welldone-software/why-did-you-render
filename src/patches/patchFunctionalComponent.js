import {defaults} from 'lodash'

import getUpdateInfo from '../getUpdateInfo'

export default function patchFunctionalComponent(FunctionalComponent, displayName, React, options){
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
  WDYRFunctionalComponent.ComponentForHooksTracking = FunctionalComponent
  defaults(WDYRFunctionalComponent, FunctionalComponent)

  return WDYRFunctionalComponent
}
