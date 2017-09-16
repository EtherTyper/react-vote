import {
    BrowserRouter as Router,
    Route,
    Link
} from 'react-router-dom';
import React from 'react';
import './index.css';
import VotePage from './VotePage';
import WinnerPage from './WinnerPage';
import AdminPage from './AdminPage';
import './App.css';
import logo from './logo.svg';

const App = () => (
    <Router>
        <div>
            <div className="App">
                <div className="App-header">
                    <img src={logo} className="App-logo" alt="logo" />
                    <h2>Welcome to React Vote</h2>

                    <Link to="/"><input type="button" value="Vote" /></Link>
                    <Link to="/winner"><input type="button" value="See Winner" /></Link>
                    <Link to="/admin"><input type="button" value="Admin Controls" /></Link>
                </div>
    
                <Route exact path="/" component={VotePage} />
                <Route path="/winner" component={WinnerPage} />
                <Route path="/admin" component={AdminPage} />
            </div>
        </div>
    </Router>
);

export default App;