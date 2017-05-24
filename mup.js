module.exports = {
  servers: {
    one: {
      host: '128.199.112.157',
      username: 'root',
      ///Users/SaiMunLee/.ssh
      pem: '/Users/SaiMunLee/.ssh/id_rsa'
      // password:
      // or leave blank for authenticate from ssh-agent
    }
  },

  meteor: {
    name: 'GPS_TrailVisualizer',
    path: './',
    servers: {
      one: {}
    },
    buildOptions: {
      serverOnly: true,
    },
    env: {
      ROOT_URL: 'http://128.199.112.157',
      // MONGO_URL: 'mongodb://localhost/meteor'
    },
    docker: {
      image: 'abernix/meteord:base', // use this image if using Meteor 1.4+

    },
    deployCheckWaitTime: 180
  },

  mongo: {
    oplog: true,
    port: 27017,
    servers: {
      one: {},
    },
  },
};
