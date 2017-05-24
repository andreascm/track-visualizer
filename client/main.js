import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import { Session } from 'meteor/session';
import polyline from 'polyline';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import injectTapEventPlugin from 'react-tap-event-plugin';
import { red400 } from 'material-ui/styles/colors';

import Header from './components/header';
import Maps from './containers/google_maps';
import UserList from './components/user_list';

injectTapEventPlugin();

// This replaces the textColor value on the palette
// and then update the keys for each component that depends on it.
// More on Colors: http://www.material-ui.com/#/customization/colors
const muiTheme = getMuiTheme({
  palette: {
    textColor: red400,
  },
  appBar: {
    height: 60,
  },
});

const mapStyle = {
  height: '100%',
  width: '100%',
};

// this actually render slower than componentWillMount
let user_data = [];
class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      access_token: '',
      user_activities: [],
      name: '',
      user_data: [],
    };
  }

    /* excellent place to call the api */
  componentWillMount() {
    // this.props.location.query.code is the access code given when u exchange it for an access token
    Session.set("authorizeCode", this.props.location.query.code);
    const authorizeCode = Session.get("authorizeCode");
    Meteor.call('getAccessToken', authorizeCode, (err, res) => {
      if (err) {
        console.log(err);
      }
      if (!err) {
        // console.log(res);
        this.setState({ access_token: res.access_token, name: res.athlete.lastname });

        let url = `https://www.strava.com/api/v3/athlete/activities?access_token=${res.access_token}&per_page=10`;
        // console.log(url);
        axios.get(url)
          .then(response => {
            console.log(response.data);
            this.setState({ user_activities: response.data });

            // over here we can add the map data into the mongoDB database

            const IndividualItem = response.data.map((item) => {
              const id = item.id;
              Meteor.call('getIndividualActivity', id, this.state.access_token, (err, res) => {
                if(err) {
                  console.log(err);
                } else {
                  // append the object into an array
                  let decodedPolyline = polyline.decode(res.map.polyline);
                  let id = res.id.toString();
                  Meteor.call('gps.insert', id, decodedPolyline);
                }
              });
            });
          })
          .catch(error => {
            console.log(error);
          });
      }
    });
  }

  render() {
    return (
      <div>
        <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
          <Header title="Home" access_token={this.state.access_token}/>
        </MuiThemeProvider>
        <div style={mapStyle}>
          <Maps />
        </div>
        <MuiThemeProvider>
          <UserList access_token={this.state.access_token} user_activities={this.state.user_activities} name={this.state.name}/>
        </MuiThemeProvider>
      </div>
    );
  }
}

export default Main;
