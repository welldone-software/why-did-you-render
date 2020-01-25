/* eslint-disable no-unused-vars */
import './types'
import React from 'react'
import * as Redux from 'react-redux'
import whyDidYouRender from '@welldone-software/why-did-you-render';

/* SHOULD ERROR because bad trackExtraHooks was provided (second argument should be string) */
whyDidYouRender(React, {trackExtraHooks: [[Redux, Redux.useSelector]]});
whyDidYouRender(React, {trackExtraHooks: [[Redux, 'useSelector']]});

interface Props {
  str: string
}

const FunctionalComponent: React.FC<Props> = ({str}) => <div>{str}</div>
FunctionalComponent.whyDidYouRender = true
FunctionalComponent.whyDidYouRender = {collapseGroups: true}
/* SHOULD ERROR because we use an unsupported whyDidYouRender prop */
FunctionalComponent.whyDidYouRender = {nonWDYRProp: true}
/* SHOULD ERROR because whyDidYouRender shouldn't be a string */
FunctionalComponent.whyDidYouRender = 'a'

const MemoFunctionalComponent = React.memo<Props>(({str}) => <div>{str}</div>)
MemoFunctionalComponent.whyDidYouRender = true
MemoFunctionalComponent.whyDidYouRender = {collapseGroups: true}
/* THIS SHOULD ERROR because we use an unsupported whyDidYouRender prop */
MemoFunctionalComponent.whyDidYouRender = {nonWDYRProp: true}
/* THIS SHOULD ERROR because whyDidYouRender shouldn't be a string */
MemoFunctionalComponent.whyDidYouRender = 'a'

/* SHOULD ERROR because bad trackExtraHooks was provided (second argument should be string) */
FunctionalComponent.whyDidYouRender = {trackExtraHooks: [[Redux, Redux.useSelector]]}
FunctionalComponent.whyDidYouRender = {trackExtraHooks: [[Redux, 'useSelector']]}

class RegularClassComponent extends React.Component<Props>{
  render(){
    const {str} = this.props
    return (
      <div>{str}</div>
    )
  }
}

class ClassComponentWithBooleanWDYR extends React.Component<Props>{
  static whyDidYouRender = true
  render(){
    const {str} = this.props
    return (
      <div>{str}</div>
    )
  }
}

class ClassComponentWithObjWDYR extends React.Component<Props>{
  static whyDidYouRender = {collapseGroups: true}
  render(){
    const {str} = this.props
    return (
      <div>{str}</div>
    )
  }
}

class ErroredClassComponentWithNonWDYRProp extends React.Component<Props>{
  /* SHOULD ERROR because we use an unsupported whyDidYouRender prop */
  static whyDidYouRender = {nonWDYRProp: 'a'}
  render(){
    const {str} = this.props
    return (
      <div>{str}</div>
    )
  }
}

class ErroredClassComponentWithStringWDYR extends React.Component<Props>{
  /* THIS SHOULD ERROR because whyDidYouRender shouldn't be a string */
  static whyDidYouRender = 'a'
  render(){
    const {str} = this.props
    return (
      <div>{str}</div>
    )
  }
}

class ErrorousClassComponentWithTrackExtraHooks extends React.Component<Props>{
  static whyDidYouRender = {
    collapseGroups: true,
    trackExtraHooks: [[Redux, Redux.useSelector] as WhyDidYouRender.ExtraHookToTrack]
  }
  render(){
    const {str} = this.props
    return (
      <div>{str}</div>
    )
  }
}

class ClassComponentWithTrackExtraHooks extends React.Component<Props>{
  static whyDidYouRender = {
    collapseGroups: true,
    trackExtraHooks: [[Redux, 'useSelector'] as WhyDidYouRender.ExtraHookToTrack]
  }
  render(){
    const {str} = this.props
    return (
      <div>{str}</div>
    )
  }
}

class PureClassComponentWithBooleanWDYR extends React.PureComponent<Props>{
  static whyDidYouRender = true
  render(){
    const {str} = this.props
    return (
      <div>{str}</div>
    )
  }
}

class PureClassComponentWithObjWDYR extends React.PureComponent<Props>{
  static whyDidYouRender = {collapseGroups: true}
  render(){
    const {str} = this.props
    return (
      <div>{str}</div>
    )
  }
}

class ErroredPureClassComponentWithNonWDYRProp extends React.PureComponent<Props>{
  /* SHOULD ERROR because we use an unsupported whyDidYouRender prop */
  static whyDidYouRender = {nonWDYRProp: 'a'}
  render(){
    const {str} = this.props
    return (
      <div>{str}</div>
    )
  }
}

class ErroredPureClassComponentWithStringWDYR extends React.PureComponent<Props>{
  /* THIS SHOULD ERROR because whyDidYouRender shouldn't be a string */
  static whyDidYouRender = 'a'
  render(){
    const {str} = this.props
    return (
      <div>{str}</div>
    )
  }
}
