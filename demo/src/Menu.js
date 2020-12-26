import React from 'react';

let Menu = ({ children }) => (
  <div>
    <h1>whyDidYouRender Demos</h1>
    <h3>
      <span style={{ backgroundColor: '#dad' }}>&nbsp;Open the console&nbsp;</span>
      &nbsp;and click on one of the demos
    </h3>
    <ul>
      {children}
    </ul>
  </div>
);

export default Menu;
