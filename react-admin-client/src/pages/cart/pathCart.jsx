import React, {Component} from 'react'
import {Switch, Route,Redirect} from 'react-router-dom'

import Cart from './cart'
import CartPay from './cartPay'

export default class PathCart extends Component {
  render() {
    return (
      <Switch>
        <Route path='/cart' component={Cart} exact/> {/*路径完全匹配*/}
        <Route path='/cart/pay' component={CartPay} />
        <Redirect to='/cart'/>
      </Switch>
    )
  }
}
