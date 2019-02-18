import React from 'react'
import _ from 'lodash'
import moment from 'moment-timezone'
import Slider from 'react-slick'

export default class Signs extends React.Component{
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
		let items = data.brands
		items = _.orderBy(items, (item)=>{return item['Date/Time Assessed']}, 'asc')
		let images = _.map(items, (item, index)=>{
			let dateTimeAssessed = moment(item['Date/Time Assessed']).format('MM/DD/YYYY')
			return <img key={index} title={dateTimeAssessed} className="photo" src={asset('/cache/' + item['Brand Compliance Photo'] + '.png')} onClick={this.onClickPreview.bind(this, item['Brand Compliance Photo'])}/>
		})

		let settings = {
			dots: true,
			infinite: false,
			speed: 500,
			slidesToShow: 1,
			slidesToScroll: 1
		}

		return (
			<div className="detail">
				<div className="left">
					<div className="title">
						Sign Details
					</div>
					<div className="section">
						<div>
							<div className="field_name2">Sign Map Name:</div>
							<div className="field_value2 color_value">{data['Sign Map Name']}</div>
						</div>
						<div>
							<div className="field_name2">Sign Type:</div>
							<div className="field_value2 color_value">{data['Sign Type']}</div>
						</div>
						<div>
							<div className="field_name2">Illumination:</div>
							<div className="field_value2 color_value">{data['Illumination']}</div>
						</div>
						<div>
							<div className="field_name2">Last Date Assessed:</div>
							<div className="field_value2 color_value">{moment(data['Last Date Assessed']).format('MM/DD/YYYY')}</div>
						</div>
						<div>
							<div className="field_name2">Brand Compliant?:</div>
							<div className={data['Brand Compliant?'] == "Yes" ? "field_value2 color_green" : "field_value2 color_red"}>{data['Brand Compliant?']}</div>
						</div>
						<div>
							<div className="field_name2">Brand Compliance Check Needed?:</div>
							<div className={data['Brand Compliance Check Needed?'] != "Yes" ? "field_value2 color_green" : "field_value2 color_red"}>{data['Brand Compliance Check Needed?']}</div>
						</div>
						<div className="brandCompliance">
							<div className="field_name1 text-center">Brand Compliance History</div>
							<div className="field_image_signs text-center">
								{images}
							</div>
						</div>
						<div>
							<div className="field_name2">Sign Notes:</div>
							<div className="field_value2">{data['Sign Notes']}</div>
						</div>
					</div>
				</div>
				<div className="right">
					<Slider {...settings}>
						{!!data['Latest Brand Compliance Photo'] && 
						<div>								
							<div className="text-center">Latest Brand Compliance Photo:</div>
							<img className="photo" src={asset('/cache/' + data['Latest Brand Compliance Photo'] + '.png')} onClick={this.onClickPreview.bind(this, data['Latest Brand Compliance Photo'])}/>
						</div>
						}
						{!!data['Design Intent Image'] && 
						<div>
							<div className="text-center">Design Intent Image</div>
							<img className="photo" src={asset('/cache/' + data['Design Intent Image'] + '.png')} onClick={this.onClickPreview.bind(this, data['Design Intent Image'])}/>
						</div>
						}
						{!!data['Sign Plan Image'] && 
						<div>
							<div className="text-center">Sign Plan Image</div>
							<img className="photo" src={asset('/cache/' + data['Sign Plan Image'] + '.png')} onClick={this.onClickPreview.bind(this, data['Sign Plan Image'])}/>
						</div>
						}
						{!!data['Sign Plan Image Option 2'] && 
						<div>
							<div className="text-center">Sign Plan Image Option 2</div>
							<img className="photo" src={asset('/cache/' + data['Sign Plan Image Option 2'] + '.png')} onClick={this.onClickPreview.bind(this, data['Sign Plan Image Option 2'])}/>
						</div>
						}
					</Slider>
				</div>
			</div>
		)
	}
}