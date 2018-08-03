import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Nav extends Component {
  render() {
    return (
      <nav>
        <Link to="/">Dashboard</Link>
        <Link to="/storyboard">Storyboard</Link>
      </nav>
    );
  }
}

export default Nav;
