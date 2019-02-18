import _ from 'lodash'
import {reduxForm} from 'redux-form'
import React from 'react'
import {Button, Form, Message, Input} from 'semantic-ui-react'

import {LOGIN} from '../../redux/auth/actions'

function validateLogin(data) {
	const required = [
		'username',
		'password',
	]
	const errors = {}

	required.forEach(function(f) {
		if (!_.get(data, f)) {
			_.set(errors, f, 'Required')
		}
	})  
	return errors
}

@reduxForm({
	form: 'login',
	fields: [
		'username',
		'password'
	],
	validate: validateLogin,
})
export default class LoginForm extends React.Component {
	constructor(props) {
		super(props)
		this.isFirst = true
	}
	render() {
		const {submitting, error, fields: {username, password}, handleSubmit} = this.props
		username.error = !!username.error
		password.error = !!password.error
		
		delete username.initialValue
		delete username.onUpdate
		delete username.valid
		delete username.invalid
		delete username.dirty
		delete username.pristine
		delete username.active
		delete username.touched
		delete username.visited
		delete password.initialValue
		delete password.onUpdate
		delete password.valid
		delete password.invalid
		delete password.dirty
		delete password.pristine
		delete password.active
		delete password.touched
		delete password.visited

		let showError = !this.isFirst && (username.error || password.error)
		this.isFirst = false

		return (
			<div className="login_form">
				<img className='login_logo' src={asset('/assets/resources/images/login/logo.svg')}/> 
				<Form error={showError} onSubmit={handleSubmit}>
					<div className='input_container'>
						<Form.Field>
							<Input type='email' {...username} focus placeholder='Email Address'/>
						</Form.Field>
						<Form.Field>
							<Input type='password' {...password} placeholder='Password'/>
						</Form.Field>
					</div>
					<Message error content='Incorrect username or password.'/>
					<div className='input_submit'>
						<a className='forgotPassword' href='https://implementix.trackvia.com/#/signin'>Forgot password?</a>
						<Button color='green' loading={this.props.loading} disabled={this.props.loading}>Sign In</Button>
					</div>
				</Form>
			</div>
		)
	}
}