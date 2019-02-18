import React from 'react'
import _ from 'lodash'
import {connect} from 'react-redux'

import Header from '../../core/components/Header'
import Brand from '../../core/components/Brand'
import GMap from '../../core/components/GMap'
import Layers from '../../core/components/Layers'
import Filters from '../../core/components/Filters'
import Preview from '../../core/components/Preview'
import {LAYER_NONE, LAYER_LOCATION, LAYER_SIGNS, LAYER_VEHICLES, LAYER_PROMOS} from '../../core/components/Layers'
import Tooltip from './Tooltip'
import Dockbar from './Dockbar'
import Sidebar from './Sidebar'
import {search, filter, FIELDS_TYPE_NONE} from '../../core/search'

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
	{}
)
export default class Map extends React.Component {
	constructor(props) {
		super(props)
		document.title = 'Implementix - Map View'
		this.state = {
			locations: [],
			signs: [],
			promos: [],
			promoitems: [],
			vehicles: [],

			marker_selected: null,
			dockicon_selected: LAYER_NONE,
			layer_selected: LAYER_LOCATION,
			cluster: false,
			heatmap: false,

			sidebar_visible: false,
			sidebar_layer: LAYER_NONE,
			sidebar_dataid: null,
			sidebar_data: null,
			sidebar_locationid: null,

			keyword: '',
			layersVisible: false,
			filtersVisible: false,
			previewVisible: false,
			previewImage: undefined,
		}
	}

	componentDidMount() {
		const {locations, signs, promos, promoitems, vehicles} = this.props
		this.setState({
			locations: locations,
			signs: signs,
			promos: promos,
			promoitems: promoitems,
			vehicles: vehicles
		})
	}

	componentWillReceiveProps(nextProps) {
		const {locations, signs, promos, promoitems, vehicles} = nextProps
		this.setState({
			locations: locations,
			signs: signs,
			promos: promos,
			promoitems: promoitems,
			vehicles: vehicles
		})
	}

	showDetail(layer, id, data){
		this.setState({
			sidebar_visible: true,
			sidebar_layer: layer,
			sidebar_dataid: id,
			sidebar_data: data
		})
	}

	hideDetail(){
		this.setState({sidebar_visible: false})
	}

	onSearch(keyword, layerFromParam, pLayer){
		const {locations, signs, promos, promoitems, vehicles} = this.props
		const {layer_selected} = this.state

		this.setState({marker_selected: null, keyword: keyword, sidebar_locationid: null})
		let layer = layerFromParam ? pLayer : layer_selected

		let result = null
		switch(layer){
			case LAYER_LOCATION:
				result = search(layer, locations, keyword)
				this.setState({locations: result})
				break
			case LAYER_SIGNS:
				result = search(layer, signs, keyword)
				this.setState({signs: result})
				break
			case LAYER_VEHICLES:
				result = search(layer, vehicles, keyword)
				this.setState({vehicles: result})
				break
			case LAYER_PROMOS:
				let promos_detailed = []
				_.map(promos, (promo, index)=>{
					let promoitem_id = parseInt(promo.$original['Promotional Items(id)'])
					let ret = Object.assign({}, promo)
					_.map(promoitems, (promoitem, item_index)=>{
						if(promoitem_id === parseInt(promoitem.id)){
							ret.$original.promoitem = promoitem.$original
						}
					})
					promos_detailed.push(ret)
				})
				result = search(layer, promos_detailed, keyword)
				this.setState({promos: result})
				break
			default:
				break
		}
		return result
	}

	onFilter(filters){
		const {keyword, layer_selected} = this.state
		let searchResult = this.onSearch(keyword, false, 0)
		let result = searchResult
		if(filters.length == 1){
			if(filters[0].field.type != FIELDS_TYPE_NONE) // clear filter
				result = filter(layer_selected, searchResult, filters)
		}else
			result = filter(layer_selected, searchResult, filters)

		switch(layer_selected){
			case LAYER_LOCATION:
				this.setState({locations: result})
				break
			case LAYER_SIGNS:
				this.setState({signs: result})
				break
			case LAYER_VEHICLES:
				this.setState({vehicles: result})
				break
			case LAYER_PROMOS:
				this.setState({promos: result})
				break
			default:
				break
		}
	}

	onClickMarker(id, data) {
		if(this.isDockIconClicked() && this.state.dockicon_selected != LAYER_LOCATION){
			this.showDetail(this.state.dockicon_selected, id, data)
		}else if(this.state.layer_selected != LAYER_LOCATION && this.state.layer_selected != LAYER_NONE){
			this.setState({sidebar_locationid: null})
			this.showDetail(this.state.layer_selected, id, data)
		}
		if(this.isDockIconClicked() && this.state.dockicon_selected != LAYER_LOCATION) {			
			return
		}
		this.setState({marker_selected: id, dockicon_selected: LAYER_NONE})
	}

	onClickDockIcon(id) {
		this.setState({dockicon_selected: id})
	}

	onClickMap(){
		this.hideDetail()
		if(this.isDockIconClicked() && this.state.dockicon_selected != LAYER_LOCATION){			
			return
		}
		this.setState({marker_selected: null, layersVisible: false, filtersVisible: false, sidebar_locationid: null})
	}

	onClickLayerToggle(visible){
		this.setState({layersVisible: visible})
	}

	onClickLayerItem(index){
		this.onSearch(this.state.keyword, true, index)
		this.setState({
			marker_selected: null, 
			sidebar_locationid: null,
			layer_selected: index, 
			dockicon_selected: LAYER_NONE,
			filtersVisible: false
		})
		this.hideDetail()
	}

	onToggleCluster(checked){
		if(checked && this.state.heatmap)
			this.setState({cluster: checked, heatmap: false})
		else
			this.setState({cluster: checked})
	}

	onToggleHeatmap(checked){
		if(checked && this.state.cluster)
			this.setState({heatmap: checked, cluster: false})
		else
			this.setState({heatmap: checked})
	}

	onClickFilterToggle(visible){
		this.setState({filtersVisible: visible})
	}

	onClickPreview(imageName){
		this.setState({previewImage: imageName, previewVisible: true})
	}

	onClickSidebarLocation(location){
		if(location){
			this.setState({sidebar_locationid: location})
		}
	}

	onClosePreview(){
		this.setState({previewVisible: false})
	}

	isDockIconClicked(){
		const {layer_selected, marker_selected, dockicon_selected} = this.state
		return layer_selected == LAYER_LOCATION && marker_selected != null && dockicon_selected != LAYER_NONE
	}

	render() {
		const {locations, signs, promos, promoitems, vehicles} = this.state
		const {layer_selected, marker_selected, dockicon_selected, cluster, heatmap, layersVisible, filtersVisible} = this.state
		const {sidebar_visible, sidebar_layer, sidebar_dataid, sidebar_data, sidebar_locationid} = this.state
		const {previewVisible, previewImage} = this.state
		
		// Is dock icon clicked? then we need to change the map accordingly
		let isDockIconClicked = this.isDockIconClicked()
		
		// get positions from layer
		let positions = []
		let layer = isDockIconClicked ? dockicon_selected : layer_selected
		
		switch(layer){
			case LAYER_LOCATION:
				_.map(locations, (location, index)=>{
					if(!!location.$original['Geotag']){
						positions.push({
							id: location.$original.id,
							latitude: parseFloat(location.$original['Geotag'].latitude),
							longitude: parseFloat(location.$original['Geotag'].longitude),
							data: location.$original
						})
					}
				})
				break
			case LAYER_SIGNS:
				_.map(signs, (sign, index)=>{
					if(!!sign.$original['Assessment Geotag']){
						positions.push({
							id: sign.$original.id,
							latitude: parseFloat(sign.$original['Assessment Geotag'].latitude),
							longitude: parseFloat(sign.$original['Assessment Geotag'].longitude),
							data: sign.$original,
							locationid: sign.$original['Locations(id)']
						})
					}
				})
				break
			case LAYER_PROMOS:
				_.map(promos, (promo, index)=>{
					if(!!promo.$original['Geotag']){
						positions.push({
							id: promo.$original.id,
							latitude: parseFloat(promo.$original['Geotag'].latitude),
							longitude: parseFloat(promo.$original['Geotag'].longitude),
							data: promo.$original,
							locationid: promo.$original['Location(id)']
						})
					}
				})
				break
			case LAYER_VEHICLES:
				_.map(vehicles, (vehicle, index)=>{
					if(!!vehicle.$original['Geotag']){
						positions.push({
							id: vehicle.$original.id,
							latitude: parseFloat(vehicle.$original['Geotag'].latitude),
							longitude: parseFloat(vehicle.$original['Geotag'].longitude),
							data: vehicle.$original,
							locationid: vehicle.$original['Location(id)']
						})
					}
				})
				break
			default:
				positions = []
				break
		}

		// filter positions if dockicon_selected
		let newPositions = []
		if(isDockIconClicked && layer != LAYER_LOCATION){
			_.map(positions, (position)=>{
				if(parseInt(position.locationid) == parseInt(marker_selected)){					
					let newPos = Object.assign({}, position)
					newPositions.push(newPos)
				}
			})
			positions = newPositions
		}
		return (
			<div className='map_container'>
				<Header isMapView={true} onSearch={::this.onSearch}/>
				<Brand/>
				<Layers
					visible={layersVisible}
					selected={layer_selected}
					count={positions.length}
					cluster={cluster}
					heatmap={heatmap}
					onClickLayerToggle={this.onClickLayerToggle.bind(this)}
					onToggleCluster={this.onToggleCluster.bind(this)}
					onToggleHeatmap={this.onToggleHeatmap.bind(this)}
					onClickLayerItem={this.onClickLayerItem.bind(this)}
				/>
				<Filters
					visible={filtersVisible}
					layersVisible={layersVisible}
					layer={layer_selected}
					count={positions.length}
					onFilter={::this.onFilter}
					onClickFilterToggle={this.onClickFilterToggle.bind(this)}
				/>
				<Tooltip layer={layer}/>
				<Dockbar 
					location_selected={
						layer_selected === LAYER_LOCATION ? marker_selected : 
							(layer_selected != LAYER_LOCATION && sidebar_visible && sidebar_locationid != null) ? 
							sidebar_locationid : null
						}
					icon_selected={layer_selected === LAYER_LOCATION ? (marker_selected == null ? LAYER_NONE : dockicon_selected) :
							(layer_selected != LAYER_LOCATION && sidebar_visible && sidebar_locationid != null) ? 
								(dockicon_selected == LAYER_NONE ? LAYER_LOCATION : dockicon_selected) : null
						}
					onClickDockIcon={::this.onClickDockIcon}
					onClickDataRow={::this.showDetail}
					locations={locations}
					signs={signs}
					promos={promos}
					promoitems={promoitems}
					vehicles={vehicles}
				/>
				<GMap 
					positions={positions} 
					layer={layer}
					cluster={cluster}
					heatmap={heatmap}
					selected={marker_selected}
					onClickMarker={::this.onClickMarker} 
					onClickMap={::this.onClickMap}
				/>
				<Sidebar 
					visible={sidebar_visible}
					layer={sidebar_layer}
					data={sidebar_data}
					brands={this.props.brands}
					promoitems={promoitems}
					onClickClose={::this.hideDetail}
					onClickPreview={::this.onClickPreview}
					onClickLocation={::this.onClickSidebarLocation}
				/>
				<Preview visible={previewVisible} imageName={previewImage} onClickClose={::this.onClosePreview}/>
			</div>
		)
	}
}