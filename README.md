# Why Did You Render

[![npm version](https://badge.fury.io/js/%40welldone-software%2Fwhy-did-you-render.svg)](https://badge.fury.io/js/%40welldone-software%2Fwhy-did-you-render)

`why-did-you-render` monkey patches `React` to notify you about avoidable re-renders.

For example, when you pass `style={{width: '100%'}}` to a big pure component and make it always re-render:

![](https://raw.githubusercontent.com/welldone-software/why-did-you-render/master/demo-image.png)

It can also help you to simply track when and why a certain component re-renders.

## Read More
You can read more about the library [>> HERE <<](http://bit.ly/wdyr1).

## Part 2 - Common Fixing Scenarios
Common fixing scenarios this library can help to eliminate can be found [>> HERE <<](http://bit.ly/wdyr02).

## Part 3 - Hooks
Understand and fix hook issues [>> HERE <<](http://bit.ly/wdyr3).

## Sandbox
You can test the library in the official sandbox [>> HERE <<](http://bit.ly/wdyr-sb).

## Setup
```
npm install @welldone-software/why-did-you-render --save
```
or
```
yarn add @welldone-software/why-did-you-render
```

## Usage
Execute `whyDidYouRender` with `React` as it's first argument.

```js
import React from 'react';

if (process.env.NODE_ENV !== 'production') {
  const whyDidYouRender = require('@welldone-software/why-did-you-render');
  whyDidYouRender(React);
}
```

If you are building for latest browsers and don't transpile the "class" keyword use the "no-classes-transpile" dist:
```js
import React from 'react';

if (process.env.NODE_ENV !== 'production') {
  const whyDidYouRender = require('@welldone-software/why-did-you-render/dist/no-classes-transpile/umd/whyDidYouRender.min.js');
  whyDidYouRender(React);
}
```
Not doing so will [result in a bug](https://github.com/welldone-software/why-did-you-render/issues/5)
where a transpiled class tries to extend a native class:

`Class constructors must be invoked with 'new'`.


Then mark all the components you want to be notified about their re-renders with `whyDidYouRender` like so:

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
  customName: 'EnhancedMenu'
}
```

- `logOnDifferentValues`:

  Normally only re-renders that are caused by equal values in props / state trigger notifications:
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
  const EnhancedMenu = Connect(withPropsOnChange(withPropsOnChange(withStateHandlers(withPropsOnChange(withState(withPropsOnChange(lifecycle(withPropsOnChange(withPropsOnChange(onlyUpdateForKeys(LoadNamespace(Connect(withState(withState(withPropsOnChange(lifecycle(withPropsOnChange(withHandlers(withHandlers(withHandlers(withHandlers(Connect(lifecycle(Menu))))))))))))))))))))))))
  ```

  will have the display name:

  ```js
  Connect(withPropsOnChange(withPropsOnChange(withStateHandlers(withPropsOnChange(withState(withPropsOnChange(lifecycle(withPropsOnChange(withPropsOnChange(onlyUpdateForKeys(LoadNamespace(Connect(withState(withState(withPropsOnChange(lifecycle(withPropsOnChange(withHandlers(withHandlers(withHandlers(withHandlers(Connect(lifecycle(Menu))))))))))))))))))))))))
  ```

  To prevent polluting the console, and any other reason, you can change it using `customName`.

## Options
Optionally you can pass in options as a second parameter. The following options are available:
- `include: [RegExp, ...]` (`null` by default)
- `exclude: [RegExp, ...]` (`null` by default)
- `trackHooks: true`
- `logOnDifferentValues: false`
- `onlyLogs: false`
- `collapseGroups: false`
- `hotReloadBufferMs: 500`
- `titleColor`
- `diffNameColor`
- `diffPathColor`
- `notifier: ({Component, displayName, prevProps, prevState, nextProps, nextState, reason, options}) => void`

#### include / exclude
You can include or exclude tracking for re-renders for components
by their displayName with the `include` and `exclude` options.

*Notice: **exclude** takes priority over both `include` and `whyDidYouRender` statics on components.*
```js
whyDidYouRender(React, { include: [/^pure/], exclude: [/^Connect/] });
```

#### trackHooks
You can turn off tracking of hooks changes.

Understand and fix hook issues [>> HERE <<](http://bit.ly/wdyr3).

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

#### hotReloadBufferMs
Time in milliseconds to ignore updates after a hot reload is detected.

We can't currently know exactly if a render was triggered by hot reload,
so instead, we ignore all updates for `hotReloadBufferMs` (default: 500) after a hot reload.

#### notifier
A notifier can be provided if the default one does not suite your needs.

## Credit

Inspired by the following previous work:

https://github.com/maicki/why-did-you-update which i had the chance to maintain for some time.

https://github.com/garbles/why-did-you-update where [A deep dive into React perf debugging](http://benchling.engineering/deep-dive-react-perf-debugging/) is credited for the idea.

## License

This library is [MIT licensed](./LICENSE).
