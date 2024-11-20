import {
  isArray,
  isPlainObject,
  isDate,
  isRegExp,
  isError,
  isFunction,
  isSet,
  isMap,
  has,
  uniq,
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

function isGetter(obj, prop) {
  return !!Object.getOwnPropertyDescriptor(obj, prop)['get'];
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
    const setLength = a.size;
    if (setLength !== b.size) {
      return trackDiff(new Set(a), new Set(b), diffsAccumulator, pathString, diffTypes.different);
    }

    const setItemDiffs = [];
    let numberOfDeepEqualsValues = 0;
    const aValues = [...a.values()];
    const bValues = [...b.values()];
    for (let i = setLength; i--; i > 0) {
      const diffEquals = accumulateDeepEqualDiffs(aValues[i], bValues[i], setItemDiffs, `${pathString}.values()[${i}]`, { detailed });
      if (diffEquals) {
        numberOfDeepEqualsValues++;
      }
    }

    if (detailed || numberOfDeepEqualsValues !== setLength) {
      diffsAccumulator.push(...setItemDiffs);
    }

    if (numberOfDeepEqualsValues === setLength) {
      return trackDiff(new Set(a), new Set(b), diffsAccumulator, pathString, diffTypes.deepEquals);
    }

    return trackDiff(new Set(a), new Set(b), diffsAccumulator, pathString, diffTypes.different);
  }

  if (isMap(a) && isMap(b)) {
    const mapLength = a.size;
    if (mapLength !== b.size) {
      return trackDiff(new Map(a), new Map(b), diffsAccumulator, pathString, diffTypes.different);
    }

    const mapKeysDiffs = [];
    let numberOfDeepEqualsKeys = 0;
    const aKeys = [...a.keys()];
    const bKeys = [...b.keys()];
    for (let i = mapLength; i--; i > 0) {
      const diffEquals = accumulateDeepEqualDiffs(aKeys[i], bKeys[i], mapKeysDiffs, `${pathString}.keys()[${i}]`, { detailed });
      if (diffEquals) {
        numberOfDeepEqualsKeys++;
      }
    }

    if (detailed || numberOfDeepEqualsKeys !== mapLength) {
      diffsAccumulator.push(...mapKeysDiffs);
    }

    if (numberOfDeepEqualsKeys !== mapLength) {
      return trackDiff(new Map(a), new Map(b), diffsAccumulator, pathString, diffTypes.different);
    }

    const mapValuesDiffs = [];
    let numberOfDeepEqualsValues = 0;
    const aValues = [...a.values()];
    const bValues = [...b.values()];
    for (let i = mapLength; i--; i > 0) {
      const diffEquals = accumulateDeepEqualDiffs(aValues[i], bValues[i], mapValuesDiffs, `${pathString}.values()[${i}]`, { detailed });
      if (diffEquals) {
        numberOfDeepEqualsValues++;
      }
    }

    if (detailed || numberOfDeepEqualsValues !== mapLength) {
      diffsAccumulator.push(...mapValuesDiffs);
    }

    if (numberOfDeepEqualsValues === mapLength) {
      return trackDiff(new Map(a), new Map(b), diffsAccumulator, pathString, diffTypes.deepEquals);
    }

    return trackDiff(new Map(a), new Map(b), diffsAccumulator, pathString, diffTypes.different);
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
    const aKeys = Object.getOwnPropertyNames(a);
    const bKeys = Object.getOwnPropertyNames(b);

    const allKeys = uniq([...aKeys, ...bKeys]);

    const clonedA = isPlainObject(a) ? { ...a } : a;
    const clonedB = isPlainObject(b) ? { ...b } : b;

    if (allKeys.length !== aKeys.length || allKeys.length !== bKeys.length) {
      return trackDiff(clonedA, clonedB, diffsAccumulator, pathString, diffTypes.different);
    }

    const relevantKeys = allKeys.filter(key => {
      // do not compare the stack as it differ even though the errors are identical.
      if (key === 'stack' && isError(a)) {
        return false;
      }

      // getters checking is causing too much problems because of how it's used in js.
      // not only getters can throw errors, they also cause side effects in many cases.
      if (isGetter(a, key)) {
        return false;
      }

      return true;
    });

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
