import React from 'react';
import { Route, IndexRoute } from 'react-router';

import App from './components/app';
import Main from './main';
import Video from './containers/hyperlapse_video';
import LoginMain from './login';
import ShareVideoContainer from './containers/ShareVideoContainer';

export default (
  <Route path="/" component={App}>
    <IndexRoute component={LoginMain} />
    <Route path="main" component={Main} />
    <Route path="video/:id" component={Video} />
    <Route path="shareVideo/:id" component={ShareVideoContainer} />
  </Route>
);
