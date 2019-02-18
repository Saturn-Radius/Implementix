import React from 'react'
import _ from 'lodash'
import moment from 'moment-timezone'
import Slider from 'react-slick'

export default class Promos extends React.Component{
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
		const {data, items, onClickPreview} = this.props
		let promoitem = null
		_.map(items, (item, item_index)=>{
			if(parseInt(data['Promotional Items(id)']) === parseInt(item.id)){
				promoitem = item.$original
			}
		})

		let settings = {
			dots: true,
			infinite: false,
			speed: 500,
			slidesToShow: 1,
			slidesToScroll: 1
		}

		return (
			<div className="content">
				<div className="content_body">
					<div className="section">
						<div className="field_name1">Location:</div>
						<div className="field_value1 color_value field_link" onClick={this.onClickLocation.bind(this, data['Location(id)'])}>{data['Location']}</div>
					</div>
					<div className="section">
						<div className="field_name1">Title:</div>
						<div className="field_value1 color_value">{data['Title']}</div>
					</div>
					<div className="section">
						<div>
							<div className="field_name2">Instructions:</div>
							<div className="field_value2 color_value">{promoitem ? promoitem['Instructions'] : ''}</div>
						</div>
						<div>
							<div className="field_name2">Start Date:</div>
							<div className="field_value2 color_value">{promoitem ? moment(promoitem['Start Date'], 'YYYY-MM-DD').format('MM/DD/YYYY') : ''}</div>
						</div>
						<div>
							<div className="field_name2">End Date:</div>
							<div className="field_value2 color_value">{promoitem ? moment(promoitem['End Date'], 'YYYY-MM-DD').format('MM/DD/YYYY') : ''}</div>
						</div>
						<div>
							<div className="field_name2">Active?:</div>
							<div className="field_value2 color_value">{data['Active?']}</div>
						</div>
						<div>
							<div className="field_name2">Site-Specific Instructions:</div>
							<div className="field_value2 color_value">{data['Site-Specific Instructions']}</div>
						</div>
					</div>
					<div className="section">
						<div className="field_name1">Photo:</div>
						<div className="field_image2">
							<Slider {...settings}>
								{!!data['Image'] && 
								<div>
									<div className="text-center">Image</div>
									<img className="photo" src={asset('/cache/' + data['Image'] + '.png')} onClick={this.onClickPreview.bind(this, data['Image'])}/>
								</div>
								}
								{!!data['Installed Image'] && 
								<div>
									<div className="text-center">Installed Image</div>
									<img className="photo" src={asset('/cache/' + data['Installed Image'] + '.png')} onClick={this.onClickPreview.bind(this, data['Installed Image'])}/>
								</div>
								}
								{!!data['Removal Image'] &&
								<div>
									<div className="text-center">Removal Image</div>
									<img className="photo" src={asset('/cache/' + data['Removal Image'] + '.png')} onClick={this.onClickPreview.bind(this, data['Removal Image'])}/>
								</div>
								}
							</Slider>
						</div>
					</div>
					<div className="section">
						<div className="field_name2">Notes- Location Manager:</div>
						<div className="field_value2">{data['Notes- Location Manager']}</div>
					</div>
				</div>
			</div>
		)
	}
}