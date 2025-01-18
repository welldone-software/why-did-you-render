import React from 'react';

import createStepLogger from '../createStepLogger';

export default {
  description: 'Props And State Changes',
  fn({reactDomRoot, whyDidYouRender}) {
    const stepLogger = createStepLogger();

    whyDidYouRender(React);

    class ClassDemo extends React.Component {
      static whyDidYouRender = true;

      state = {
        c: {d: 'd'},
      };

      static getDerivedStateFromProps() {
        return {
          c: {d: 'd'},
        };
      }

      render() {
        return <div>State And Props Changes</div>;
      }
    }

    stepLogger('First Render');
    reactDomRoot.render(<ClassDemo a={{b: 'b'}}/>);

    stepLogger('Second Render', true);
    reactDomRoot.render(<ClassDemo a={{b: 'b'}}/>);
  },
};
