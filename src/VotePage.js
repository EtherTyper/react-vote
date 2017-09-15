import React from 'react';
import cx from 'classnames';
import DraggableList from 'react-draggable-list';
import md5 from 'blueimp-md5';
import './App.css';

const Candidate = (role) => class Candidate extends React.Component {
  getDragHeight() {
    return 28;
  }

  render() {
    const {item, itemSelected, dragHandle} = this.props;
    const scale = itemSelected * 0.05 + 1;
    const shadow = itemSelected * 15 + 1;
    const dragged = itemSelected !== 0;

    const spacedRole = role.replace(/([A-Z])/g, " $1");
    const capitalizedRole = spacedRole.charAt(0).toUpperCase() + spacedRole.slice(1);

    return (
      <div
        className={cx('item', {dragged})}
        style={{
          transform: `scale(${scale})`,
          boxShadow: `rgba(0, 0, 0, 0.3) 0px ${shadow}px ${2 * shadow}px 0px`
        }}
      >
        {dragHandle(<div className="dragHandle" />)}
        <h1>
          { item.name === 'EliB' ? `Future ${capitalizedRole} ` : null }
          { item.name }
        </h1>
      </div>
    );
  }
}

export default class VotePage extends React.Component {
  container;

  static nameChecker = /^[A-Z]\w+[A-Z]$/m;
  static host = 'https://react-vote-server.herokuapp.com';

  state = {
    useContainer: false,
    candidateName: '',
    voterName: '',
    role: 'president',
    list: [
      'EliB',
      'JosephJ',
      'StevenX',
      'ChristineT',
      'VaishnaviA'
    ].map(i => {
      return { name: i }
    })
  };

  addCandidate() {
    if (!VotePage.nameChecker.test(this.state.candidateName)) {
      this.setState({
        applicationError: `Please reformat the entered candidate's name.`,
        applicationSuccess: undefined
      });
    } else {
      this.setState({
        list: [
          {name: this.state.candidateName},
          ...this.state.list
        ],
        candidateName: ''
      })
    }
  }

  submitBallot() {
    if (!VotePage.nameChecker.test(this.state.voterName)) {
      this.setState({
        applicationError: `Please reformat the entered voter's name.`,
        applicationSuccess: undefined
      });
    } else {
      console.log(this.state.role);
      console.log(this.state.voterName);
      console.log(this.state.list.map(object => object.name));

      const spacedRole = role.replace(/([A-Z])/g, " $1");
      const capitalizedRole = spacedRole.charAt(0).toUpperCase() + spacedRole.slice(1);

      // Note: I do not use encodeURIContext because nameChecker already verifies these values are alphanumeric.
      let list = this.state.list.map(object => object.name).join(',');
      let queryURL = `${VotePage.host}/vote?role=${this.state.role}&voter=${md5(this.state.voterName)}&list=${list}`;

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
  }

  handleEvent(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  onListChange(newList) {
    this.setState({list: newList});
  }

  render() {
    const {useContainer} = this.state;

    let applicationError = this.state.applicationError;

    // eslint-disable-next-line
    this.state.applicationError = undefined;

    return (
      <div>
        <p className="App-intro">
          To get started, add some candidates to the list, select a role to nominate them for,
          and drag them into order from most want in office to least want in office.
          <br />
          <b>
            NOTE:
          </b>
          {' '}
          Names must be entered in the following format: "FirstL" or "FirstNamesL" for multiple first names.
        </p>
        <div>
          <input type="text" name="candidateName" placeholder="Candidate Name" value={this.state.candidateName} onChange={this.handleEvent.bind(this)} />
          <input type="button" value="Add Candidate" onClick={this.addCandidate.bind(this)} />

          <br /> {/* Global Settings & Buttons. */}

          <input type="text" name="voterName" placeholder="Voter Name" value={this.state.voterName} onChange={this.handleEvent.bind(this)} />
          <select name="role" value={this.state.role} onChange={this.handleEvent.bind(this)}>
            <option value="president">President</option>
            <option value="vicePresident">Vice President</option>
            <option value="librarian">Librarian</option>
          </select>
          <input type="button" value="Submit Ballot" onClick={this.submitBallot.bind(this)} />

          { applicationError ?
            <p style={{fontWeight: 'bold', color: 'red'}} className="App-intro">
              {applicationError}
            </p>
            : null }

          { this.state.applicationSuccess ?
            <p style={{fontWeight: 'bold', color: 'green'}} className="App-intro">
              {this.state.applicationSuccess}
            </p>
            : null }
        </div>
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
          <DraggableList
            itemKey="name"
            template={Candidate(this.state.role)}
            list={this.state.list}
            onMoveEnd={newList => this.onListChange(newList)}
            container={()=>useContainer ? this.container : document.body}
          />
        </div>
      </div>
    );
  }
}