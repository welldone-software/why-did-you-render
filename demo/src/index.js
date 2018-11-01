import React from 'react'
import {render} from 'react-dom'
import propsChanges from './propsChanges'
import stateChanges from './stateChanges'
import bothChanges from './bothChanges'
import noChanges from './noChanges'
import bigList from './bigList'

const domMenuElement = document.getElementById('menu')
const domDemoElement = document.getElementById('demo')

class ChangeDemoLink extends React.Component{
  constructor(props){
    super(props)
    this.onClick = this.onClick.bind(this)
  }
  componentDidMount(){
    if(!location.hash){
      location.hash = bigList.name
      setTimeout(() => window.location.reload())
    }
    else if(location.hash.substr(1) === this.props.route.name){
      setTimeout(() => this.props.route(domDemoElement))
    }
  }
  onClick(){
    setTimeout(() => window.location.reload())
  }
  render(){
    const{route, children} = this.props
    return (
      <li>
        <a href={`#${route.name}`} onClick={this.onClick}>
          {children}
        </a>
      </li>
    )
  }
}

const Menu = () => (
  <div>
    <h1>whyDidYouRender Demos</h1>
    <h3>
      <span style={{backgroundColor: '#dad'}}>
        &nbsp;Open the console&nbsp;
      </span>
      &nbsp;and click on one of the demos
    </h3>
    <ul>
      <ChangeDemoLink route={bigList}>Big List (Main Demo)</ChangeDemoLink>
      <ChangeDemoLink route={propsChanges}>Props Changes</ChangeDemoLink>
      <ChangeDemoLink route={stateChanges}>State Changes</ChangeDemoLink>
      <ChangeDemoLink route={bothChanges}>State And Props Changes</ChangeDemoLink>
      <ChangeDemoLink route={noChanges}>State And Props The Same</ChangeDemoLink>
    </ul>
  </div>
)

render(<Menu/>, domMenuElement)
