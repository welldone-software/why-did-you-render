import findObjectsDifferences from '~/findObjectsDifferences';
import { diffTypes } from '~/consts';

describe('findObjectsDifferences shallow', () => {
  test('for empty values', () => {
    const prev = null;
    const next = null;
    const diffs = findObjectsDifferences(prev, next);
    expect(diffs).toEqual(false);
  });

  test('For no differences', () => {
    const prev = { prop: 'value' };
    const next = prev;
    const diffs = findObjectsDifferences(prev, next);
    expect(diffs).toEqual(false);
  });

  test('For prev empty value', () => {
    const prev = null;
    const next = { prop: 'value' };
    const diffs = findObjectsDifferences(prev, next);
    expect(diffs).toEqual([
      {
        pathString: 'prop',
        diffType: diffTypes.different,
        prevValue: undefined,
        nextValue: 'value',
      },
    ]);
  });

  test('For next empty value', () => {
    const prev = { prop: 'value' };
    const next = null;
    const diffs = findObjectsDifferences(prev, next);
    expect(diffs).toEqual([
      {
        pathString: 'prop',
        diffType: diffTypes.different,
        prevValue: 'value',
        nextValue: undefined,
      },
    ]);
  });

  test('For objects different by reference but equal by value', () => {
    const prop2 = { a: 'a' };
    const prev = { prop: 'value', prop2 };
    const next = { prop: 'value', prop2 };
    const diffs = findObjectsDifferences(prev, next);
    expect(diffs).toEqual([]);
  });

  test('For props inside the object different by reference but equal by value', () => {
    const prev = { prop: { a: 'a' } };
    const next = { prop: { a: 'a' } };
    const diffs = findObjectsDifferences(prev, next);
    expect(diffs).toEqual([
      {
        pathString: 'prop',
        diffType: diffTypes.deepEquals,
        prevValue: prev.prop,
        nextValue: next.prop,
      },
    ]);
  });

  test('For functions inside the object with the same name', () => {
    const prev = { fn: function something() {} };
    const next = { fn: function something() {} };
    const diffs = findObjectsDifferences(prev, next);
    expect(diffs).toEqual([
      {
        pathString: 'fn',
        diffType: diffTypes.function,
        prevValue: prev.fn,
        nextValue: next.fn,
      },
    ]);
  });

  test('Mix of differences inside the objects', () => {
    const prev = { prop: 'value', prop2: { a: 'a' }, prop3: 'AA', fn: function something() {} };
    const next = { prop: 'value', prop2: { a: 'a' }, prop3: 'ZZ', fn: function something() {} };
    const diffs = findObjectsDifferences(prev, next);
    expect(diffs).toEqual([
      {
        pathString: 'prop2',
        diffType: diffTypes.deepEquals,
        prevValue: prev.prop2,
        nextValue: next.prop2,
      },
      {
        pathString: 'prop3',
        diffType: diffTypes.different,
        prevValue: prev.prop3,
        nextValue: next.prop3,
      },
      {
        pathString: 'fn',
        diffType: diffTypes.function,
        prevValue: prev.fn,
        nextValue: next.fn,
      },
    ]);
  });
});

describe('findObjectsDifferences not shallow', () => {
  test('for empty values', () => {
    const prev = null;
    const next = null;
    const diffs = findObjectsDifferences(prev, next, { shallow: false });
    expect(diffs).toEqual(false);
  });

  test('For no differences', () => {
    const prev = { prop: 'value' };
    const next = prev;
    const diffs = findObjectsDifferences(prev, next, { shallow: false });
    expect(diffs).toEqual(false);
  });

  test('For prev empty value', () => {
    const prev = null;
    const next = { prop: 'value' };
    const diffs = findObjectsDifferences(prev, next, { shallow: false });
    expect(diffs).toEqual([
      {
        pathString: '',
        diffType: diffTypes.different,
        prevValue: null,
        nextValue: { prop: 'value' },
      },
    ]);
  });

  test('For next empty value', () => {
    const prev = { prop: 'value' };
    const next = null;
    const diffs = findObjectsDifferences(prev, next, { shallow: false });
    expect(diffs).toEqual([
      {
        pathString: '',
        diffType: diffTypes.different,
        prevValue: { prop: 'value' },
        nextValue: null,
      },
    ]);
  });

  test('For objects different by reference but equal by value', () => {
    const prop2 = { a: 'a' };
    const prev = { prop: 'value', prop2 };
    const next = { prop: 'value', prop2 };
    const diffs = findObjectsDifferences(prev, next, { shallow: false });
    expect(diffs).toEqual([
      {
        pathString: '',
        diffType: diffTypes.deepEquals,
        prevValue: { prop: 'value', prop2 },
        nextValue: { prop: 'value', prop2 },
      },
    ]);
  });

  test('For sets with same values', () => {
    const prev = new Set([1, 2, 3, { foo: 'bar' }]);
    const next = new Set([1, 2, 3, { foo: 'bar' }]);
    const diffs = findObjectsDifferences(prev, next, { shallow: false });
    expect(diffs).toEqual([{
      pathString: '',
      diffType: diffTypes.deepEquals,
      prevValue: prev,
      nextValue: next,
    }]);
  });

  test('For sets with different values', () => {
    const prevValues = [1, 2, 3];
    const nextValues = [4, 5, 6];
    const prev = new Set(prevValues);
    const next = new Set(nextValues);
    const diffs = findObjectsDifferences(prev, next, { shallow: false });
    expect(diffs).toEqual([
      {
        pathString: '.values()[2]',
        diffType: diffTypes.different,
        prevValue: prevValues[2],
        nextValue: nextValues[2],
      },
      {
        pathString: '.values()[1]',
        diffType: diffTypes.different,
        prevValue: prevValues[1],
        nextValue: nextValues[1],
      },
      {
        pathString: '.values()[0]',
        diffType: diffTypes.different,
        prevValue: prevValues[0],
        nextValue: nextValues[0],
      },
      {
        pathString: '',
        diffType: diffTypes.different,
        prevValue: prev,
        nextValue: next,
      },
    ]);
  });

  test('For sets with different length', () => {
    const prev = new Set([1, 2, 3]);
    const next = new Set([1, 2, 3, 4]);
    const diffs = findObjectsDifferences(prev, next, { shallow: false });
    expect(diffs).toEqual([
      {
        pathString: '',
        diffType: diffTypes.different,
        prevValue: prev,
        nextValue: next,
      },
    ]);
  });

  test('For maps with same entries', () => {
    const prev = new Map([[1, 'a'], [2, 'b'], [3, 'c'], [{ foo: 'bar' }, { bar: 'foo' }]]);
    const next = new Map([[1, 'a'], [2, 'b'], [3, 'c'], [{ foo: 'bar' }, { bar: 'foo' }]]);
    const diffs = findObjectsDifferences(prev, next, { shallow: false });
    expect(diffs).toEqual([{
      pathString: '',
      diffType: diffTypes.deepEquals,
      prevValue: prev,
      nextValue: next,
    }]);
  });

  test('For maps with different keys', () => {
    const prevEntries = [[1, ''], [2, ''], [3, '']];
    const nextEntries = [[4, ''], [5, ''], [6, '']];
    const prev = new Map(prevEntries);
    const next = new Map(nextEntries);
    const diffs = findObjectsDifferences(prev, next, { shallow: false });
    expect(diffs).toEqual([
      {
        pathString: '.keys()[2]',
        diffType: diffTypes.different,
        prevValue: prevEntries[2][0],
        nextValue: nextEntries[2][0],
      },
      {
        pathString: '.keys()[1]',
        diffType: diffTypes.different,
        prevValue: prevEntries[1][0],
        nextValue: nextEntries[1][0],
      },
      {
        pathString: '.keys()[0]',
        diffType: diffTypes.different,
        prevValue: prevEntries[0][0],
        nextValue: nextEntries[0][0],
      },
      {
        pathString: '',
        diffType: diffTypes.different,
        prevValue: prev,
        nextValue: next,
      },
    ]);
  });

  test('For maps with different values', () => {
    const prevEntries = [[1, 'a'], [2, 'b'], [3, 'c']];
    const nextEntries = [[1, 'd'], [2, 'e'], [3, 'f']];
    const prev = new Map(prevEntries);
    const next = new Map(nextEntries);
    const diffs = findObjectsDifferences(prev, next, { shallow: false });
    expect(diffs).toEqual([
      {
        pathString: '.values()[2]',
        diffType: diffTypes.different,
        prevValue: prevEntries[2][1],
        nextValue: nextEntries[2][1],
      },
      {
        pathString: '.values()[1]',
        diffType: diffTypes.different,
        prevValue: prevEntries[1][1],
        nextValue: nextEntries[1][1],
      },
      {
        pathString: '.values()[0]',
        diffType: diffTypes.different,
        prevValue: prevEntries[0][1],
        nextValue: nextEntries[0][1],
      },
      {
        pathString: '',
        diffType: diffTypes.different,
        prevValue: prev,
        nextValue: next,
      },
    ]);
  });

  test('For maps with different length', () => {
    const prev = new Map([[1, 1], [2, 2], [3, 3]]);
    const next = new Map([[1, 1], [2, 2], [3, 3], [4, 4]]);
    const diffs = findObjectsDifferences(prev, next, { shallow: false });
    expect(diffs).toEqual([
      {
        pathString: '',
        diffType: diffTypes.different,
        prevValue: prev,
        nextValue: next,
      },
    ]);
  });
});
