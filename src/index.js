import React from 'react';
import ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';
import './scss/index.min.css';

import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import { BrowserRouter as Router } from 'react-router-dom';
import reduxThunk from 'redux-thunk';

import { rootReducer as reducer } from './redux';
import MainRouter from './router.js';

const store = createStore(
  reducer,
  compose(
    applyMiddleware(reduxThunk),
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
  )
);

// const token = localStorage.getItem('token');
//
// if (token) {
//   store.dispatch({ type: AUTH_USER })
// }


ReactDOM.render(
  <Provider store={store}>
    <Router>
      <MainRouter />
    </Router>
  </Provider>
  , document.getElementById('root')
);
registerServiceWorker();
