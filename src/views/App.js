/*global __CLIENT__*/
import React from 'react';
import {Link} from 'react-router';
import {load} from '../actions/infoActions';
import InfoBar from '../components/InfoBar';
if (__CLIENT__) {
  require('./App.scss');
}

export default class App {
  render() {
    return (
      <div className="container app">
        <div className="jumbotron">
          <h1>React Redux Example</h1>

          <p>
            by <a href="https://twitter.com/erikras" target="_blank">@erikras</a>
            <a className="github" href="https://github.com/erikras/react-redux-universal-hot-example" target="_blank">
              <i className="fa fa-github"/> View on Github
            </a>
          </p>
          <iframe
            src="https://ghbtns.com/github-btn.html?user=erikras&repo=react-redux-universal-hot-example&type=star&count=true&size=large"
            frameBorder="0" allowTransparency="true" scrolling="0" width="160px" height="30px"></iframe>
          <iframe
            src="https://ghbtns.com/github-btn.html?user=erikras&amp;repo=react-redux-universal-hot-example&amp;type=fork&amp;count=true&size=large"
            allowTransparency="true" frameBorder="0" scrolling="0" width="160px" height="30px"></iframe>
        </div>
        <nav className="navbar navbar-default">
          <div className="container-fluid">
            <ul className="nav navbar-nav">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/sign-up">Sign Up</Link></li>
              <li><Link to="/login">Login</Link></li>
            </ul>
          </div>
        </nav>
        <InfoBar/>

        <div className="app-content">
          {this.props.children}
        </div>
      </div>
    );
  }

  static fetchData(dispatch) {
    return dispatch(load());
  }
}
