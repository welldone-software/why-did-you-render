import {defaults} from 'lodash'

import getDisplayName from '../getDisplayName'

import {isForwardRefComponent, isReactClassComponent} from '../utils'
import patchClassComponent from './patchClassComponent'
import patchFunctionalOrStrComponent from './patchFunctionalOrStrComponent'

export default function patchMemoComponent(MemoComponent, displayName, React, options){
  const {type: InnerMemoComponent} = MemoComponent

  const isInnerMemoComponentAClassComponent = isReactClassComponent(InnerMemoComponent)
  const isInnerMemoComponentForwardRefs = isForwardRefComponent(InnerMemoComponent)

  const WrappedFunctionalComponent = isInnerMemoComponentForwardRefs ?
    InnerMemoComponent.render :
    InnerMemoComponent

  const PatchedInnerComponent = isInnerMemoComponentAClassComponent ?
    patchClassComponent(WrappedFunctionalComponent, displayName, React, options) :
    patchFunctionalOrStrComponent(WrappedFunctionalComponent, true, displayName, React, options)

  PatchedInnerComponent.displayName = getDisplayName(WrappedFunctionalComponent)
  PatchedInnerComponent.ComponentForHooksTracking = MemoComponent
  defaults(PatchedInnerComponent, WrappedFunctionalComponent)

  const WDYRMemoizedFunctionalComponent = React.memo(
    isInnerMemoComponentForwardRefs ? React.forwardRef(PatchedInnerComponent) : PatchedInnerComponent,
    MemoComponent.compare
  )

  WDYRMemoizedFunctionalComponent.displayName = displayName
  defaults(WDYRMemoizedFunctionalComponent, MemoComponent)

  return WDYRMemoizedFunctionalComponent
}
