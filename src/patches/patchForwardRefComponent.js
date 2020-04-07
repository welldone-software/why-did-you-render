import {defaults} from 'lodash'

import getDisplayName from '../getDisplayName'
import {isMemoComponent} from '../utils'
import patchFunctionalOrStrComponent from './patchFunctionalOrStrComponent'

export default function patchForwardRefComponent(ForwardRefComponent, displayName, React, options, ownerDataMap){
  const {render: InnerForwardRefComponent} = ForwardRefComponent

  const isInnerComponentMemoized = isMemoComponent(InnerForwardRefComponent)
  const WrappedFunctionalComponent = isInnerComponentMemoized ?
    InnerForwardRefComponent.type : InnerForwardRefComponent

  const WDYRWrappedByReactForwardRefFunctionalComponent = (
    patchFunctionalOrStrComponent(WrappedFunctionalComponent, isInnerComponentMemoized, displayName, React, options, ownerDataMap)
  )

  WDYRWrappedByReactForwardRefFunctionalComponent.displayName = getDisplayName(WrappedFunctionalComponent)
  WDYRWrappedByReactForwardRefFunctionalComponent.ComponentForHooksTracking = WrappedFunctionalComponent
  defaults(WDYRWrappedByReactForwardRefFunctionalComponent, WrappedFunctionalComponent)

  const WDYRForwardRefFunctionalComponent = React.forwardRef(
    isInnerComponentMemoized ?
      React.memo(WDYRWrappedByReactForwardRefFunctionalComponent, InnerForwardRefComponent.compare) :
      WDYRWrappedByReactForwardRefFunctionalComponent
  )

  try{
    WDYRForwardRefFunctionalComponent.displayName = displayName
  }catch(e){
    // not crucial if displayName couldn't be set
  }

  defaults(WDYRForwardRefFunctionalComponent, ForwardRefComponent)

  return WDYRForwardRefFunctionalComponent
}
