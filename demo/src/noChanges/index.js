import React from 'react';
import ReactDom from 'react-dom';

import createStepLogger from '../createStepLogger';

export default {
  description: 'No Changes',
  fn({ domElement, whyDidYouRender }) {
    const stepLogger = createStepLogger();

    whyDidYouRender(React);

    class ClassDemo extends React.Component {
      static whyDidYouRender = true

      componentDidMount() {
        stepLogger('forceUpdate', true);
        this.forceUpdate();
      }
      render() {
        return <div>State And Props The Same</div>;
      }
    }

    stepLogger('First Render');
    ReactDom.render(<ClassDemo/>, domElement);
  },
};
