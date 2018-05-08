import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';

import App from './components/app';

class MainRouter extends Component {
  render() {
    return (
      <div>
        <Route path="/" component={App} />
        <Switch>
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
