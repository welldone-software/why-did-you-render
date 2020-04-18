import React from 'react'
import * as rtl from '@testing-library/react'
import whyDidYouRender from 'index'
import {diffTypes} from '../src/consts'

let updateInfos = []

beforeEach(() => {
  updateInfos = []
  whyDidYouRender(React, {
    notifier: updateInfo => updateInfos.push(updateInfo),
    logOwnerReasons: true
  })
})

afterEach(() => {
  if(React.__REVERT_WHY_DID_YOU_RENDER__){
    React.__REVERT_WHY_DID_YOU_RENDER__()
  }
})

function createOwners(Child){
  const Owner = () => <Child />

  class ClassOwner extends React.Component{
    state = {a: 1}
    componentDidMount(){
      this.setState({a: 2})
    }

    render(){
      return <Child />
    }
  }

  function HooksOwner(){
    /* eslint-disable no-unused-vars */
    const [a, setA] = React.useState(1)
    const [b, setB] = React.useState(1)
    /* eslint-enable */
    React.useEffect(() => {
      setA(2)
      setB(2)
    }, [])

    return <Child />
  }

  return {Owner, ClassOwner, HooksOwner}
}

describe('logOwnerReasons - function child', () => {
  const Child = () => null
  Child.whyDidYouRender = true

  const {Owner, ClassOwner, HooksOwner} = createOwners(Child)

  test('owner props changed', () => {
    const {rerender} = rtl.render(<Owner a={1}/>)
    rerender(<Owner a={2} />)

    expect(updateInfos).toHaveLength(1)
    expect(updateInfos[0].reason).toEqual({
      propsDifferences: [],
      stateDifferences: false,
      hookDifferences: false,
      ownerDifferences: {
        propsDifferences: [{
          pathString: 'a',
          diffType: diffTypes.different,
          prevValue: 1,
          nextValue: 2
        }],
        stateDifferences: false,
        hookDifferences: []
      }
    })
  })

  test('owner state changed', () => {
    rtl.render(<ClassOwner/>)

    expect(updateInfos).toHaveLength(1)
    expect(updateInfos[0].reason).toEqual({
      propsDifferences: [],
      stateDifferences: false,
      hookDifferences: false,
      ownerDifferences: {
        propsDifferences: false,
        stateDifferences: [{
          pathString: 'a',
          diffType: diffTypes.different,
          prevValue: 1,
          nextValue: 2
        }],
        hookDifferences: []
      }
    })
  })

  test('owner hooks changed', () => {
    rtl.render(<HooksOwner/>)

    expect(updateInfos).toHaveLength(1)
    expect(updateInfos[0].reason).toEqual({
      propsDifferences: [],
      stateDifferences: false,
      hookDifferences: false,
      ownerDifferences: {
        propsDifferences: false,
        stateDifferences: false,
        hookDifferences: [
          {
            hookName: 'useState',
            differences: [{
              pathString: '',
              diffType: diffTypes.different,
              prevValue: 1,
              nextValue: 2
            }]
          },
          {
            hookName: 'useState',
            differences: [{
              pathString: '',
              diffType: diffTypes.different,
              prevValue: 1,
              nextValue: 2
            }]
          }
        ]
      }
    })
  })
})


describe('logOwnerReasons - class child', () => {
  class Child extends React.Component{
    static whyDidYouRender = true
    render(){
      return null
    }
  }

  const {Owner, ClassOwner, HooksOwner} = createOwners(Child)

  test('owner props changed', () => {
    const {rerender} = rtl.render(<Owner a={1}/>)
    rerender(<Owner a={2} />)

    expect(updateInfos).toHaveLength(1)
    expect(updateInfos[0].reason).toEqual({
      propsDifferences: [],
      stateDifferences: false,
      hookDifferences: false,
      ownerDifferences: {
        propsDifferences: [{
          pathString: 'a',
          diffType: diffTypes.different,
          prevValue: 1,
          nextValue: 2
        }],
        stateDifferences: false,
        hookDifferences: []
      }
    })
  })

  test('owner state changed', () => {
    rtl.render(<ClassOwner/>)

    expect(updateInfos).toHaveLength(1)
    expect(updateInfos[0].reason).toEqual({
      propsDifferences: [],
      stateDifferences: false,
      hookDifferences: false,
      ownerDifferences: {
        propsDifferences: false,
        stateDifferences: [{
          pathString: 'a',
          diffType: diffTypes.different,
          prevValue: 1,
          nextValue: 2
        }],
        hookDifferences: []
      }
    })
  })

  test('owner hooks changed', () => {
    rtl.render(<HooksOwner/>)

    expect(updateInfos).toHaveLength(1)
    expect(updateInfos[0].reason).toEqual({
      propsDifferences: [],
      stateDifferences: false,
      hookDifferences: false,
      ownerDifferences: {
        propsDifferences: false,
        stateDifferences: false,
        hookDifferences: [
          {
            hookName: 'useState',
            differences: [{
              pathString: '',
              diffType: diffTypes.different,
              prevValue: 1,
              nextValue: 2
            }]
          },
          {
            hookName: 'useState',
            differences: [{
              pathString: '',
              diffType: diffTypes.different,
              prevValue: 1,
              nextValue: 2
            }]
          }
        ]
      }
    })
  })
})
