import React from 'react'
import _ from 'lodash'
import moment from 'moment-timezone'

export default class Promos extends React.Component{
	constructor(props){
		super(props)
	}

	onClickPreview(imageName){
		if (typeof this.props.onClickPreview === 'function'){
			this.props.onClickPreview(imageName)
		}
	}

	render(){
		const {data} = this.props.data
		let promoitem = data.promoitem

		let settings = {
			dots: true,
			infinite: false,
			speed: 500,
			slidesToShow: 1,
			slidesToScroll: 1
		}

		return (
			<div className="promo_detail">
				<div className="title">
					Promo Details
				</div>
				<div className="section">
					<div className="row">
						<div className="col-xs-12 col-sm-7">
							<div className="field_name2">Item Name:</div>
							<div className="field_value2 color_value">{data['Promotional Items']}</div>
						</div>
						<div className="col-xs-12 col-sm-5">
							<div className="field_name2">Start Date:</div>
							<div className="field_value2 color_value">{promoitem ? moment(promoitem['Start Date'], 'YYYY-MM-DD').format('MM/DD/YYYY') : ''}</div>
						</div>
					</div>
					<div className="row">
						<div className="col-xs-12 col-sm-7">
							<div className="field_name2">Instructions:</div>
							<div className="field_value2 color_value">{promoitem ? promoitem['Instructions'] : ''}</div>
						</div>
						<div className="col-xs-12 col-sm-5">
							<div className="field_name2">End Date:</div>
							<div className="field_value2 color_value">{promoitem ? moment(promoitem['End Date'], 'YYYY-MM-DD').format('MM/DD/YYYY') : ''}</div>
						</div>
					</div>
					<div className="row">
						<div className="col-xs-12 col-sm-7">
							<div className="field_name2">Site-Specific Instructions:</div>
							<div className="field_value2 color_value">{data['Site-Specific']}</div>
						</div>
						<div className="col-xs-12 col-sm-5">
							<div className="field_name2">Active?:</div>
							<div className="field_value2 color_value">{data['Active?']}</div>
						</div>
					</div>
				</div>
				<div className="section">
					<div className="row">
						<div className="col-xs-12 col-sm-4 image">
							<div className="text-center">Promotional Item</div>
							<img className="photo" src={asset('/cache/' + data['Image'] + '.png')} onClick={this.onClickPreview.bind(this, data['Image'])}/>
						</div>
						<div className="col-xs-12 col-sm-4 image">
							<div className="text-center">Installed Image</div>
							<img className="photo" src={asset('/cache/' + data['Installed Image'] + '.png')} onClick={this.onClickPreview.bind(this, data['Installed Image'])}/>
						</div>
						<div className="col-xs-12 col-sm-4 image">
							<div className="text-center">Removal Image</div>
							<img className="photo" src={asset('/cache/' + data['Removal Image'] + '.png')} onClick={this.onClickPreview.bind(this, data['Removal Image'])}/>
						</div>
					</div>
				</div>
				<div className="section">
					<div className="field_name2">Notes- Location Manager:</div>
					<div className="field_value2">{data['Notes- Location Manager']}</div>
				</div>
			</div>
		)
	}
}