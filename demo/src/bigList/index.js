/* eslint-disable no-console */
import React from 'react'
import {times} from 'lodash'
import {render} from 'react-dom'
import whyDidYouRender from '../whyDidYouRender'

export default function bigList(domElement){
  whyDidYouRender(React)

  class BigListPureComponent extends React.PureComponent{
    static whyDidYouRender = true
    render(){
      return (
        <div style={this.props.style}>
          <h2>BigListPureComponent</h2>
          <div>
            {times(3000).map(n => <div key={n}>Element #{n}</div>)}
          </div>
        </div>
      )
    }
  }

  class Main extends React.Component{
    state = {count: 0}
    render(){
      return (
        <div style={{height: '100%', width: '100%', display: 'flex', flexDirection: 'column'}}>
          <h1>Big List (Main Demo)</h1>
          <p>
            {'Open the console and notice how the heavy list re-renders on every click on "Increase!" even though it\'s props are the same.'}
          </p>
          <div>
            <button onClick={() => {this.setState({count: this.state.count + 1})}}>
              Increase!
            </button>
          </div>
          <div>
            <span>Count: {this.state.count}</span>
          </div>
          <BigListPureComponent style={{width: '100%'}}/>
        </div>
      )
    }
  }

  render(<Main/>, domElement)
}
