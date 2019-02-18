import React from 'react'
import _ from 'lodash'
import moment from 'moment-timezone'

export default class Location extends React.Component{
	constructor(props){
		super(props)
	}

	onClickPreview(imageName){
		if (typeof this.props.onClickPreview === 'function'){
			this.props.onClickPreview(imageName)
		}
	}

	render(){
		const {data} = this.props
		let brandCompliance = data['Brand Compliance Status']
		let signsBrandCompliant = Math.round(data['Signs That Are Brand Compliant'] * 100)
		let complianceNeeded = data['Compliance Check Needed?']
		let brandStatus = data['Brand Compliance Status']
		let signsChecked = Math.round(data['Signs Checked'] * 100)
		return (
			<div className="detail">
				<div className="left">
					<div className="title">
						Location Details
					</div>
					<div className="section">
						<div>
							<div className="field_name1">Location Details: </div>
							<div className="field_value1 color_value">{data['Address']}</div>
						</div>
						<div>
							<div className="field_name1">Total # Of Signs:</div>
							<div className="field_value1 color_value">{data['# of Signs']}</div>
						</div>
						<div>
							<div className="field_name1">Last Brand Compliance Check:</div>
							<div className="field_value1 color_value">{moment(data['Last Brand Compliance Check'], 'YYYY-MM-DD').format('MM/DD/YYYY')}</div>
						</div>
						<div>
							<div className="field_name1">Brand Compliance Status:</div>
							<div className={brandStatus == 'Pass' ? "field_value1 color_green" : "field_value1 color_red"}>{brandCompliance}</div>
						</div>
						<div>
							<div className="field_name1">Signs That Are Brand Compliant:</div>
							<div className={signsBrandCompliant == 100 ? "field_value1 color_green" : "field_value1 color_red"}>{signsBrandCompliant + '%'}</div>
						</div>
						<div>
							<div className="field_name1">Compliance Check Needed?:</div>
							<div className={complianceNeeded == 'Yes' ? "field_value1 color_red" : "field_value1 color_green"}>{complianceNeeded}</div>
						</div>
						<div>
							<div className="field_name1">Signs Checked:</div>
							<div className={signsChecked == 100 ? "field_value1 color_green" : "field_value1 color_red"}>{signsChecked + '%'}</div>
						</div>
					</div>
				</div>
				<div className="right">
					<div>
						<div className="text-center">Site Map:</div>
						<img className="photo" src={asset('/cache/' + data['Site Map'] + '.png')} onClick={this.onClickPreview.bind(this, data['Site Map'])}/>
					</div>
				</div>
			</div>
		)
	}
}