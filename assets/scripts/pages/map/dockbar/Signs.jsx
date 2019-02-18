import React from 'react'
import moment from 'moment-timezone'
import _ from 'lodash'
import ReactTable from 'react-table'
import {Checkbox} from 'semantic-ui-react'

import {LAYER_SIGNS} from '../../../core/components/Layers'

export default class Signs extends React.Component{
	constructor(props){
		super(props)
		this.state ={
			expand: false
		}
	}

	onClickRow(id, data){
		if (typeof this.props.onClickDataRow === 'function') {
			this.props.onClickDataRow(LAYER_SIGNS, id, data)
		}
	}

	onToggleExpand(event, data){
		this.setState({expand: data.checked})
	}

	render(){
		let self = this
		let {signs} = this.props
		let {expand} = this.state

		let columns = [
			{Header: '', className:'td-image', accessor: 'Latest Brand Compliance Photo', Cell: props => <img className="td-photo" src={asset('/cache/' + props.value + '.png')}/>},
			{Header: 'Sign Map Name', accessor: 'Sign Map Name'},
			{Header: 'Sign Type', accessor: 'Sign Type'},
			{Header: 'Last Date Assessed', accessor: 'Last Date Assessed', Cell: props => <span>{moment(props.value).format('MM/DD/YYYY')}</span>},
			{Header: 'Brand Compliant?', accessor: 'Brand Compliant?'},
			{Header: 'Check Needed?', accessor: 'Brand Compliance Check Needed?'},			
		]
		if(expand){
			columns.push({Header: 'Days Since Last Assessment', accessor: 'Days Since Last Assessment'})
			columns.push({Header: 'Number of Records', accessor: 'Number of Brand Compliance Records'})
			columns.push({Header: 'Illumination', accessor: 'Illumination'})
			columns.push({Header: 'Façade Material', accessor: 'Façade Material'})
			columns.push({Header: 'Sign Notes', accessor: 'Sign Notes'})
		}
		return (
			<div className="dock-signs">
				<div className="table_expand">
					<div className="expand_title">Expand:</div>
					<Checkbox toggle checked={expand} onChange={::this.onToggleExpand} />
				</div>
				<ReactTable
					showPagination={false}
					minRows={0}
					data={signs}
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