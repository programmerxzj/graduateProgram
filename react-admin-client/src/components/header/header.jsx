import React, {Component} from 'react'
import {withRouter} from 'react-router-dom'
import {Modal} from 'antd'
import {connect} from 'react-redux'

import LinkButton from '../link-button/link-button'
import {formateDate} from '../../utils/dataUtils'
import {reqWeather} from '../../api'
import menuList from '../../config/menuConfig'


import './header.less'
import {logout} from "../../redux/actions";

class Header extends Component {
  state = {
    currentTime: formateDate(Date.now()), //当前时间字符串
    city: '', //城市
    weather: ''  //天气
  }

  getTime = () => {
    this.intervalId = setInterval(() => {
      const currentTime = formateDate(Date.now())
      this.setState({currentTime})
    }, 1000)
  }

  getWeather = async () => {
    //获得城市天气
    const {city, weather} = await reqWeather('垫江')
    //  更新状态
    this.setState({city, weather})
  }

  getTitle = () => {
    //  得到路径
    const path = this.props.location.pathname

    let title

    menuList.forEach(item => {
      if (item.key === path) {
        title = item.title
      } else if (item.children) {
        //  在子item中查找
        const cItem = item.children.find(cItem => path.indexOf(cItem.key) === 0)

        //  如果cItem有值才匹配
        if (cItem) {
          title = cItem.title
        }
      }
    })
    return title
  }

  logout1 = () => {
    Modal.confirm({
      content: '确定退出吗？',
      onOk: () => {
        console.log('ok');
        //  删除user数据
        this.props.logout()
      }
    })
  }

  componentDidMount() {
    //  实时获取当前时间
    this.getTime()
    //  获取当前天气
    this.getWeather()
  }

  componentWillUnmount() {
    //  清除定时器
    clearInterval(this.intervalId)
  }

  render() {
    const {currentTime, city, weather} = this.state

    const username = this.props.user.username
    // console.log(this.props.user);
    //显示当前title
    // const title = this.getTitle()
    const title = this.props.headTitle
    return (
      <div className='header'>
        <div className='header-top'>
          <span>欢迎，{username}</span>
          <LinkButton onClick={this.logout1}>退出</LinkButton>
        </div>
        <div className='header-bottom'>
          <div className='header-bottom-left'>{title}</div>
          <div className='header-bottom-right'>
            <span>{currentTime}</span>
            <span>{city}</span>
            <span style={{color: 'red', fontSize: 20}}>{weather}</span>
          </div>
        </div>
      </div>
    )
  }
}

export default connect(
  state => ({headTitle: state.headTitle, user: state.user}),
  {logout}
)(withRouter(Header))
