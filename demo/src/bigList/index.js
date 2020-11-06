import React from 'react'
import ReactDom from 'react-dom'
import times from 'lodash.times'

export default {
  description: 'Big List (Main Demo)',
  fn({domElement, whyDidYouRender}){
    whyDidYouRender(React)

    class BigListPureComponent extends React.PureComponent{
      static whyDidYouRender = {customName: 'BigList'}
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

    const bigListStyle = {width: '100%'} // eslint-disable-line no-unused-vars

    // Notice, that unlike the huge list, we don't track Main's re-renders because we don't care about it's re-renders.
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
            {/* this is how you can prevent re-renders: */}
            {/* <BigListPureComponent style={bigListStyle}/> */}
            <BigListPureComponent style={{width: '100%'}}/>
          </div>
        )
      }
    }

    ReactDom.render(<Main/>, domElement)
  }
}
