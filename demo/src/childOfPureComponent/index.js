import React from 'react';

export default {
  description: 'Child of Pure Component',
  fn({ reactDomRoot, whyDidYouRender }) {
    whyDidYouRender(React, {
      trackAllPureComponents: true,
    });

    const SomeChild = () => (
      <div>Child!</div>
    );

    class PureFather extends React.PureComponent {
      render() {
        return (
          <div>
            {this.props.children}
          </div>
        );
      }
    }

    class Main extends React.Component {
      state = { clicksCount: 0 };
      render() {
        return (
          <div>
            <button onClick={() => this.setState({ clicksCount: this.state.clicksCount + 1 })}>
              clicks: {this.state.clicksCount}
            </button>
            <PureFather>
              <SomeChild/>
            </PureFather>
          </div>
        );
      }
    }

    reactDomRoot.render(<Main/>);
  },
};
