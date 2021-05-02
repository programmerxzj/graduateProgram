/*入口js*/

import React from 'react'
import ReactDOM from 'react-dom'
import {Provider} from 'react-redux'

import App from './App'
import store from "./redux/store";


//渲染标签
ReactDOM.render((
  <Provider store={store}>
    <App/>
  </Provider>
  ),document.getElementById('root'))
