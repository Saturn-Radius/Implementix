import _ from 'lodash'
import {handleActions} from 'redux-actions'
import {fromJS, List, Map, OrderedMap, Set} from 'immutable'
import {createAsyncHandlers} from '../actions'

const initialState = Map({
  locations: Map()
})

const FETCH_LOCATIONS = createAsyncHandlers('FETCH_LOCATIONS', {
  success(state, action) {
  	const {locations: {data}} = action.payload
    return state.set('locations', fromJS(data))
  }
})

export default handleActions({
  ...FETCH_LOCATIONS,
}, initialState)
