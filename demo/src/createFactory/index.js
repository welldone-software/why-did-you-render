import React from 'react';

export default {
  description: 'Creating react element using React.createFactory',
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

    const TestComponentFactory = React.createFactory(TestComponent);

    reactDomRoot.render(TestComponentFactory({ a: 1 }));
    reactDomRoot.render(TestComponentFactory({ a: 1 }));
  },
};
