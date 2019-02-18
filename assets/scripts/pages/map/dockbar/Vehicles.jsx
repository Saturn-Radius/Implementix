import React from 'react'
import moment from 'moment-timezone'
import _ from 'lodash'
import ReactTable from 'react-table'
import {Checkbox} from 'semantic-ui-react'

import {LAYER_VEHICLES} from '../../../core/components/Layers'

export default class Vehicles extends React.Component{
	constructor(props){
		super(props)
		this.state ={
			expand: false
		}
	}

	onClickRow(id, data){
		if (typeof this.props.onClickDataRow === 'function') {
			this.props.onClickDataRow(LAYER_VEHICLES, id, data)
		}
	}
	
	onToggleExpand(event, data){
		this.setState({expand: data.checked})
	}

	render(){
		let self = this
		let {vehicles} = this.props
		let {expand} = this.state
		let columns = [			
			{Header: 'Unit Number', accessor: 'Unit Number'},
			{Header: 'Vehicle type', accessor: 'Vehicle Type'},
			{Header: 'Front Photo', className:'td-image', accessor: 'Front Photo', Cell: props => <img className="td-photo" src={asset('/cache/' + props.value + '.png')}/>}
		]
		if(expand){
			columns.push({Header: 'Left Photo', className:'td-image', accessor: 'Left Photo', Cell: props => <img className="td-photo" src={asset('/cache/' + props.value + '.png')}/>})
			columns.push({Header: 'Rear Photo', className:'td-image', accessor: 'Rear Photo', Cell: props => <img className="td-photo" src={asset('/cache/' + props.value + '.png')}/>})
			columns.push({Header: 'Right Photo', className:'td-image', accessor: 'Right Photo', Cell: props => <img className="td-photo" src={asset('/cache/' + props.value + '.png')}/>})
			columns.push({Header: 'Optional Photo', className:'td-image', accessor: 'Optional Photo', Cell: props => <img className="td-photo" src={asset('/cache/' + props.value + '.png')}/>})
			columns.push({Header: 'Last Date Assessed', accessor: 'Last Date Assessed'})
			columns.push({Header: 'Brand Compliant?', accessor: 'Brand Compliant?'})
			columns.push({Header: 'Corrective Action Needed?', accessor: 'Corrective Action Needed?'})
			columns.push({Header: 'Vehicle Notes', accessor: 'Vehicle Notes'})
		}
		return (
			<div className="dock-vehicles">
				<div className="table_expand">
					<div className="expand_title">Expand:</div>
					<Checkbox toggle checked={expand} onChange={::this.onToggleExpand} />
				</div>
				<ReactTable
					showPagination={false}
					minRows={0}
					data={vehicles}
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