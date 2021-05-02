/*
* redux 最核心模块
* */
import {createStore, applyMiddleware} from 'redux'
import thunk from 'redux-thunk'
import {composeWithDevTools} from 'redux-devtools-extension'

import reducer from './reducer'

//默认暴露store
export default createStore(reducer, composeWithDevTools(applyMiddleware(thunk)))

