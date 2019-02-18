import React from 'react'
import _ from 'lodash'
import {connect} from 'react-redux'
import {routeActions} from 'react-router-redux'

import LoadingBar from '../core/components/LoadingBar'
import Header from '../core/components/Header'

import {FETCH_LOCATIONS} from '../redux/locations/actions'
import {FETCH_SIGNS} from '../redux/signs/actions'
import {FETCH_BRANDS} from '../redux/brands/actions'
import {FETCH_PROMOS} from '../redux/promos/actions'
import {FETCH_PROMOITEMS} from '../redux/promoitems/actions'
import {FETCH_VEHICLES} from '../redux/vehicles/actions'
import {HTTP_INIT, HTTP_LOADING, HTTP_LOADING_SUCCESSED, HTTP_LOADING_FAILED} from '../core/http'

@connect(
	(state) => {
		const locations = state.locations.get('locations').toJS()
		const signs = state.signs.get('signs').toJS()
		const brands = state.brands.get('brands').toJS()
		const promos = state.promos.get('promos').toJS()
		const promoitems = state.promoitems.get('promoitems').toJS()
		const vehicles = state.vehicles.get('vehicles').toJS()
		return {
			locations: Array.isArray(locations) ? locations : [],
			signs: Array.isArray(signs) ? signs : [],
			brands: Array.isArray(brands) ? brands : [],
			promos: Array.isArray(promos) ? promos : [],
			promoitems: Array.isArray(promoitems) ? promoitems : [],
			vehicles: Array.isArray(vehicles) ? vehicles : [],
		}
	},
	{FETCH_LOCATIONS, FETCH_SIGNS, FETCH_BRANDS, FETCH_PROMOS, FETCH_PROMOITEMS, FETCH_VEHICLES, push:routeActions.push}
)
export default class Map extends React.Component {
	constructor(props) {
		super(props)
		document.title = 'Implementix'
		this.state = {
			status_locations: HTTP_INIT,
			status_signs: HTTP_INIT,
			status_promos: HTTP_INIT,
			status_promoitems: HTTP_INIT,
			status_vehicles: HTTP_INIT,
			status_brands: HTTP_INIT,			
		}
	}

	componentDidMount() {
		const {FETCH_LOCATIONS, FETCH_SIGNS, FETCH_BRANDS, FETCH_PROMOS, FETCH_PROMOITEMS, FETCH_VEHICLES} = this.props
		const loadingSetter_locations = (type, val) => () =>{
			switch(type){
				case 1:
					this.setState({status_locations: val})
					break
				case 2:
					this.setState({status_signs: val})
					break
				case 3:
					this.setState({status_promos: val})
					break
				case 4:
					this.setState({status_promoitems: val})
					break
				case 5:
					this.setState({status_vehicles: val})
					break
				case 6:
					this.setState({status_brands: val})
					break
				default:
					break
			}			
		}
		// locations
		Promise.resolve(FETCH_LOCATIONS())
			.catch(loadingSetter_locations(1, HTTP_LOADING_FAILED))
			.then(loadingSetter_locations(1, HTTP_LOADING_SUCCESSED))
		loadingSetter_locations(1, HTTP_LOADING)()
		// signs
		Promise.resolve(FETCH_SIGNS())
			.catch(loadingSetter_locations(2, HTTP_LOADING_FAILED))
			.then(loadingSetter_locations(2, HTTP_LOADING_SUCCESSED))
		loadingSetter_locations(2, HTTP_LOADING)()		
		// promos
		Promise.resolve(FETCH_PROMOS())
			.catch(loadingSetter_locations(3, HTTP_LOADING_FAILED))
			.then(loadingSetter_locations(3, HTTP_LOADING_SUCCESSED))
		loadingSetter_locations(3, HTTP_LOADING)()
		// promoitems
		Promise.resolve(FETCH_PROMOITEMS())
			.catch(loadingSetter_locations(4, HTTP_LOADING_FAILED))
			.then(loadingSetter_locations(4, HTTP_LOADING_SUCCESSED))
		loadingSetter_locations(4, HTTP_LOADING)()
		// vehicles
		Promise.resolve(FETCH_VEHICLES())
			.catch(loadingSetter_locations(5, HTTP_LOADING_FAILED))
			.then(loadingSetter_locations(5, HTTP_LOADING_SUCCESSED))
		loadingSetter_locations(5, HTTP_LOADING)()
		// brands
		Promise.resolve(FETCH_BRANDS())
			.catch(loadingSetter_locations(6, HTTP_LOADING_FAILED))
			.then(loadingSetter_locations(6, HTTP_LOADING_SUCCESSED))
		loadingSetter_locations(6, HTTP_LOADING)()
	}

	componentWillUpdate(nextProps, nextState) {
		const {status_locations, status_signs, status_brands, status_promos, status_promoitems, status_vehicles} = nextState

		// check is loading
		let loading_locations = status_locations <= HTTP_LOADING
		let loading_signs = status_signs <= HTTP_LOADING
		let loading_brands = status_brands <= HTTP_LOADING
		let loading_promos = status_promos <= HTTP_LOADING
		let loading_promoitems = status_promoitems <= HTTP_LOADING
		let loading_vehicles = status_vehicles <= HTTP_LOADING
		let isLoading = loading_locations || loading_signs || loading_brands || loading_promos || loading_promoitems || loading_vehicles

		if(!isLoading){
			const {push} = nextProps
			push('/main/map')
		}
	}

	render(){
		const {status_locations, status_signs, status_brands, status_promos, status_promoitems, status_vehicles} = this.state

		// check is loading
		let loading_locations = status_locations <= HTTP_LOADING
		let loading_signs = status_signs <= HTTP_LOADING
		let loading_brands = loading_brands <= HTTP_LOADING
		let loading_promos = status_promos <= HTTP_LOADING
		let loading_promoitems = status_promoitems <= HTTP_LOADING
		let loading_vehicles = status_vehicles <= HTTP_LOADING
		let isLoading = loading_locations || loading_signs || loading_brands || loading_promos || loading_promoitems || loading_vehicles

		return (			
			<div className='main'>
				{!isLoading && <Header isMapView={true}/>}
				{isLoading && <LoadingBar/>}
			</div>
		)
	}
}