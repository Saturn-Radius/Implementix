import React from 'react'
import _ from 'lodash'
import {LAYER_NONE, LAYER_LOCATION, LAYER_SIGNS, LAYER_VEHICLES, LAYER_PROMOS} from '../../core/components/Layers'
import Location from './detail/Location'
import Signs from './detail/Signs'
import Vehicles from './detail/Vehicles'
import Promos from './detail/Promos'
export default class AlbumDetail extends React.Component {
	constructor(props){
		super(props)
	}

	componentDidUpdate(prevProps, prevState) {
		this.updateDimensions()
	}

	updateDimensions(){
		// const {visible} = this.props
		// let width = $(window).width()
		// let height = $(window).height()
		// let min = Math.min(width, height)
		// let isMobile = min < 768

		// $('.sidebar_container').css({
		// 	'left': visible ? -10 : isMobile ? 0 - width - 50 : -410,
		// })
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

	render(){
		const {visible, data, onClickPreview} = this.props
		return (
			<div className={visible ? 'detail_popup visible' : 'detail_popup'}>
				<div className="detail_container">
					<div className="detail_toggle" onClick={::this.onClickToggle}>
						<img className="detail_btnToggle" src={asset('/assets/resources/images/close.png')}/>
					</div>
					<div className="content_container">
						{data != null && data.type === LAYER_LOCATION &&
							<Location data={data} onClickPreview={::this.onClickPreview}/>
						}
						{data != null && data.type === LAYER_SIGNS && 
							<Signs data={data} onClickPreview={::this.onClickPreview}/>
						}
						{data != null && data.type === LAYER_VEHICLES && 
							<Vehicles data={data} onClickPreview={::this.onClickPreview}/>
						}
						{data != null && data.type === LAYER_PROMOS && 
							<Promos data={data} onClickPreview={::this.onClickPreview}/>
						}
					</div>
				</div>
			</div>
		)
	}
}