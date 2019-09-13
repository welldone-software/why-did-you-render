import {defaults} from 'lodash'

import getDisplayName from '../getDisplayName'
import {isMemoComponent} from '../utils'
import patchFunctionalComponent from './patchFunctionalComponent'

export default function patchForwardRefComponent(ForwardRefComponent, displayName, React, options){
  const {render: InnerForwardRefComponent} = ForwardRefComponent

  const isInnerComponentMemoized = isMemoComponent(InnerForwardRefComponent)
  const WrappedFunctionalComponent = isInnerComponentMemoized ?
    InnerForwardRefComponent.type : InnerForwardRefComponent

  const WDYRWrappedByReactForwardRefFunctionalComponent = (
    patchFunctionalComponent(WrappedFunctionalComponent, isInnerComponentMemoized, displayName, React, options)
  )

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
