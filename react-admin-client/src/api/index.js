/*
* 封装ajax请求函数
* */

import jsonp from 'jsonp'
import {message} from 'antd'

import ajax from "./ajax";

const BASE = ''
//登录
export const reqLogin = (username, password) => ajax(BASE + '/login', {username, password}, 'POST')

// 添加用户
// export const reqAddUser = (user) => ajax(BASE + '/manage/user/add', user, 'POST')

// 获取一级/二级分类的列表
export const reqCategorys = (parentId) => ajax(BASE + '/manage/category/list', {parentId})

// 获取一个分类
export const reqCategory = (categoryId) => ajax(BASE + '/manage/category/info', {categoryId})

// 添加分类
export const reqAddCategory = (categoryName, parentId) => ajax(BASE + '/manage/category/add', {
  categoryName,
  parentId
}, 'POST')

// 更新分类
export const reqUpdateCategory = ({categoryId, categoryName}) => ajax(BASE + '/manage/category/update', {
  categoryId,
  categoryName
}, 'POST')

//获取商品
export const reqProducts = (pageNum, pageSize) => ajax(BASE + '/manage/product/list', {pageNum, pageSize})

// 更新商品的状态(上架/下架)
export const reqUpdateStatus = (productId, status) => ajax(BASE + '/manage/product/updateStatus', {
  productId,
  status
}, 'POST')

/*
搜索商品分页列表 (根据商品名称/商品描述)
searchType: 搜索的类型, productName/productDesc
 */
export const reqSearchProducts = ({pageNum, pageSize, searchName, searchType}) => ajax(BASE + '/manage/product/search', {
  pageNum,
  pageSize,
  [searchType]: searchName,
})

/**
 * 删除指定名称的图片
 * @param city
 * @returns {Promise<any>}
 */
export const reqDeleteImg = (name) => ajax(BASE + '/manage/img/delete', {name}, 'POST')

// 添加/修改商品
export const reqAddOrUpdateProduct = (product) => ajax(BASE + '/manage/product/' + (product._id ? 'update' : 'add'), product, 'POST')

//添加商品


//删除商品
export const reqDeleteProduct=(productId)=>ajax(BASE+'/manage/product/delete',{productId},'POST')

//// 获取所有角色的列表
export const reqRoles = () => ajax(BASE + '/manage/role/list')

// 添加角色的列表
export const reqAddRole = (roleName) => ajax(BASE + '/manage/role/add', {roleName}, "POST")

// 更新角色权限的列表
export const reqUpdateRole = (role) => ajax(BASE + '/manage/role/update', role, 'POST')

//获取所有角色列表
export const reqUsers = () => ajax(BASE + '/manage/user/list')

//删除角色
export const reqDeleteUser = (userId) => ajax(BASE + '/manage/user/delete', {userId}, 'POST')

//添加角色
export const reqAddOrUpdateUser = (user) => ajax(BASE + '/manage/user/'+(user._id ? 'update' : 'add'), user, 'POST')

//获取天气请求函数jsonp
export const reqWeather = (city) => {

  return new Promise((resolve, reject) => {
    const url = `https://restapi.amap.com/v3/weather/weatherInfo?city=${city}&key=07bbf34022e6b600b16cd862513eeece`
    // 发送jsonp请求
    jsonp(url, {}, (err, data) => {
      // console.log('jsonp()', err, data)
      // 如果成功了
      if (data.status === '1') {
        // 取出需要的数据
        const {city, weather} = data.lives[0]
        resolve({city, weather})
      } else {
        // 如果失败了
        message.error('获取天气信息失败!')
      }

    })
  })
}
// reqWeather('重庆')

// 添加商品到购物车
export const reqAddCartProduct=(product,username)=>ajax(BASE+'/manage/cart/add',{product,username},'POST')

//获取购物车商品
export const reqCartProduct=(pageNum,pageSize,username)=>ajax(BASE+'/manage/cart/list',{pageNum, pageSize,username})

//删除购物车指定商品
export const reqDeleteCartProduct=(productId,username)=>ajax(BASE+'/manage/cart/delete',{productId,username},'POST')

//清空购物车
export const reqClearCart=(username)=>ajax(BASE+'/manage/cart/clear',{username},'POST')
