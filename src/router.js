import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';

import Dashboard from './components/dashboard';
import Storyboard from './components/storyboard';
import SimpleEditor from './components/draft-js/simple-editor';
import MainWrapper from './components/main-wrapper';

class MainRouter extends Component {
  render() {
    return (
      <div>
        <Route path="/" component={MainWrapper} />
        <Switch>
          <Route path="/draft-js" component={SimpleEditor} />
          <Route path="/storyboard" component={Storyboard} />
          <Route path="/" component={Dashboard} />
          {/* <Route path="/signin" component={Signin} />
          <Route path="/signout" component={Signout} />
          <PrivateRoute path="/log/success" component={SuccessLog} />
          <PrivateRoute path="/log/error" component={ErrorLog} /> */}
        </Switch>
      </div>
    )
  }
}

export default MainRouter;
