import React from 'react';
import md5 from 'blueimp-md5';
import './App.css';

export default class AdminPage extends React.Component {
  container;

  static nameChecker = /^[A-Z]\w+[A-Z]$/m;
  static host = process.env.PRODUCTION ? 'https://react-vote-server.herokuapp.com' : 'http://127.0.0.1:5000';

  state = {
    role: 'president',
    password: ''
  };

  errorMessage(message) {
    this.setState({
      applicationError: message,
      applicationSuccess: undefined
    });
  }

  successMessage(message) {
    this.setState({
      applicationSuccess: message,
      applicationError: undefined
    });
  }

  submitBallot() {
    console.log(this.state.role);
    console.log(this.state.list.map(object => object.name));

    const spacedRole = this.state.role.replace(/([A-Z])/g, " $1");
    const capitalizedRole = spacedRole.charAt(0).toUpperCase() + spacedRole.slice(1);

    // Note: I do not use encodeURIContext because nameChecker already verifies these values are alphanumeric.
    const list = this.state.list.map(object => object.name).join(',');
    const queryURL = `${AdminPage.host}/vote?role=${this.state.role}&voter=${md5(this.state.voterName)}&list=${list}`;

    fetch(queryURL).then(async (result) => {
      if ((await result.text()).includes('locked')) {
        this.setState({
          applicationError: `Voting for ${capitalizedRole} is closed.`,
          applicationSuccess: undefined
        });
      }
        
      this.setState({
        applicationSuccess: 'Your ballot has been submitted!',
        applicationError: undefined
      });
    }).catch((result) => {
      this.setState({
        applicationError: 'Your ballot failed to submit.',
        applicationSuccess: undefined
      });
    })
  }

  handleEvent(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value,
      applicationError: undefined
    });
  }

  lock() {
    const password = encodeURIComponent(this.state.password);

    const spacedRole = this.state.role.replace(/([A-Z])/g, " $1");
    const capitalizedRole = spacedRole.charAt(0).toUpperCase() + spacedRole.slice(1);

    let queryURL = `${AdminPage.host}/lock?role=${this.state.role}&password=${password}`;

    fetch(queryURL).then(async (result) => {
      if ((await result.text()).includes('Locked')) {
        this.successMessage(`Voting for ${capitalizedRole} is closed!`);
      } else if (!result.ok) {
        this.errorMessage(`Failed to lock voting for ${capitalizedRole}.`)
      }
    }).catch((result) => {
      this.errorMessage(`Failed to lock voting for ${capitalizedRole}.`)
    })
  }

  reset() {

  }

  render() {
    return (
      <div>
        <p className="App-intro">
          This page is exclusively for site admins (i.e. Eli.)
          Password is required for all functionality on it.
        </p>
        <div>
          <input type="password" name="password" placeholder="Password" value={this.state.candidateName} onChange={this.handleEvent.bind(this)} />

          <br /> {/* Real controls beneath. */}

          <select name="role" value={this.state.role} onChange={this.handleEvent.bind(this)}>
            <option value="president">President</option>
            <option value="vicePresident">Vice President</option>
            <option value="librarian">Librarian</option>
          </select>
          <input type="button" value="Lock" onClick={this.lock.bind(this)} />
          <input type="button" value="Complete Reset" onClick={this.reset.bind(this)} />

          { this.state.applicationError ?
            <p style={{fontWeight: 'bold', color: 'red'}} className="App-intro">
              {this.state.applicationError}
            </p>
            : null }

          { this.state.applicationSuccess ?
            <p style={{fontWeight: 'bold', color: 'green'}} className="App-intro">
              {this.state.applicationSuccess}
            </p>
            : null }
        </div>
      </div>
    );
  }
}