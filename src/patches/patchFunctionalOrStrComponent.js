import {defaults} from 'lodash';

import wdyrStore from '../wdyrStore';

import getUpdateInfo from '../getUpdateInfo';

const getFunctionalComponentFromStringComponent = (componentTypeStr) => props => (
  wdyrStore.React.createElement(componentTypeStr, props)
);

export default function patchFunctionalOrStrComponent(FunctionalOrStringComponent, {isPure, displayName, defaultProps}) {
  const FunctionalComponent = typeof(FunctionalOrStringComponent) === 'string' ?
    getFunctionalComponentFromStringComponent(FunctionalOrStringComponent) :
    FunctionalOrStringComponent;

  function WDYRFunctionalComponent(nextProps, ...args) {
    const prevPropsRef = wdyrStore.React.useRef();
    const prevProps = prevPropsRef.current;
    prevPropsRef.current = nextProps;

    const prevOwnerRef = wdyrStore.React.useRef();
    const prevOwner = prevOwnerRef.current;
    const nextOwner = wdyrStore.ownerBeforeElementCreation;
    prevOwnerRef.current = nextOwner;

    if (prevProps) {
      const updateInfo = getUpdateInfo({
        Component: FunctionalComponent,
        displayName,
        prevOwner,
        nextOwner,
        prevProps,
        nextProps,
      });

      const notifiedByHooks = (
        !updateInfo.reason.propsDifferences || (
          (isPure && updateInfo.reason.propsDifferences.length === 0)
        )
      );

      if (!notifiedByHooks) {
        wdyrStore.options.notifier(updateInfo);
      }
    }

    return FunctionalComponent(nextProps, ...args);
  }

  try {
    WDYRFunctionalComponent.displayName = displayName;
  } catch (_e) {
    // not crucial if displayName couldn't be set
  }

  WDYRFunctionalComponent.defaultProps = defaultProps;

  WDYRFunctionalComponent.ComponentForHooksTracking = FunctionalComponent;
  defaults(WDYRFunctionalComponent, FunctionalComponent);

  return WDYRFunctionalComponent;
}
