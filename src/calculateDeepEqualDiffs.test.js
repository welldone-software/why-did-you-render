import React from 'react'
import calculateDeepEqualDiffs from './calculateDeepEqualDiffs'
import {diffTypes} from './consts'

describe('calculateDeepEqualDiffs', () => {
  test('same', () => {
    const prevValue = {a: 'b'}
    const nextValue = prevValue

    const diffs = calculateDeepEqualDiffs(prevValue, nextValue)

    expect(diffs).toEqual([])
  })

  test('not deep equal', () => {
    const prevValue = {a: 'b'}
    const nextValue = {a: 'c'}

    const diffs = calculateDeepEqualDiffs(prevValue, nextValue)

    expect(diffs).toEqual([
      {
        pathString: '.a',
        prevValue: 'b',
        nextValue: 'c',
        diffType: diffTypes.different
      },
      {
        pathString: '',
        prevValue,
        nextValue,
        diffType: diffTypes.different
      }
    ])
  })

  test('simple deep', () => {
    const prevValue = {a: 'b'}
    const nextValue = {a: 'b'}

    const diffs = calculateDeepEqualDiffs(prevValue, nextValue)

    expect(diffs).toEqual([
      {
        pathString: '',
        prevValue,
        nextValue,
        diffType: diffTypes.deepEquals
      }
    ])
  })

  test('nested object deep equals', () => {
    const prevValue = {a: {b: 'c'}}
    const nextValue = {a: {b: 'c'}}

    const diffs = calculateDeepEqualDiffs(prevValue, nextValue)

    expect(diffs).toEqual([
      {
        pathString: '.a',
        prevValue: prevValue.a,
        nextValue: nextValue.a,
        diffType: diffTypes.deepEquals
      },
      {
        pathString: '',
        prevValue,
        nextValue,
        diffType: diffTypes.deepEquals
      }
    ])
  })

  test('nested array deep equals', () => {
    const prevValue = {a: {b: ['c']}}
    const nextValue = {a: {b: ['c']}}

    const diffs = calculateDeepEqualDiffs(prevValue, nextValue)

    expect(diffs).toEqual([
      {
        pathString: '.a.b',
        prevValue: prevValue.a.b,
        nextValue: nextValue.a.b,
        diffType: diffTypes.deepEquals
      },
      {
        pathString: '.a',
        prevValue: prevValue.a,
        nextValue: nextValue.a,
        diffType: diffTypes.deepEquals
      },
      {
        pathString: '',
        prevValue,
        nextValue,
        diffType: diffTypes.deepEquals
      }
    ])
  })

  test('date', () => {
    const now = new Date()
    const now2 = new Date(now)

    const prevValue = {a: {b: [now]}}
    const nextValue = {a: {b: [now2]}}

    const diffs = calculateDeepEqualDiffs(prevValue, nextValue)

    expect(diffs).toEqual([
      {
        pathString: '.a.b[0]',
        prevValue: prevValue.a.b[0],
        nextValue: nextValue.a.b[0],
        diffType: diffTypes.date
      },
      {
        pathString: '.a.b',
        prevValue: prevValue.a.b,
        nextValue: nextValue.a.b,
        diffType: diffTypes.deepEquals
      },
      {
        pathString: '.a',
        prevValue: prevValue.a,
        nextValue: nextValue.a,
        diffType: diffTypes.deepEquals
      },
      {
        pathString: '',
        prevValue,
        nextValue,
        diffType: diffTypes.deepEquals
      }
    ])
  })

  test('regular expression', () => {
    const regEx = /c/i
    const regEx2 = /c/i

    const prevValue = {a: {b: [regEx]}}
    const nextValue = {a: {b: [regEx2]}}

    const diffs = calculateDeepEqualDiffs(prevValue, nextValue)

    expect(diffs).toEqual([
      {
        pathString: '.a.b[0]',
        prevValue: prevValue.a.b[0],
        nextValue: nextValue.a.b[0],
        diffType: diffTypes.regex
      },
      {
        pathString: '.a.b',
        prevValue: prevValue.a.b,
        nextValue: nextValue.a.b,
        diffType: diffTypes.deepEquals
      },
      {
        pathString: '.a',
        prevValue: prevValue.a,
        nextValue: nextValue.a,
        diffType: diffTypes.deepEquals
      },
      {
        pathString: '',
        prevValue,
        nextValue,
        diffType: diffTypes.deepEquals
      }
    ])
  })

  test('dom elements', () => {
    const element = document.createElement('div')
    const element2 = document.createElement('div')

    const prevValue = {a: element}
    const nextValue = {a: element2}

    const diffs = calculateDeepEqualDiffs(prevValue, nextValue)

    expect(diffs).toEqual([
      {
        pathString: '.a',
        prevValue: prevValue.a,
        nextValue: nextValue.a,
        diffType: diffTypes.different
      },
      {
        pathString: '',
        prevValue,
        nextValue,
        diffType: diffTypes.different
      }
    ])
  })

  test('equal react elements', () => {
    const tooltip = <div>hi!</div>

    const prevValue = {a: tooltip}
    const nextValue = {a: tooltip}

    const diffs = calculateDeepEqualDiffs(prevValue, nextValue)

    expect(diffs).toEqual([
      {
        pathString: '',
        prevValue,
        nextValue,
        diffType: diffTypes.deepEquals
      }
    ])
  })


  test('simple react elements', () => {
    const tooltip = <div>hi!</div>
    const tooltip2 = <div>hi!</div>

    const prevValue = {a: tooltip}
    const nextValue = {a: tooltip2}

    const diffs = calculateDeepEqualDiffs(prevValue, nextValue)

    expect(diffs).toEqual([
      {
        pathString: '.a',
        prevValue: prevValue.a,
        nextValue: nextValue.a,
        diffType: diffTypes.reactElement
      },
      {
        pathString: '',
        prevValue,
        nextValue,
        diffType: diffTypes.deepEquals
      }
    ])
  })

  test('react class component instance', () => {
    class MyComponent extends React.Component{
      render(){
        return <div>hi!</div>
      }
    }

    const tooltip = <MyComponent/>
    const tooltip2 = <MyComponent/>

    const prevValue = {a: tooltip}
    const nextValue = {a: tooltip2}

    const diffs = calculateDeepEqualDiffs(prevValue, nextValue)

    expect(diffs).toEqual([
      {
        pathString: '.a',
        prevValue: prevValue.a,
        nextValue: nextValue.a,
        diffType: diffTypes.reactElement
      },
      {
        pathString: '',
        prevValue,
        nextValue,
        diffType: diffTypes.deepEquals
      }
    ])
  })

  test('react functional component instance', () => {
    const MyFunctionalComponent = () => (
      <div>hi!</div>
    )

    const tooltip = <MyFunctionalComponent/>
    const tooltip2 = <MyFunctionalComponent/>

    const prevValue = {a: tooltip}
    const nextValue = {a: tooltip2}

    const diffs = calculateDeepEqualDiffs(prevValue, nextValue)

    expect(diffs).toEqual([
      {
        pathString: '.a',
        prevValue: prevValue.a,
        nextValue: nextValue.a,
        diffType: diffTypes.reactElement
      },
      {
        pathString: '',
        prevValue,
        nextValue,
        diffType: diffTypes.deepEquals
      }
    ])
  })

  test('functions', () => {
    const fn = function something(){}
    const fn2 = function something(){}

    const prevValue = {fn}
    const nextValue = {fn: fn2}

    const diffs = calculateDeepEqualDiffs(prevValue, nextValue)

    expect(diffs).toEqual([
      {
        pathString: '.fn',
        prevValue: prevValue.fn,
        nextValue: nextValue.fn,
        diffType: diffTypes.function
      },
      {
        pathString: '',
        prevValue,
        nextValue,
        diffType: diffTypes.deepEquals
      }
    ])
  })

  test('inline functions', () => {
    const prevValue = {a: {fn: () => {}}}
    const nextValue = {a: {fn: () => {}}}

    const diffs = calculateDeepEqualDiffs(prevValue, nextValue)

    expect(diffs).toEqual([
      {
        pathString: '.a.fn',
        prevValue: prevValue.a.fn,
        nextValue: nextValue.a.fn,
        diffType: diffTypes.function
      },
      {
        pathString: '.a',
        prevValue: prevValue.a,
        nextValue: nextValue.a,
        diffType: diffTypes.deepEquals
      },
      {
        pathString: '',
        prevValue,
        nextValue,
        diffType: diffTypes.deepEquals
      }
    ])
  })

  test('mix', () => {
    const prevValue = {a: {fn: () => {}}, b: [{tooltip: <div>hi</div>}]}
    const nextValue = {a: {fn: () => {}}, b: [{tooltip: <div>hi</div>}]}

    const diffs = calculateDeepEqualDiffs(prevValue, nextValue)

    expect(diffs).toEqual([
      {
        pathString: '.b[0].tooltip',
        prevValue: prevValue.b[0].tooltip,
        nextValue: nextValue.b[0].tooltip,
        diffType: diffTypes.reactElement
      },
      {
        pathString: '.b[0]',
        prevValue: prevValue.b[0],
        nextValue: nextValue.b[0],
        diffType: diffTypes.deepEquals
      },
      {
        pathString: '.b',
        prevValue: prevValue.b,
        nextValue: nextValue.b,
        diffType: diffTypes.deepEquals
      },
      {
        pathString: '.a.fn',
        prevValue: prevValue.a.fn,
        nextValue: nextValue.a.fn,
        diffType: diffTypes.function
      },
      {
        pathString: '.a',
        prevValue: prevValue.a,
        nextValue: nextValue.a,
        diffType: diffTypes.deepEquals
      },
      {
        pathString: '',
        prevValue,
        nextValue,
        diffType: diffTypes.deepEquals
      }
    ])
  })
})
