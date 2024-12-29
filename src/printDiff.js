import {sortBy, groupBy} from 'lodash';

import calculateDeepEqualDiffs from './calculateDeepEqualDiffs';
import {diffTypesDescriptions} from './consts';

export default function printDiff(value1, value2, {pathString, consoleLog}) {
  const diffs = calculateDeepEqualDiffs(value1, value2, pathString, {detailed: true});

  const keysLength = Math.max(...diffs.map(diff => diff.pathString.length)) + 2;

  Object.entries(groupBy(sortBy(diffs, 'pathString'), 'diffType'))
    .forEach(([diffType, diffs]) => {
      consoleLog(`%c${diffTypesDescriptions[diffType]}:`, 'text-decoration: underline; color: blue;');
      diffs.forEach(diff => {
        consoleLog(`${diff.pathString}:`.padEnd(keysLength, ' '), diff.prevValue);
      });
    });
}
