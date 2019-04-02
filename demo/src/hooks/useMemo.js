/* eslint-disable no-console */
import React from 'react'
import ReactDom from 'react-dom'

export default {
  description: 'Hooks - useMemo',
  fn({domElement, whyDidYouRender}){
    whyDidYouRender(React)

    const ComponentWithMemo = React.memo(({count}) => {
      console.log('render ComponentWithMemo')
      const countObj = React.useMemo(() => ({a: 'a'}))
      return (
        <p>count: {count} JSON: {JSON.stringify(countObj)}</p>
      )
    })
    ComponentWithMemo.displayName = 'ComponentWithMemo'
    ComponentWithMemo.whyDidYouRender = true

    function Main(){
      const [count, setCount] = React.useState(0)

      return (
        <div>
          <button onClick={() => setCount(count + 1)}>
            Current count: {count}
          </button>
          <ComponentWithMemo count={count}/>
        </div>
      )
    }

    ReactDom.render(<Main/>, domElement)
  }
}
