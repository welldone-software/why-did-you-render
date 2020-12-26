import React from 'react';
import ReactDom from 'react-dom';

import App from './App';

const domMenuElement = document.getElementById('menu');

ReactDom.render(<App/>, domMenuElement);
