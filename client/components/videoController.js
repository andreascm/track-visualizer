import React, { Component } from 'react';
import Paper from 'material-ui/Paper';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import injectTapEventPlugin from 'react-tap-event-plugin';
import LinearProgress from 'material-ui/LinearProgress';
import Slider from 'material-ui/Slider';

/* React Router */
import {browserHistory} from 'react-router';

// const style = {
//   height: 100,
//   width: 100,
//   margin: 20,
//   textAlign: 'center',
//   display: 'inline-block',
// };

// the children of paper must be a react node. e.g. <App />
class VideoController extends Component {
  constructor(props) {
    super(props);
    this.state = {
      playBool: true,
      slider: 0,
      sliderMax: 0,
    };
    this.loadingScreen = this.loadingScreen.bind(this);
  }

  loadingScreen() {
    // console.log(typeof this.props.Length);
    if (this.props.LoadingBool == true) {
      if (typeof this.props.Length == 'string' || typeof this.props.Value == 'string') {
        return (
          <div className="loader">
            <p>
              Generating Route...
            </p>
            <MuiThemeProvider>
              <LinearProgress mode="indeterminate" />
            </MuiThemeProvider>
          </div>
        );
      }
      else {
        let percentage = Math.round((this.props.Value / this.props.Length) * 100);
        return (
          <div className="loader">
            <div className="percentage">
              <p>
                {percentage}%
              </p>
              <MuiThemeProvider>
                <LinearProgress  mode="determinate" value={percentage}/>
              </MuiThemeProvider>
            </div>
          </div>
        );
      }
    }

    else if (this.props.LoadingBool == false) {

      // load the pause play buttons here.
      if (this.state.playBool == true) {
        return (
          <div className="controlsContainer">
            <div className="image">
              <img src={'/images/up_arrow.png'} onClick={this.rotateUp.bind(this)}/>
              <img src={'/images/left_arrow.png'} onClick={this.rotateLeft.bind(this)}/>
              <img src={'/images/prev.png'} onClick={this.prevHandler.bind(this)}/>
              <img src={'/images/fast-rewind.png'} onClick={this.decreaseSpeed.bind(this)}/>
              <img src={'/images/pause.png'} onClick={this.pauseButton.bind(this)}/>
              <img src={'/images/fast-forward.png'} onClick={this.increaseSpeed.bind(this)}/>
              <img src={'/images/next.png'} onClick={this.nextHandler.bind(this)}/>
              <img src={'/images/right_arrow.png'} onClick={this.rotateRight.bind(this)}/>
              <img src={'/images/down_arrow.png'} onClick={this.rotateDown.bind(this)}/>
            </div>
            {/* <MuiThemeProvider>
              <Slider value={this.state.slider} min={0} max={this.state.sliderMax-1} step={1} onChange={this.handelSlider}/>
            </MuiThemeProvider> */}
          </div>
        );
      }
      else {
        return (
          <div className="controlsContainer">
            <div className="image">
              <img src={'/images/up_arrow.png'} onClick={this.rotateUp.bind(this)}/>
              <img src={'/images/left_arrow.png'} onClick={this.rotateLeft.bind(this)}/>
              <img src={'/images/prev.png'} onClick={this.prevHandler.bind(this)}/>
              <img src={'/images/fast-rewind.png'} onClick={this.decreaseSpeed.bind(this)}/>
              <img src={'/images/play.png'} onClick={this.resumeButton.bind(this)}/>
              <img src={'/images/fast-forward.png'} onClick={this.increaseSpeed.bind(this)}/>
              <img src={'/images/next.png'} onClick={this.nextHandler.bind(this)}/>
              <img src={'/images/right_arrow.png'} onClick={this.rotateRight.bind(this)}/>
              <img src={'/images/down_arrow.png'} onClick={this.rotateDown.bind(this)}/>
            </div>
            {/* <MuiThemeProvider>
              <Slider value={this.state.slider} min={0} max={this.state.sliderMax-1} step={1} onChange={this.handelSlider}/>
            </MuiThemeProvider> */}
          </div>
        );
      }
    }
  }

  prevHandler() {
    this.setState({ playBool: false });
    hyperlapse.prev();
  }

  nextHandler() {
    this.setState({ playBool: false });
    hyperlapse.next();
  }

  pauseButton() {
    hyperlapse.pause();
    this.setState({ playBool: false });
  }

  resumeButton() {
    hyperlapse.play();
    this.setState({ playBool: true });
  }

  increaseSpeed() {
    hyperlapse.millis -=20;
    // browserHistory.goBack();
  }

  decreaseSpeed() {
    hyperlapse.millis +=20;
  }

  rotateLeft() {
    hyperlapse.position.x -= 20;
  }

  rotateRight() {
    hyperlapse.position.x += 20;
  }

  rotateUp() {
    hyperlapse.position.y +=20;
  }

  rotateDown() {
    hyperlapse.position.y -=20;
  }


  render() {
    return (
      <div>{this.loadingScreen()}</div>
    );
  }
}

export default VideoController;
