import {createHistory} from 'history'
import React from 'react'
import ReactDOM from 'react-dom'
import {Provider} from 'react-redux'
import {Router, Route, browserHistory} from 'react-router'

import './core/magics'
import store from './redux/store'
import routes from './routes'

ReactDOM.render(
  <Provider store={store}>
    <Router history={browserHistory}>{routes(store)}</Router>
  </Provider>
, document.getElementById('app-container'))