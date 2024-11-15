/**
 * @typedef {import('../types').ObjectDifference} ObjectDifference
 * @typedef {import('../types').OwnerData} OwnerData
 * @typedef {import('../types').OwnerDifferences} OwnerDifferences
 */
import findObjectsDifferences from './findObjectsDifferences';
import wdyrStore from './wdyrStore';

/**
 * 
 * @param {{ prevOwnerData: OwnerData; nextOwnerData: OwnerData }} param
 * @returns {OwnerDifferences}
 */
function getOwnerDifferences({ prevOwnerData, nextOwnerData }) {
  if (!prevOwnerData || !nextOwnerData) {
    return false;
  }

  // in strict mode prevOwnerData might be twice as lengthy because of double renders
  const prevOwnerDataHooks = prevOwnerData.hooks.length === nextOwnerData.hooks.length * 2 ?
    prevOwnerData.hooks.slice(prevOwnerData.hooks.length / 2) :
    prevOwnerData.hooks;

  const hookDifferences = prevOwnerDataHooks.map(({ hookName, result }, i) => ({
    hookName,
    differences: findObjectsDifferences(result, nextOwnerData.hooks[i].result, { shallow: false }),
  }));

  return {
    propsDifferences: findObjectsDifferences(prevOwnerData.props, nextOwnerData.props),
    stateDifferences: findObjectsDifferences(prevOwnerData.state, nextOwnerData.state),
    hookDifferences: hookDifferences.length > 0 ? hookDifferences : false,
  };
}

function getUpdateReason(prevProps, prevState, prevHook, nextProps, nextState, nextHook) {
  const prevOwnerData = wdyrStore.ownerDataMap.get(prevProps);
  const nextOwnerData = wdyrStore.ownerDataMap.get(nextProps);

  return {
    propsDifferences: findObjectsDifferences(prevProps, nextProps),
    stateDifferences: findObjectsDifferences(prevState, nextState),
    hookDifferences: findObjectsDifferences(prevHook, nextHook, { shallow: false }),
    ownerDifferences: getOwnerDifferences({ prevOwnerData, nextOwnerData }),
  };
}

export default function getUpdateInfo({ Component, displayName, hookName, prevProps, prevState, prevHook, nextProps, nextState, nextHook }) {
  return {
    Component,
    displayName,
    hookName,
    prevProps,
    prevState,
    prevHook,
    nextProps,
    nextState,
    nextHook,
    reason: getUpdateReason(prevProps, prevState, prevHook, nextProps, nextState, nextHook),
  };
}
