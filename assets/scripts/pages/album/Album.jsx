import React from 'react'
import _ from 'lodash'
import {connect} from 'react-redux'

import Header from '../../core/components/Header'
import Brand from '../../core/components/Brand'
import Preview from '../../core/components/Preview'
import AlbumView from './AlbumView'
import AlbumDetail from './AlbumDetail'

import {LAYER_NONE, LAYER_LOCATION, LAYER_SIGNS, LAYER_VEHICLES, LAYER_PROMOS} from '../../core/components/Layers'
import {search, filter} from '../../core/search'

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
export default class Album extends React.Component {   
	constructor(props) {
		super(props)
		this.state={
			albumData: this.getData(props, props.locations),
			detailVisible: false,
			detailData: null,
			previewVisible: false,
			previewImage: undefined,
		}
		document.title = 'Implementix - Album View'
	}
	
	componentDidMount() {
	}

	componentWillReceiveProps(nextProps) {
		this.setState({albumData: this.getData(nextProps, nextProps.locations)})
	}

	onClickImage(imageData){
		this.setState({detailData: imageData, detailVisible:true})
	}

	onClickDetailClose(){
		this.setState({detailData: null, detailVisible: false})
	}

	onClickPreview(imageName){

	}

	getData(props, locations){
		const {signs, brands, promos, promoitems, vehicles} = props
		let result = []
		result = _.map(locations, (location)=>{
			let original = Object.assign({}, location.$original)
			let location_id = original.id
			// add signs
			original.signs = []
			_.map(signs, (sign)=>{
				if(parseInt(sign.$original['Locations(id)']) === parseInt(location_id)){
					let sign_id = sign.$original['id']
					let ret = Object.assign({}, sign.$original)
					let brand_items = []
					_.map(brands, (brand)=>{
						if(brand.$original && parseInt(brand.$original['Conversion Sign(id)']) === parseInt(sign_id)){
							brand_items.push(brand.$original)
						}
					})
					ret.brands = brand_items
					original.signs.push(ret)
				}
			})
			// add promos
			original.promos = []
			_.map(promos, (promo)=>{
				if(parseInt(promo.$original['Location(id)']) === parseInt(location_id)){
					let promoitem_id = parseInt(promo.$original['Promotional Items(id)'])
					let ret = Object.assign({}, promo.$original)
					_.map(promoitems, (promoitem)=>{
						if(promoitem_id === parseInt(promoitem.id)){
							ret.promoitem = promoitem.$original
						}
					})
					original.promos.push(ret)
				}
			})
			// add vehicles
			original.vehicles = []
			_.map(vehicles, (vehicle)=>{
				if(parseInt(vehicle.$original['Location(id)']) === parseInt(location_id))
					original.vehicles.push(Object.assign({}, vehicle.$original))
			})
			return original
		})
		return result
	}

	onSearch(keyword, layerFromParam, pLayer){
		let locations = this.getData(this.props, this.props.locations)
		let result = search(LAYER_LOCATION, locations, keyword, true)
		this.setState({albumData: result})
	}

	onClickPreview(imageName){
		this.setState({previewImage: imageName, previewVisible: true})
	}

	onClosePreview(){
		this.setState({previewVisible: false})
	}

	render() {
		const {albumData, detailData, detailVisible} = this.state
		const {previewVisible, previewImage} = this.state
		return (
			<div className='album_container'>
				<Header isMapView={false} onSearch={::this.onSearch}/>
				<Brand/>
				<AlbumView
					data={albumData}
					onClickImage={::this.onClickImage}
				/>
				{detailVisible && detailData != null && detailData.type != LAYER_NONE &&
					<AlbumDetail
						visible={detailVisible}
						data={detailData}
						onClickClose={::this.onClickDetailClose}
						onClickPreview={::this.onClickPreview}
					/>
				}
				<Preview visible={previewVisible} imageName={previewImage} onClickClose={::this.onClosePreview}/>
			</div>
		)
	}
}