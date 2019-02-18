import React from 'react'
import classNames from 'classnames'
import { IndexRoute, Route } from 'react-router'
import _ from 'lodash'

import {FETCH_SESSION} from './redux/auth/actions'

import Root from './pages/Root'
import Main from './pages/Main'
import Map from './pages/map/Map'
import Album from './pages/album/Album'
import Login from './pages/auth/Login'
/**
 * Includes Sidebar, Header and Footer.
 */

export default function({dispatch, getState}) {
	const requireLogin = (nextState, replace, cb) => {
		const check = () => {
			const {auth} = getState()

			if (!auth.has('user')) {
				replace({pathname: '/login', query: {next: '/main'}})
			}
			cb()
		}
		const auth = getState().auth
		let query = nextState.location.query		
		if(query.SAMLRequest){
			query.next = '/main'
			replace({pathname: '/login', query: query})
			cb()
		}else{
			if (auth.get('initialized')) {
				check()
			} else {
				dispatch(FETCH_SESSION()).then(check, check)
			}
		}		
	}
	const skipIfLoggedIn = (nextState, replace, cb) => {
		const check = () => {
			const {auth} = getState()
			const next = _.get(nextState, 'location.query.next', '/main')
			if (auth.has('user')) {
				replace({pathname: next})
			}
			cb()
		}
		const auth = getState().auth
		if (auth.get('initialized')) {
			check()
		} else {
			dispatch(FETCH_SESSION()).then(check, check)
		}
	}
	return (
		<Route path='/' component={Root}>
			<IndexRoute component={Main} onEnter={requireLogin}/>
			<Route path="login" component={Login} onEnter={skipIfLoggedIn} />
			<Route path="main" onEnter={requireLogin}>
				<IndexRoute component={Main}/>
				<Route path="map" component={Map}/>
				<Route path="album" component={Album}/>
			</Route>
	 </Route>
	)
}
