import React, {Component} from 'react';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import FlatButton from 'material-ui/FlatButton';
import Toggle from 'material-ui/Toggle';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import Home from 'material-ui/svg-icons/action/home';
import {browserHistory} from 'react-router';
import { Session } from 'meteor/session';
import axios from 'axios';

//var url = "https://login.live.com/oauth20_authorize.srf?client_id={70948966-da9f-49bd-9124-fe2ba4c4ce1e}&scope={mshealth.ReadProfile mshealth.ReadDevices mshealth.ReadActivityHistory mshealth.ReadActivityLocation}&response_type=code&redirect_uri={https://login.live.com/oauth20_desktop.srf}";

let thisToggle = false;

class Logout extends Component {
  constructor(props) {
    super(props);
    this.handleLogout = this.handleLogout.bind(this);
  }
  static muiName = 'FlatButton';


  handleLogout() {
    console.log("logout");
    window.location.href = "https://www.strava.com/logout";
    // clear meteor sessions here.
    Session.keys = {};
  }

  render() {
    return (
      <FlatButton {...this.props} label="Logout" onClick={this.handleLogout} />
    );
  }
}

const Logged = (props) => (
  <IconMenu
    {...props}
    iconButtonElement={
      <IconButton><MoreVertIcon /></IconButton>
    }
    targetOrigin={{horizontal: 'right', vertical: 'top'}}
    anchorOrigin={{horizontal: 'right', vertical: 'top'}}
  >
    <MenuItem primaryText="Refresh" />
    <MenuItem primaryText="Help" />
    <MenuItem primaryText="Sign out" />
  </IconMenu>
);

Logged.muiName = 'IconMenu';

/**
 * This example is taking advantage of the composability of the `AppBar`
 * to render different components depending on the application state.
 */

 const styles = {
   mediumIcon: {
    width: 28,
    height: 28,
  }
 }

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      logged: false,
    };
  }

  handleChange = (event, logged) => {
    this.setState({logged: logged});
  };


  render() {
    return (
      <div>
        {/* <Toggle
          label="Logged"
          defaultToggled={true}
          onToggle={this.handleChange}
          labelPosition="right"
          style={{margin: 20}}
        /> */}
        <AppBar
          title={this.props.title}
          // iconElementRight={thisToggle ? <Logged /> : <Logout />}
          iconElementLeft={<IconButton iconStyle={styles.mediumIcon}><Home /></IconButton>}
          iconElementRight={<Logout />}
        />
      </div>
    );
  }
}

export default Header;
