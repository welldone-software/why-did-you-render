import {get, isFunction} from 'lodash';

import wdyrStore from './wdyrStore';

import normalizeOptions from './normalizeOptions';
import getDisplayName from './getDisplayName';
import getDefaultProps from './getDefaultProps';
import getUpdateInfo from './getUpdateInfo';
import shouldTrack from './shouldTrack';

import patchClassComponent from './patches/patchClassComponent';
import patchFunctionalOrStrComponent from './patches/patchFunctionalOrStrComponent';
import patchMemoComponent from './patches/patchMemoComponent';
import patchForwardRefComponent from './patches/patchForwardRefComponent';

import {
  isForwardRefComponent,
  isMemoComponent,
  isReactClassComponent,
} from './utils';

import {dependenciesMap} from './calculateDeepEqualDiffs';

import {getCurrentOwner} from './helpers';

export {wdyrStore, getCurrentOwner};

const initialHookValue = Symbol('initial-hook-value');

function trackHookChanges(hookName, {path: pathToGetTrackedHookResult}, rawHookResult) {
  const nextResult = pathToGetTrackedHookResult ? get(rawHookResult, pathToGetTrackedHookResult) : rawHookResult;

  const prevResultRef = wdyrStore.React.useRef(initialHookValue);
  const prevResult = prevResultRef.current;
  prevResultRef.current = nextResult;

  const ownerInstance = getCurrentOwner();
  if (!ownerInstance) {
    return rawHookResult;
  }

  if (!wdyrStore.hooksInfoForCurrentRender.has(ownerInstance)) {
    wdyrStore.hooksInfoForCurrentRender.set(ownerInstance, []);
  }
  const hooksInfoForCurrentRender = wdyrStore.hooksInfoForCurrentRender.get(ownerInstance);

  hooksInfoForCurrentRender.push({hookName, result: nextResult});

  const Component = ownerInstance.type.ComponentForHooksTracking || ownerInstance.type;
  const displayName = getDisplayName(Component);

  const isShouldTrack = shouldTrack(Component, {isHookChange: true});
  if (isShouldTrack && prevResult !== initialHookValue) {
    const updateInfo = getUpdateInfo({
      Component: Component,
      displayName,
      hookName,
      prevHookResult: prevResult,
      nextHookResult: nextResult,
    });
 
    if (updateInfo.reason.hookDifferences) {
      wdyrStore.options.notifier(updateInfo);
    }
  }

  return rawHookResult;
}

function createPatchedComponent(Component, {displayName, defaultProps}) {
  if (isMemoComponent(Component)) {
    return patchMemoComponent(Component, {displayName, defaultProps});
  }

  if (isForwardRefComponent(Component)) {
    return patchForwardRefComponent(Component, {displayName, defaultProps});
  }

  if (isReactClassComponent(Component)) {
    return patchClassComponent(Component, {displayName, defaultProps});
  }

  return patchFunctionalOrStrComponent(Component, {displayName, defaultProps, isPure: false});
}

function getPatchedComponent(Component, {displayName, defaultProps}) {
  if (wdyrStore.componentsMap.has(Component)) {
    return wdyrStore.componentsMap.get(Component);
  }

  const WDYRPatchedComponent = createPatchedComponent(Component, {displayName, defaultProps});

  wdyrStore.componentsMap.set(Component, WDYRPatchedComponent);

  return WDYRPatchedComponent;
}

function getIsSupportedComponentType(Comp) {
  if (!Comp) {
    return false;
  }

  if (isMemoComponent(Comp)) {
    return getIsSupportedComponentType(Comp.type);
  }

  if (isForwardRefComponent(Comp)) {
    return getIsSupportedComponentType(Comp.render);
  }

  if (typeof Comp === 'function') {
    return true;
  }
}

export const hooksConfig = {
  useState: {path: '0'},
  useReducer: {path: '0'},
  useContext: undefined,
  useSyncExternalStore: undefined,
  useMemo: {dependenciesPath: '1', dontReport: true},
  useCallback: {dependenciesPath: '1', dontReport: true},
};

export function storeOwnerData(element) {
  const owner = getCurrentOwner();
  if (owner) {
    const Component = owner.type.ComponentForHooksTracking || owner.type;
    const displayName = getDisplayName(Component);

    let additionalOwnerData = {};
    if (wdyrStore.options.getAdditionalOwnerData) {
      additionalOwnerData = wdyrStore.options.getAdditionalOwnerData(element);
    }

    wdyrStore.ownerDataMap.set(owner, {
      Component,
      displayName,
      props: owner.pendingProps,
      state: owner.stateNode ? owner.stateNode.state : null,
      hooksInfo: wdyrStore.hooksInfoForCurrentRender.get(owner) || [],
      additionalOwnerData,
    });

    wdyrStore.hooksInfoForCurrentRender.delete(owner);
  }
}

function trackHooksIfNeeded() {
  const hooksSupported = !!wdyrStore.React.useState;

  if (wdyrStore.options.trackHooks && hooksSupported) {
    const nativeHooks = Object.entries(hooksConfig).map(([hookName, hookTrackingConfig]) => {
      return [wdyrStore.React, hookName, hookTrackingConfig];
    });

    const hooksToTrack = [
      ...nativeHooks,
      ...wdyrStore.options.trackExtraHooks,
    ];

    hooksToTrack.forEach(([hookParent, hookName, hookTrackingConfig = {}]) => {
      const originalHook = hookParent[hookName];

      const newHook = function useWhyDidYouRenderReWrittenHook(...args) {
        const hookResult = originalHook.call(this, ...args);
        const {dependenciesPath, dontReport} = hookTrackingConfig;
        const shouldTrackHookChanges = !dontReport;
        if (dependenciesPath && isFunction(hookResult)) {
          dependenciesMap.set(hookResult, {hookName, deps: get(args, dependenciesPath)});
        }
        if (shouldTrackHookChanges) {
          trackHookChanges(hookName, hookTrackingConfig, hookResult);
        }
        return hookResult;
      };

      Object.defineProperty(newHook, 'name', {
        value: hookName + 'WDYR',
        writable: false
      });
      Object.assign(newHook, {originalHook});
      hookParent[hookName] = newHook;
    });
  }
}

export function getWDYRType(origType) {
  const isShouldTrack = (
    getIsSupportedComponentType(origType) &&
    shouldTrack(origType, {isHookChange: false})
  );

  if (!isShouldTrack) {
    return null;
  }

  const displayName = (
    origType &&
    origType.whyDidYouRender &&
    origType.whyDidYouRender.customName ||
    getDisplayName(origType)
  );

  const defaultProps = getDefaultProps(origType);

  const WDYRPatchedComponent = getPatchedComponent(origType, {displayName, defaultProps});

  return WDYRPatchedComponent;
}

export default function whyDidYouRender(React, userOptions) {
  if (React.__IS_WDYR__) {
    return;
  }
  React.__IS_WDYR__ = true;

  Object.assign(wdyrStore, {
    React,
    options: normalizeOptions(userOptions),
    origCreateElement: React.createElement,
    origCreateFactory: React.createFactory,
    origCloneElement: React.cloneElement,
    componentsMap: new WeakMap(),
  });

  React.createElement = function(origType, ...rest) {
    const WDYRType = getWDYRType(origType);
    if (WDYRType) {
      try {
        wdyrStore.ownerBeforeElementCreation = getCurrentOwner();
        const element = wdyrStore.origCreateElement.apply(React, [WDYRType, ...rest]);
        if (wdyrStore.options.logOwnerReasons) {
          storeOwnerData(element);
        }
        return element;
      }
      catch (e) {
        wdyrStore.options.consoleLog('whyDidYouRender error in createElement. Please file a bug at https://github.com/welldone-software/why-did-you-render/issues.', {
          errorInfo: {
            error: e,
            componentNameOrComponent: origType,
            rest,
            options: wdyrStore.options,
          },
        });
      }
    }

    return wdyrStore.origCreateElement.apply(React, [origType, ...rest]);
  };
  Object.assign(React.createElement, wdyrStore.origCreateElement);

  React.createFactory = type => {
    const factory = React.createElement.bind(null, type);
    factory.type = type;
    return factory;
  };
  Object.assign(React.createFactory, wdyrStore.origCreateFactory);

  React.cloneElement = (...args) => {
    wdyrStore.ownerBeforeElementCreation = getCurrentOwner();
    const element = wdyrStore.origCloneElement.apply(React, args);
    if (wdyrStore.options.logOwnerReasons) {
      storeOwnerData(element);
    }

    return element;
  };
  Object.assign(React.cloneElement, wdyrStore.origCloneElement);

  trackHooksIfNeeded();

  React.__REVERT_WHY_DID_YOU_RENDER__ = () => {
    Object.assign(React, {
      createElement: wdyrStore.origCreateElement,
      createFactory: wdyrStore.origCreateFactory,
      cloneElement: wdyrStore.origCloneElement,
    });

    wdyrStore.componentsMap = null;

    const hooksToRevert = [
      ...Object.keys(hooksConfig).map(hookName => [React, hookName]),
      ...wdyrStore.options.trackExtraHooks,
    ];
    hooksToRevert.forEach(([hookParent, hookName]) => {
      if (hookParent[hookName].originalHook) {
        hookParent[hookName] = hookParent[hookName].originalHook;
      }
    });

    delete React.__REVERT_WHY_DID_YOU_RENDER__;
    delete React.__IS_WDYR__;
  };

  return React;
}
