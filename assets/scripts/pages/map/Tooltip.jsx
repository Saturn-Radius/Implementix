import React from 'react'
import {LAYER_LOCATION, LAYER_SIGNS, LAYER_VEHICLES, LAYER_PROMOS} from '../../core/components/Layers'

export default class Tooltip extends React.Component{
	render(){
		const {layer} = this.props
		let tooltip = null

		let width = $(window).width()
		let height = $(window).height()
		let min = Math.min(width, height)
		let isMobile = min < 768

		switch(layer){
			case LAYER_LOCATION:
				tooltip = (<div id="location-tooltip" >
					<div className="location-background">
						<img className="tooltip-img" src={asset('/assets/resources/images/tooltip_map_pin.png')}/>
					</div>
					{ isMobile &&
						<div className="location-content-mobile">
							<div className="location-sitemap">
								<div className="sitemap-border">
									<img id='location-sitemap'/>
								</div>
							</div>
							<div className="location-detail">
								<div id="location-name"/>
								<div id="location-address"/>
							</div>
						</div>
					}
					{ !isMobile &&
						<div className="location-content">
							<div id="location-name"/>
							<div className="location-sitemap">
								<div className="sitemap-border">
									<img id='location-sitemap'/>
								</div>
							</div>
							<div className="location-lastbrand">
								<div>Last Brand Compliance Check:</div>
								<div id="location-lastbrand"/>
							</div>
							<div className="location-brandcompliance">
								<div>Brand Compliance Status:</div>
								<div id="location-brandcompliance"/>
							</div>
							<div className="location-percentsigns">
								<div>Signs That Are Brand Compliant:</div>
								<div id="location-percentsigns"/>
							</div>
							<div className="location-spacing"/>
						</div>
					}
				</div>)
				break
			case LAYER_SIGNS:
				tooltip = (<div id="signs-tooltip">
					<div className="signs-background">
						<img className="tooltip-img" src={asset('/assets/resources/images/tooltip_map_pin.png')}/>
					</div>
					<div className="signs-content">
						<div className="sign-border">
							<img id="tooltip-signs-img"/>
						</div>
					</div>
				</div>)
				break
			case LAYER_PROMOS:
				tooltip = (<div id="promo-tooltip">
					<img className="tooltip-promo-img" src={asset('/assets/resources/images/tooltip_promo_pin.svg')}/>
				</div>)
				break
			case LAYER_VEHICLES:
				tooltip = (<div id="vehicle-tooltip">
					<img className="tooltip-vehicle-img" src={asset('/assets/resources/images/tooltip_vehicle_pin.svg')}/>
				</div>)
				break
			default:
				tooltip = null
				break
		}
		return tooltip
	}
}