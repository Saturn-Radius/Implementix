import _ from 'lodash'
import moment from 'moment'
import {LAYER_NONE, LAYER_LOCATION, LAYER_SIGNS, LAYER_VEHICLES, LAYER_PROMOS} from './components/Layers'

const CONVERT_LIST_TO_DROPDOWN = (list) => {
	let ret = [{text:'Choose ...', value: null}]
	_.map(list, (item)=>{
		ret.push({text: item, value:item})
	})
	return ret
}

const IS_IN_DATE_RANGE = (date, startDate, endDate) => {
	let start = startDate.clone()
	let end = endDate.clone()
	if(startDate.isSame(endDate)){
		start = start.add(-1, 'days')
	}
	return date.isSameOrBefore(end) && date.isSameOrAfter(start)
}

export const IS_FOUND = (value, keyword) => {
	if(!value)
		return 0
	return value.toLowerCase().indexOf(keyword) != -1 ? 1 : 0
}

// { FIELDS
	export const FIELDS_TYPE_NONE = 0
	export const FIELDS_TYPE_STRING = 1
	export const FIELDS_TYPE_NUMBER = 2
	export const FIELDS_TYPE_PERCENTAGE = 3
	export const FIELDS_TYPE_DATE = 4
	export const FIELDS_TYPE_DROPDOWN = 5

	export const FIELDS = {
		locations: [
				{text:'Choose a field', value: '', type: FIELDS_TYPE_NONE},
				{text:'# of Signs', value: '# of Signs', type: FIELDS_TYPE_NUMBER},
				{text:'Address', value: 'Address', type: FIELDS_TYPE_STRING},
				{text:'Brand Compliance Status', value: 'Brand Compliance Status', type: FIELDS_TYPE_STRING},
				{text:'Compliance Check Needed?', value: 'Compliance Check Needed?', type: FIELDS_TYPE_STRING},
				{text:'Days Since Last Brand Compliance Check', value: 'Days Since Last Brand Compliance Check', type: FIELDS_TYPE_NUMBER},
				{text:'Inactive?', value: 'Inactive?', type: FIELDS_TYPE_DROPDOWN, list: CONVERT_LIST_TO_DROPDOWN(['Inactive'])},
				{text:'Interior Wall Material', value: 'Interior Wall Material', type: FIELDS_TYPE_STRING},
				{text:'Last Brand Compliance Check', value: 'Last Brand Compliance Check', type: FIELDS_TYPE_DATE},
				{text:'Location Name', value: 'Location Name', type: FIELDS_TYPE_STRING},
				{text:'Record ID', value: 'Record ID', type: FIELDS_TYPE_STRING},
				{text:'Signs Checked', value: 'Signs Checked', type: FIELDS_TYPE_PERCENTAGE},
				{text:'Signs That Are Brand Compliant', value: 'Signs That Are Brand Compliant', type: FIELDS_TYPE_PERCENTAGE}
			],
		signs: [
				{text:'Choose a field', value: '', type: FIELDS_TYPE_NONE},
				{text:'Assessment Needed?', value: 'Assessment Needed?', type: FIELDS_TYPE_STRING},
				{text:'Brand Compliance Check Needed?', value: 'Brand Compliance Check Needed?', type: FIELDS_TYPE_STRING},
				{text:'Brand Compliant?', value: 'Brand Compliant?', type: FIELDS_TYPE_STRING},
				{text:'Client Added Sign?', value: 'Client Added Sign?', type: FIELDS_TYPE_DROPDOWN, list: CONVERT_LIST_TO_DROPDOWN(['Yes'])},
				{text:'Days Since Last Assessment', value: 'Days Since Last Assessment', type: FIELDS_TYPE_NUMBER},
				{text:'Facade Material', value: 'Facade Material', type: FIELDS_TYPE_DROPDOWN, list: CONVERT_LIST_TO_DROPDOWN(['Brick','Concrete','Drywall','Glass','Metal','N/A','Other- See Notes','Stone/Aggregate','Stucco','Vinyl','Wallpaper','Wood'])},
				{text:'Last Date Assessed', value: 'Last Date Assessed', type: FIELDS_TYPE_STRING},
				{text:'Locations', value: 'Locations', type: FIELDS_TYPE_STRING},
				{text:'New Sign Map Name', value: 'Sign Map Name', type: FIELDS_TYPE_STRING},
				{text:'New Sign Type', value: 'Sign Type', type: FIELDS_TYPE_STRING},
				{text:'Number of Brand Compliance Records', value: 'Number of Brand Compliance Records', type: FIELDS_TYPE_NUMBER},
				{text:'Old Sign Type', value: 'Old Sign Type', type: FIELDS_TYPE_DROPDOWN, list: CONVERT_LIST_TO_DROPDOWN(['ATM Canopy','Awning','Banner','Blade','Cabinet Sign','Channel Letters','Deposit Box','Dimensional Letters','Directional','Entrance','Free-Standing ATM','In-Wall ATM','Informational Display','Lane Signals','Monument','Other- See Notes','Parking Sign','Plaque','Pylon','Window Graphics'])},
				{text:'Record ID', value: 'Record ID', type: FIELDS_TYPE_STRING},
				{text:'Shared Sign?', value: 'Shared Sign?', type: FIELDS_TYPE_DROPDOWN, list: CONVERT_LIST_TO_DROPDOWN(['Yes'])},
				{text:'Sides?', value: 'Sides?', type: FIELDS_TYPE_DROPDOWN, list: CONVERT_LIST_TO_DROPDOWN(['1','2','3','4'])},
				{text:'Sign Notes', value: 'Sign Notes', type: FIELDS_TYPE_STRING},
			],
		vehicles: [
				{text:'Choose a field', value: '', type: FIELDS_TYPE_NONE},
				{text:'Record ID', value: 'Record ID', type: FIELDS_TYPE_STRING},
				{text:'Unit Number', value: 'Unit Number', type: FIELDS_TYPE_STRING},
				{text:'Vehicle Notes', value: 'Vehicle Notes', type: FIELDS_TYPE_STRING},
				{text:'Vehicle Type', value: 'Vehicle Type', type: FIELDS_TYPE_DROPDOWN, list: CONVERT_LIST_TO_DROPDOWN(['Ambulance','Cargo Van','Compact Cargo Van','Passenger Car','Pickup Truck','Pickup with Topper','SUV','Sedan','Trailer','Transit Van'])}
			],
		promos: [
				{text:'Choose a field', value: '', type: FIELDS_TYPE_NONE},
				{text:'Active?', value: 'Active?', type: FIELDS_TYPE_DROPDOWN, list: CONVERT_LIST_TO_DROPDOWN(['Active', 'Future', 'Retired'])},
				{text:'Promotion Duration', value: 'Promotion Duration', type: FIELDS_TYPE_STRING},
				{text:'Start Date', value: 'Start Date', type: FIELDS_TYPE_DATE},
				{text:'End Date', value: 'End Date', type: FIELDS_TYPE_DATE},
				{text:'Instructions', value: 'Instructions', type: FIELDS_TYPE_STRING},
				{text:'Location', value: 'Location', type: FIELDS_TYPE_STRING},
				{text:'Notes- Location Manager', value: 'Notes- Location Manager', type: FIELDS_TYPE_STRING},
				{text:'Site-Specific', value: 'Site-Specific', type: FIELDS_TYPE_STRING},
				{text:'Title', value: 'Title', type: FIELDS_TYPE_STRING},
			]
	}
// }

// { TYPES
	export const TYPE_NONE = 0
	export const TYPE_STRING_IDENTICAL = 1
	export const TYPE_STRING_NOT_IDENTICAL = 2
	export const TYPE_STRING_IS_BLANK = 3
	export const TYPE_STRING_IS_NOT_BLANK = 4
	export const TYPE_STRING_CONTAINS = 5
	export const TYPE_STRING_NOT_CONTAINS = 6

	export const TYPE_NUMBER_LESS_THAN = 1
	export const TYPE_NUMBER_LESS_THAN_OR_EQUAL_TO = 2
	export const TYPE_NUMBER_GREATER_THAN = 3
	export const TYPE_NUMBER_GREATER_THAN_OR_EQUAL_TO = 4
	export const TYPE_NUMBER_EQUAL_TO = 5
	export const TYPE_NUMBER_IS_NOT_EQUAL_TO = 6
	export const TYPE_NUMBER_IS_BLANK = 7
	export const TYPE_NUMBER_IS_NOT_BLANK = 8

	export const TYPE_DATE_IS_BEFORE = 1
	export const TYPE_DATE_IS_BEFORE_OR_EQUAL = 2
	export const TYPE_DATE_IS_AFTER = 3
	export const TYPE_DATE_IS_AFTER_OR_EQUAL = 4
	export const TYPE_DATE_IS_IN_RANGE = 5
	export const TYPE_DATE_IS_NOT_IN_RANGE = 6
	export const TYPE_DATE_IS_BLANK = 7
	export const TYPE_DATE_IS_NOT_BLANK = 8

	export const TYPE_DROPDOWN_HAS_THIS_OPTION_SELECTED = 1
	export const TYPE_DROPDOWN_DOES_NOT_HAVE_THIS_OPTION_SELECTED = 2
	export const TYPE_DROPDOWN_HAS_AN_OPTION_SELECTED = 3
	export const TYPE_DROPDOWN_HAS_NO_OPTIONS_SELECTED = 4
	export const TYPE_DROPDOWN_IS_ANY_OF_THE_FOLLOWING = 5
	export const TYPE_DROPDOWN_IS_NONE_OF_THE_FOLLOWING = 6

	export const TYPE_DATEDROPDOWN_NONE = 0
	export const TYPE_DATEDROPDOWN_THE_DATE = 1
	export const TYPE_DATEDROPDOWN_THIS_MANY_DAYS_AGO = 2
	export const TYPE_DATEDROPDOWN_THIS_MANY_DAYS_FROM_NOW = 3
	export const TYPE_DATEDROPDOWN_YESTERDAY = 4
	export const TYPE_DATEDROPDOWN_TODAY = 5
	export const TYPE_DATEDROPDOWN_TOMORROW = 6
	export const TYPE_DATEDROPDOWN_LAST_WEEK = 7
	export const TYPE_DATEDROPDOWN_THIS_WEEK = 8
	export const TYPE_DATEDROPDOWN_NEXT_WEEK = 9
	export const TYPE_DATEDROPDOWN_LAST_MONTH = 10
	export const TYPE_DATEDROPDOWN_THIS_MONTH = 11
	export const TYPE_DATEDROPDOWN_NEXT_MONTH = 12
	export const TYPE_DATEDROPDOWN_LAST_YEAR = 13
	export const TYPE_DATEDROPDOWN_THIS_YEAR = 14
	export const TYPE_DATEDROPDOWN_NEXT_YEAR = 15

	export const TYPES = {
		string: [
				{text:'Choose ...', value: TYPE_NONE},
				{text:'Is Identical To', value: TYPE_STRING_IDENTICAL},
				{text:'Is Not Identical To', value: TYPE_STRING_NOT_IDENTICAL},
				{text:'Is Blank', value: TYPE_STRING_IS_BLANK},
				{text:'Is Not Blank', value: TYPE_STRING_IS_NOT_BLANK},
				{text:'Contains', value: TYPE_STRING_CONTAINS},
				{text:'Does Not Contain', value: TYPE_STRING_NOT_CONTAINS},
			],
		number: [
				{text:'Choose ...', value: TYPE_NONE},
				{text:'Less than', value: TYPE_NUMBER_LESS_THAN},
				{text:'Less than or equal to', value: TYPE_NUMBER_LESS_THAN_OR_EQUAL_TO},
				{text:'Greater than', value: TYPE_NUMBER_GREATER_THAN},
				{text:'Greater than or equal to', value: TYPE_NUMBER_GREATER_THAN_OR_EQUAL_TO},
				{text:'Equal to', value: TYPE_NUMBER_EQUAL_TO},
				{text:'Is not equal to', value: TYPE_NUMBER_IS_NOT_EQUAL_TO},
				{text:'Is Blank', value: TYPE_NUMBER_IS_BLANK},
				{text:'Is Not Blank', value: TYPE_NUMBER_IS_NOT_BLANK},
			],
		percentage: [
				{text:'Choose ...', value: TYPE_NONE},
				{text:'Less than', value: TYPE_NUMBER_LESS_THAN},
				{text:'Less than or equal to', value: TYPE_NUMBER_LESS_THAN_OR_EQUAL_TO},
				{text:'Greater than', value: TYPE_NUMBER_GREATER_THAN},
				{text:'Greater than or equal to', value: TYPE_NUMBER_GREATER_THAN_OR_EQUAL_TO},
				{text:'Equal to', value: TYPE_NUMBER_EQUAL_TO},
				{text:'Is not equal to', value: TYPE_NUMBER_IS_NOT_EQUAL_TO},
				{text:'Is Blank', value: TYPE_NUMBER_IS_BLANK},
				{text:'Is Not Blank', value: TYPE_NUMBER_IS_NOT_BLANK},
			],
		date: [
				{text:'Choose ...', value: TYPE_NONE},
				{text:'Is before', value: TYPE_DATE_IS_BEFORE},
				{text:'Is before or equal to', value: TYPE_DATE_IS_BEFORE_OR_EQUAL},
				{text:'Is after', value: TYPE_DATE_IS_AFTER},
				{text:'Is after or equal to', value: TYPE_DATE_IS_AFTER_OR_EQUAL},
				{text:'Is in range', value: TYPE_DATE_IS_IN_RANGE},
				{text:'Is not in range', value: TYPE_DATE_IS_NOT_IN_RANGE},
				{text:'Is Blank', value: TYPE_DATE_IS_BLANK},
				{text:'Is not Blank', value: TYPE_DATE_IS_NOT_BLANK},
			],
		dropdown: [
				{text:'Choose ...', value: TYPE_NONE},
				{text:'Has this option selected', value: TYPE_DROPDOWN_HAS_THIS_OPTION_SELECTED},
				{text:'Does not have this option selected', value: TYPE_DROPDOWN_DOES_NOT_HAVE_THIS_OPTION_SELECTED},
				// {text:'Has an option selected', value: TYPE_DROPDOWN_HAS_AN_OPTION_SELECTED},
				// {text:'Has no options selected', value: TYPE_DROPDOWN_HAS_NO_OPTIONS_SELECTED},
				// {text:'Is any of the following', value: TYPE_DROPDOWN_IS_ANY_OF_THE_FOLLOWING},
				// {text:'Is none of the following', value: TYPE_DROPDOWN_IS_NONE_OF_THE_FOLLOWING},
			],
		date_dropdown: [
				{text: 'Choose ...', value: null},
				{text: 'The Date', value: TYPE_DATEDROPDOWN_THE_DATE},
				// {text: 'This many days ago', value: TYPE_DATEDROPDOWN_THIS_MANY_DAYS_AGO},
				// {text: 'This many days from now', value: TYPE_DATEDROPDOWN_THIS_MANY_DAYS_FROM_NOW},
				{text: 'Yesterday', value: TYPE_DATEDROPDOWN_YESTERDAY},
				{text: 'Today', value: TYPE_DATEDROPDOWN_TODAY},
				{text: 'Tomorrow', value: TYPE_DATEDROPDOWN_TOMORROW},
				{text: 'Last Week', value: TYPE_DATEDROPDOWN_LAST_WEEK},
				{text: 'This Week', value: TYPE_DATEDROPDOWN_THIS_WEEK},
				{text: 'Next Week', value: TYPE_DATEDROPDOWN_NEXT_WEEK},
				{text: 'Last Month', value: TYPE_DATEDROPDOWN_LAST_MONTH},
				{text: 'This Month', value: TYPE_DATEDROPDOWN_THIS_MONTH},
				{text: 'Next Month', value: TYPE_DATEDROPDOWN_NEXT_MONTH},
				{text: 'Last Year', value: TYPE_DATEDROPDOWN_LAST_YEAR},
				{text: 'This Year', value: TYPE_DATEDROPDOWN_THIS_YEAR},
				{text: 'Next Year', value: TYPE_DATEDROPDOWN_NEXT_YEAR},
			]
	}
// }

export const search = (layer, data, keyword, isAlbumView) => {
	if(keyword.length == 0)
		return data
	if(!data || !Array.isArray(data))
		return []
	let result = _.filter(data, (obj)=>{
		let item = isAlbumView ? obj : obj.$original
		if(!item)
			return 0
		let found = 0
		switch(layer){
			case LAYER_LOCATION:
				if(!isAlbumView){
					found += IS_FOUND(item['Project'], keyword)
					found += IS_FOUND(item['Record ID'], keyword)
					found += IS_FOUND(item['Address'], keyword)
					found += IS_FOUND(item['Location Name'], keyword)
					found += IS_FOUND(item['Bank'], keyword)
					found += IS_FOUND(item['Branch'], keyword)
				}else{
					// search in location
					found += IS_FOUND(item['Project'], keyword)
					found += IS_FOUND(item['Record ID'], keyword)
					found += IS_FOUND(item['Address'], keyword)
					found += IS_FOUND(item['Location Name'], keyword)
					found += IS_FOUND(item['Bank'], keyword)
					found += IS_FOUND(item['Branch'], keyword)
					
					// search in signs
					item.signs = _.filter(item.signs, (sign)=>{
						let found_sign = 0
						found_sign += IS_FOUND(sign['Sign Map Name'], keyword)
						found_sign += IS_FOUND(sign['Sign Type'], keyword)
						found_sign += IS_FOUND(sign['Illumination'], keyword)
						found_sign += IS_FOUND(sign['Sign Notes'], keyword)
						return found_sign > 0
					})
					found += item.signs.length

					// search in vehicles
					item.vehicles = _.filter(item.vehicles, (vehicle)=>{
						let found_vehicle = 0
						found_vehicle += IS_FOUND(vehicle['Vehicle Type'], keyword)
						found_vehicle += IS_FOUND(vehicle['Unit Number'], keyword)
						found_vehicle += IS_FOUND(vehicle['Vehicle Notes'], keyword)
						return found_vehicle > 0
					})
					found += item.vehicles.length

					// search in promos
					item.promos = _.filter(item.promos, (promo)=>{
						let found_promo = 0		
						found_promo += IS_FOUND(promo['Promotional Items'], keyword)
						found_promo += IS_FOUND(promo['Site-Specific'], keyword)
						found_promo += IS_FOUND(promo['Notes- Location Manager'], keyword)
						found_promo += IS_FOUND(promo['Title'], keyword)
						if(promo.promoitem){
							found_promo += IS_FOUND(promo.promoitem['Instructions'], keyword)
						}
						return found_promo > 0
					})
					found += item.promos.length
				}
				break
			case LAYER_SIGNS:
				found += IS_FOUND(item['Project'], keyword)
				found += IS_FOUND(item['Sign Map Name'], keyword)
				found += IS_FOUND(item['Sign Type'], keyword)
				found += IS_FOUND(item['Illumination'], keyword)
				found += IS_FOUND(item['Sign Notes'], keyword)
				found += IS_FOUND(item['Locations'], keyword)
				break
			case LAYER_VEHICLES:
				found += IS_FOUND(item['Project'], keyword)
				found += IS_FOUND(item['Record ID'], keyword)
				found += IS_FOUND(item['Location'], keyword)
				found += IS_FOUND(item['Unit Number'], keyword)
				found += IS_FOUND(item['Vehicle Notes'], keyword)
				found += IS_FOUND(item['Vehicle Type'], keyword)
				break
			case LAYER_PROMOS:
				found += IS_FOUND(item['Record ID'], keyword)
				found += IS_FOUND(item['Location'], keyword)				
				found += IS_FOUND(item['Promotional Items'], keyword)
				found += IS_FOUND(item['Site-Specific'], keyword)
				found += IS_FOUND(item['Title'], keyword)
				found += IS_FOUND(item['Notes- Location Manager'], keyword)
				if(item.promoitem){
					found += IS_FOUND(item.promoitem['Instructions'], keyword)
				}
				break
			default:
				break
		}
		return found > 0
	})

	return result
}

const sub_filter = (obj, filter) => {
	let field = filter.field.value
	let field_type = filter.field.type
	let type = filter.type
	let value1 = filter.value1
	let value2 = filter.value2
	let value = null, keyword = null
	switch(field_type){
		case FIELDS_TYPE_STRING:
			value = obj[field] ? obj[field].trim() : ''
			keyword = value1 ? value1.trim() : ''
			value = value.toLowerCase()
			keyword = keyword.toLowerCase()
			switch(type){
				case TYPE_STRING_IDENTICAL:
					return value == keyword
					break
				case TYPE_STRING_NOT_IDENTICAL:
					return value != keyword
					break
				case TYPE_STRING_IS_BLANK:
					return value.length == 0
					break
				case TYPE_STRING_IS_NOT_BLANK:
					return value.length != 0
					break
				case TYPE_STRING_CONTAINS:
					return IS_FOUND(value, keyword)
					break
				case TYPE_STRING_NOT_CONTAINS:
					return !IS_FOUND(value, keyword)
					break
				default:
					return false
					break
			}
			break
		case FIELDS_TYPE_NUMBER:
			value = parseFloat(obj[field])
			keyword = parseFloat(value1)
			switch(type){
				case TYPE_NUMBER_LESS_THAN:
					if(isNaN(value) || isNaN(keyword))
						return false
					return value < keyword
					break
				case TYPE_NUMBER_LESS_THAN_OR_EQUAL_TO:
					if(isNaN(value) || isNaN(keyword))
					return false
					return value <= keyword
					break
				case TYPE_NUMBER_GREATER_THAN:
					if(isNaN(value) || isNaN(keyword))
						return false	
					return value > keyword
					break
				case TYPE_NUMBER_GREATER_THAN_OR_EQUAL_TO:
					if(isNaN(value) || isNaN(keyword))
						return false
					return value >= keyword
					break
				case TYPE_NUMBER_EQUAL_TO:
					if(isNaN(value) || isNaN(keyword))
						return false
					return value == keyword
					break
				case TYPE_NUMBER_IS_NOT_EQUAL_TO:
					return value != keyword
					break
				case TYPE_NUMBER_IS_BLANK:
					return obj[field].length == 0 || obj[field] == null
					break
				case TYPE_NUMBER_IS_NOT_BLANK:
					return !(obj[field].length == 0 || obj[field] == null)
					break
				default:
					return false
					break
			}
			break
		case FIELDS_TYPE_PERCENTAGE:
			value = parseFloat(obj[field])
			keyword = parseInt(value1)
			if(!isNaN(value))
				value = Math.round(value * 100)
			switch(type){
				case TYPE_NUMBER_LESS_THAN:
					if(isNaN(value) || isNaN(keyword))
						return false
					return value < keyword
					break
				case TYPE_NUMBER_LESS_THAN_OR_EQUAL_TO:
					if(isNaN(value) || isNaN(keyword))
					return false
					return value <= keyword
					break
				case TYPE_NUMBER_GREATER_THAN:
					if(isNaN(value) || isNaN(keyword))
						return false	
					return value > keyword
					break
				case TYPE_NUMBER_GREATER_THAN_OR_EQUAL_TO:
					if(isNaN(value) || isNaN(keyword))
						return false
					return value >= keyword
					break
				case TYPE_NUMBER_EQUAL_TO:
					if(isNaN(value) || isNaN(keyword))
						return false
					return value == keyword
					break
				case TYPE_NUMBER_IS_NOT_EQUAL_TO:
					return value != keyword
					break
				case TYPE_NUMBER_IS_BLANK:
					return obj[field].length == 0 || obj[field] == null
					break
				case TYPE_NUMBER_IS_NOT_BLANK:
					return !(obj[field].length == 0 || obj[field] == null)
					break
				default:
					return false
					break
			}
			break
		case FIELDS_TYPE_DATE:
			switch(type){
				case TYPE_DATE_IS_BEFORE:
					if(obj[field] == null || obj[field] == '')
						return false
					value = moment(obj[field], 'YYYY-MM-DD')
					return value.isBefore(value1)
					break
				case TYPE_DATE_IS_BEFORE_OR_EQUAL:
					if(obj[field] == null || obj[field] == '')
						return false
					value = moment(obj[field], 'YYYY-MM-DD')
					return value.isSameOrBefore(value1)
					break
				case TYPE_DATE_IS_AFTER:
					if(obj[field] == null || obj[field] == '')
						return false
					value = moment(obj[field], 'YYYY-MM-DD')
					return value.isAfter(value1)
					break
				case TYPE_DATE_IS_AFTER_OR_EQUAL:
					if(obj[field] == null || obj[field] == '')
						return false
					value = moment(obj[field], 'YYYY-MM-DD')
					return value.isSameOrAfter(value1)
					break
				case TYPE_DATE_IS_BLANK:
					return obj[field] == null || obj[field].length == 0
					break
				case TYPE_DATE_IS_NOT_BLANK:
					return obj[field] != null && obj[field].length != 0
					break				
				case TYPE_DATE_IS_IN_RANGE:
					if(obj[field] == null || obj[field] == '')
						return false
					value = moment(obj[field], 'YYYY-MM-DD')
					return IS_IN_DATE_RANGE(value, value1, value2)					
					break
				case TYPE_DATE_IS_NOT_IN_RANGE:
					if(obj[field] == '' || obj[field] == null)
						return true
					value = moment(obj[field], 'YYYY-MM-DD')
					return !IS_IN_DATE_RANGE(value, value1, value2)
					break
				default:
					return false
					break
			}
			break
		case FIELDS_TYPE_DROPDOWN:
			value = obj[field] ? obj[field].trim() : ''
			keyword = value1 ? value1.trim() : ''
			value = value.toLowerCase()
			keyword = keyword.toLowerCase()
			switch(type){
				case TYPE_DROPDOWN_HAS_THIS_OPTION_SELECTED:
					return IS_FOUND(value, keyword)
					break
				case TYPE_DROPDOWN_DOES_NOT_HAVE_THIS_OPTION_SELECTED:
					return !IS_FOUND(value, keyword)
					break				
				default:
					return false
					break
			}
			break
		default:
			return false
			break
	}
	return false
}

export const filter = (layer, data, filters) => {
	if(!data || !Array.isArray(data))
		return []
	// let test = []
	// _.map(data, (datum)=>{
	// 	test.push(datum.$original['Signs That Are Brand Compliant'])
	// })
	// console.log(test, filters)
	let result = _.filter(data, (obj)=>{
		let item = obj.$original
		if(!item)
			return 0
		let found = 0
		_.map(filters, (ftr)=>{
			found += sub_filter(item, ftr) ? 1 : 0
		})
		return found == filters.length
	})

	return result
}