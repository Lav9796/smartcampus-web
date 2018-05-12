import React, { Component } from 'react';
import { Panel  } from 'react-bootstrap';

class EventCard extends Component {
  render() {
    const event = this.props.event;
    return (
      <Panel bsStyle="primary">
        <Panel.Heading>
          <Panel.Title componentClass="h3">{event.title}</Panel.Title>
          <small>Posted by {event.author.username}</small>
        </Panel.Heading>
        <table>
          <tbody>
            <tr>
              <td>
                <Panel.Body>
                  <center>
                    <b>{event.start_time}</b>
                    <br/> to <br/>
                    <b>{event.end_time}</b>
                    <br/>
                    at <b>{event.location}</b>
                    <br/>
                    <a href={event.link}>{event.link}</a>
                  </center>
                </Panel.Body>
              </td>
              <td>
                <Panel.Body>{event.body}</Panel.Body>
              </td>
            </tr>
          </tbody>
        </table>
        <Panel.Footer style={{textAlign: 'right'}}>
          <small>Updated at {event.updated_at}</small>
        </Panel.Footer>
      </Panel>
    );
  }
}

export default EventCard;