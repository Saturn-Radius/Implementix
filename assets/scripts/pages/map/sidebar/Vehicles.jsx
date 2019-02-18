import React from 'react'
import _ from 'lodash'
import moment from 'moment-timezone'

export default class Vehicles extends React.Component{
	constructor(props){
		super(props)
	}

	onClickPreview(imageName){
		if (typeof this.props.onClickPreview === 'function'){
			this.props.onClickPreview(imageName)
		}
	}

	onClickLocation(location){
		if (typeof this.props.onClickLocation === 'function'){
			this.props.onClickLocation(location)
		}
	}

	render(){
		const {data} = this.props

		return (
			<div className="content">
				<div className="content_body">
					<div className="section">
						<div className="field_name1">Location:</div>
						<div className="field_value1 color_value field_link" onClick={this.onClickLocation.bind(this, data['Location(id)'])}>{data['Location']}</div>
					</div>
					<div className="section">
						<div>
							<div className="field_name2">Vehicle Type:</div>
							<div className="field_value2 color_value">{data['Vehicle Type']}</div>
						</div>
						<div>
							<div className="field_name2">Unit Number:</div>
							<div className="field_value2 color_value">{data['Unit Number']}</div>
						</div>
					</div>
					<div className="section">
						<div className="row field_image_vehicles">
							<div className="col-xs-6 field_image_vehicle">
								<div className="text-center">Front Photo:</div>
								<img className="photo" src={asset('/cache/' + data['Front Photo'] + '.png')} onClick={this.onClickPreview.bind(this, data['Front Photo'])}/>
							</div>
							<div className="col-xs-6 field_image_vehicle second">
								<div className="text-center">Rear Photo:</div>
								<img className="photo" src={asset('/cache/' + data['Rear Photo'] + '.png')} onClick={this.onClickPreview.bind(this, data['Rear Photo'])}/>
							</div>
						</div>
						<div className="row field_image_vehicles">
							<div className="col-xs-6 field_image_vehicle">
								<div className="text-center">Left Photo:</div>
								<img className="photo" src={asset('/cache/' + data['Left Photo'] + '.png')} onClick={this.onClickPreview.bind(this, data['Left Photo'])}/>
							</div>
							<div className="col-xs-6 field_image_vehicle second">
								<div className="text-center">Right Photo:</div>
								<img className="photo" src={asset('/cache/' + data['Right Photo'] + '.png')} onClick={this.onClickPreview.bind(this, data['Right Photo'])}/>
							</div>
						</div>
					</div>
					<div className="section">
						<div className="field_name2">Vehicle Notes:</div>
						<div className="field_value2">{data['Vehicle Notes']}</div>
					</div>
				</div>
			</div>
		)
	}
}