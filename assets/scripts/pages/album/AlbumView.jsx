import React from 'react'
import _ from 'lodash'
import LazyLoad from 'react-lazy-load'
import {LAYER_NONE, LAYER_LOCATION, LAYER_SIGNS, LAYER_VEHICLES, LAYER_PROMOS} from '../../core/components/Layers'

export default class AlbumView extends React.Component {
	constructor(props) {
		super(props)
	}
	
	componentDidMount() {
	}

	onClickImage(image){
		if (typeof this.props.onClickImage === 'function') {
			this.props.onClickImage(image)
		}
	}

	onClickLocation(){

	}

	render() {
		const self=this
		const {data} = this.props
		let width = $(window).width()
		let height = $(window).height()
		let min = Math.min(width, height)
		let isMobile = width < 768

		let sorted_data = _.orderBy(data, (item)=>{return item['Address']}, 'asc')

		let content = _.map(sorted_data, (location, index)=>{
			location.type = LAYER_LOCATION
			let imageData = []
			// signs
			_.map(location.signs, (sign)=>{
				let obj = {}
				obj.id = sign.id
				obj.data = sign
				obj.image = sign['Latest Brand Compliance Photo']
				obj.type = LAYER_SIGNS
				obj.description = 'Sign'
				if(obj.image)
					imageData.push(obj)
			})
			// promos
			_.map(location.promos, (promo)=>{
				let obj = {}
				obj.id = promo.id
				obj.data = promo
				obj.image = promo['Image']
				obj.type = LAYER_PROMOS
				obj.description = 'Promotion'
				if(obj.image)
					imageData.push(obj)
			})
			// vehicles
			_.map(location.vehicles, (vehicle)=>{
				let obj = {}
				obj.id = vehicle.id
				obj.data = vehicle
				obj.image = vehicle['Front Photo']
				obj.type = LAYER_VEHICLES
				obj.description = 'Vehicle'
				if(obj.image)
					imageData.push(obj)
			})

			// add undefined image if empty
			if(imageData.length == 0){
				imageData.push({
					id: 0,
					data: null,
					image: undefined,
					type: LAYER_NONE,
					description: null,
				})
			}
			
			let imageList = _.map(imageData, (image, imageIndex)=>{
				return (
					<div key={imageIndex} className="card_container" onClick={self.onClickImage.bind(self, image)}>
						<LazyLoad width={isMobile ? 100 : 200} height={isMobile ? 100 : 200}>
							<div className="card">
								<img className="LazyLoadImg" src={asset('/cache/' + image.image + '.png')}/>
								{!!image.description &&
									<div className="description">
										{image.description}
									</div>
								}
							</div>
						</LazyLoad>
					</div>
				)
			})

			return (
				<div key={index} className="location">
					<div className="location_address" onClick={self.onClickImage.bind(self, location)}>{location['Address']}</div>
					<div className="location_album">
						{imageList}
					</div>
				</div>
			)
		})
		return (
			<div className='albumview_container'>
				{content}
			</div>
		)
	}
}