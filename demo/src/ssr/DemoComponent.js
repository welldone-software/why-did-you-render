const React = require('react')
const createReactClass = require('create-react-class')

const DemoComponent = createReactClass({
  displayName: 'DemoComponent',
  render(){
    return React.createElement('div', {}, this.props.text)
  }
})

DemoComponent.whyDidYouRender = true

module.exports = DemoComponent
