import findObjectsDifferences from './findObjectsDifferences'
import {diffTypes} from './consts'

describe('findObjectsDifferences', () => {
  test('for empty values', () => {
    const prev = null
    const next = null
    const diffs = findObjectsDifferences(prev, next)
    expect(diffs).toEqual(false)
  })

  test('For no differences', () => {
    const prev = {prop: 'value'}
    const next = prev
    const diffs = findObjectsDifferences(prev, next)
    expect(diffs).toEqual(false)
  })

  test('For prev empty value', () => {
    const prev = null
    const next = {prop: 'value'}
    const diffs = findObjectsDifferences(prev, next)
    expect(diffs).toEqual([
      {
        pathString: 'prop',
        diffType: diffTypes.different,
        prevValue: undefined,
        nextValue: 'value'
      }
    ])
  })

  test('For next empty value', () => {
    const prev = {prop: 'value'}
    const next = null
    const diff = findObjectsDifferences(prev, next)
    expect(diff).toEqual([
      {
        pathString: 'prop',
        diffType: diffTypes.different,
        prevValue: 'value',
        nextValue: undefined
      }
    ])
  })

  test('For objects different by reference but equal by value', () => {
    const prop2 = {a: 'a'}
    const prev = {prop: 'value', prop2}
    const next = {prop: 'value', prop2}
    const diff = findObjectsDifferences(prev, next)
    expect(diff).toEqual([])
  })

  test('For props inside the object different by reference but equal by value', () => {
    const prev = {prop: {a: 'a'}}
    const next = {prop: {a: 'a'}}
    const diff = findObjectsDifferences(prev, next)
    expect(diff).toEqual([
      {
        pathString: 'prop',
        diffType: diffTypes.deepEquals,
        prevValue: prev.prop,
        nextValue: next.prop
      }
    ])
  })

  test('For functions inside the object with the same name', () => {
    const prev = {fn: function something(){}}
    const next = {fn: function something(){}}
    const diff = findObjectsDifferences(prev, next)
    expect(diff).toEqual([
      {
        pathString: 'fn',
        diffType: diffTypes.function,
        prevValue: prev.fn,
        nextValue: next.fn
      }
    ])
  })

  test('Mix of differences inside the objects', () => {
    const prev = {prop: 'value', prop2: {a: 'a'}, prop3: 'AA', fn: function something(){}}
    const next = {prop: 'value', prop2: {a: 'a'}, prop3: 'ZZ', fn: function something(){}}
    const diff = findObjectsDifferences(prev, next)
    expect(diff).toEqual([
      {
        pathString: 'prop2',
        diffType: diffTypes.deepEquals,
        prevValue: prev.prop2,
        nextValue: next.prop2
      },
      {
        pathString: 'prop3',
        diffType: diffTypes.different,
        prevValue: prev.prop3,
        nextValue: next.prop3
      },
      {
        pathString: 'fn',
        diffType: diffTypes.function,
        prevValue: prev.fn,
        nextValue: next.fn
      }
    ])
  })
})
