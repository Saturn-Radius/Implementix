import React from 'react'

export default class Brand extends React.Component{
	render(){
		return (
			<div className='brand_container'>
				<img className='icon_brand' src={asset('/assets/resources/images/icon_brand.svg')}/> 
			</div>
		)
	}
}