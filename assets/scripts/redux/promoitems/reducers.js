import _ from 'lodash'
import {handleActions} from 'redux-actions'
import {fromJS, List, Map, OrderedMap, Set} from 'immutable'
import {createAsyncHandlers} from '../actions'

const initialState = Map({
  promoitems: Map()
})

const FETCH_PROMOITEMS = createAsyncHandlers('FETCH_PROMOITEMS', {
  success(state, action) {
  	const {promoitems: {data}} = action.payload
    return state.set('promoitems', fromJS(data))
  }
})

export default handleActions({
  ...FETCH_PROMOITEMS,
}, initialState)
