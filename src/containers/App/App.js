import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import DocumentMeta from 'react-document-meta';
import { isLoaded as isInfoLoaded, load as loadInfo } from 'redux/modules/info';
import { isLoaded as isAuthLoaded, load as loadAuth, logout } from 'redux/modules/auth';
import { InfoBar } from 'components';
import { pushState } from 'redux-router';

const title = 'React Redux Example';
const description = 'All the modern best practices in one example.';
const image = 'https://react-redux.herokuapp.com/logo.jpg';

const meta = {
  title,
  description,
  meta: {
    charSet: 'utf-8',
    property: {
      'og:site_name': title,
      'og:image': image,
      'og:locale': 'en_US',
      'og:title': title,
      'og:description': description,
      'twitter:card': 'summary',
      'twitter:site': '@erikras',
      'twitter:creator': '@erikras',
      'twitter:title': title,
      'twitter:description': description,
      'twitter:image': image,
      'twitter:image:width': '200',
      'twitter:image:height': '200'
    }
  }
};

const NavbarLink = ({to, children}) => (
  <Link to={to} activeStyle={{
    color: 'red'
  }}>
    {children}
  </Link>
);

@connect(
  state => ({user: state.auth.user}),
  {logout, pushState})
export default class App extends Component {
  static propTypes = {
    children: PropTypes.object.isRequired,
    user: PropTypes.object,
    logout: PropTypes.func.isRequired,
    pushState: PropTypes.func.isRequired
  };

  static contextTypes = {
    store: PropTypes.object.isRequired
  };

  componentWillReceiveProps(nextProps) {
    if (!this.props.user && nextProps.user) {
      // login
      this.props.pushState(null, '/loginSuccess');
    } else if (this.props.user && !nextProps.user) {
      // logout
      this.props.pushState(null, '/');
    }
  }

  static fetchData(getState, dispatch) {
    const promises = [];
    if (!isInfoLoaded(getState())) {
      promises.push(dispatch(loadInfo()));
    }
    if (!isAuthLoaded(getState())) {
      promises.push(dispatch(loadAuth()));
    }
    return Promise.all(promises);
  }

  handleLogout(event) {
    event.preventDefault();
    this.props.logout();
  }

  render() {
    const {user} = this.props;
    const styles = require('./App.scss');
    return (
      <div className={styles.app}>
        <DocumentMeta {...meta}/>
        <nav className="navbar navbar-default navbar-fixed-top">
          <div className="container">
            <Link to="/" className="navbar-brand">
              <div className={styles.brand}/>
              React Redux Example
            </Link>

            <ul className="nav navbar-nav">
              {user && <li><NavbarLink to="/chat">Chat</NavbarLink></li>}

              <li><NavbarLink to="/widgets">Widgets</NavbarLink></li>
              <li><NavbarLink to="/survey">Survey</NavbarLink></li>
              <li><NavbarLink to="/about">About Us</NavbarLink></li>
              {!user && <li><NavbarLink to="/login">Login</NavbarLink></li>}
              {user && <li className="logout-link"><a href="/logout" onClick={::this.handleLogout}>Logout</a></li>}
            </ul>
            {user &&
            <p className={styles.loggedInMessage + ' navbar-text'}>Logged in as <strong>{user.name}</strong>.</p>}
            <ul className="nav navbar-nav navbar-right">
              <li>
                <a href="https://github.com/erikras/react-redux-universal-hot-example"
                   target="_blank" title="View on Github"><i className="fa fa-github"/></a>
              </li>
            </ul>
          </div>
        </nav>
        <div className={styles.appContent}>
          {this.props.children}
        </div>
        <InfoBar/>

        <div className="well text-center">
          Have questions? Ask for help <a
          href="https://github.com/erikras/react-redux-universal-hot-example/issues"
          target="_blank">on Github</a> or in the <a
          href="http://www.reactiflux.com/" target="_blank">#react-redux-universal</a> Slack channel.
        </div>
      </div>
    );
  }
}
