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

    const hookDifferences = prevOwnerDataHooks.map(({hookName, result}, i) => ({
      hookName,
      differences: findObjectsDifferences(result, nextOwnerData.hooksInfo[i].result, {shallow: false}),
    }));

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
    prevProps,
    prevState,
    prevHookResult,
    nextProps,
    nextState,
    nextHookResult,
    reason: getUpdateReason(prevOwner, prevProps, prevState, prevHookResult, nextOwner, nextProps, nextState, nextHookResult),
  };
}
