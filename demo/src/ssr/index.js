import React from 'react';
import ReactDom from 'react-dom/client';

import createStepLogger from '../createStepLogger';

import DemoComponent from './DemoComponent';

export default {
  description: 'Server Side (hydrate)',
  fn({domElement, whyDidYouRender}) {
    const stepLogger = createStepLogger();

    return fetch('/ssrComponent')
      .then(response => response.text())
      .then(initialDemoHTML => {
        domElement.innerHTML = initialDemoHTML;

        whyDidYouRender(React);

        stepLogger('hydrate');
        const hydratedRoot = ReactDom.hydrateRoot(domElement, <DemoComponent text="hydrated hi"/>);

        setTimeout(() => {
          stepLogger('render with same props', true);
          hydratedRoot.render(<DemoComponent text="hydrated hi"/>);
        }, 1);

        return hydratedRoot;
      });
  },
  settings: {shouldCreateRoot: false},
};
