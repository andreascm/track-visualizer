import React, { Component } from 'react';
import FlatButton from 'material-ui/FlatButton';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';


const divStyle = {
  width: window.innerWidth,
  height: window.innerHeight,
  backgroundImage: 'url(' + '/images/running_photo.png' + ')',
  overflow: 'hidden',
  backgroundSize: 'cover',
};

class LoginMain extends Component {

  login(e) {
    //for testing on localhost, insert client_id here
    window.location.href = `https://www.strava.com/oauth/authorize?client_id=&response_type=code&redirect_uri=http://127.0.0.1:3000/main&scope=write&state=mystate&approval_prompt=force`;
    // for deployment
    //window.location.href = `https://www.strava.com/oauth/authorize?client_id=&response_type=code&redirect_uri=http://128.199.112.157/main&scope=write&state=mystate&approval_prompt=force`
  }
  render() {
    return (
      <div style={divStyle} className="blockText">
        <h1>
          Introducing GPS Trail Visualizer
        </h1>
        <div id="PageDetail" className="fadeIn">
          <p>A web based application that lets you immerse yourselves into a 3D view of your running path.<br />
          Simply connect your Strava account to get started!</p>
        </div>

        <MuiThemeProvider>
          <FlatButton label="Connect With Strava" primary={true} onClick={this.login.bind(this)}/>
        </MuiThemeProvider>
      </div>
    );
  }
}

export default LoginMain;
