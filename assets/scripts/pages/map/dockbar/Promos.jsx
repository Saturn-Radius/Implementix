import React from 'react'
import moment from 'moment-timezone'
import _ from 'lodash'
import ReactTable from 'react-table'
import {Checkbox} from 'semantic-ui-react'

import {LAYER_PROMOS} from '../../../core/components/Layers'

export default class Promos extends React.Component{
	constructor(props){
		super(props)
		this.state ={
			expand: false
		}
	}

	onClickRow(id, data){
		if (typeof this.props.onClickDataRow === 'function') {
			this.props.onClickDataRow(LAYER_PROMOS, id, data)
		}
	}
	
	onToggleExpand(event, data){
		this.setState({expand: data.checked})
	}

	render(){
		let self = this
		let {promos} = this.props
		let {expand} = this.state

		let promoitems = _.map(promos, (promo)=>{
			if(promo.promoitem){
				return {
					'id': promo['id'],
					'Title': promo['Title'],
					'Instructions': promo.promoitem['Instructions'],
					'Start Date': promo.promoitem['Start Date'],
					'End Date': promo.promoitem['End Date'],
					'Promotional Items(id)': promo['Promotional Items(id)'],
					'Promotional Items': promo['Promotional Items'],
					'Item Name': promo['Promotional Items'],
					'Location': promo['Location'],
					'Location(id)': promo['Location(id)'],
					'Active?': promo['Active?'],
					'Site-Specific Instructions': promo['Site-Specific Instructions'],
					'Notes- Location Manager': promo['Notes- Location Manager'],
					'Image': promo['Image'],
					'Installed Image': promo['Installed Image'],
					'Removal Image': promo['Removal Image'],
					'Promotion Duration': promo['Promotion Duration'],
					'Date1': promo['Date Scheduled vs. Date Installed'],
					'Date2': promo['Date Removal Scheduled vs. Date Removed'],
				}
			}else{
				return {
					'id': promo['id'],
					'Title': promo['Title'],
					'Promotional Items(id)': promo['Promotional Items(id)'],
					'Promotional Items': promo['Promotional Items'],
					'Item Name': promo['Promotional Items'],
					'Location': promo['Location'],
					'Location(id)': promo['Location(id)'],
					'Active?': promo['Active?'],
					'Site-Specific Instructions': promo['Site-Specific Instructions'],
					'Notes- Location Manager': promo['Notes- Location Manager'],
					'Image': promo['Image'],
					'Installed Image': promo['Installed Image'],
					'Removal Image': promo['Removal Image'],
					'Promotion Duration': promo['Promotion Duration'],
					'Date1': promo['Date Scheduled vs. Date Installed'],
					'Date2': promo['Date Removal Scheduled vs. Date Removed'],
				}
			}
		})
		let data = _.compact(promoitems)
		let columns = [
			{Header: '', className:'td-image', accessor: 'Image', Cell: props => {
				let active = props.original['Active?']
				let image = active == 'Future' ? props.original['Image'] : (active == 'Active' ? props.original['Installed Image'] : props.original['Removal Image'])
				return (<img className="td-photo" src={asset('/cache/' + image + '.png')}/>)
			}},
			{Header: 'Title', accessor: 'Title'},
			{Header: 'Instructions', accessor: 'Instructions'},
			{Header: 'Start Date', accessor: 'Start Date', Cell: props => <span>{moment(props.value).format('MM/DD/YYYY')}</span>},
			{Header: 'End Date', accessor: 'End Date', Cell: props => <span>{moment(props.value).format('MM/DD/YYYY')}</span>},
			{Header: 'Active?', accessor: 'Active?'},
		]
		if(expand){
			columns.push({Header: 'Promotion Duration', accessor: 'Promotion Duration'})
			columns.push({Header: 'Site-Specific Instructions', accessor: 'Site-Specific Instructions'})
			columns.push({Header: 'Installed Image', className:'td-image', accessor: 'Installed Image', Cell: props => {
				return (<img className="td-photo" src={asset('/cache/' + props.original['Installed Image'] + '.png')}/>)
			}})
			columns.push({Header: 'Removal Image', className:'td-image', accessor: 'Removal Image', Cell: props => {
				return (<img className="td-photo" src={asset('/cache/' + props.original['Removal Image'] + '.png')}/>)
			}})
			columns.push({Header: 'Date Scheduled vs. Date Installed', accessor: 'Date1'})
			columns.push({Header: 'Date Removal Scheduled vs. Date Removed', accessor: 'Date2'})
			columns.push({Header: 'Notes- Location Manager', accessor: 'Notes- Location Manager'})
		}		
		return (
			<div className="dock-promos">
				<div className="table_expand">
					<div className="expand_title">Expand:</div>
					<Checkbox toggle checked={expand} onChange={::this.onToggleExpand} />
				</div>
				<ReactTable
					showPagination={false}
					minRows={0}
					data={data}
					columns={columns}
					defaultPageSize={100}
					getTrProps={(state, rowInfo, column, instance) => {
						return {
							onClick: (e, handleOriginal) => {
								self.onClickRow(rowInfo.original.id, rowInfo.original)
							}
						}
					}}
				/>
			</div>
		)
	}
}