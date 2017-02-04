import React      from 'react';
import ReactDOM   from 'react-dom';
import $          from 'jquery';
import EventTable from './Table';
import RaisedButton from 'material-ui/RaisedButton';
import './form.scss';

export default class Form extends React.Component {
  constructor() {
    super()
    this.state = {
      events: [],
      error: ""
    }
  }
  submit() {
    let username = this.refs.username.value;
    if (username.length > 0) {
       $.ajax(`https://api.github.com/users/${username}/events`)
      .done(data => {
        this.setState({
          events: data
        })
      })
      .fail((xhr, status, error) => {
        this.setState({error: error.responseJSON.message});
      })
    } else {
      this.setState({error: 'please enter a valid github username'});
    }
  }

  render() {
    return (
      <div className="form-div">
        <h1>Fetch Github User Events Hello Get up</h1>
        <p>just type in a username and all recent events will be shown</p>
        <div className="form">
          <input type="text" className="form-input" ref="username"/>
          <span className="error">{this.state.error}</span>
          <RaisedButton onClick={this.submit.bind(this)} label="Fetch Events" />
        </div>
        <EventTable events={this.state.events} />
      </div>
    );
  }
}