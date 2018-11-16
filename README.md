# Why Did You Render

[![npm version](https://badge.fury.io/js/%40welldone-software%2Fwhy-did-you-render.svg)](https://badge.fury.io/js/%40welldone-software%2Fwhy-did-you-render)

`why-did-you-render` monkey patches `React` to notify you about avoidable re-renders.

For example, when you pass `style={{width: '100%'}}` to a big pure component and make it always re-render:

![](https://raw.githubusercontent.com/welldone-software/why-did-you-render/master/demo-image.png)

It can also help you to simply track when and why a certain component re-renders.

You can read more about the library
[>> HERE <<](https://medium.com/welldone-software/why-did-you-render-mr-big-pure-react-component-2a36dd86996f).

And about common fixing scenarios this library can hep with
[>> HERE <<](https://medium.com/welldone-software/why-did-you-render-mr-big-pure-react-component-part-2-common-fixing-scenarios-667bfdec2e0f).

You can test the library in it's sandbox [>> HERE <<](https://goo.gl/Gqb7wb).

### Setup
```
npm install @welldone-software/why-did-you-render --save
```
or
```
yarn add @welldone-software/why-did-you-render
```

### Usage
Execute `whyDidYouRender` with `React` as it's first argument.
```js
import React from 'react';

if (process.env.NODE_ENV !== 'production') {
  const whyDidYouRender = require('@welldone-software/why-did-you-render');
  whyDidYouRender(React);
}
```
Pass a second argument (options) with `include: [RegExp, ...]` to specify
what components to track for unnecessary re-renders:
```js
  whyDidYouRender(React, {include: [/pure/]});
```
Or mark the components you want to be notified about their re-renders with `whyDidYouRender` like so:
```js
class BigListPureComponent extends React.PureComponent {
  static whyDidYouRender = true
  render(){
    return (
      //some heavy render you want to ensure doesn't happen if its not neceserry
    )
  }
}
```
Or like this:
```js
const BigListPureComponent = props => (
  <div>
    //some heavy component you want to ensure doesn't happen if its not neceserry
  </div>
)
BigListPureComponent.whyDidYouRender = true
```
You can also pass an object to specify when do you want to be notified.
We currently support only one option: `logOnDifferentValues`
This option will notify you about the component's re-renders even if these which
occurred because of changed props/state:
```js
BigListPureComponent.whyDidYouRender = {logOnDifferentValues: true}

```
### Common Fixing Scenarios
A list of common fixing scenarios can be found here: [>> HERE <<](https://goo.gl/hnfMPb)

### Options
Optionally you can pass in options as a second parameter. The following options are available:
- `include: [RegExp, ...]` (`null` by default)
- `exclude: [RegExp, ...]` (`null` by default)
- `logOnDifferentValues: false`
- `onlyLogs: false`
- `collapseGroups: false`
- `notifier: ({Component, displayName, prevProps, prevState, nextProps, nextState, reason, options}) => void`

#### include / exclude
You can include or exclude tracking for re-renders for components
by their displayName with the `include` and `exclude` options.

*Notice: **exclude** takes priority over both `include` and `whyDidYouRender` statics on components.*
```js
whyDidYouRender(React, { include: [/^pure/], exclude: [/^Connect/] });
```

#### logOnDifferentValues
Normally, you only want notifications about component re-renders when their props and state
are the same, because it means these re-renders could of been avoided. But you can also track
all re-renders, even on different state/props.

```js
render(<BigListPureComponent a={1}/>)
render(<BigListPureComponent a={2}/>)
// this will only cause whyDidYouRender notifications for {logOnDifferentValues: true}
```

#### onlyLogs
If you don't want to use `console.group` to group logs by component, you can print them as simple logs.

#### collapseGroups
Grouped logs can start collapsed:

#### notifier
A notifier can be provided if the default one does not suite your needs.

### Credit

Inspired by the following previous work:

https://github.com/maicki/why-did-you-update which i had the chance to maintain for some time.

https://github.com/garbles/why-did-you-update where [A deep dive into React perf debugging](http://benchling.engineering/deep-dive-react-perf-debugging/) is credited for the idea.

### License

This library is [MIT licensed](./LICENSE).
