import { get, isFunction } from 'lodash';

import wdyrStore from './wdyrStore';

import normalizeOptions from './normalizeOptions';
import getDisplayName from './getDisplayName';
import getUpdateInfo from './getUpdateInfo';
import shouldTrack from './shouldTrack';

import patchClassComponent from './patches/patchClassComponent';
import patchFunctionalOrStrComponent from './patches/patchFunctionalOrStrComponent';
import patchMemoComponent from './patches/patchMemoComponent';
import patchForwardRefComponent from './patches/patchForwardRefComponent';

import { isForwardRefComponent, isMemoComponent, isReactClassComponent } from './utils';
import { dependenciesMap } from './calculateDeepEqualDiffs';

export { wdyrStore };

const initialHookValue = Symbol('initial-hook-value');

function trackHookChanges(hookName, { path: hookPath }, hookResult) {
  const nextHook = hookPath ? get(hookResult, hookPath) : hookResult;

  const renderNumberForTheHook = wdyrStore.React.useRef(true);

  // TODO: improve
  const isSecondCycleOfRenders = (
    wdyrStore.hooksPerRender[0] &&
    wdyrStore.hooksPerRender[0].renderNumberForTheHook !== renderNumberForTheHook.current
  );

  if (isSecondCycleOfRenders) {
    wdyrStore.hooksPerRender = [];
  }

  wdyrStore.hooksPerRender.push({ hookName, result: nextHook, renderNumberForTheHook: renderNumberForTheHook.current });

  renderNumberForTheHook.current++;

  const ComponentHookDispatchedFromInstance = (
    wdyrStore.React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED &&
    wdyrStore.React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner.current
  );

  const prevHookRef = wdyrStore.React.useRef(initialHookValue);

  if (!ComponentHookDispatchedFromInstance) {
    return hookResult;
  }

  const Component = ComponentHookDispatchedFromInstance.type.ComponentForHooksTracking || ComponentHookDispatchedFromInstance.type;
  const displayName = getDisplayName(Component);

  const isShouldTrack = shouldTrack(Component, { isHookChange: true });
  if (!isShouldTrack) {
    return hookResult;
  }

  const newPrevHookRef = prevHookRef.current;
  prevHookRef.current = hookResult;

  if (newPrevHookRef !== initialHookValue) {
    const notification = getUpdateInfo({
      Component: Component,
      displayName,
      hookName,
      prevHook: hookPath ? get(newPrevHookRef, hookPath) : newPrevHookRef,
      nextHook,
    });

    if (notification.reason.hookDifferences) {
      wdyrStore.options.notifier(notification);
    }
  }

  return hookResult;
}

function createPatchedComponent(Component, { displayName }) {
  if (isMemoComponent(Component)) {
    return patchMemoComponent(Component, { displayName });
  }

  if (isForwardRefComponent(Component)) {
    return patchForwardRefComponent(Component, { displayName });
  }

  if (isReactClassComponent(Component)) {
    return patchClassComponent(Component, { displayName });
  }

  return patchFunctionalOrStrComponent(Component, { displayName, isPure: false });
}

function getPatchedComponent(Component, { displayName }) {
  if (wdyrStore.componentsMap.has(Component)) {
    return wdyrStore.componentsMap.get(Component);
  }

  const WDYRPatchedComponent = createPatchedComponent(Component, { displayName });

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
  useState: { path: '0' },
  useReducer: { path: '0' },
  useContext: undefined,
  useMemo: { dependenciesPath: '1', dontReport: true },
  useCallback: { dependenciesPath: '1', dontReport: true },
};

export function storeOwnerData(element) {
  const OwnerInstance = wdyrStore.React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner.current;
  if (OwnerInstance) {
    const Component = OwnerInstance.type.ComponentForHooksTracking || OwnerInstance.type;
    const displayName = getDisplayName(Component);
    wdyrStore.ownerDataMap.set(element.props, {
      Component,
      displayName,
      props: OwnerInstance.pendingProps,
      state: OwnerInstance.stateNode ? OwnerInstance.stateNode.state : null,
      hooks: wdyrStore.hooksPerRender,
    });
  }
}

function resetHooksPerRenderIfNeeded() {
  // Intercept assignments to ReactCurrentOwner.current to reset hooksPerRender
  let currentOwner = null;
  if (wdyrStore.React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED) {
    Object.defineProperty(wdyrStore.React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, 'current', {
      get() {
        return currentOwner;
      },
      set(value) {
        currentOwner = value;
        wdyrStore.hooksPerRender = [];
      },
    });
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
      const newHookName = hookName[0].toUpperCase() + hookName.slice(1);

      const newHook = function(...args) {
        const hookResult = originalHook.call(this, ...args);
        const { dependenciesPath, dontReport } = hookTrackingConfig;
        if (dependenciesPath && isFunction(hookResult)) {
          dependenciesMap.set(hookResult, { hookName, deps: get(args, dependenciesPath) });
        }
        if (!dontReport) {
          trackHookChanges(hookName, hookTrackingConfig, hookResult);
        }
        return hookResult;
      };

      Object.defineProperty(newHook, 'name', { value: newHookName, writable: false });
      Object.assign(newHook, { originalHook });
      hookParent[hookName] = newHook;
    });
  }
}

export function getWDYRType(origType) {
  const isShouldTrack = (
    getIsSupportedComponentType(origType) &&
    shouldTrack(origType, { isHookChange: false })
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

  const WDYRPatchedComponent = getPatchedComponent(origType, { displayName });

  return WDYRPatchedComponent;
}

export default function whyDidYouRender(React, userOptions) {
  Object.assign(wdyrStore, {
    React,
    options: normalizeOptions(userOptions),
    origCreateElement: React.createElement,
    origCreateFactory: React.createFactory,
    origCloneElement: React.cloneElement,
    componentsMap: new WeakMap(),
  });

  resetHooksPerRenderIfNeeded();

  React.createElement = function(origType, ...rest) {
    const WDYRType = getWDYRType(origType);
    if (WDYRType) {
      try {
        const element = wdyrStore.origCreateElement.apply(React, [WDYRType, ...rest]);
        if (wdyrStore.options.logOwnerReasons) {
          storeOwnerData(element);
        }
        return element;
      }
      catch (e) {
        wdyrStore.options.consoleLog('whyDidYouRender error. Please file a bug at https://github.com/welldone-software/why-did-you-render/issues.', {
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
    const element = wdyrStore.origCloneElement.apply(React, args);
    if (wdyrStore.options.logOwnerReasons) {
      storeOwnerData(element);
    }

    return element;
  };
  Object.assign(React.cloneElement, wdyrStore.origCloneElement);

  trackHooksIfNeeded();

  React.isWDYR = true;

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
    delete React.isWDYR;
  };

  return React;
}
