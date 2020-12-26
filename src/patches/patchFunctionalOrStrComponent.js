import { defaults } from 'lodash';

import wdyrStore from '../wdyrStore';

import getUpdateInfo from '../getUpdateInfo';

const getFunctionalComponentFromStringComponent = (componentTypeStr) => props => (
  wdyrStore.React.createElement(componentTypeStr, props)
);

export default function patchFunctionalOrStrComponent(FunctionalOrStringComponent, { isPure, displayName }) {
  const FunctionalComponent = typeof(FunctionalOrStringComponent) === 'string' ?
    getFunctionalComponentFromStringComponent(FunctionalOrStringComponent) :
    FunctionalOrStringComponent;

  function WDYRFunctionalComponent() {
    const nextProps = arguments[0];
    const ref = wdyrStore.React.useRef();

    const prevProps = ref.current;
    ref.current = nextProps;

    if (prevProps) {
      const updateInfo = getUpdateInfo({
        Component: FunctionalComponent,
        displayName,
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

    return FunctionalComponent(...arguments);
  }

  try {
    WDYRFunctionalComponent.displayName = displayName;
  } catch (e) {
    // not crucial if displayName couldn't be set
  }

  WDYRFunctionalComponent.ComponentForHooksTracking = FunctionalComponent;
  defaults(WDYRFunctionalComponent, FunctionalComponent);

  return WDYRFunctionalComponent;
}
