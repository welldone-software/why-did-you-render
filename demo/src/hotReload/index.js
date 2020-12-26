import React from 'react';
import ReactDom from 'react-dom';
import ReactHotLoader from 'react-hot-loader';

import createStepLogger from '../createStepLogger';

const text = 'change me when the app is running please';

let DemoComponent = ({ children }) => (
  <div>
    <h4>{text}</h4>
    {children}
  </div>
);

DemoComponent = ReactHotLoader.hot(module)(DemoComponent);

DemoComponent.whyDidYouRender = true;

export default {
  description: 'React Hot Reload Of Tracked Component',
  fn({ domElement, whyDidYouRender }) {
    const stepLogger = createStepLogger();

    whyDidYouRender(React);

    stepLogger('initial render');
    ReactDom.render(<DemoComponent>yo!</DemoComponent>, domElement);

    stepLogger('render with same props', true);
    ReactDom.render(<DemoComponent>yo!</DemoComponent>, domElement);
  },
};
