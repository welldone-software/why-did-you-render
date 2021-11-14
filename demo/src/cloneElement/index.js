import React from 'react';
import ReactDom from 'react-dom';

export default {
  description: 'Creating react element using React.cloneElement',
  fn({ domElement, whyDidYouRender }) {
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

    ReactDom.render(testElement, domElement);
    ReactDom.render(testElement2, domElement);
  },
};
