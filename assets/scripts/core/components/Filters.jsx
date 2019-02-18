import React from 'react'
import _ from 'lodash'
import { Button, Icon, Label } from 'semantic-ui-react'
import FilterRow from './FilterRow'

import {FIELDS, TYPES} from '../search'
import {FIELDS_TYPE_NONE, FIELDS_TYPE_STRING, FIELDS_TYPE_NUMBER, FIELDS_TYPE_PERCENTAGE, FIELDS_TYPE_DATE, FIELDS_TYPE_DROPDOWN} from '../search'
import {TYPE_NONE, TYPE_STRING_IS_BLANK, TYPE_STRING_IS_NOT_BLANK, TYPE_NUMBER_IS_BLANK, TYPE_NUMBER_IS_NOT_BLANK, TYPE_DATE_IS_BLANK, TYPE_DATE_IS_NOT_BLANK} from '../search'
import {TYPE_DATE_IS_BEFORE, TYPE_DATE_IS_BEFORE_OR_EQUAL, TYPE_DATE_IS_AFTER, TYPE_DATE_IS_AFTER_OR_EQUAL, TYPE_DATE_IS_IN_RANGE, TYPE_DATE_IS_NOT_IN_RANGE} from '../search'

let FILTER_EMPTY = {
	field: {text:'Choose a field', value: '', type: FIELDS_TYPE_NONE},
	type: TYPE_NONE,
	value1: null,
	value2: null,
}
const IS_NULL_OR_EMPTY = (str) => {return str == null || str.trim() == ''}

export default class Filters extends React.Component {
	constructor(props){
		super(props)
		this.state = {
			filters: [Object.assign({}, FILTER_EMPTY)],
			valid: false
		}
		let width = $(window).width()
		let height = $(window).height()
		let min = Math.min(width, height)
		this.isMobile = min < 768
		this.filterLimit = this.isMobile ? 2: 3
	}

	componentWillReceiveProps(nextProps) {
		$('.filters_container').css({
			top: nextProps.layersVisible ? 350 : 150
		})
		this.setState({visible: nextProps.visible}) // not specific action, but to trigger render
		if(this.props.layer != nextProps.layer){
			this.refreshFilter()
		}
	}

	refreshFilter() {
		let filters = [Object.assign({}, FILTER_EMPTY)]
		this.setState({
			filters: filters
		})
		this.evaluateApply(filters)
		this.props.onFilter(filters)
	}	

	addEmptyFilter() {
		let filters = this.state.filters
		if(filters.length >= this.filterLimit)
			return
		let filter = Object.assign({}, FILTER_EMPTY)
		filters.push(filter)
		this.setState({
			filters: filters
		})
		this.evaluateApply(filters)
	}
	
	updateFilter(index, field, type, value1, value2){
		let filters = this.state.filters
		if(index >= filters.length){
			console.log('update filter error index = ', index)
			return
		}
		filters[index].field = field
		filters[index].type = type
		filters[index].value1 = value1
		filters[index].value2 = value2
		this.setState({
			filters: filters
		})
		this.evaluateApply(filters)
	}

	removeFilter(index){
		let filters = this.state.filters
		filters.splice(index, 1)
		if(filters.length == 0){
			this.addEmptyFilter()
		}
		else{
			this.setState({
				filters: filters
			})
			this.evaluateApply(filters)
		}
	}

	evaluateApply(filters){
		let valid = true
		_.map(filters, (filter, index)=>{
			if(filter.field.type == FIELDS_TYPE_NONE)
				valid = false
			else{
				if(filter.type == TYPE_NONE)
					valid = false
				else{
					switch(filter.field.type){
						case FIELDS_TYPE_STRING:
							if(!(filter.type == TYPE_STRING_IS_BLANK || filter.type == TYPE_STRING_IS_NOT_BLANK) && IS_NULL_OR_EMPTY(filter.value1)){
								valid = false
							}
							break
						case FIELDS_TYPE_NUMBER:
						case FIELDS_TYPE_PERCENTAGE:
							if(!(filter.type == TYPE_NUMBER_IS_BLANK || filter.type == TYPE_NUMBER_IS_NOT_BLANK) && IS_NULL_OR_EMPTY(filter.value1)){
								valid = false
							}
							break
						case FIELDS_TYPE_DATE:
							switch(filter.type){
								case TYPE_DATE_IS_BEFORE:
								case TYPE_DATE_IS_BEFORE_OR_EQUAL:
								case TYPE_DATE_IS_AFTER:
								case TYPE_DATE_IS_AFTER_OR_EQUAL:
									if(filter.value1 == null)
										valid = false
									break
								case TYPE_DATE_IS_IN_RANGE:
								case TYPE_DATE_IS_NOT_IN_RANGE:
									if(filter.value1 == null || filter.value2 == null)
										valid = false
									break
								default:
									break
							}
							break
						case FIELDS_TYPE_DROPDOWN:
							if(filter.value1 == null)
								valid = false
							break
						default:
							break
					}
				}
			}
		})
		this.setState({
			valid: valid
		})
	}

	onClickToggle() {
		this.props.onClickFilterToggle(!this.props.visible)
	}

	onFilter(){
		this.props.onFilter(this.state.filters)
	}

	render() {
		const {layer, visible, count} = this.props
		const {filters, valid} = this.state

		let filter_rows = _.map(filters, (filter, index)=>{
			return (
				<div key={index} className="filter_row">
					<FilterRow
						index={index}
						layer={layer}
						filter={filter}
						onUpdate={::this.updateFilter}
						onRemove={::this.removeFilter}
						onFilter={::this.onFilter}
					/>
				</div>
			)
		})
		
		return (
			<div className="filters_container">
				<div className="filters_toggle" onClick={::this.onClickToggle}>
					<img className="toggle_button" src={asset('/assets/resources/images/icon_filter.png')}/>
				</div>				
				<div className="filters_content" style={{opacity: visible ? 1 : 0, pointerEvents: visible ? 'fill' : 'none'}}>
					<div className="filter_rows">
						{filter_rows}
					</div>
					<div className="filter_action">
						<div className="filter_add">
							<Label onClick={::this.addEmptyFilter}>
								<Icon 
									name='plus' 
									inverted circular link />
								Add Filter
							</Label>
							<div>
								Count: {count}
							</div>
						</div>
						<div className="filter_buttons">
							<Button primary disabled={!valid} onClick={::this.onFilter}>Apply</Button>
							<Button secondary onClick={::this.refreshFilter}>Clear</Button>
						</div>
					</div>
				</div>
			</div>
		)
	}
}