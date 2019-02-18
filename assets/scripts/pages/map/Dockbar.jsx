import React from 'react'
import _ from 'lodash'

import {LAYER_NONE, LAYER_LOCATION, LAYER_SIGNS, LAYER_VEHICLES, LAYER_PROMOS} from '../../core/components/Layers'

import Location from './dockbar/Location'
import Signs from './dockbar/Signs'
import Vehicles from './dockbar/Vehicles'
import Promos from './dockbar/Promos'

export default class Dockbar extends React.Component{
	constructor(props) {
		super(props)
		this.state = {
			current_location: null,
			current_signs: [],
			current_promos: [],
			current_vehicles: [],
			toggle: false, // false: maximized, true: minized
		}
		this.mounted = false
	}

	componentDidMount(){
		this.mounted = true
		window.addEventListener('resize', this.updateDimensions.bind(this))
	}

	componentWillUnmount(){
		this.mounted = false
		window.removeEventListener('resize', this.updateDimensions.bind(this))
	}

	componentWillReceiveProps(nextProps) {
		let current_location=null, current_signs=[], current_promos=[], current_vehicles=[]
		if(nextProps.location_selected){
			current_location = this.getLocation(nextProps)
			current_signs = this.getSigns(nextProps)
			current_promos = this.getPromos(nextProps)
			current_vehicles = this.getVehicles(nextProps)			
		}
		this.setState({
			current_location: current_location,
			current_signs: current_signs,
			current_promos: current_promos,
			current_vehicles: current_vehicles,
		})
	}

	componentDidUpdate(prevProps, prevState) {
		this.updateDimensions()
	}

	updateDimensions(){
		if(!this.mounted)
			return
		let {location_selected, icon_selected} = this.props
		let {current_signs, current_vehicles, current_promos, toggle} = this.state

		const bottom_only_icons = -160
		let width = $('.map-dockbar').width()
		let height = $('.map-dockbar').height()
		let window_width = $(window).width()
		let left = window_width / 2 - width / 2
		let bottom = 0
		
		if(location_selected == null){
			bottom = -height
		}else{
			if(icon_selected == LAYER_NONE){ // none selected
				bottom = bottom_only_icons
			}else{
				switch(icon_selected){
					case LAYER_SIGNS: // signs
						if(current_signs.length == 0)
							bottom = bottom_only_icons
						else
							bottom = 0
						break
					case LAYER_VEHICLES: // vehicles
						if(current_vehicles.length == 0)
							bottom = bottom_only_icons
						else
							bottom = 0
						break
					case LAYER_PROMOS: // promos
						if(current_promos.length == 0)
							bottom = bottom_only_icons
						else
							bottom = 0
						break
					default:
						bottom = 0
						break
				}
			}
		}
		if(toggle)
			bottom = (height / 25) - height + 15
		$('.map-dockbar').css({
			'left': left,
			'bottom': bottom,
		})
	}

	onToggleDock(){
		this.setState({toggle: !this.state.toggle})
	}

	onClickIcon(index){
		let old = this.props.icon_selected
		let newIcon = old == index ? 0 : index
		let {current_signs, current_vehicles, current_promos} = this.state
		switch(newIcon){
			case LAYER_SIGNS: // signs
				if(current_signs.length == 0)
					return				
				break
			case LAYER_VEHICLES: // vehicles
				if(current_vehicles.length == 0)
					return
				break
			case LAYER_PROMOS: // promos
				if(current_promos.length == 0)
					return
				break
			default:
				break
		}
		this.props.onClickDockIcon(newIcon)
	}

	getLocation(props) {
		const {location_selected, locations} = props
		let result = null
		_.map(locations, (location, index)=>{
			if(parseInt(location.id) === parseInt(location_selected)){				
				result = location.$original
			}
		})
		return result
	}

	getSigns(props) {
		const {location_selected, signs} = props
		let result = []
		_.map(signs, (sign, index)=>{
			if(parseInt(sign.$original['Locations(id)']) === parseInt(location_selected))
				result.push(sign.$original)
		})
		return result
	}

	getPromos(props) {
		const {location_selected, promos, promoitems} = props
		let result = []
		_.map(promos, (promo, index)=>{
			if(parseInt(promo.$original['Location(id)']) === parseInt(location_selected)){
				let promoitem_id = parseInt(promo.$original['Promotional Items(id)'])
				let ret = Object.assign({}, promo.$original)
				_.map(promoitems, (promoitem, item_index)=>{
					if(promoitem_id === parseInt(promoitem.id)){
						ret.promoitem = promoitem.$original
					}
				})
				result.push(ret)
			}
		})
		return result
	}

	getVehicles(props) {
		const {location_selected, vehicles} = props
		let result = []
		_.map(vehicles, (vehicle, index)=>{
			if(parseInt(vehicle.$original['Location(id)']) === parseInt(location_selected))
				result.push(vehicle.$original)
		})
		return result
	}

	onClickDataRow(layer, id, data){
		if (typeof this.props.onClickDataRow === 'function') {
			this.props.onClickDataRow(layer, id, data)
		}
	}

	render(){
		const {icon_selected} = this.props
		let class_default = "dock-icon", class_type = "dock-icon selected"
		let isMobile = ($(window).width() >= 200 && $(window).width() <= 480)

		const {current_location, current_signs, current_promos, current_vehicles} = this.state

		return (
			<div className="map-dockbar" >
				<div className="dock-background">
					<img className="dock-bgImg" src={isMobile ? asset('/assets/resources/images/dock_mobile.png') : asset('/assets/resources/images/dock.png')}/>
				</div>
				<div className="dock-toggle">
					<div className="toggle-button" onClick={::this.onToggleDock}>
						<i className={this.state.toggle ? 'fa fa-caret-up' : 'fa fa-caret-down'}/>
					</div>
				</div>
				<div className="dock-content">
					<div className="dock-icons">
						<div className={icon_selected === LAYER_LOCATION ? class_type : class_default} onClick={this.onClickIcon.bind(this, LAYER_LOCATION)}>
							{current_location && current_location['Site Map'] && <img className="dock-iconImg" src={asset('/cache/' + current_location['Site Map'] + '.png')}/>}
							{icon_selected !== LAYER_LOCATION &&
								<div className="dock-icon-layer-detail">Location Details</div>
							}
						</div>
						<div className={icon_selected === LAYER_SIGNS ? class_type : class_default} onClick={this.onClickIcon.bind(this, LAYER_SIGNS)}>
							<img className="dock-iconImg2" src={asset('/assets/resources/images/dock_signs.svg')}/>
							<div className="dock-count">
								{current_signs.length}
							</div>
						</div>
						<div className={icon_selected === LAYER_VEHICLES ? class_type : class_default} onClick={this.onClickIcon.bind(this, LAYER_VEHICLES)}>
							<img className="dock-iconImg2" src={asset('/assets/resources/images/dock_vehicle.svg')}/>
							<div className="dock-count">
								{current_vehicles.length}
							</div>
						</div>
						<div className={icon_selected === LAYER_PROMOS ? class_type : class_default} onClick={this.onClickIcon.bind(this, LAYER_PROMOS)}>
							<img className="dock-iconImg2" src={asset('/assets/resources/images/dock_promo.svg')}/>
							<div className="dock-count">
								{current_promos.length}
							</div>
						</div>
					</div>
					{icon_selected === LAYER_LOCATION && current_location != null &&
						<Location location={current_location}/>
					}
					{icon_selected === LAYER_SIGNS && current_signs.length != 0 &&
						<Signs signs={current_signs} onClickDataRow={::this.onClickDataRow}/>
					}
					{icon_selected === LAYER_VEHICLES && current_vehicles.length != 0 &&
						<Vehicles vehicles={current_vehicles} onClickDataRow={::this.onClickDataRow}/>
					}
					{icon_selected === LAYER_PROMOS && current_promos.length != 0 &&
						<Promos promos={current_promos} onClickDataRow={::this.onClickDataRow}/>
					}
				</div>
			</div>
		)
	}
}