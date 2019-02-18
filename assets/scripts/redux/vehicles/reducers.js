import _ from 'lodash'
import {handleActions} from 'redux-actions'
import {fromJS, List, Map, OrderedMap, Set} from 'immutable'
import {createAsyncHandlers} from '../actions'

const initialState = Map({
  vehicles: Map()
})

const FETCH_VEHICLES = createAsyncHandlers('FETCH_VEHICLES', {
  success(state, action) {
  	const {vehicles: {data}} = action.payload
    return state.set('vehicles', fromJS(data))
  }
})

export default handleActions({
  ...FETCH_VEHICLES,
}, initialState)
