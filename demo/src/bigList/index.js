import {times} from 'lodash'

export default {
  name: 'Big List (Main Demo)',
  fn({React, render, domElement, whyDidYouRender}){
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

    const bigListStyle = {width: '100%'} // eslint-disable-line no-unused-vars

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

    render(<Main/>, domElement)
  }
}
