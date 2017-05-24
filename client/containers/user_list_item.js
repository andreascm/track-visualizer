import React, { Component } from 'react';
import Avatar from 'material-ui/Avatar';
import {List, ListItem} from 'material-ui/List';
import RunningIcon from 'material-ui/svg-icons/Maps/directions-run';
import ShareIcon from 'material-ui/svg-icons/Social/share';
import VideoIcon from 'material-ui/svg-icons/Notification/ondemand-video';
import {blue500, yellow600, darkBlack} from 'material-ui/styles/colors';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import { ShareButtons, ShareCounts, generateShareIcon } from 'react-share';
import polyline from 'polyline';
import RefreshIndicator from 'material-ui/RefreshIndicator';

/* mongoDB */
import { createContainer } from 'meteor/react-meteor-data';
import { Gps } from '../../imports/collections/gps';

/* Redux */
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { inputData } from '../actions/index';
import { inputAddress } from '../actions/index';

/* React Router */
import {browserHistory} from 'react-router';


const customContentStyle = {
  width: '100%',
  maxWidth: 'none',
};
const {
  FacebookShareButton,
  GooglePlusShareButton,
  TwitterShareButton,
} = ShareButtons;

const FacebookIcon = generateShareIcon('facebook');
const TwitterIcon = generateShareIcon('twitter');
const GooglePlusIcon = generateShareIcon('google');

const style = {
  container: {
    position: 'relative',
  },
  refresh: {
    display: 'inline-block',
    position: 'relative',
  },
};

class UserListitem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      loading: false,
    };
  }

  shareVideo() {
    console.log("sharing video");
  };

  handleOpen = () => {
    // Close button
    this.setState({open: true});
  };

  handleClose = () => {
    // Submit button
    this.setState({open: false});
  };

  linkToVideo = () => {
    // insert into Db here
    // let decodedPolyline = polyline.decode(this.props.item.map.polyline);
    // this.props.inputData(decodedPolyline);
    // browserHistory.push("video/" + this.props.item.id);
    returnPath = window.location.href;
    this.props.inputAddress(returnPath);
    Meteor.call('getIndividualActivity',this.props.item.id, this.props.access_token,(err,res) => {
      if (err) {
        console.log(err);
      } else {
        console.log(res);
        let decodedPolyline = polyline.decode(res.map.polyline);
        this.props.inputData(decodedPolyline);
        browserHistory.push("video/" + this.props.item.id);
      }
    });

  };


  handleClick = () => {
    returnPath = window.location.href;
    this.props.inputAddress(returnPath);

    // add a loading screen
    // set a loading state to true
    this.setState({ loading: true });

    Meteor.call('getIndividualActivity',this.props.item.id, this.props.access_token,(err,res) => {
      if (err) {
        console.log(err);
      } else {
        console.log(res);
        let decodedPolyline = polyline.decode(res.map.polyline);
        let id = this.props.item.id.toString(); // have to convert it to string as meteor does not allow int as _id.
        this.props.inputData(decodedPolyline);
        this.setState({ loading: false });
      }
    });
  };

  // handleClick = () => {
  //   this.props.inputData(this.props.polyline);
  //   let id = this.props.item.id.toString();
  //   Meteor.call('gps.insert', id, this.props.polyline);
  // }

  render() {
    // this was passed from user_list.js
    const item = this.props.item;
    const date = item.start_date;  // this is a string
    const newDate = date.slice(8,10) + "/" + date.slice(5,7) + " " + item.name;
    const minutes = Math.floor(item.elapsed_time/60);
    const seconds = item.elapsed_time - (minutes * 60);


    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={this.handleClose}
      />,
      // add another action here to create another button
    ];

    // For development purpose only
    // const shareUrl = `http://127.0.0.1:3000/shareVideo/${this.props.item.id}`;

    const shareUrl = `http://128.199.112.157/shareVideo/${this.props.item.id}`;
    const title = 'Check out where i run today!';

    if (this.state.loading == true) {
      return (
        <div style={style.container}>
          <RefreshIndicator
            size={50}
            left={70}
            top={0}
            loadingColor="#FF9800"
            status="loading"
            style={style.refresh}
          />
        </div>
      );
    }
    else {
      return (
        <div>
          <ListItem
            primaryText={newDate}
            //item.caloriesBurnedSummary.totalCalories
            secondaryText={
              <p>
                <span style={{color: darkBlack}}>Total Distance</span> --
                {item.distance/1000 + " km"}<br />
                <span style={{color: darkBlack}}>Time Taken</span> --
                {minutes + " min " + seconds + " s"}<br />
              </p>
            }
            secondaryTextLines={2}
            leftAvatar={<Avatar icon={<RunningIcon />} backgroundColor={blue500} />}
            initiallyOpen={false}
            primaryTogglesNestedList={true}
            onClick={this.handleClick.bind(this)}
            // onClick={() => Meteor.call('gps.insert', this.props.item.id, this.props.item.mapPoints)}
            nestedItems={[
              <ListItem
                key={1}
                primaryText="Video"
                leftIcon={<VideoIcon />}
                onTouchTap={this.linkToVideo.bind(this)}
              />,
              <ListItem
                key={2}
                primaryText="Share this Video"
                leftIcon={<ShareIcon />}
                onTouchTap={this.handleOpen}
              />
            ]}
          />
          <Dialog
            title="Click below to choose which platform you want to share with."
            actions={actions}
            modal={true}
            contentStyle={customContentStyle}
            open={this.state.open}
          >
          {/* add share button */}
          <div className="shareContainer">
            <FacebookShareButton
                url={shareUrl}
                title={title}
                className="share-button">
                <FacebookIcon
                  size={32}
                  round />
            </FacebookShareButton>
            <TwitterShareButton
              url={shareUrl}
              title={title}
              className="share-button">
              <TwitterIcon
                size={32}
                round />
            </TwitterShareButton>
            <GooglePlusShareButton
              url={shareUrl}
              className="share-button">
              <GooglePlusIcon
                size={32}
                round />
            </GooglePlusShareButton>
          </div>
          </Dialog>
        </div>
      );
    }
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ inputData, inputAddress }, dispatch)
}

export default connect(null, mapDispatchToProps)(UserListitem);
