# Why Did You Render

[![npm version](https://badge.fury.io/js/%40welldone-software%2Fwhy-did-you-render.svg)](https://badge.fury.io/js/%40welldone-software%2Fwhy-did-you-render)

`why-did-you-render` monkey patches **`React`** to notify you about avoidable re-renders. (Works with **`React Native`** as well.)

For example, when you pass `style={{width: '100%'}}` to a big pure component and make it always re-render:

![](https://raw.githubusercontent.com/welldone-software/why-did-you-render/master/demo-image.png)

It can also help you to simply track when and why a certain component re-renders.

## Read More
* You can read more about the library [>> HERE <<](http://bit.ly/wdyr1).
* Part 2 - **Common fixing scenarios** this library can help to eliminate can be found [>> HERE <<](http://bit.ly/wdyr02).
* Part 3 - **React Hooks** - Understand and fix hooks issues [>> HERE <<](http://bit.ly/wdyr3).
* Part 4 - **React-Redux** - Understand and fix react-redux issues [>> HERE <<](http://bit.ly/wdyr04).

## Sandbox
You can test the library in the official sandbox [>> HERE <<](http://bit.ly/wdyr-sb).

## Setup
> The required React version for the library is **16.12** but it is expected to work with older versions as well.

> For versions before 16.8 turn off hooks support by using `trackHooks: false` in `whyDidYouRender`'s init options.*

```
npm install @welldone-software/why-did-you-render --save
```
or
```
yarn add @welldone-software/why-did-you-render
```

## Installation
Execute `whyDidYouRender` with `React` as its first argument **before any `React` element is created**.

```js
import React from 'react';

if (process.env.NODE_ENV !== 'production') {
  const whyDidYouRender = require('@welldone-software/why-did-you-render');
  whyDidYouRender(React);
}
```

## Usage
Mark any component you want to be notified about their "redundant" re-renders with `whyDidYouRender` like this:

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

You can also pass an object to specify more advanced settings:

```js
EnhancedMenu.whyDidYouRender = {
  logOnDifferentValues: true,
  customName: 'Menu'
}
```

- `logOnDifferentValues`:

  Normally, only re-renders that are caused by equal values in props / state trigger notifications:
  ```js
  render(<Menu a={1}/>)
  render(<Menu a={1}/>)
  ```
  This option will trigger notifications even if they occurred because of different props / state (Thus, because of "legit" re-renders):
  ```js
  render(<Menu a={1}/>)
  render(<Menu a={2}/>)
  ```

- `customName`:

  Sometimes the name of the component can be very inconvenient. For example:

  ```js
  const EnhancedMenu = withPropsOnChange(withPropsOnChange(withStateHandlers(withPropsOnChange(withState(withPropsOnChange(lifecycle(withPropsOnChange(withPropsOnChange(onlyUpdateForKeys(LoadNamespace(Connect(withState(withState(withPropsOnChange(lifecycle(withPropsOnChange(withHandlers(withHandlers(withHandlers(withHandlers(Connect(lifecycle(Menu)))))))))))))))))))))))
  ```

  will have the display name:

  ```js
  withPropsOnChange(withPropsOnChange(withStateHandlers(withPropsOnChange(withState(withPropsOnChange(lifecycle(withPropsOnChange(withPropsOnChange(onlyUpdateForKeys(LoadNamespace(Connect(withState(withState(withPropsOnChange(lifecycle(withPropsOnChange(withHandlers(withHandlers(withHandlers(withHandlers(Connect(lifecycle(Menu)))))))))))))))))))))))
  ```

  To prevent polluting the console, and any other reason, you can change it using `customName`.

## Options
Optionally you can pass in `options` as the second parameter. The following options are available:
- `include: [RegExp, ...]` (`null` by default)
- `exclude: [RegExp, ...]` (`null` by default)
- `trackHooks: true`
- `trackExtraHooks: []`
- `logOnDifferentValues: false`
- `hotReloadBufferMs: 500`
- `onlyLogs: false`
- `collapseGroups: false`
- `titleColor`
- `diffNameColor`
- `diffPathColor`
- `notifier: ({Component, displayName, prevProps, prevState, nextProps, nextState, reason, options}) => void`

#### include / exclude
You can include or exclude tracking for re-renders for components
by their displayName with the `include` and `exclude` options.

*Notice: **exclude** takes priority over both `include` and `whyDidYouRender` statics on components.*

For example, the following code is used to [track all redundant re-renders that are caused by React-Redux](http://bit.ly/wdyr04):
```js
whyDidYouRender(React, { include: [/^ConnectFunction/] });
```

#### trackHooks
You can turn off tracking of hooks changes.

Understand and fix hook issues [>> HERE <<](http://bit.ly/wdyr3).

#### trackExtraHooks
Adding extra hooks to track for "redundant" results:
```js
whyDidYouRender(React, {trackExtraHooks: [
  [Redux, 'useSelector']
]});
```

#### logOnDifferentValues
Normally, you only want notifications about component re-renders when their props and state
are the same, because it means these re-renders could have been avoided. But you can also track
all re-renders, even on different state/props.

```js
render(<BigListPureComponent a={1}/>)
render(<BigListPureComponent a={2}/>)
// this will only cause whyDidYouRender notifications for {logOnDifferentValues: true}
```

#### hotReloadBufferMs
Time in milliseconds to ignore updates after a hot reload is detected.

We can't currently know exactly if a render was triggered by hot reload,
so instead, we ignore all updates for `hotReloadBufferMs` (default: 500) after a hot reload.

#### onlyLogs
If you don't want to use `console.group` to group logs by component, you can print them as simple logs.

#### collapseGroups
Grouped logs can start collapsed:

#### titleColor / diffNameColor / diffPathColor
Controls the colors used in the console notifications

#### notifier
You can create a custom notifier if the default one does not suite your needs.

## Troubleshooting

### `Class constructors must be invoked with 'new'`.
If you are building for latest browsers (or using es6 classes without building) you don't transpile the "class" keyword.

This causes an error because the library uses transpiled classes, and [transpiled classes currently can't extend native classes](https://github.com/welldone-software/why-did-you-render/issues/5).

To fix this, use the "no-classes-transpile" dist:
```js
import React from 'react';

if (process.env.NODE_ENV !== 'production') {
  const whyDidYouRender = require('@welldone-software/why-did-you-render/dist/no-classes-transpile/umd/whyDidYouRender.min.js');
  whyDidYouRender(React);
}
```

### React-Redux `connect` HOC is spamming the console
Since `connect` hoists statics, if you add WDYR to the inner component, it is also added to the HOC component where complex hooks are running.

To fix this, add the `whyDidYouRender = true` static to a component after the connect:
```js
  const SimpleComponent = ({a}) => <div data-testid="foo">{a.b}</div>)
  // not before the connect: 
  // SimpleComponent.whyDidYouRender = true
  const ConnectedSimpleComponent = connect(
    state => ({a: state.a})
  )(SimpleComponent)
  // after the connect:
  SimpleComponent.whyDidYouRender = true
```

## Credit

Inspired by the following previous work:

https://github.com/maicki/why-did-you-update which i had the chance to maintain for some time.

https://github.com/garbles/why-did-you-update where [A deep dive into React perf debugging](http://benchling.engineering/deep-dive-react-perf-debugging/) is credited for the idea.

## License

This library is [MIT licensed](./LICENSE).
