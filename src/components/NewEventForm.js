import React, { Component } from "react";
import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import { connect } from 'react-redux';
import { postEvent } from '../actions';

class NewEventForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      title: '',
      startDate: '',
      startTime: '',
      endDate: '',
      endTime: '',
      location: '',
      link: '',
      body: '',
    };
  }

  validateForm() {
    return this.state.title.length > 0 
      && this.state.location.length > 0
      && this.state.body.length > 0;
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  handleSubmit = event => {
    event.preventDefault();

    const startTimestamp = this.state.startDate + ' ' + this.state.startTime + ':00';
    const endTimestamp = this.state.endDate + ' ' + this.state.endTime + ':00';

    this.props.postEvent(this.state.title, startTimestamp, endTimestamp,
      this.state.location, this.state.link, this.state.body);
  }

  render() {
    return (
      <div className="NewEvent">
        <form onSubmit={this.handleSubmit}>
          <FormGroup controlId="title" bsSize="large">
            <ControlLabel>Title</ControlLabel>
            <FormControl
              autoFocus
              type="text"
              value={this.state.title}
              onChange={this.handleChange}
            />
          </FormGroup>
          <FormGroup controlId="startDate" bsSize="large">
            <ControlLabel>Start Date</ControlLabel>
            <FormControl
              type="date"
              value={this.state.startDate}
              onChange={this.handleChange}
            />
          </FormGroup>
          <FormGroup controlId="startTime" bsSize="large">
            <ControlLabel>Start Time</ControlLabel>
            <FormControl
              type="time"
              value={this.state.startTime}
              onChange={this.handleChange}
            />
          </FormGroup>
          <FormGroup controlId="endDate" bsSize="large">
            <ControlLabel>End Date</ControlLabel>
            <FormControl
              type="date"
              value={this.state.endDate}
              onChange={this.handleChange}
            />
          </FormGroup>
          <FormGroup controlId="endTime" bsSize="large">
            <ControlLabel>End Time</ControlLabel>
            <FormControl
              type="time"
              value={this.state.endTime}
              onChange={this.handleChange}
            />
          </FormGroup>
          <FormGroup controlId="location" bsSize="large">
            <ControlLabel>Location</ControlLabel>
            <FormControl
              type="text"
              value={this.state.location}
              onChange={this.handleChange}
            />
          </FormGroup>
          <FormGroup controlId="link" bsSize="large">
            <ControlLabel>Link</ControlLabel>
            <FormControl
              type="text"
              value={this.state.link}
              onChange={this.handleChange}
            />
          </FormGroup>
          <FormGroup controlId="body" bsSize="large">
            <ControlLabel>Body</ControlLabel>
            <FormControl
              type="text"
              value={this.state.body}
              onChange={this.handleChange}
            />
          </FormGroup>
          <Button
            block
            bsSize="large"
            disabled={!this.validateForm()}
            type="submit"
          >
            Post Event
          </Button>
        </form>
      </div>
    );
  }
}

export default connect(null, { postEvent })(NewEventForm);
