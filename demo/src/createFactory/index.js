import React from 'react';
import ReactDom from 'react-dom';

export default {
  description: 'Creating react element using React.createFactory',
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

    const TestComponentFactory = React.createFactory(TestComponent);

    ReactDom.render(TestComponentFactory({ a: 1 }), domElement);
    ReactDom.render(TestComponentFactory({ a: 1 }), domElement);
  },
};
