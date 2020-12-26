import React from 'react';
import ReactDom from 'react-dom';
import styled from 'styled-components';

export default {
  description: 'styled-components',
  fn({ domElement, whyDidYouRender }) {
    whyDidYouRender(React);

    const SimpleComponent = (props) => {
      return (
        <div {...props}>
          styled-components
        </div>
      );
    };

    const StyledSimpleComponent = styled(SimpleComponent)`
      background-color: #ff96ae;
      font-style: italic;
    `;

    StyledSimpleComponent.whyDidYouRender = true;

    const Main = () => (
      <StyledSimpleComponent a={[]}/>
    );

    ReactDom.render(<Main/>, domElement);
    ReactDom.render(<Main/>, domElement);
  },
};
