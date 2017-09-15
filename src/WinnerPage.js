import React from 'react';
import './App.css';

const Candidate = (role) => class Candidate extends React.Component {
  render() {
    const spacedRole = role.replace(/([A-Z])/g, " $1");
    const capitalizedRole = spacedRole.charAt(0).toUpperCase() + spacedRole.slice(1);

    return (
      <div className='item' style={{boxShadow: `rgba(0, 0, 0, 0.3) 0px 1px 2px 0px`}}>
        <h1>
          { capitalizedRole } { this.props.name }
        </h1>
      </div>
    );
  }
}

export default class App extends React.Component {
  container;

  static nameChecker = /^[A-Z]\w+[A-Z]$/m;
  static host = 'https://react-vote-server.herokuapp.com';

  state = {
    useContainer: false
  };

  submitBallot() {
    fetch(`${App.host}/winner?role=${this.state.role}`).then((result) => {
      this.setState({
        winnerText: result.text()
      });
    })
  }

  render() {
    const {useContainer} = this.state;
    const SpecificCandidate = Candidate('president');

    return (
      <div>
        <p className="App-intro">
          { this.state.votesLocked ?
            'The following candidate won: ' :
            'At this rate, the winner will be: ' }
        </p>
        <div
          className="list" ref={el => {
            if (el) this.container = el;
          }}
          style={{
            overflow: useContainer ? 'auto' : '',
            height: useContainer ? '200px' : '',
            border: useContainer ? '1px solid gray' : ''
          }}
        >
          { this.state.winnerText ?
            <SpecificCandidate name={this.state.winnerText} />
            : <p style={{fontWeight: 'bold', color: 'gray'}}>
              Loading winner information.
            </p> }
        </div>
      </div>
    );
  }
}