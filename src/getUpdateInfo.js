import findObjectsDifferences from './findObjectsDifferences';
import wdyrStore from './wdyrStore';

function getOwnerDifferences({ prevOwnerData, nextOwnerData }) {
  if (!prevOwnerData || !nextOwnerData) {
    return false;
  }

  // in strict mode a re-render happens twice as opposed to the initial render that happens once.
  const prevOwnerDataHooks = prevOwnerData.hooksInfo.length === nextOwnerData.hooksInfo.length * 2 ?
    prevOwnerData.hooksInfo.slice(prevOwnerData.hooksInfo.length / 2) :
    prevOwnerData.hooksInfo;

  const hookDifferences = prevOwnerDataHooks.map(({ hookName, result }, i) => ({
    hookName,
    differences: findObjectsDifferences(result, nextOwnerData.hooksInfo[i].result, { shallow: false }),
  }));

  return {
    propsDifferences: findObjectsDifferences(prevOwnerData.props, nextOwnerData.props),
    stateDifferences: findObjectsDifferences(prevOwnerData.state, nextOwnerData.state),
    hookDifferences: hookDifferences.length > 0 ? hookDifferences : false,
  };
}

function getUpdateReason(prevProps, prevState, prevHookResult, nextProps, nextState, nextHookResult) {
  const prevOwnerData = wdyrStore.ownerDataMap.get(prevProps);
  const nextOwnerData = wdyrStore.ownerDataMap.get(nextProps);

  return {
    propsDifferences: findObjectsDifferences(prevProps, nextProps),
    stateDifferences: findObjectsDifferences(prevState, nextState),
    hookDifferences: findObjectsDifferences(prevHookResult, nextHookResult, { shallow: false }),
    ownerDifferences: getOwnerDifferences({ prevOwnerData, nextOwnerData }),
  };
}

export default function getUpdateInfo({ Component, displayName, hookName, prevProps, prevState, prevHookResult, nextProps, nextState, nextHookResult }) {
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
    reason: getUpdateReason(prevProps, prevState, prevHookResult, nextProps, nextState, nextHookResult),
  };
}
