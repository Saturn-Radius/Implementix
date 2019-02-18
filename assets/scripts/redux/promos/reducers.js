import _ from 'lodash'
import {handleActions} from 'redux-actions'
import {fromJS, List, Map, OrderedMap, Set} from 'immutable'
import {createAsyncHandlers} from '../actions'

const initialState = Map({
  promos: Map()
})

const FETCH_PROMOS = createAsyncHandlers('FETCH_PROMOS', {
  success(state, action) {
  	const {promos: {data}} = action.payload
    return state.set('promos', fromJS(data))
  }
})

export default handleActions({
  ...FETCH_PROMOS,
}, initialState)
