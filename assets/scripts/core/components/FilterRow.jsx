import React from 'react'
import _ from 'lodash'
import moment from 'moment'
import DatePicker from 'react-datepicker'
import DateRangePicker from './DateRangePicker'
import { Icon, Input, Dropdown } from 'semantic-ui-react'
import {LAYER_LOCATION, LAYER_SIGNS, LAYER_VEHICLES, LAYER_PROMOS} from './Layers'
import {TYPE_NONE, TYPE_STRING_IS_BLANK, TYPE_STRING_IS_NOT_BLANK, TYPE_NUMBER_IS_BLANK, TYPE_NUMBER_IS_NOT_BLANK, TYPE_DATE_IS_BLANK, TYPE_DATE_IS_NOT_BLANK, TYPE_DATE_IS_BEFORE, TYPE_DATE_IS_BEFORE_OR_EQUAL, TYPE_DATE_IS_AFTER, TYPE_DATE_IS_AFTER_OR_EQUAL, TYPE_DATE_IS_IN_RANGE, TYPE_DATE_IS_NOT_IN_RANGE} from '../search'
import {FIELDS_TYPE_NONE, FIELDS_TYPE_STRING, FIELDS_TYPE_NUMBER, FIELDS_TYPE_PERCENTAGE, FIELDS_TYPE_DATE, FIELDS_TYPE_DROPDOWN} from '../search'
import {FIELDS, TYPES} from '../search'

export default class FilterRow extends React.Component {
  constructor(props){
    super(props)
    this.setFocus = false
  }

  componentDidUpdate(){
    if(this.setFocus){
      this.setFocus = false
      $('.inputFilter input').focus()
    }    
  }

  onFieldChange(e, obj){
    const {index, onUpdate} = this.props
    let selected = _.find(obj.options, { 'value': obj.value })
    onUpdate(index, selected, TYPE_NONE, null, null)    
  }

  onTypeChange(e, obj){
    const {index, filter, onUpdate} = this.props    
    if(filter.type == obj.value)
      return
    this.setFocus = true
    if(this.refs.inputFilter)
      this.refs.inputFilter.inputRef.value = ''
    onUpdate(index, filter.field, obj.value, null, null)
  }

  onValueInputChange(e, obj){
    const {index, filter, onUpdate} = this.props
    onUpdate(index, filter.field, filter.type, obj.value, null)
  }

  onValueInputKeyDown(event){
    let search = this.refs.inputFilter.inputRef.value
		if(event.keyCode == 13 && search.length > 0){
			this.props.onFilter()
		}
  }

  onValueDropdownChange(e, obj){
    const {index, filter, onUpdate} = this.props
    onUpdate(index, filter.field, filter.type, obj.value, null)
  }

  onValueDatePickerChange(date){
    const {index, filter, onUpdate} = this.props
    onUpdate(index, filter.field, filter.type, date, null)
  }

  onDateRangeApply(start, end) {
    const {index, filter, onUpdate} = this.props
    onUpdate(index, filter.field, filter.type, start, end)
	}

	onDateRangeClear() {
    const {index, filter, onUpdate} = this.props
    onUpdate(index, filter.field, filter.type, null, null)
	}

  onRemove(){
    const {index, onRemove} = this.props
    onRemove(index)
  }

  render() {
    const {index, layer, filter} = this.props

    let fields= [], types= [], dropdown = []
    switch(layer){
      case LAYER_LOCATION:
        fields = FIELDS.locations
        break
      case LAYER_SIGNS:
        fields = FIELDS.signs
        break
      case LAYER_VEHICLES:
        fields = FIELDS.vehicles
        break
      case LAYER_PROMOS:
        fields = FIELDS.promos
        break
      default:
        break
    }

    let hasInput = filter.type == TYPE_NONE ? false : true
    let hasDropdown = false, hasDatePicker = false, hasDateRange = false, isPercentage = false
    switch(filter.field.type){
      case FIELDS_TYPE_STRING:
        types = TYPES.string
        if(filter.type == TYPE_STRING_IS_BLANK || filter.type == TYPE_STRING_IS_NOT_BLANK)
          hasInput = false
        break
      case FIELDS_TYPE_NUMBER:
        types = TYPES.number
        if(filter.type == TYPE_NUMBER_IS_BLANK || filter.type == TYPE_NUMBER_IS_NOT_BLANK)
          hasInput = false
        break
      case FIELDS_TYPE_PERCENTAGE:
        types = TYPES.percentage
        isPercentage = true
        if(filter.type == TYPE_NUMBER_IS_BLANK || filter.type == TYPE_NUMBER_IS_NOT_BLANK)
          hasInput = false
        break
      case FIELDS_TYPE_DATE:
        types = TYPES.date
        hasInput = false
        switch(filter.type){
          case TYPE_DATE_IS_BEFORE:
          case TYPE_DATE_IS_BEFORE_OR_EQUAL:
          case TYPE_DATE_IS_AFTER:
          case TYPE_DATE_IS_AFTER_OR_EQUAL:
            hasDatePicker = true
            break
          case TYPE_DATE_IS_IN_RANGE:
          case TYPE_DATE_IS_NOT_IN_RANGE:
            hasDateRange = true
            break
          default:
            break
        }
        break
      case FIELDS_TYPE_DROPDOWN:
        types = TYPES.dropdown
        hasInput = false
        hasDropdown = filter.type != TYPE_NONE
        dropdown = filter.field.list
        break
      default:
        types = []
        hasInput = false
        break
    }

    return (
      <div className="filter_row_content">
        <Icon 
          name='delete' 
          inverted circular link 
          onClick={::this.onRemove}/>
        <div className="filter_row_item">
          <Dropdown 
            ref="filter_field"
            placeholder='Choose a field' fluid selection
            onChange={::this.onFieldChange}
            options={fields}
            value={filter.field.value}
            />
        </div>
        {types.length > 0 &&
          <div className="filter_row_item">
            <Dropdown 
              ref="filter_type"
              placeholder='Choose...' fluid selection
              onChange={::this.onTypeChange}
              value={filter.type}
              options={types} />
          </div>
        }
        {hasInput &&
          <div className="filter_row_item">
            <Input
              ref="inputFilter"
              placeholder="Search..."
              type="text"
              size="small"
              className="inputFilter"
              focus
              onChange={::this.onValueInputChange}
              onKeyDown={::this.onValueInputKeyDown}
            />
            {isPercentage && 
              <div>%</div>
            }
          </div>
        }
        {hasDropdown &&
          <div className="filter_row_item">
            <Dropdown 
              ref="filter_type"
              placeholder='Choose ...' fluid selection
              onChange={::this.onValueDropdownChange}
              value={filter.value1}
              options={dropdown} />
          </div>
        }
        {hasDatePicker &&
          <div className="filter_row_item">
            <DatePicker
              selected={filter.value1}
              onChange={::this.onValueDatePickerChange}
              dateFormat="YYYY-MM-DD"
            />
          </div>
        }
        {hasDateRange &&
          <DateRangePicker
            startDate={filter.value1}
            endDate={filter.value2}
            onApply={::this.onDateRangeApply} 
            onClear={::this.onDateRangeClear}
          />
        }
      </div>
    )
  }
}