/* eslint-disable no-console */
import React from 'react'
import ReactDom from 'react-dom'

export default {
  description: 'Hooks - useContext',
  fn({domElement, whyDidYouRender}){
    whyDidYouRender(React)

    const MyContext = React.createContext({c: 'c'})

    function ComponentWithContextHook(){
      const currentContext = React.useContext(MyContext)
      return (
        <p>{currentContext.c}</p>
      )
    }
    ComponentWithContextHook.whyDidYouRender = true

    const MemoizedComponentWithContextHook = React.memo(ComponentWithContextHook)
    MemoizedComponentWithContextHook.whyDidYouRender = true

    const MemoizedComponent = React.memo(() => <div>{'Memoized component that doesn\'t use context'}</div>)

    function Main(){
      const [currentState, setCurrentState] = React.useState({c: 'context value'})

      React.useLayoutEffect(() => {
        setCurrentState({c: 'context value'})
      }, [])

      return (
        <MyContext.Provider value={currentState}>
          <h3>
            {`While somehow weird, we have two notifications for "ComponentWithContextHook"
            since it is re-rendered regardless of context changes because "Main" is
            re-rendered and ComponentWithContextHook is not pure`}
          </h3>
          <div>
            <ComponentWithContextHook />
            <MemoizedComponentWithContextHook />
            <MemoizedComponent />
          </div>
        </MyContext.Provider>
      )
    }

    ReactDom.render(<Main/>, domElement)
  }
}
