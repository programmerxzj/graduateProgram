import React, {Component} from 'react'
import {Link, withRouter} from 'react-router-dom'
import {Menu, Icon} from 'antd'
import {connect} from 'react-redux'

import './left-nav.less'
import logo from '../../assets/images/logo1.jpg'
import menuList from '../../config/menuConfig'
import {setHeadTitle} from '../../redux/actions'

const SubMenu = Menu.SubMenu;

class LeftNav extends Component {

  getMenuNodes = (menuList) => {
    const path = this.props.location.pathname

    return menuList.map(item => {
      // 如果当前用户有item对应的权限, 才需要显示对应菜单项
      if (this.hasAuth(item)) {
        if (!item.children) {
          if (item.key === path || path.indexOf(item.key) === 0) {
            //更新headTitle状态
            this.props.setHeadTitle(item.title)
          }
          return (
            <Menu.Item key={item.key}>
              <Link to={item.key} onClick={() => this.props.setHeadTitle(item.title)}>
                <Icon type={item.icon}></Icon>
                <span>{item.title}</span>
              </Link>
            </Menu.Item>
          )
        } else {
          // 查找一个与当前请求路径匹配的子Item
          const cItem = item.children.find(cItem => path.indexOf(cItem.key) === 0)
          // 如果存在, 说明当前item的子列表需要打开
          if (cItem) {
            this.openKey = item.key
          }
          return (
            <SubMenu
              key={item.key}
              title={
                <span>
                <Icon type={item.icon}></Icon>
                <span>{item.title}</span>
              </span>
              }
            >
              {this.getMenuNodes(item.children)}
            </SubMenu>
          )
        }
      }
    })
  }

  /**
   * 查询item是否有权限
   */
  hasAuth = (item) => {
    const {key, isPublic} = item

    const menus = this.props.user.role.menus
    const username = this.props.user.username

    // 1. 如果当前用户是admin
    // 2. 如果当前item是公开的
    // 3. 当前用户有此item的权限: key有没有menus中

    if (username === 'admin' || isPublic || menus.indexOf(key) !== -1) {
      return true
    } else if (item.children) { // 4. 如果当前用户有此item的某个子item的权限
      return !!item.children.find(child => menus.indexOf(child.key) !== -1)
    }

    return false
  }

  componentWillMount() {
    this.menuNodes = this.getMenuNodes(menuList)
  }

  render() {
    let path = this.props.location.pathname

    if (path.indexOf('/product') === 0) { // 当前请求的是商品或其子路由界面
      path = '/product'
    }

    // 得到需要打开菜单项的key
    const openKey = this.openKey
    return (
      <div className='left-nav'>
        <Link to='/' className='left-nav-header'>
          <img src={logo} alt="logo"/>
          <h1>校园杂货</h1>
        </Link>
        <Menu
          mode='inline'
          theme='dark'
          selectedKeys={[path]}
          defaultOpenKeys={[openKey]}
        >
          {
            this.menuNodes
          }

        </Menu>
      </div>
    )
  }
}

/*
* withRouter
* 包装非路由组件获取三个值   history location match
* */
export default connect(
  state => ({user:state.user}),
  {setHeadTitle}
)(withRouter(LeftNav))
