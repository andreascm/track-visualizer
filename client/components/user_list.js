import React, { Component } from 'react';
import MobileTearSheet from './MobileTearSheet';
import {List, ListItem} from 'material-ui/List';
import ActionInfo from 'material-ui/svg-icons/action/info';
import Divider from 'material-ui/Divider';
import Subheader from 'material-ui/Subheader';
import Avatar from 'material-ui/Avatar';
import FileFolder from 'material-ui/svg-icons/file/folder';
import ActionAssignment from 'material-ui/svg-icons/action/assignment';
import {blue500, yellow600} from 'material-ui/styles/colors';
import RunningIcon from 'material-ui/svg-icons/Maps/directions-run';
import UserListitem from '../containers/user_list_item';
import Infinite from 'react-infinite';
import axios from 'axios';
import polyline from 'polyline';

// This file calls the mshealth api and get the data from its server and pass them as props to user_list_item.
class UserList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      _Greeting: '',
      _runActivity: [],
    };
  }

  render() {
    // console.log(this.props.user_activities);
    let Greeting = `Welcome, ${this.props.name}`;
    // const activity = this.state._runActivity;
    const activity = this.props.user_activities;
    // over here can introduce the material loading.
    if (!activity) {
      return <div>Loading...</div>
    }

    const ListViewItem = activity.map((item) => {
      if (!item) {
        return <div>Loading...</div>
      } else {
        return (
          <UserListitem key={item.id} item={item} access_token={this.props.access_token}/>
        );
      }
    });

    return (
      <Infinite containerHeight={900} elementHeight={650} className="userlist">
        <MobileTearSheet>
          <List>
            <ListItem
             primaryText={Greeting}
             leftAvatar={<Avatar src="http://writm.com/wp-content/uploads/2016/08/Cat-hd-wallpapers.jpg" />}
            />
          </List>
          <Divider inset={true} />
          <List>
            <Subheader inset={true}>Trails</Subheader>
              {ListViewItem}
          </List>
        </MobileTearSheet>
      </Infinite>
    );
  }
}

export default UserList;
