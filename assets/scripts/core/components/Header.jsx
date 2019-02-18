import React from 'react'
import _ from 'lodash'
import {connect} from 'react-redux'
import {routeActions} from 'react-router-redux'

import {LOGOUT, UPDATE_ZIPCODES} from '../../redux/auth/actions'
import { Icon, Input, Label } from 'semantic-ui-react'

@connect(
	(state) => {
		const u = state.auth.get('user')
		return {
			user: u ? u.toJS() : null
		}
	},
	{LOGOUT, UPDATE_ZIPCODES, push:routeActions.push, replace: routeActions.replace}
)
export default class Header extends React.Component {	
	switchView(isMapView){
		const {push} = this.props
		push(isMapView ? '/main/map' : '/main/album')
	}

	logout() {
		const {LOGOUT, replace} = this.props
		return Promise.resolve(LOGOUT())
			.then(() => {
				localStorage.removeItem('token')
				replace('/login')
			})
	}

	onSearch(){
		let search = this.refs.inputSearch.inputRef.value
		if (typeof this.props.onSearch === 'function') {
			this.props.onSearch(search.toLowerCase(), false, 0)
		}
	}

	onDelete(){
		if(this.refs.inputSearch.inputRef.value == '')
			return
		this.refs.inputSearch.inputRef.value = ''		
		if (typeof this.props.onSearch === 'function') {
			this.props.onSearch('', false, 0)
		}
	}

	onKeyDown(event){
		let search = this.refs.inputSearch.inputRef.value
		if(event.keyCode == 13 && typeof this.props.onSearch === 'function'){
			this.props.onSearch(search.toLowerCase(), false, 0)
		}
	}

	onClickTrackvia(event){
		window.open('https://implementix.trackvia.com/', '_blank')
	}

	updateZipcodes(){
		const {UPDATE_ZIPCODES, replace} = this.props
		return Promise.resolve(UPDATE_ZIPCODES())
			.then(() => {
				console.log('update zipcodes done')
			})
	}

	render() {
		const {isMapView} = this.props
		const styleMap = !!isMapView ? 'header_tab selected' : 'header_tab'
		const styleAlbum = !isMapView ? 'header_tab selected' : 'header_tab'
		return (
			<div className='header_container'>
				<div className={isMapView ? "header_search" : "header_search full"}>
					<Icon 
						className='btn_search'
						name='search' 
						link 
						onClick={::this.onSearch}
					/>
					<Input
						ref="inputSearch" 
						placeholder="Search..."
						type="text"
						size="small"
						onKeyDown={::this.onKeyDown}
						icon={
							<Icon 
								name='delete' 
								inverted circular link 
								onClick={::this.onDelete}
							/>
						}
					/>
				</div>
				<div className='header_switch'>
					<div className={styleMap} onClick={this.switchView.bind(this, true)}>Map</div>
					<div className={styleAlbum} onClick={this.switchView.bind(this, false)}>Album</div>
				</div>
				<div className='logout' onClick={::this.logout}>
					<i className='fa fa-power-off'/>
				</div>
				<div className='trackvia' onClick={::this.onClickTrackvia}>
					<img src={asset('/assets/resources/images/trackvia.svg')} />
				</div>
			</div>
		)
	}
}