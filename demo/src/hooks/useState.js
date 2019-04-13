/* eslint-disable no-console */
import React from 'react'
import ReactDom from 'react-dom'

export default {
  description: 'Hooks - useState',
  fn({domElement, whyDidYouRender}){
    whyDidYouRender(React)

    function BrokenHooksComponent(){
      console.log('render BrokenHooksComponent')
      const [numObj, setNumObj] = React.useState({num: 0})
      return (
        <>
          <p>{'Will cause a re-render since {num: 0} !== {num: 0}'}</p>
          <button onClick={() => setNumObj({num: 0})}>
            Will Cause a Re-render: {numObj.num}
          </button>
        </>
      )
    }
    BrokenHooksComponent.whyDidYouRender = true

    const BrokenHooksPureComponent = React.memo(BrokenHooksComponent)
    BrokenHooksPureComponent.displayName = 'BrokenHooksPureComponent'
    BrokenHooksPureComponent.whyDidYouRender = true

    function CorrectHooksComponent(){
      console.log('render CorrectHooksComponent')
      const [num, setNum] = React.useState(0)
      return (
        <>
          <p>{'Will NOT cause a re-render since 0 === 0'}</p>
          <button onClick={() => setNum(0)}>
            Will NOT Cause a Re-render: {num}
          </button>
        </>
      )
    }
    CorrectHooksComponent.whyDidYouRender = true

    function useNumState(defState){
      const [state, setState] = React.useState(defState)

      function smartSetState(newState){
        if(state.num !== newState.num){
          setState(newState)
        }
      }

      return [state, smartSetState]
    }

    function SmartHooksComponent(){
      console.log('render SmartHooksComponent')
      const [numObj, setNumObj] = useNumState({num: 0})
      return (
        <>
          <p>{'Will NOT cause a re-render setState won\'t be called'}</p>
          <button onClick={() => setNumObj({num: 0})}>
            Will NOT Cause a Re-render: {numObj.num}
          </button>
        </>
      )
    }
    SmartHooksComponent.whyDidYouRender = true

    function Main(){
      return (
        <div>
          BrokenHooksPureComponent
          <BrokenHooksPureComponent />
          <br />
          <br />
          BrokenHooksComponent
          <BrokenHooksComponent />
          <br />
          <br />
          CorrectHooksComponent
          <CorrectHooksComponent />
          <br />
          <br />
          SmartHooksComponent
          <SmartHooksComponent />
        </div>
      )
    }

    ReactDom.render(<Main/>, domElement)
  }
}
