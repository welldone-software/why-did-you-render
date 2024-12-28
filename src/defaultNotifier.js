import wdyrStore from './wdyrStore';

import { diffTypes, diffTypesDescriptions } from './consts';
import printDiff from './printDiff';

const moreInfoUrl = 'http://bit.ly/wdyr02';
const moreInfoHooksUrl = 'http://bit.ly/wdyr3';

let inHotReload = false;

function shouldLog(reason, Component) {
  if (inHotReload) {
    return false;
  }

  if (wdyrStore.options.logOnDifferentValues) {
    return true;
  }

  if (Component.whyDidYouRender && Component.whyDidYouRender.logOnDifferentValues) {
    return true;
  }

  const hasDifferentValues = ((
    reason.propsDifferences &&
    reason.propsDifferences.some(diff => diff.diffType === diffTypes.different)
  ) || (
    reason.stateDifferences &&
    reason.stateDifferences.some(diff => diff.diffType === diffTypes.different)
  ) || (
    reason.hookDifferences &&
    reason.hookDifferences.some(diff => diff.diffType === diffTypes.different)
  ));

  return !hasDifferentValues;
}

function logDifference({ Component, displayName, hookName, prefixMessage, diffObjType, differences, values }) {
  if (differences && differences.length > 0) {
    wdyrStore.options.consoleLog({ [displayName]: Component }, `${prefixMessage} of ${diffObjType} changes:`);
    differences.forEach(({ pathString, diffType, prevValue, nextValue }) => {
      function diffFn() {
        printDiff(prevValue, nextValue, { pathString, consoleLog: wdyrStore.options.consoleLog });
      }
      wdyrStore.options.consoleGroup(
        `%c${diffObjType === 'hook' ? `[hook ${hookName} result]` : `${diffObjType}.`}%c${pathString}%c`,
        `color:${wdyrStore.options.diffNameColor};`, `color:${wdyrStore.options.diffPathColor};`, 'color:default;'
      );
      wdyrStore.options.consoleLog(
        `${diffTypesDescriptions[diffType]}. (more info at ${hookName ? moreInfoHooksUrl : moreInfoUrl})`,
      );
      wdyrStore.options.consoleLog({ [`prev ${pathString}`]: prevValue }, '!==', { [`next ${pathString}`]: nextValue });
      if (diffType === diffTypes.deepEquals) {
        wdyrStore.options.consoleLog({ 'For detailed diff, right click the following fn, save as global, and run: ': diffFn });
      }
      wdyrStore.options.consoleGroupEnd();
    });
  }
  else if (differences) {
    wdyrStore.options.consoleLog(
      { [displayName]: Component },
      `${prefixMessage} the ${diffObjType} object itself changed but its values are all equal.`,
      diffObjType === 'props' ?
        'This could have been avoided by making the component pure, or by preventing its father from re-rendering.' :
        'This usually means this component called setState when no changes in its state actually occurred.',
      `More info at ${moreInfoUrl}`
    );
    wdyrStore.options.consoleLog(`prev ${diffObjType}:`, values.prev, ' !== ', values.next, `:next ${diffObjType}`);
  }
}

export default function defaultNotifier(updateInfo) {
  const { Component, displayName, hookName, prevProps, prevState, prevHookResult, nextProps, nextState, nextHookResult, reason } = updateInfo;

  if (!shouldLog(reason, Component, wdyrStore.options)) {
    return;
  }

  wdyrStore.options.consoleGroup(`%c${displayName}`, `color: ${wdyrStore.options.titleColor};`);

  let prefixMessage = 'Re-rendered because';

  if (reason.propsDifferences) {
    logDifference({
      Component,
      displayName,
      prefixMessage,
      diffObjType: 'props',
      differences: reason.propsDifferences,
      values: { prev: prevProps, next: nextProps },
    });
    prefixMessage = 'And because';
  }

  if (reason.stateDifferences) {
    logDifference({
      Component,
      displayName,
      prefixMessage,
      diffObjType: 'state',
      differences: reason.stateDifferences,
      values: { prev: prevState, next: nextState },
    });
  }

  if (reason.hookDifferences) {
    logDifference({
      Component,
      displayName,
      prefixMessage,
      diffObjType: 'hook',
      differences: reason.hookDifferences,
      values: { prev: prevHookResult, next: nextHookResult },
      hookName,
    });
  }

  if (reason.propsDifferences && reason.ownerDifferences) {
    const prevOwnerData = wdyrStore.ownerDataMap.get(prevProps);
    const nextOwnerData = wdyrStore.ownerDataMap.get(nextProps);

    wdyrStore.options.consoleGroup(`Rendered by ${nextOwnerData.displayName}`);
    let prefixMessage = 'Re-rendered because';

    if (reason.ownerDifferences.propsDifferences) {
      logDifference({
        Component: nextOwnerData.Component,
        displayName: nextOwnerData.displayName,
        prefixMessage,
        diffObjType: 'props',
        differences: reason.ownerDifferences.propsDifferences,
        values: { prev: prevOwnerData.props, next: nextOwnerData.props },
      });
      prefixMessage = 'And because';
    }

    if (reason.ownerDifferences.stateDifferences) {
      logDifference({
        Component: nextOwnerData.Component,
        displayName: nextOwnerData.displayName,
        prefixMessage,
        diffObjType: 'state',
        differences: reason.ownerDifferences.stateDifferences,
        values: { prev: prevOwnerData.state, next: nextOwnerData.state },
      });
    }

    if (reason.ownerDifferences.hookDifferences) {
      reason.ownerDifferences.hookDifferences.forEach(({ hookName, differences }, i) =>
        logDifference({
          Component: nextOwnerData.Component,
          displayName: nextOwnerData.displayName,
          prefixMessage,
          diffObjType: 'hook',
          differences,
          values: { prev: prevOwnerData.hooksInfo[i].result, next: nextOwnerData.hooksInfo[i].result },
          hookName,
        })
      );
    }
    wdyrStore.options.consoleGroupEnd();
  }

  if (!reason.propsDifferences && !reason.stateDifferences && !reason.hookDifferences) {
    wdyrStore.options.consoleLog(
      { [displayName]: Component },
      'Re-rendered although props and state objects are the same.',
      'This usually means there was a call to this.forceUpdate() inside the component.',
      `more info at ${moreInfoUrl}`
    );
  }

  wdyrStore.options.consoleGroupEnd();
}

export function createDefaultNotifier(hotReloadBufferMs) {
  if (hotReloadBufferMs) {
    if (typeof(module) !== 'undefined' && module.hot && module.hot.addStatusHandler) {
      module.hot.addStatusHandler(status => {
        if (status === 'idle') {
          inHotReload = true;
          setTimeout(() => {
            inHotReload = false;
          }, hotReloadBufferMs);
        }
      });
    }
  }

  return defaultNotifier;
}
