import React from "react";
import { formatRole, host, ApplicationPage } from "./common";
import "./App.css";

export default class AdminPage extends ApplicationPage {
  container;

  state = {
    role: "president",
    password: ""
  };

  lock() {
    const password = encodeURIComponent(this.state.password);

    const formattedRole = formatRole(this.state.role);

    let queryURL = `${host}/lock?role=${this.state.role}&password=${password}`;

    fetch(queryURL)
      .then(async result => {
        if ((await result.text()).includes("Locked")) {
          this.successMessage(`Voting for ${formattedRole} is closed!`);
        } else if (!result.ok) {
          this.errorMessage(`Failed to lock voting for ${formattedRole}.`);
        }
      })
      .catch(result => {
        this.errorMessage(`Failed to lock voting for ${formattedRole}.`);
      });
  }

  reset() {
    const password = encodeURIComponent(this.state.password);
    let queryURL = `${host}/reset?password=${password}`;

    fetch(queryURL)
      .then(async result => {
        if ((await result.text()).includes("Reset")) {
          this.successMessage(`All ballots have been removed!`);
        } else if (!result.ok) {
          this.errorMessage(`Failed to clear votes.`);
        }
      })
      .catch(result => {
        this.errorMessage(`Failed to clear votes.`);
      });
  }

  render() {
    return (
      <div>
        <p className="App-intro">
          This page is exclusively for site admins (i.e. Eli.) Password is
          required for all functionality on it.
        </p>
        <div>
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={this.state.candidateName}
            onChange={this.handleEvent.bind(this)}
          />
          <br /> {/* Real controls beneath. */}
          <select
            name="role"
            value={this.state.role}
            onChange={this.handleEvent.bind(this)}
          >
            <option value="president">President</option>
            <option value="vicePresident">Vice President</option>
            <option value="librarian">Librarian</option>
          </select>
          <input type="button" value="Lock" onClick={this.lock.bind(this)} />
          <input
            type="button"
            value="Complete Reset"
            onClick={this.reset.bind(this)}
          />
          {this.state.applicationError ? (
            <p style={{ fontWeight: "bold", color: "red" }}>
              {this.state.applicationError}
            </p>
          ) : null}
          {this.state.applicationSuccess ? (
            <p style={{ fontWeight: "bold", color: "green" }}>
              {this.state.applicationSuccess}
            </p>
          ) : null}
        </div>
      </div>
    );
  }
}
