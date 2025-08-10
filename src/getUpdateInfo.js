import findObjectsDifferences from './findObjectsDifferences';
import wdyrStore from './wdyrStore';

function getOwnerDifferences(prevOwner, nextOwner) {
  if (!prevOwner || !nextOwner) {
    return false;
  }

  const prevOwnerData = wdyrStore.ownerDataMap.get(prevOwner);
  const nextOwnerData = wdyrStore.ownerDataMap.get(nextOwner);

  if (!prevOwnerData || !nextOwnerData) {
    return false;
  }

  try {
    // in strict mode a re-render happens twice as opposed to the initial render that happens once.
    const prevOwnerDataHooks = prevOwnerData.hooksInfo.length === nextOwnerData.hooksInfo.length * 2 ?
      prevOwnerData.hooksInfo.slice(prevOwnerData.hooksInfo.length / 2) :
      prevOwnerData.hooksInfo;

    const prevHooks = Array.isArray(prevOwnerDataHooks) ? prevOwnerDataHooks : [];
    const nextHooks = Array.isArray(nextOwnerData?.hooksInfo) ? nextOwnerData.hooksInfo : [];
    
    // Handle different array lengths safely
    const hookDifferences = [];
    const maxLen = Math.max(prevHooks.length, nextHooks.length);
    
    for (let i = 0; i < maxLen; i++) {
      const prev = prevHooks[i];
      const next = nextHooks[i];
      
      if (!prev && next) {
        // Hook was added
        hookDifferences.push({
          hookName: next.hookName,
          differences: {change: 'added'},
        });
      } else if (prev && !next) {
        // Hook was removed
        hookDifferences.push({
          hookName: prev.hookName,
          differences: {change: 'removed'},
        });
      } else if (prev && next) {
        // Both exist, compare them
        let differences;
        try {
          differences = findObjectsDifferences(prev.result, next.result, {shallow: false});
        } catch {
          differences = {error: 'diff_failed'};
        }
        hookDifferences.push({
          hookName: prev.hookName,
          differences,
        });
      }
    }

    return {
      propsDifferences: findObjectsDifferences(prevOwnerData.props, nextOwnerData.props),
      stateDifferences: findObjectsDifferences(prevOwnerData.state, nextOwnerData.state),
      hookDifferences: hookDifferences.length > 0 ? hookDifferences : false,
    };
  }
  catch(e) {
    wdyrStore.options.consoleLog('whyDidYouRender error in getOwnerDifferences. Please file a bug at https://github.com/welldone-software/why-did-you-render/issues.', {
      errorInfo: {
        error: e,
        prevOwner,
        nextOwner,
        options: wdyrStore.options,
      },
    });
    return false;
  }
}

function getUpdateReason(prevOwner, prevProps, prevState, prevHookResult, nextOwner, nextProps, nextState, nextHookResult) {
  return {
    propsDifferences: findObjectsDifferences(prevProps, nextProps),
    stateDifferences: findObjectsDifferences(prevState, nextState),
    hookDifferences: findObjectsDifferences(prevHookResult, nextHookResult, {shallow: false}),
    ownerDifferences: getOwnerDifferences(prevOwner, nextOwner),
  };
}

export default function getUpdateInfo({Component, displayName, hookName, prevOwner, nextOwner, prevProps, prevState, prevHookResult, nextProps, nextState, nextHookResult}) {
  return {
    Component,
    displayName,
    hookName,
    prevOwner,
    prevProps,
    prevState,
    prevHookResult,
    nextOwner,
    nextProps,
    nextState,
    nextHookResult,
    reason: getUpdateReason(prevOwner, prevProps, prevState, prevHookResult, nextOwner, nextProps, nextState, nextHookResult),
    ownerDataMap: wdyrStore.ownerDataMap,
  };
}
