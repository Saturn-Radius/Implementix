import _ from 'lodash'
import {handleActions} from 'redux-actions'
import {fromJS, List, Map, OrderedMap, Set} from 'immutable'

import {createAsyncHandlers} from '../actions'

const initialState = Map({
	initialized: false,
	loading: Set(),
	errors: Map(),
})

const loadUser = (state, action) => {
	let user = fromJS(_.get(action, 'payload.data'))
	// if(!!user)console.log('loadUser = ', user.toJS())
	let next = initialState.set('initialized', !!user)
	if(user)
		next = next.set('user', user)
	return next
}

const FETCH_SESSION = createAsyncHandlers('FETCH_SESSION', {
	success: loadUser
})

const LOGIN = createAsyncHandlers('LOGIN', {
	success: loadUser
})

const FACEBOOK_LOGIN = createAsyncHandlers('FACEBOOK_LOGIN', {
	success: loadUser
})

const LOGOUT = createAsyncHandlers('LOGOUT', {
	success: loadUser
})

const REGISTER = createAsyncHandlers('REGISTER', {
	success: loadUser
})

const UPDATE = createAsyncHandlers('UPDATE', {
	success: loadUser
})

const UPDATE_ZIPCODES = createAsyncHandlers('UPDATE_ZIPCODES', {
	success: loadUser
})

export default handleActions({
	...FETCH_SESSION,
	...LOGIN,
	...FACEBOOK_LOGIN,
	...LOGOUT,
	...REGISTER,
	...UPDATE,
	...UPDATE_ZIPCODES,
}, initialState)
