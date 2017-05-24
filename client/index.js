import React from 'react';
import ReactDOM from 'react-dom';

// Redux
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import rootReducer from './reducers';
import { Router, browserHistory } from 'react-router';
import routes from './routes';
let store = createStore(rootReducer);

// Entry point
Meteor.startup(() => {
  ReactDOM.render(
    <Provider store={store}>
      <Router history={browserHistory} routes={routes}/>
    </Provider>,
    document.getElementById('render-target'));
})
