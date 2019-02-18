import {applyMiddleware, compose, createStore, combineReducers} from 'redux'
import promise from 'redux-promise'
import {reducer as formReducer} from 'redux-form'
import {browserHistory} from 'react-router'
import {syncHistory, routeReducer} from 'react-router-redux'
import thunk from 'redux-thunk'

import {loadingReducer} from './actions'
import getRoutes from '../routes'

const logger = store => next => action => {
  // console.group(action.type)
  // console.info('dispatching', action)
  let result = next(action)
  // console.log('next state', store.getState())
  // console.groupEnd(action.type)
  return result
}
const initialState = {
    routing: {
       location: '/',
    }
}

const routerMiddleware = syncHistory(browserHistory)
let enhancers = [
  applyMiddleware(...[thunk, logger, promise, routerMiddleware].filter(Boolean)),
  null,
].filter(Boolean)

let factory = compose(...enhancers)(createStore)

const store = factory(combineReducers({
  loading: loadingReducer,
  routing: routeReducer,
  form: formReducer,
  auth: require('./auth/reducers'),
  locations: require('./locations/reducers'),
  signs: require('./signs/reducers'),
  brands: require('./brands/reducers'),
  promos: require('./promos/reducers'),
  promoitems: require('./promoitems/reducers'),
  vehicles: require('./vehicles/reducers'),
  navigation: require('./navigation/reducers'),
  notifications: require('./notifications/reducers'),
}), initialState)
//  

routerMiddleware.listenForReplays(store)

export default store
