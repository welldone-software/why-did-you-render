import React from 'react';

import createStepLogger from '../createStepLogger';

export default {
  description: 'No Changes',
  fn({reactDomRoot, whyDidYouRender}) {
    const stepLogger = createStepLogger();

    whyDidYouRender(React);

    class ClassDemo extends React.Component {
      static whyDidYouRender = true;

      componentDidMount() {
        stepLogger('forceUpdate', true);
        this.forceUpdate();
      }
      render() {
        return <div>State And Props The Same</div>;
      }
    }

    stepLogger('First Render');
    reactDomRoot.render(<ClassDemo/>);
  },
};
