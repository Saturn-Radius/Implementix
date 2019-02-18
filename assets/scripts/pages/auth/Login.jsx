import _ from 'lodash'
import classNames from 'classnames'
import {connect} from 'react-redux'
import React from 'react'
import {routeActions} from 'react-router-redux'
import {Link} from 'react-router'

import {LOGIN} from '../../redux/auth/actions'
import LoginForm from './LoginForm'

@connect(
	(state) => {return {nextLocation: _.get(state, 'routing.location.query.next', '/')}},
	{LOGIN, push: routeActions.push}
)
export default class LoginPage extends React.Component {
	constructor(props) {
		super(props)
		document.title = 'Implementix - Log In'
		this.state = {
			loading: false
		}
	}

	componentDidMount() {
	}

	componentWillUnmount() {
	}

	handleSubmit(form) {
		let width = $(window).width()
		let height = $(window).height()
		let min = Math.min(width, height)
		let isMobile = min < 768
		const {LOGIN, push, nextLocation} = this.props
		this.setState({loading: true})
		return Promise.resolve(LOGIN(form))
			.catch((err) => {
				this.setState({loading: false})
				return Promise.reject(_.result(err, 'toFieldErrors'))
			})
			.then((v) => {
				// store token
				let token = v.data.$original.token
				localStorage.setItem('token', token)
				// do login
				this.setState({loading: false})
				if(this.props.location.query.SAMLRequest)
					window.location = '/sso?auth=' + this.props.location.query.SAMLRequest
				else{
					// setCookie
					if(process.env.CONFIG_IS_SANDBOX == 'true')
						push(nextLocation)
					else if(isMobile){
						push(nextLocation)
					}else{
						window.location = 'https://implementix.trackvia.com/#/home'
					}	
				}
				return v
			})
	}

	render() {		
		return (
			<div className='login_container'>
				<LoginForm onSubmit={::this.handleSubmit} loading={this.state.loading}/>
			</div>
		)
	}
}