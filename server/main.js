import { Meteor } from 'meteor/meteor';
import '../imports/collections/gps';
import { Gps } from '../imports/collections/gps';
import axios from 'axios';

Meteor.startup(() => {
  Meteor.publish('gps', function() {
    return Gps.find({});
  });

  //http://stackoverflow.com/questions/38884522/promise-pending
  Meteor.methods({
    // this method will return the access_token
    'getAccessToken':function(code) {
      return axios.post(`https://www.strava.com/oauth/token?client_id=&client_secret=&code=${code}`)
        .then(response => {
          return response.data;
        });
    },

    'getIndividualActivity':function(id, access_token) {
      return axios.get(`https://www.strava.com/api/v3/activities/${id}?access_token=${access_token}`)
        .then(response => {
          return response.data
        });
    }
  });
});
