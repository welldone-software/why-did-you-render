import React from 'react';

export default {
  description: 'Creating react element using React.cloneElement',
  fn({ reactDomRoot, whyDidYouRender }) {
    whyDidYouRender(React);

    class TestComponent extends React.Component {
      static whyDidYouRender = true;
      render() {
        return (
          <div>
            TestComponent
          </div>
        );
      }
    }

    const testElement = <TestComponent a={1}/>;
    const testElement2 = React.cloneElement(testElement);

    reactDomRoot.render(testElement);
    reactDomRoot.render(testElement2);
  },
};
