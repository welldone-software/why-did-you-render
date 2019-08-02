import {defaults} from 'lodash'

import getUpdateInfo from '../getUpdateInfo'
import getDisplayName from '../getDisplayName'

import {REACT_FORWARD_REF_TYPE} from '../consts'

export default function patchMemoComponent(MemoComponent, displayName, React, options){
  const {type: InnerMemoComponent} = MemoComponent

  const isInnerMemoComponentForwardRefs = InnerMemoComponent.$$typeof === REACT_FORWARD_REF_TYPE
  const WrappedFunctionalComponent = isInnerMemoComponentForwardRefs ? InnerMemoComponent.render : InnerMemoComponent

  function WDYRWrappedByMemoFunctionalComponent(){
    const nextProps = arguments[0]
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

      // if a memoized functional component re-rendered without props change / prop values change
      // it was probably caused by a hook and we should not care about it
      if(notification.reason.propsDifferences && notification.reason.propsDifferences.length > 0){
        options.notifier(notification)
      }
    }

    return WrappedFunctionalComponent(...arguments)
  }

  WDYRWrappedByMemoFunctionalComponent.displayName = getDisplayName(WrappedFunctionalComponent)
  WDYRWrappedByMemoFunctionalComponent.ComponentForHooksTracking = MemoComponent
  defaults(WDYRWrappedByMemoFunctionalComponent, WrappedFunctionalComponent)

  const WDYRMemoizedFunctionalComponent = React.memo(
    isInnerMemoComponentForwardRefs ? React.forwardRef(WDYRWrappedByMemoFunctionalComponent) : WDYRWrappedByMemoFunctionalComponent,
    MemoComponent.compare
  )

  WDYRMemoizedFunctionalComponent.displayName = displayName
  defaults(WDYRMemoizedFunctionalComponent, MemoComponent)

  return WDYRMemoizedFunctionalComponent
}
