import React from 'react';
import ReactDom from 'react-dom';

import createStepLogger from '../createStepLogger';

import DemoComponent from './DemoComponent';

export default {
  description: 'Server Side (hydrate)',
  fn({ domElement, whyDidYouRender }) {
    const stepLogger = createStepLogger();

    fetch('/ssrComponent')
      .then(response => response.text())
      .then(initialDemoHTML => {
        domElement.innerHTML = initialDemoHTML;

        whyDidYouRender(React);

        stepLogger('hydrate');
        ReactDom.hydrate(<DemoComponent text="hydrated hi"/>, domElement);

        stepLogger('render with same props', true);
        ReactDom.render(<DemoComponent text="hydrated hi"/>, domElement);
      });
  },
};
