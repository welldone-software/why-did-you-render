/* eslint-disable no-console */
import React, {useState} from 'react'
import ReactDom from 'react-dom'

export default {
  description: 'Hooks',
  fn({domElement, whyDidYouRender}){
    whyDidYouRender(React)

    function BrokenHooksComponent(){
      console.log('render BrokenHooksComponent')
      const [numObj, setNumObj] = useState({num: 0})
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

    function CorrectHooksComponent(){
      console.log('render CorrectHooksComponent')
      const [num, setNum] = useState(0)
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

    function Main(){
      return (
        <div>
          <BrokenHooksComponent />
          <br />
          <CorrectHooksComponent />
        </div>
      )
    }

    ReactDom.render(<Main/>, domElement)
  }
}
