import classNames from 'classnames'
import React from 'react'
import {connect} from 'react-redux'
import Modal from 'react-modal'
import Notifications from '../core/components/notifications/Notifications'

@connect((state) => {
  return {
    navigation: state.navigation.toJS()
  }
}, {})
class Root extends React.Component {
  constructor(props){
    super(props)
  }
  render() {
    const {navigation} = this.props
    return (
      <div id='root'>
        <Notifications />
        {this.props.children}          
      </div>
    )
  }
}
export default Root
