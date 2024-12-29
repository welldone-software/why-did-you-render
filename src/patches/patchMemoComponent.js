import { defaults } from 'lodash';

import wdyrStore from '../wdyrStore';

import getDisplayName from '../getDisplayName';
import { isForwardRefComponent, isMemoComponent, isReactClassComponent } from '../utils';
import patchClassComponent from './patchClassComponent';
import patchFunctionalOrStrComponent from './patchFunctionalOrStrComponent';

export default function patchMemoComponent(MemoComponent, { displayName, defaultProps }) {
  const { type: InnerMemoComponent } = MemoComponent;

  const isInnerMemoComponentAClassComponent = isReactClassComponent(InnerMemoComponent);
  const isInnerMemoComponentForwardRefs = isForwardRefComponent(InnerMemoComponent);
  const isInnerMemoComponentAnotherMemoComponent = isMemoComponent(InnerMemoComponent);

  const WrappedFunctionalComponent = isInnerMemoComponentForwardRefs ?
    InnerMemoComponent.render :
    InnerMemoComponent;

  const PatchedInnerComponent = isInnerMemoComponentAClassComponent ?
    patchClassComponent(WrappedFunctionalComponent, { displayName, defaultProps }) :
    (isInnerMemoComponentAnotherMemoComponent ?
      patchMemoComponent(WrappedFunctionalComponent, { displayName, defaultProps }) :
      patchFunctionalOrStrComponent(WrappedFunctionalComponent, { displayName, isPure: true })
    );

  try {
    PatchedInnerComponent.displayName = getDisplayName(WrappedFunctionalComponent);
  } catch (_e) {
    // not crucial if displayName couldn't be set
  }

  PatchedInnerComponent.ComponentForHooksTracking = MemoComponent;
  defaults(PatchedInnerComponent, WrappedFunctionalComponent);

  const WDYRMemoizedFunctionalComponent = wdyrStore.React.memo(
    isInnerMemoComponentForwardRefs ? wdyrStore.React.forwardRef(PatchedInnerComponent) : PatchedInnerComponent,
    MemoComponent.compare
  );

  try {
    WDYRMemoizedFunctionalComponent.displayName = displayName;
  } catch (_e) {
    // not crucial if displayName couldn't be set
  }

  WDYRMemoizedFunctionalComponent.defaultProps = defaultProps;

  defaults(WDYRMemoizedFunctionalComponent, MemoComponent);

  return WDYRMemoizedFunctionalComponent;
}
