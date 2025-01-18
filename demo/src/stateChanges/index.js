import React from 'react';

import createStepLogger from '../createStepLogger';

export default {
  description: 'State Changes',
  fn({reactDomRoot, whyDidYouRender}) {
    const stepLogger = createStepLogger();

    whyDidYouRender(React);

    class ClassDemo extends React.Component {
      static whyDidYouRender = true;

      state = {
        stateKey: 'stateValue',
      };

      componentDidMount() {
        stepLogger('Set an existing state key with the same value', true);
        this.setState({stateKey: 'stateValue'}, () => {

          stepLogger('Add object entry');
          this.setState({objectKey: {a: 'a'}}, () => {

            stepLogger('Add a new object entry that equals by value', true);
            this.setState({objectKey: {a: 'a'}});
          });
        });
      }

      render() {
        return <div>State Changes</div>;
      }
    }

    stepLogger('First Render');
    reactDomRoot.render(<ClassDemo a={1}/>);
  },
};
