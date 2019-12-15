/* eslint-disable no-console */
import React from 'react'
import ReactDom from 'react-dom'

export default {
  description: 'Hooks - useMemo',
  fn({domElement, whyDidYouRender}){
    whyDidYouRender(React)

    const ComponentWithAlwaysNewMemoResult = React.memo(({count}) => {
      console.log('render ComponentWithAlwaysNewMemoResult')
      const countObj = React.useMemo(() => ({a: 'a'}), [count])
      return (
        <p>count: {count} JSON: {JSON.stringify(countObj)}</p>
      )
    })
    ComponentWithAlwaysNewMemoResult.displayName = 'ComponentWithAlwaysNewMemoResult'
    ComponentWithAlwaysNewMemoResult.whyDidYouRender = true

    const ComponentWithSameMemoResult = React.memo(({count}) => {
      console.log('render ComponentWithSameMemoResult')
      const countObj = React.useMemo(() => ({a: 'a'}), [])
      return (
        <p>count: {count} JSON: {JSON.stringify(countObj)}</p>
      )
    })
    ComponentWithSameMemoResult.displayName = 'ComponentWithSameMemoResult'
    ComponentWithSameMemoResult.whyDidYouRender = true

    function Main(){
      const [count, setCount] = React.useState(0)

      return (
        <div>
          <button onClick={() => setCount(count + 1)}>
            Current count: {count}
          </button>
          <ComponentWithAlwaysNewMemoResult count={count}/>
          <ComponentWithSameMemoResult count={count}/>
        </div>
      )
    }

    ReactDom.render(<Main/>, domElement)
  }
}
