import React from "react";
import "./App.css";

const Candidate = role =>
  class Candidate extends React.Component {
    render() {
      const spacedRole = role.replace(/([A-Z])/g, " $1");
      const capitalizedRole =
        spacedRole.charAt(0).toUpperCase() + spacedRole.slice(1);

      return (
        <div
          className="item"
          style={{ boxShadow: `rgba(0, 0, 0, 0.3) 0px 1px 2px 0px` }}
        >
          <h1>
            {capitalizedRole} {this.props.name}
          </h1>
        </div>
      );
    }
  };

export default class WinnerPage extends React.Component {
  container;

  static host = process.env.PRODUCTION
    ? "https://react-vote-server.herokuapp.com"
    : "http://127.0.0.1:5000";

  state = {
    useContainer: false,
    role: "president"
  };

  componentDidMount() {
    this.loadWinner();
  }

  loadWinner() {
    console.log("Loading winner.");

    this.setState({
      winnerText: undefined
    });

    fetch(`${WinnerPage.host}/winner?role=${this.state.role}`)
      .then(async result => {
        this.setState({
          winnerText: await result.text()
        });
      })
      .catch(result => {
        this.setState({
          applicationError: "Failed to fetch winner information."
        });
      });

    fetch(`${WinnerPage.host}/locked?role=${this.state.role}`)
      .then(async result => {
        this.setState({
          votesLocked: (await result.text()) === "true"
        });
      })
      .catch(result => {
        this.setState({
          applicationError: "Failed to fetch election information."
        });
      });
  }

  handleEvent(event) {
    this.setState(
      {
        role: event.target.value
      },
      () => {
        this.loadWinner();
      }
    );
  }

  render() {
    const { useContainer } = this.state;
    const SpecificCandidate = Candidate(this.state.role);

    return (
      <div>
        <p className="App-intro">
          {this.state.votesLocked
            ? "The following candidate won: "
            : "At this rate, the winner will be: "}
          <select
            name="role"
            value={this.state.role}
            onChange={this.handleEvent.bind(this)}
          >
            <option value="president">President</option>
            <option value="vicePresident">Vice President</option>
            <option value="librarian">Librarian</option>
          </select>
        </p>
        <div
          className="list"
          ref={el => {
            if (el) this.container = el;
          }}
          style={{
            overflow: useContainer ? "auto" : "",
            height: useContainer ? "200px" : "",
            border: useContainer ? "1px solid gray" : ""
          }}
        >
          {this.state.winnerText ? (
            <SpecificCandidate name={this.state.winnerText} />
          ) : this.state.applicationError ? (
            <p
              style={{ fontWeight: "bold", color: "red" }}
              className="App-intro"
            >
              {this.state.applicationError}
            </p>
          ) : (
            <p style={{ fontWeight: "bold", color: "gray" }}>
              Loading winner information.
            </p>
          )}
        </div>
      </div>
    );
  }
}
