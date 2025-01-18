import React from 'react';
import styled from 'styled-components';

export default {
  description: 'styled-components',
  fn({reactDomRoot, whyDidYouRender}) {
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

    reactDomRoot.render(<Main/>);
    reactDomRoot.render(<Main/>);
  },
};
