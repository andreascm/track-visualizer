import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { Gps } from '../../imports/collections/gps';
import ShareVideo from './ShareVideo';

class ShareVideoContainer extends Component {
  propTypes: {
   data: React.PropTypes.array.isRequired
  }
  render() {
    // this.props.data is in an object instead of an array
    console.log(this.props.data);
    if (!this.props.data) {
      return (
        <div>Loading...</div>
      );
    }
    return (
      <div>
        <ShareVideo data={this.props.data.content}/>
      </div>
    );
  }
}

export default createContainer((props) => {
  // this.props.params.id is to get the id in the url field given in the url
  const { id } = props.params;
  Meteor.subscribe('gps');

  return { data: Gps.findOne({ id: id}) }
}, ShareVideoContainer);



//Users.findOne({}, { fields: { 'alterEgos.name': 1, _id: 0 } });
