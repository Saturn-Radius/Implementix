import React from 'react'
import _ from 'lodash'
import {LAYER_NONE, LAYER_LOCATION, LAYER_SIGNS, LAYER_VEHICLES, LAYER_PROMOS} from '../../core/components/Layers'
import Signs from './sidebar/Signs'
import Vehicles from './sidebar/Vehicles'
import Promos from './sidebar/Promos'

export default class Sidebar extends React.Component {
	constructor(props){
		super(props)
	}

	componentDidUpdate(prevProps, prevState) {
		this.updateDimensions()
	}

	updateDimensions(){
		const {visible} = this.props
		let width = $(window).width()
		let height = $(window).height()
		let min = Math.min(width, height)
		let isMobile = min < 768

		$('.sidebar_container').css({
			'left': visible ? -10 : isMobile ? 0 - width - 50 : -410,
		})
	}

	onClickToggle() {
		if (typeof this.props.onClickClose === 'function') {
			this.props.onClickClose()
		}
	}

	onClickPreview(imageName) {
		if (typeof this.props.onClickPreview === 'function'){
			this.props.onClickPreview(imageName)
		}
	}

	onClickLocation(location) {
		if (typeof this.props.onClickLocation === 'function'){
			this.props.onClickLocation(location)
		}
	}

	render() {
		const {layer, data, promoitems, brands, onClickPreview} = this.props
		let sidebar_title = ''
		switch(layer){
			case LAYER_SIGNS:
				sidebar_title = 'Sign Details'
				break
			case LAYER_VEHICLES:
				sidebar_title = 'Vehicle Details'
				break
			case LAYER_PROMOS:
				sidebar_title = 'Promo Details'
				break
		}

		return (
			<div className="sidebar_container">
				<div className="sidebar_background">
					<img className="sidebar_bgImg" src={asset('/assets/resources/images/sidebar_detail.png')}/>
				</div>
				<div className="sidebar_toggle" onClick={::this.onClickToggle}>
					<img className="sidebar_btnToggle" src={asset('/assets/resources/images/close.png')}/>
				</div>
				<div className="sidebar_title">
					{sidebar_title}
				</div>
				<div className="content_container">
				{layer === LAYER_SIGNS && data != null &&
					<Signs data={data} brands={brands} onClickPreview={::this.onClickPreview} onClickLocation={::this.onClickLocation}/>
				}
				{layer === LAYER_VEHICLES && data != null &&
					<Vehicles data={data} onClickPreview={::this.onClickPreview} onClickLocation={::this.onClickLocation}/>
				}
				{layer === LAYER_PROMOS && data != null &&
					<Promos data={data} items={promoitems} onClickPreview={::this.onClickPreview} onClickLocation={::this.onClickLocation}/>
				}
				</div>
			</div>
		)
	}
}