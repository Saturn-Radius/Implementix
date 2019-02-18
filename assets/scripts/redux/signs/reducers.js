import _ from 'lodash'
import {handleActions} from 'redux-actions'
import {fromJS, List, Map, OrderedMap, Set} from 'immutable'
import {createAsyncHandlers} from '../actions'

const initialState = Map({
  signs: Map()
})

const FETCH_SIGNS = createAsyncHandlers('FETCH_SIGNS', {
  success(state, action) {
  	const {signs: {data}} = action.payload
    return state.set('signs', fromJS(data))
  }
})

export default handleActions({
  ...FETCH_SIGNS,
}, initialState)
