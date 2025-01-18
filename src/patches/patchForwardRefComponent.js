import {defaults} from 'lodash';

import wdyrStore from '../wdyrStore';

import getDisplayName from '../getDisplayName';
import {isMemoComponent} from '../utils';
import patchFunctionalOrStrComponent from './patchFunctionalOrStrComponent';

export default function patchForwardRefComponent(ForwardRefComponent, {displayName, defaultProps}) {
  const {render: InnerForwardRefComponent} = ForwardRefComponent;

  const isInnerComponentMemoized = isMemoComponent(InnerForwardRefComponent);
  const WrappedFunctionalComponent = isInnerComponentMemoized ?
    InnerForwardRefComponent.type : InnerForwardRefComponent;

  const WDYRWrappedByReactForwardRefFunctionalComponent = (
    patchFunctionalOrStrComponent(WrappedFunctionalComponent, {isPure: isInnerComponentMemoized, displayName})
  );

  WDYRWrappedByReactForwardRefFunctionalComponent.displayName = getDisplayName(WrappedFunctionalComponent);
  WDYRWrappedByReactForwardRefFunctionalComponent.ComponentForHooksTracking = WrappedFunctionalComponent;
  defaults(WDYRWrappedByReactForwardRefFunctionalComponent, WrappedFunctionalComponent);

  const WDYRForwardRefFunctionalComponent = wdyrStore.React.forwardRef(
    isInnerComponentMemoized ?
      wdyrStore.React.memo(WDYRWrappedByReactForwardRefFunctionalComponent, InnerForwardRefComponent.compare) :
      WDYRWrappedByReactForwardRefFunctionalComponent
  );

  try {
    WDYRForwardRefFunctionalComponent.displayName = displayName;
  } catch (_e) {
    // not crucial if displayName couldn't be set
  }

  WDYRForwardRefFunctionalComponent.defaultProps = defaultProps;

  defaults(WDYRForwardRefFunctionalComponent, ForwardRefComponent);

  return WDYRForwardRefFunctionalComponent;
}
