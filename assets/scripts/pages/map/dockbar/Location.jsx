import React from 'react'
import moment from 'moment-timezone'

export default class Location extends React.Component{
	render(){
		let {location} = this.props
		let signsBrandCompliant = Math.round(location['Signs That Are Brand Compliant'] * 100)
		let complianceNeeded = location['Compliance Check Needed?']
		let brandStatus = location['Brand Compliance Status']
		let signsChecked = Math.round(location['Signs Checked'] * 100)
		return (
			<div className="dock-location">
				<div className="location-name">
					<div className="location-name-details">Location Details: </div>
					<div className="location-name-address">{location['Address']}</div>
				</div>
				<div className="row location-row">
					<div className="col-xs-6 col-sm-6">
						<div className="location-field">Total # Of Signs: <span className="location-value">{location['# of Signs']}</span></div>
					</div>
					<div className="col-xs-6 col-sm-6">
						<div className="location-field">Signs That Are Brand Compliant: <span className={signsBrandCompliant == 100 ? "location-value color_green" : "location-value color_red"}>{signsBrandCompliant + '%'}</span></div>
					</div>
				</div>
				<div className="row location-row">
					<div className="col-xs-6 col-sm-6">
						<div className="location-field">Last Brand Compliance Check: <span className="location-value">{moment(location['Last Brand Compliance Check'], 'YYYY-MM-DD').format('MM/DD/YYYY')}</span></div>
					</div>
					<div className="col-xs-6 col-sm-6">
						<div className="location-field">Compliance Check Needed?: <span className={complianceNeeded == 'Yes' ? "location-value color_red" : "location-value color_green"}>{complianceNeeded}</span></div>
					</div>
				</div>
				<div className="row location-row">
					<div className="col-xs-6 col-sm-6">
						<div className="location-field">Brand Compliance Status: <span className={brandStatus == 'Pass' ? "location-value color_green" : "location-value color_red"}>{brandStatus}</span></div>
					</div>
					<div className="col-xs-6 col-sm-6">
						<div className="location-field">Signs Checked: <span className={signsChecked == 100 ? "location-value color_green" : "location-value color_red"}>{signsChecked + '%'}</span></div>
					</div>
				</div>
			</div>
		)
	}
}