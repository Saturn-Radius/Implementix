import React from 'react'
import _ from 'lodash'

export const LAYER_NONE = 0
export const LAYER_LOCATION = 1
export const LAYER_SIGNS = 2
export const LAYER_VEHICLES = 3
export const LAYER_PROMOS = 4

import {Checkbox} from 'semantic-ui-react'

export default class Layers extends React.Component {
	constructor(props){
		super(props)
	}

	onClickToggle() {
		this.props.onClickLayerToggle(!this.props.visible)
	}

	onClickItem(selected) {
		this.props.onClickLayerItem(selected)		
	}

	onToggleCluster(event, data){
		this.props.onToggleCluster(data.checked)
	}

	onToggleHeatmap(event, data){
		this.props.onToggleHeatmap(data.checked)
	}

	render() {
		const {selected, cluster, heatmap, count, visible} = this.props

		let class_default = "layers_item", class_selected = "layers_item selected"
		return (
			<div className="layers_container">
				<div className="layers_toggle" onClick={::this.onClickToggle}>
					<img className="toggle_button" src={asset('/assets/resources/images/icon_layer.png')}/>
				</div>
				{visible &&
					<div className="layers_list">
						<div className={selected == LAYER_LOCATION ? class_selected : class_default} onClick={this.onClickItem.bind(this, LAYER_LOCATION)}>
							<div className="item_title">Locations</div>
							{selected == LAYER_LOCATION && <img className="item_icon" src={asset('/assets/resources/images/icon_layer_item.svg')}/>}
						</div>
						<div className={selected == LAYER_SIGNS ? class_selected : class_default} onClick={this.onClickItem.bind(this, LAYER_SIGNS)}>
							<div className="item_title">Signs</div>
							{selected == LAYER_SIGNS && <img className="item_icon" src={asset('/assets/resources/images/icon_layer_item.svg')}/>}
						</div>
						<div className={selected == LAYER_PROMOS ? class_selected : class_default} onClick={this.onClickItem.bind(this, LAYER_PROMOS)}>
							<div className="item_title">Promotions</div>
							{selected == LAYER_PROMOS && <img className="item_icon" src={asset('/assets/resources/images/icon_layer_item.svg')}/>}
						</div>
						<div className={selected == LAYER_VEHICLES ? class_selected : class_default} onClick={this.onClickItem.bind(this, LAYER_VEHICLES)}>
							<div className="item_title">Vehicles</div>
							{selected == LAYER_VEHICLES && <img className="item_icon" src={asset('/assets/resources/images/icon_layer_item.svg')}/>}
						</div>
						<div className="item_cluster">
							<div className="cluster_title">Clustering:</div>
							<Checkbox toggle checked={cluster} onChange={::this.onToggleCluster} />
						</div>
						<div className="item_heatmap">
							<div className="heatmap_title">Heatmap:</div>
							<Checkbox toggle checked={heatmap} onChange={::this.onToggleHeatmap} />
						</div>
						<div className="item_count">
							Count: {count}
						</div>
					</div>
				}
			</div>
		)
	}
}