import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import Slider from 'material-ui/Slider';
import LinearProgress from 'material-ui/LinearProgress';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

let elevation = 0;
let individualPoints = [];
let pano = document.getElementById('pano');
let px, py;
let onPointerDownPointerX=0, onPointerDownPointerY=0;

class ShareVideo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Progress: '',
      Length: '',
      Value: '',
      playBool: true,
      LoadingBool: true,
      isMoving: false,
      px: null,
      py: null,
      onPointerDownPointerX: 0,
      onPointerDownPointerY: 0,
      data: [],
      sliderPosition: 0,
      sliderMax: 1,
      xPosition: null,
      yPosition: null,
      open: true,
    };
  }


  handleMouseDown(e) {
    e.preventDefault();

    console.log("handleMouseDown");
    this.setState({
      isMoving: true,
      onPointerDownPointerX: e.clientX,
      onPointerDownPointerY: e.clientY,
      px: hyperlapse.position.x,
      py: hyperlapse.position.y
    });
  }

  handleMouseMove(e) {
    e.preventDefault();

    let f = hyperlapse.fov() / 500;
    if (this.state.isMoving) {
      let dx = ( this.state.onPointerDownPointerX - e.clientX ) * f;
      let dy = ( e.clientY - this.state.onPointerDownPointerY ) * f;
      hyperlapse.position.x = this.state.px + dx; // reversed dragging direction (thanks @mrdoob!)
      hyperlapse.position.y = this.state.py + dy;
      this.setState({ xPosition: hyperlapse.position.x, yPosition: hyperlapse.position.y });
    }
  }

  handleMouseUp(e) {
    hyperlapse.position.x = this.state.xPosition;
    hyperlapse.position.y = this.state.yPosition;

    this.setState({
      isMoving: false,
    });
  }

  componentDidMount() {

    // let { data } = this.props;
		// let startPoint_lat = data[0].location.latitude/10000000;
		// let startPoint_lng = data[0].location.longitude/10000000;
		// let endPoint_lat = data[data.length-1].location.latitude/10000000;
		// let endPoint_lng = data[data.length-1].location.longitude/10000000;
    /* panorama */


    /* For new Hyperlapse.js */
    const runningPath = this.props.data.map((data) => {
      if (typeof data !== 'undefined') {
        // const lat = data.location.latitude/10000000;
        // const lng = data.location.longitude/10000000;

        // running_cord.push({lat: data[0], lng: data[1] });
        individualPoints.push(new google.maps.LatLng(data[0], data[1]));
      }
    });

    let startPoint = individualPoints[0];
    let endPoint = individualPoints[individualPoints.length-1];

    // calculating the midpoint of the start and end coordinates
    let centrePoint = google.maps.geometry.spherical.interpolate(endPoint, startPoint, 0.5);

    /* Map */
    let map = new google.maps.Map(document.getElementById('video_map'), {
      zoom: 13,
      center: centrePoint,
      // coordinates of Singapore
    });

    //this marker is actually correct. DO NOT CONFUSE.
    let startPointMarker = new google.maps.Marker({
      position: startPoint,
      map: map,
      icon: {
        url: '/images/flag-start-orange.png', // url
        scaledSize: new google.maps.Size(24, 24), // scaled size
        anchor: new google.maps.Point(6,24) // anchor
      }
    });

    let endPointMarker = new google.maps.Marker({
      position: endPoint,
      map: map,
      icon: {
        url: '/images/flag-finish.png', // url
        scaledSize: new google.maps.Size(24, 24), // scaled size
        anchor: new google.maps.Point(0,24) // anchor
      }
    });

    // This marker won't appear at the start.
    let cameraPinMarker = new google.maps.Marker({
      position: startPoint,
      map: map,
      icon: {
        url: '/images/runner.png',
        scaledSize: new google.maps.Size(32, 32),
      }
    });

    /* Hyperlapse */
    hyperlapse = new Hyperlapse(document.getElementById('pano'), {
  		zoom: 2,
  		use_lookat: false,
  		elevation: 50,
      fov: 80,
      millis: 50,
      width: window.innerWidth,//window.innerWidth,
      height: window.innerHeight,//window.innerHeight,
      distance_between_points: 5,
      max_points: 200,
    });

  	hyperlapse.onError = function(e) {
  		console.log(e);
  	};

    hyperlapse.onFrame = (e) => {
      cameraPinMarker.setPosition(e.point.location);
      this.setState({ sliderPosition: e.position, sliderMax: e.max-1 });
    };

    hyperlapse.onRouteProgress = (e) => {
      let dotMarker = new google.maps.Marker({
        position: e.point.location,
        draggable: false,
        icon:'/images/dot_marker.png'
      });
      dotMarker.setMap(map);
      this.setState({ Length: '' });
      this.setState({ Value: '' });
      this.setState({ Progress: "Generating Route..."});
    };
  	// This allows loading of panorama
  	hyperlapse.onRouteComplete = function(e) {
  		hyperlapse.load();
  	};

    hyperlapse.onLoadProgress = (e) => {
      // show the text and the loading screen
      const Message= "Progress: " + (e.position+1) + " of " + hyperlapse.length();
      this.setState({ Progress: "Generating Timelapse Video..."});
      this.setState({ Length: hyperlapse.length() });
      this.setState({ Value: (e.position+1)});

    };

  	// once the loading of points have been completed, play the video
  	hyperlapse.onLoadComplete = (e) => {
      // hide the loading object
      // show the controls of the video.
      this.setState({ LoadingBool: false });
  		hyperlapse.play();
  	};

  	// Google Maps API stuff here...
    // This API is for routing/finding the fastest route from point A to point B.
  	var directions_service = new google.maps.DirectionsService();

    // console.log(startPoint_lat);
    // console.log(startPoint_lng);
    // console.log(endPoint_lat);
    // console.log(endPoint_lng);
  	var route = {
  		request:{
        // sample destination, WARNING: GOOGLE MAPS AND HYPERLAPSE NEEDS TO HAVE THE SAME GPS COORDINATES
        // IF NOT THE GOOGLE MAPS API WILL NOT ACCEPT.
        // origin: new google.maps.LatLng(1.4133064, 103.8392735),
    		// destination: new google.maps.LatLng(1.419025,103.845469),

        // original route
        origin: startPoint,
        destination: endPoint,
        individualPoints : individualPoints,
  			travelMode: google.maps.DirectionsTravelMode.WALKING
  		}
  	};
    hyperlapse.generate(route);
  }

  handleSlider = (event, value) => {
    event.preventDefault();
    console.log("value: ", value);
    hyperlapse.setPosition(value);
  }


  loadingScreen() {
    // console.log(typeof this.props.Length);
    if (this.state.LoadingBool == true) {
      if (typeof this.state.Length == 'string' || typeof this.state.Value == 'string') {
        return (
          <div id="loadingController">
            <div className="loader">
              <p>
                Generating Route...
              </p>
              <MuiThemeProvider>
                <LinearProgress mode="indeterminate" />
              </MuiThemeProvider>
            </div>
          </div>
        );
      }
      else {
        let percentage = Math.round((this.state.Value / this.state.Length) * 100);
        return (
          <div id="loadingController">
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
          </div>
        );
      }
    }

    else if (this.state.LoadingBool == false) {

      // load the pause play buttons here.
      if (this.state.playBool == true) {
        return (
          <div id="controller">
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
              <div className="slider">
                <MuiThemeProvider>
                  <Slider
                    defaultValue={0}
                    value={this.state.sliderPosition}
                    min={0}
                    max={this.state.sliderMax}
                    step={1}
                    onChange={this.handleSlider}
                    style={{
                      position: 'relative',
                      top: '-10px',
                      left: '0px',
                      width: '100%',
                      height: '2px',
                    }}
                  />
                </MuiThemeProvider>
              </div>
            </div>
          </div>
        );
      }
      else {
        return (
          <div id="controller">
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
              <div className="slider">
                <MuiThemeProvider>
                  <Slider
                    defaultValue={0}
                    value={this.state.sliderPosition}
                    min={0}
                    max={this.state.sliderMax}
                    step={1}
                    onChange={this.handleSlider}
                    style={{
                      position: 'relative',
                      top: '-10px',
                      left: '0px',
                      width: '100%',
                      height: '2px',
                    }}
                  />
                </MuiThemeProvider>
              </div>
            </div>
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

  handleOpen = () => {
    // Close button
    this.setState({open: true});
  };

  handleClose = () => {
    // Submit button
    this.setState({open: false});
  };

  render() {
    const actions = [
      <FlatButton
        label="Understood"
        primary={true}
        onTouchTap={this.handleClose}
      />,
    ];

    return (
      <div>
        <MuiThemeProvider>
          <Dialog
          title="Control Descriptions"
          actions={actions}
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleClose}
        >
          <img src={'/images/controls.png'} height="200" width="400"/>
        </Dialog>
        </MuiThemeProvider>
	      <div id="video_map" className="map-container"></div>
        <div id="pano" className="video-container" onMouseDown={this.handleMouseDown.bind(this)} onMouseUp={this.handleMouseUp.bind(this)} onMouseMove={this.handleMouseMove.bind(this)} ></div>
        <div>
          {this.loadingScreen()}
        </div>
      </div>
    );
  }
}

export default ShareVideo;
