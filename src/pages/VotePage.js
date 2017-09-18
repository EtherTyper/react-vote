import React from "react";
import cx from "classnames";
import DraggableList from "react-draggable-list";
import md5 from "blueimp-md5";
import "../App.css";
import {
  formatRole,
  host,
  nameChecker,
  ApplicationPage,
  RolePicker
} from "./common";
import candidates from "../data/candidates";

class Candidate extends React.Component {
  getDragHeight() {
    return 80;
  }

  render() {
    const { item, itemSelected, dragHandle } = this.props;
    const { role, deleteFunction } = this.props.commonProps;
    const scale = itemSelected * 0.05 + 1;
    const shadow = itemSelected * 15 + 1;
    const dragged = itemSelected !== 0;

    return (
      <div
        className={cx("item", { dragged })}
        style={{
          transform: `scale(${scale})`,
          boxShadow: `rgba(0, 0, 0, 0.3) 0px ${shadow}px ${2 * shadow}px 0px`
        }}
      >
        {dragHandle(<div className="dragHandle" />)}
        <h1>
          {item.name === "EliB" ? `Future ${formatRole(role)} ` : null}
          {item.name}
        </h1>
        <div className="xButton" onClick={() => deleteFunction(item.name)} />
      </div>
    );
  }
}

export default class VotePage extends ApplicationPage {
  container;

  state = {
    useContainer: false,
    candidateName: "",
    voterName: "",
    role: "president",
    list: (function(candidates) {
      let list = {};

      for (let role in candidates) {
        list[role] = candidates[role].map(candidate => {
          return { name: candidate };
        });

        list[role] = [
          { name: "EliB" },
          ...list[role].filter(name => name !== "EliB")
        ];
      }

      return list;
    })(candidates)
  };

  addCandidate() {
    if (!nameChecker.test(this.state.candidateName)) {
      this.errorMessage(`Please reformat the entered candidate's name.`);
    } else {
      this.setState({
        list: {
          ...this.state.list,
          [this.state.role]: [
            { name: this.state.candidateName },
            ...this.state.list[this.state.role]
          ]
        },
        candidateName: ""
      });
    }
  }

  deleteFunction(toDelete) {
    this.setState({
      list: {
        ...this.state.list,
        [this.state.role]: this.state.list[this.state.role].filter(
          ({ name }) => toDelete !== name
        )
      }
    });
  }

  submitBallot() {
    if (!nameChecker.test(this.state.voterName)) {
      this.errorMessage(`Please reformat the entered voter's name.`);
    } else {
      console.log(this.state.role);
      console.log(this.state.voterName);
      console.log(this.state.list[this.state.role]);
      console.log(this.state.list[this.state.role].map(object => object.name));

      // Note: I do not use encodeURIContext because nameChecker already verifies these values are alphanumeric.
      let list = this.state.list[this.state.role]
        .map(object => object.name)
        .join(",");
      let queryURL = `${host}/vote?role=${this.state.role}&voter=${md5(
        this.state.voterName
      )}&list=${list}`;

      fetch(queryURL)
        .then(async result => {
          console.log("success");

          const text = await result.text();

          if (text.includes("locked")) {
            this.errorMessage(
              `Voting for ${formatRole(this.state.role)} is closed.`
            );
          } else {
            this.successMessage("Your ballot has been submitted!");
          }
        })
        .catch(result => {
          this.errorMessage("Your ballot failed to submit.");
        });
    }
  }

  onListChange(newList) {
    this.setState({
      list: {
        ...this.state.list,
        [this.state.role]: newList
      }
    });
  }

  render() {
    const { useContainer } = this.state;

    return (
      <div>
        <p className="App-intro">
          To get started, add some candidates to the list, select a role to
          nominate them for, and drag them into order from most want in office
          to least want in office.
          <br />
          <b>NOTE:</b> Names must be entered in the following format: "FirstL"
          or "FirstNamesL" for multiple first names.
        </p>
        <div>
          <input
            type="text"
            name="candidateName"
            placeholder="Candidate Name"
            value={this.state.candidateName}
            onChange={this.handleEvent.bind(this)}
          />
          <input
            type="button"
            value="Add Candidate"
            onClick={this.addCandidate.bind(this)}
          />
          <br /> {/* Global Settings & Buttons. */}
          <input
            type="text"
            name="voterName"
            placeholder="Voter Name"
            value={this.state.voterName}
            onChange={this.handleEvent.bind(this)}
          />
          <RolePicker
            role={this.state.role}
            onChange={this.handleEvent.bind(this)}
          />
          <input
            type="button"
            value="Submit Ballot"
            onClick={this.submitBallot.bind(this)}
          />
          {this.state.applicationError ? (
            <p
              style={{ fontWeight: "bold", color: "red" }}
              className="App-intro"
            >
              {this.state.applicationError}
            </p>
          ) : null}
          {this.state.applicationSuccess ? (
            <p
              style={{ fontWeight: "bold", color: "green" }}
              className="App-intro"
            >
              {this.state.applicationSuccess}
            </p>
          ) : null}
        </div>
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
          <DraggableList
            itemKey="name"
            template={Candidate}
            list={this.state.list[this.state.role]}
            onMoveEnd={newList => this.onListChange(newList)}
            container={() => (useContainer ? this.container : document.body)}
            commonProps={{
              role: this.state.role,
              deleteFunction: this.deleteFunction.bind(this)
            }}
          />
        </div>
      </div>
    );
  }
}
