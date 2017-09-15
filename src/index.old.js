import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import VotePage from './VotePage';
import WinnerPage from './WinnerPage';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<WinnerPage />, document.getElementById('root'));
registerServiceWorker();
