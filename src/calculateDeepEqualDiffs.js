import {
  isArray, isPlainObject, isDate,
  isRegExp, isError, isFunction, isSet,
  has,
} from 'lodash';

import { diffTypes } from './consts';

const hasElementType = typeof Element !== 'undefined';

// copied from https://github.com/facebook/react/packages/shared/ReactSymbols.js
const hasSymbol = typeof Symbol === 'function' && Symbol.for;
const REACT_ELEMENT_TYPE = hasSymbol ? Symbol.for('react.element') : 0xeac7;
const isReactElement = object => object.$$typeof === REACT_ELEMENT_TYPE;
// end

function trackDiff(a, b, diffsAccumulator, pathString, diffType) {
  diffsAccumulator.push({
    diffType,
    pathString,
    prevValue: a,
    nextValue: b,
  });
  return diffType !== diffTypes.different;
}

export const dependenciesMap = new WeakMap();

function accumulateDeepEqualDiffs(a, b, diffsAccumulator, pathString = '', { detailed }) {
  if (a === b) {
    if (detailed) {
      trackDiff(a, b, diffsAccumulator, pathString, diffTypes.same);
    }
    return true;
  }

  if (!a || !b) {
    return trackDiff(a, b, diffsAccumulator, pathString, diffTypes.different);
  }

  if (isArray(a) && isArray(b)) {
    const arrayLength = a.length;
    if (arrayLength !== b.length) {
      return trackDiff([...a], [...b], diffsAccumulator, pathString, diffTypes.different);
    }

    const arrayItemDiffs = [];
    let numberOfDeepEqualsItems = 0;
    for (let i = arrayLength; i--; i > 0) {
      const diffEquals = accumulateDeepEqualDiffs(a[i], b[i], arrayItemDiffs, `${pathString}[${i}]`, { detailed });
      if (diffEquals) {
        numberOfDeepEqualsItems++;
      }
    }

    if (detailed || numberOfDeepEqualsItems !== arrayLength) {
      diffsAccumulator.push(...arrayItemDiffs);
    }

    if (numberOfDeepEqualsItems === arrayLength) {
      return trackDiff([...a], [...b], diffsAccumulator, pathString, diffTypes.deepEquals);
    }

    return trackDiff([...a], [...b], diffsAccumulator, pathString, diffTypes.different);
  }

  if (isSet(a) && isSet(b)) {
    if (a.size !== b.size) {
      return trackDiff(new Set(a), new Set(b), diffsAccumulator, pathString, diffTypes.different);
    }

    for (const valA of a) {
      if (!b.has(valA)) {
        return trackDiff(new Set(a), new Set(b), diffsAccumulator, pathString, diffTypes.different);
      }
    }

    return trackDiff(new Set(a), new Set(b), diffsAccumulator, pathString, diffTypes.deepEquals);
  }

  if (isDate(a) && isDate(b)) {
    return a.getTime() === b.getTime() ?
      trackDiff(new Date(a), new Date(b), diffsAccumulator, pathString, diffTypes.date) :
      trackDiff(new Date(a), new Date(b), diffsAccumulator, pathString, diffTypes.different);
  }

  if (isRegExp(a) && isRegExp(b)) {
    return a.toString() === b.toString() ?
      trackDiff(a, b, diffsAccumulator, pathString, diffTypes.regex) :
      trackDiff(a, b, diffsAccumulator, pathString, diffTypes.different);
  }

  if (hasElementType && a instanceof Element && b instanceof Element) {
    return trackDiff(a, b, diffsAccumulator, pathString, diffTypes.different);
  }

  if (isReactElement(a) && isReactElement(b)) {
    if (a.type !== b.type) {
      return trackDiff(a, b, diffsAccumulator, pathString, diffTypes.different);
    }

    const reactElementPropsAreDeepEqual =
      accumulateDeepEqualDiffs(a.props, b.props, [], `${pathString}.props`, { detailed });

    return reactElementPropsAreDeepEqual ?
      trackDiff(a, b, diffsAccumulator, pathString, diffTypes.reactElement) :
      trackDiff(a, b, diffsAccumulator, pathString, diffTypes.different);
  }

  if (isFunction(a) && isFunction(b)) {
    if (a.name !== b.name) {
      return trackDiff(a, b, diffsAccumulator, pathString, diffTypes.different);
    }

    const aDependenciesObj = dependenciesMap.get(a);
    const bDependenciesObj = dependenciesMap.get(b);

    if (aDependenciesObj && bDependenciesObj) {
      const dependenciesAreDeepEqual =
        accumulateDeepEqualDiffs(aDependenciesObj.deps, bDependenciesObj.deps, diffsAccumulator, `${pathString}:parent-hook-${aDependenciesObj.hookName}-deps`, { detailed });

      return dependenciesAreDeepEqual ?
        trackDiff(a, b, diffsAccumulator, pathString, diffTypes.function) :
        trackDiff(a, b, diffsAccumulator, pathString, diffTypes.different);
    }

    return trackDiff(a, b, diffsAccumulator, pathString, diffTypes.function);
  }

  if (typeof a === 'object' && typeof b === 'object' && Object.getPrototypeOf(a) === Object.getPrototypeOf(b)) {
    const allKeys = Object.getOwnPropertyNames(a);
    const clonedA = isPlainObject(a) ? { ...a } : a;
    const clonedB = isPlainObject(b) ? { ...b } : b;
    if (allKeys.length !== Object.getOwnPropertyNames(b).length) {
      return trackDiff(clonedA, clonedB, diffsAccumulator, pathString, diffTypes.different);
    }
    // Do not compare the stack as it might differ even though the errors are identical.
    const relevantKeys = isError(a) ? allKeys.filter(k => k !== 'stack') : allKeys;
    const keysLength = relevantKeys.length;

    for (let i = keysLength; i--; i > 0) {
      if (!has(b, relevantKeys[i])) {
        return trackDiff(clonedA, clonedB, diffsAccumulator, pathString, diffTypes.different);
      }
    }

    const objectValuesDiffs = [];
    let numberOfDeepEqualsObjectValues = 0;
    for (let i = keysLength; i--; i > 0) {
      const key = relevantKeys[i];
      const deepEquals = accumulateDeepEqualDiffs(a[key], b[key], objectValuesDiffs, `${pathString}.${key}`, { detailed });
      if (deepEquals) {
        numberOfDeepEqualsObjectValues++;
      }
    }

    if (detailed || numberOfDeepEqualsObjectValues !== keysLength) {
      diffsAccumulator.push(...objectValuesDiffs);
    }

    if (numberOfDeepEqualsObjectValues === keysLength) {
      return trackDiff(clonedA, clonedB, diffsAccumulator, pathString, diffTypes.deepEquals);
    }

    return trackDiff(clonedA, clonedB, diffsAccumulator, pathString, diffTypes.different);
  }

  return trackDiff(a, b, diffsAccumulator, pathString, diffTypes.different);
}

export default function calculateDeepEqualDiffs(a, b, initialPathString, { detailed = false } = {}) {
  try {
    const diffs = [];
    accumulateDeepEqualDiffs(a, b, diffs, initialPathString, { detailed });
    return diffs;
  } catch (error) {
    if ((error.message && error.message.match(/stack|recursion/i)) || (error.number === -2146828260)) {
      // warn on circular references, don't crash.
      // browsers throw different errors name and messages:
      // chrome/safari: "RangeError", "Maximum call stack size exceeded"
      // firefox: "InternalError", too much recursion"
      // edge: "Error", "Out of stack space"
      // eslint-disable-next-line no-console
      console.warn('Warning: why-did-you-render couldn\'t handle circular references in props.', error.name, error.message);
      return false;
    }
    throw error;
  }
}
