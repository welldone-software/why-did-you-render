import React from 'react';

import createStepLogger from '../createStepLogger';

const text = 'change me when the app is running please';

const DemoComponent = ({ children }) => (
  <div>
    <h4>{text}</h4>
    {children}
  </div>
);

DemoComponent.whyDidYouRender = true;

export default {
  description: 'React Hot Reload Of Tracked Component',
  fn({ reactDomRoot, whyDidYouRender }) {
    const stepLogger = createStepLogger();

    whyDidYouRender(React);

    stepLogger('initial render');
    reactDomRoot.render(<DemoComponent>yo!</DemoComponent>);

    stepLogger('render with same props', true);
    reactDomRoot.render(<DemoComponent>yo!</DemoComponent>);
  },
};
