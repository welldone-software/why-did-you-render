import React from 'react'
import './types.d.ts'

interface Props {
  str: string
}

const FunctionalComponent: React.FC<Props> = ({str}) => <div>{str}</div>
FunctionalComponent.whyDidYouRender = true
FunctionalComponent.whyDidYouRender = {
  collapseGroups: true
}
// should error:
// FunctionalComponent.whyDidYouRender = 'a'

// eslint-disable-next-line no-unused-vars
class ClassComponent1 extends React.Component<Props>{
  static whyDidYouRender = true
  render(){
    const {str} = this.props
    return (
      <div>{str}</div>
    )
  }
}

// eslint-disable-next-line no-unused-vars
class ClassComponent2 extends React.Component<Props>{
  static whyDidYouRender = {
    collapseGroups: true
  }
  render(){
    const {str} = this.props
    return (
      <div>{str}</div>
    )
  }
}

// eslint-disable-next-line no-unused-vars
class ClassComponent3 extends React.Component<Props>{
  // this should error
  // static whyDidYouRender = 'a'
  render(){
    const {str} = this.props
    return (
      <div>{str}</div>
    )
  }
}
