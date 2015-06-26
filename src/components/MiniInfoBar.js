/*global __CLIENT__*/
import React, {PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'redux/react';
import * as infoActions from '../actions/infoActions';
if (__CLIENT__) {
  require('./InfoBar.scss');
}

class MiniInfoBar {
  static propTypes = {
    time: PropTypes.number
  }

  render() {
    const {time} = this.props;
    return (
      <div className="mini-info-bar">
        The info bar was last loaded at
        {' '}
        <span>{time && new Date(time).toString()}</span>
      </div>
    );
  }
}

@connect(state => ({
  time: state.info.data.time
}))
export default
class MiniInfoBarContainer {
  static propTypes = {
    time: PropTypes.number,
    dispatch: PropTypes.func.isRequired
  }

  render() {
    const { time, dispatch } = this.props;
    return <MiniInfoBar time={time}/>;
    // no bindActionCreators() because this component is display-only
  }
}
