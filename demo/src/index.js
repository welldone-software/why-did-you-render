import React from 'react';
import ReactDom from 'react-dom/client';

import App from './App';

const element = document.getElementById('menu');

const root = ReactDom.createRoot(element);

root.render(<App/>);

