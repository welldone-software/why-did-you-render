# Why Did You Render

![logo](images/WDYR-logo.jpg)

[![npm version](https://badge.fury.io/js/%40welldone-software%2Fwhy-did-you-render.svg)](https://badge.fury.io/js/%40welldone-software%2Fwhy-did-you-render)
[![Build Status](https://travis-ci.com/welldone-software/why-did-you-render.svg?branch=master)](https://travis-ci.com/welldone-software/why-did-you-render)
![NPM](https://img.shields.io/npm/l/@welldone-software/why-did-you-render?style=flat)
![Snyk Vulnerabilities for npm package](https://img.shields.io/snyk/vulnerabilities/npm/@welldone-software/why-did-you-render)
[![Coverage Status](https://coveralls.io/repos/github/welldone-software/why-did-you-render/badge.svg?branch=add-e2e-tests-using-cypress)](https://coveralls.io/github/welldone-software/why-did-you-render?branch=add-e2e-tests-using-cypress)

`why-did-you-render` by [Welldone Software](https://welldone.software/) monkey patches **`React`** to notify you about potentially avoidable re-renders. (Works with **`React Native`** as well.)

For example, if you pass `style={{width: '100%'}}` to a big pure component it would always re-render on every element creation:
```jsx
<BigListPureComponent style={{width: '100%'}}/>
```

It can also help you to simply track when and why a certain component re-renders.

## Setup
The last version of the library has been tested [(unit tests and E2E)]((https://travis-ci.com/welldone-software/why-did-you-render.svg?branch=master)) with **`React@16.14.0`** and **`React@17.0.1`** but it is expected to work with all `React@16` and `React@17` versions.

```
npm install @welldone-software/why-did-you-render --save-dev
```
or
```
yarn add --dev @welldone-software/why-did-you-render
```

If you use the `automatic` JSX transformation, set the library to be the import source, and make sure `preset-react` is in `development` mode.
```js
['@babel/preset-react', {
  runtime: 'automatic',
  development: process.env.NODE_ENV === 'development',
  importSource: '@welldone-software/why-did-you-render',
}]
```

> Notice: Create React App (CRA) ^4 **does use the `automatic` JSX transformation.**
> [See the following comment on how to do this step with CRA](https://github.com/welldone-software/why-did-you-render/issues/154#issuecomment-773905769)

Create a `wdyr.js` file and import it as **the first import** in your application.

`wdyr.js`:
```jsx
import React from 'react';

if (process.env.NODE_ENV === 'development') {
  const whyDidYouRender = require('@welldone-software/why-did-you-render');
  whyDidYouRender(React, {
    trackAllPureComponents: true,
  });
}
```

> **Notice: The library should *NEVER* be used in production because it slows down React**

In [Typescript](https://github.com/welldone-software/why-did-you-render/issues/161), call the file wdyr.ts and add the following line to the top of the file to import the package's types:
```tsx
/// <reference types="@welldone-software/why-did-you-render" />
```

Import `wdyr` as the first import (even before `react-hot-loader`):

`index.js`:
```jsx
import './wdyr'; // <--- first import

import 'react-hot-loader';
import {hot} from 'react-hot-loader/root';

import React from 'react';
import ReactDOM from 'react-dom';
// ...
import {App} from './app';
// ...
const HotApp = hot(App);
// ...
ReactDOM.render(<HotApp/>, document.getElementById('root'));
```

If you use `trackAllPureComponents` like we suggest, all pure components ([React.PureComponent](https://reactjs.org/docs/react-api.html#reactpurecomponent) or [React.memo](https://reactjs.org/docs/react-api.html#reactmemo)) will be tracked.

Otherwise, add `whyDidYouRender = true` to component classes/functions you want to track. (f.e `Component.whyDidYouRender = true`)

More information about what is tracked can be found in [Tracking Components](#tracking-components).

Can't see any WDYR logs? Check out the [troubleshooting section](#troubleshooting) or search in the [issues](issues).

## Custom Hooks

Also, tracking custom hooks is possible by using `trackExtraHooks`. For example if you want to track `useSelector` from React Redux:

`wdyr.js`:
```jsx
import React from 'react';

if (process.env.NODE_ENV === 'development') {
  const whyDidYouRender = require('@welldone-software/why-did-you-render');
  const ReactRedux = require('react-redux');
  whyDidYouRender(React, {
    trackAllPureComponents: true,
    trackExtraHooks: [
      [ReactRedux, 'useSelector']
    ]
  });
}
```

> Notice that there's currently a problem with rewriting exports of imported files in `webpack`. A quick workaround can help with it: [#85 - trackExtraHooks cannot set property](https://github.com/welldone-software/why-did-you-render/issues/85).

## Read More
* [Why Did You Render Mr. Big Pure React Component???](http://bit.ly/wdyr1)
* [**Common fixing scenarios** this library can helps with](http://bit.ly/wdyr02)
* [**React Hooks** - Understand and fix hooks issues](http://bit.ly/wdyr3)
* [Why Did You Render v4 Released!](https://medium.com/welldone-software/why-did-you-render-v4-released-48e0f0b99d4c) - TypeScript support, Custom hooks tracking (like React-Redux’s useSelector), Tracking of all pure components.

## Integration With Other Libraries
* [Next.js example](https://github.com/zeit/next.js/tree/canary/examples/with-why-did-you-render)
* [React-Redux With Hooks](https://medium.com/welldone-software/why-did-you-render-v4-released-48e0f0b99d4c)
* [Mobx is currently not supported](https://github.com/welldone-software/why-did-you-render/issues/162)

## Sandbox
You can test the library in [the official sandbox](http://bit.ly/wdyr-sb).

And another [official sandbox with hooks tracking](https://codesandbox.io/s/why-did-you-render-sandbox-with-hooks-pyi14)

## Tracking Components
You can track all pure components ([React.PureComponent](https://reactjs.org/docs/react-api.html#reactpurecomponent) or [React.memo](https://reactjs.org/docs/react-api.html#reactmemo)) using the `trackAllPureComponents: true` option.

You can also manually track any component you want by setting `whyDidYouRender` on them like this:
```js
class BigList extends React.Component {
  static whyDidYouRender = true
  render(){
    return (
      //some heavy render you want to ensure doesn't happen if its not necessary
    )
  }
}
```

Or for functional components:

```js
const BigListPureComponent = props => (
  <div>
    //some heavy component you want to ensure doesn't happen if its not necessary
  </div>
)
BigListPureComponent.whyDidYouRender = true
```

You can also pass an object to specify more advanced tracking settings:

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

  Sometimes the name of the component can be missing or very inconvenient. For example:

  ```js
  withPropsOnChange(withPropsOnChange(withStateHandlers(withPropsOnChange(withState(withPropsOnChange(lifecycle(withPropsOnChange(withPropsOnChange(onlyUpdateForKeys(LoadNamespace(Connect(withState(withState(withPropsOnChange(lifecycle(withPropsOnChange(withHandlers(withHandlers(withHandlers(withHandlers(Connect(lifecycle(Menu)))))))))))))))))))))))
  ```
  
## Options
Optionally you can pass in `options` as the second parameter. The following options are available:
- `include: [RegExp, ...]` (`null` by default)
- `exclude: [RegExp, ...]` (`null` by default)
- `trackAllPureComponents: false`
- `trackHooks: true`
- `trackExtraHooks: []`
- `logOwnerReasons: true`
- `logOnDifferentValues: false`
- `hotReloadBufferMs: 500`
- `onlyLogs: false`
- `collapseGroups: false`
- `titleColor`
- `diffNameColor`
- `diffPathColor`
- `notifier: ({Component, displayName, hookName, prevProps, prevState, prevHook, nextProps, nextState, nextHook, reason, options, ownerDataMap}) => void`
- `getAdditionalOwnerData: (element) => {...}`

#### include / exclude
##### (default: `null`)

You can include or exclude tracking of components by their displayName using the `include` and `exclude` options.

For example, the following code is used to [track all redundant re-renders that are caused by older React-Redux](http://bit.ly/wdyr04):
```js
whyDidYouRender(React, { include: [/^ConnectFunction/] });
```
> *Notice: **exclude** takes priority over both `include` and manually set `whyDidYouRender = `*

#### trackAllPureComponents
##### (default: `false`)

You can track all pure components (both `React.memo` and `React.PureComponent` components)

> *Notice: You can exclude the tracking of any specific component with `whyDidYouRender = false`*

#### trackHooks
##### (default: `true`)

You can turn off tracking of hooks changes.

[Understand and fix hook issues](http://bit.ly/wdyr3).

#### trackExtraHooks
##### (default: `[]`)

Track custom hooks:

```js
whyDidYouRender(React, {
  trackExtraHooks: [
    [ReactRedux, 'useSelector']
  ]
});
```

> There is currently a problem with rewriting exports of imported files in webpack. A workaround is available here: [#85 - trackExtraHooks cannot set property](https://github.com/welldone-software/why-did-you-render/issues/85)

#### logOwnerReasons
##### (default: `true`)

One way of fixing re-render issues is preventing the component's owner from re-rendering.

This option is `true` by default and it lets you view the reasons why an owner component re-renders.

![demo](images/logOwnerReasons.png)

#### logOnDifferentValues
##### (default: `false`)

Normally, you only want logs about component re-renders when they could have been avoided.

With this option, it is possible to track all re-renders.

For example:
```js
render(<BigListPureComponent a={1}/>)
render(<BigListPureComponent a={2}/>)
// will only log if you use {logOnDifferentValues: true}
```

#### hotReloadBufferMs
##### (default: `500`)

Time in milliseconds to ignore updates after a hot reload is detected.

When a hot reload is detected, we ignore all updates for `hotReloadBufferMs` to not spam the console.

#### onlyLogs
##### (default: `false`)

If you don't want to use `console.group` to group logs you can print them as simple logs.

#### collapseGroups
##### (default: `false`)

Grouped logs can be collapsed.

#### titleColor / diffNameColor / diffPathColor
##### (default titleColor: `'#058'`)
##### (default diffNameColor: `'blue'`)
##### (default diffPathColor: `'red'`)

Controls the colors used in the console notifications

#### notifier
##### (default: defaultNotifier that is exposed from the library)

You can create a custom notifier if the default one does not suite your needs.

#### getAdditionalOwnerData
##### (default: `undefined`)
You can provide a function that harvests additional data from the original react element. The object returned from this function will be added to the ownerDataMap which can be accessed later within your notifier function override.

## Troubleshooting

### No tracking
* If you are in production, WDYR is probably disabled.
* Maybe no component is tracked
    * Check out [Tracking Components](#tracking-components) once again.
    * If you track all pure components ([React.PureComponent](https://reactjs.org/docs/react-api.html#reactpurecomponent) or [React.memo](https://reactjs.org/docs/react-api.html#reactmemo)), maybe your none of your components are not pure.
* Maybe you have no issues
    * Try causing an issue by temporary rendering the whole app twice in it's entry point:
    
        `index.js`:
        ```jsx
        const HotApp = hot(App);
        HotApp.whyDidYouRender = true;
        ReactDOM.render(<HotApp/>, document.getElementById('root'));
        ReactDOM.render(<HotApp/>, document.getElementById('root'));
        ```

### Custom Hooks tracking (like useSelector)
There's currently a problem with rewriting exports of imported files in `webpack`. A quick workaround can help with it: [#85 - trackExtraHooks cannot set property](https://github.com/welldone-software/why-did-you-render/issues/85).

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

### Sourcemaps
To see the library's sourcemaps use the [source-map-loader](https://webpack.js.org/loaders/source-map-loader/).

## Credit

Inspired by the following previous work:

https://github.com/maicki/why-did-you-update which I had the chance to maintain for some time.

https://github.com/garbles/why-did-you-update where [A deep dive into React perf debugging](http://benchling.engineering/deep-dive-react-perf-debugging/) is credited for the idea.

## License

This library is [MIT licensed](./LICENSE).
