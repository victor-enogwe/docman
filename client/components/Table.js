import React from 'react';
import './table.css';

export default class EventTable extends React.Component {
  render() {
    return (
      <table className="table">
        <tbody>
        {
          <tr className="header">
            <th>Event Id</th>
            <th>Event Type</th>
            <th>Repository Name</th>
            <th>Repository Date</th>
          </tr>
        }
        {
          this.props.events.map(event =>
            <tr key={event.id} className="table-row">
              <th>{event.id}</th>
              <th>{event.type}</th>
              <th>{event.repo.name}</th>
              <th>{event.created_at}</th>
            </tr>
          )
        }
        </tbody>
      </table>
    )
  }
}

EventTable.defaultProps = {
  event: []
}