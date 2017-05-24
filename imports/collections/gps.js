import { Mongo } from 'meteor/mongo';

Meteor.methods({
  'gps.insert': function(id, content) {
    Gps.insert({ id, content });
  }
});

export const Gps = new Mongo.Collection('gps');
