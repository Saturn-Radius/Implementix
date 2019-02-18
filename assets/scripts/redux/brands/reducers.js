import _ from 'lodash'
import {handleActions} from 'redux-actions'
import {fromJS, List, Map, OrderedMap, Set} from 'immutable'
import {createAsyncHandlers} from '../actions'

const initialState = Map({
  brands: Map()
})

const FETCH_BRANDS = createAsyncHandlers('FETCH_BRANDS', {
  success(state, action) {
  	const {brands: {data}} = action.payload
    return state.set('brands', fromJS(data))
  }
})

export default handleActions({
  ...FETCH_BRANDS,
}, initialState)
