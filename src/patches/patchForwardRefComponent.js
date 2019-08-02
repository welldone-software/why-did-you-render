import {defaults} from 'lodash'

import getUpdateInfo from '../getUpdateInfo'
import getDisplayName from '../getDisplayName'
import {REACT_MEMO_TYPE} from '../consts'

export default function patchForwardRefComponent(ForwardRefComponent, displayName, React, options){
  const {render: InnerForwardRefComponent} = ForwardRefComponent

  const isInnerComponentMemoized = InnerForwardRefComponent.$$typeof === REACT_MEMO_TYPE
  const WrappedFunctionalComponent = isInnerComponentMemoized ? InnerForwardRefComponent.type : InnerForwardRefComponent

  function WDYRWrappedByReactForwardRefFunctionalComponent(){
    const nextProps = arguments[0]
    const ref = React.useRef()

    const prevProps = ref.current
    ref.current = nextProps

    if(prevProps){
      const notification = getUpdateInfo({
        Component: ForwardRefComponent,
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

  WDYRWrappedByReactForwardRefFunctionalComponent.displayName = getDisplayName(WrappedFunctionalComponent)
  WDYRWrappedByReactForwardRefFunctionalComponent.ComponentForHooksTracking = WrappedFunctionalComponent
  defaults(WDYRWrappedByReactForwardRefFunctionalComponent, WrappedFunctionalComponent)

  const WDYRForwardRefFunctionalComponent = React.forwardRef(
    isInnerComponentMemoized ?
      React.memo(WDYRWrappedByReactForwardRefFunctionalComponent, InnerForwardRefComponent.compare) :
      WDYRWrappedByReactForwardRefFunctionalComponent
  )

  WDYRForwardRefFunctionalComponent.displayName = displayName
  defaults(WDYRForwardRefFunctionalComponent, ForwardRefComponent)

  return WDYRForwardRefFunctionalComponent
}
