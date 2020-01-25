import React from 'react'
import ReactDom from 'react-dom'
import _ from  'lodash'
import {createStore} from 'redux'
import * as Redux from 'react-redux'

export default {
  description: 'React Redux',
  fn({domElement, whyDidYouRender}){
    whyDidYouRender(React, {trackExtraHooks: [
      [Redux, 'useSelector']
    ]})

    const useDispatch = Redux.useDispatch
    const useSelector = Redux.useSelector
    const Provider = Redux.Provider

    const ConnectedSimpleComponent = () => {
      const a = useSelector(state => state.a)
      const dispatch = useDispatch()

      return (
        <div>
          {`{a.b} is: ${a.b}`}
          <br/>
          <button onClick={() => dispatch({type: 'sameObj'})}>Same State</button>
          <button onClick={() => dispatch({type: 'deepEqlObj'})}>Deep Equal State</button>
          <button onClick={() => dispatch({type: 'randomObj'})}>Random Object</button>
        </div>
      )
    }

    ConnectedSimpleComponent.whyDidYouRender = true

    const initialState = {a: {b: 'c'}}
    const store = createStore((state = initialState, action) => {
      if(action.type === 'randomObj'){
        return {a: {b: `${Math.random()}`}}
      }
      if(action.type === 'deepEqlObj'){
        return _.cloneDeep(state)
      }
      return state
    })

    const Main = () => (
      <Provider store={store}>
        <ConnectedSimpleComponent/>
      </Provider>
    )

    ReactDom.render(<Main/>, domElement)
  }
}
