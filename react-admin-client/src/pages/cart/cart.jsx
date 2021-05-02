import React, {Component} from 'react'

import {
  Table,
  Card,
  Button,
  Icon,
  message,
  Modal
} from 'antd'
import LinkButton from '../../components/link-button/link-button'
import memoryUtil from "../../utils/memoryUtil";
import {PAGE_SIZE} from "../../utils/constants";
import {reqCartProduct, reqDeleteCartProduct,reqClearCart} from '../../api'

export default class Cart extends Component {

  state = {
    title: '购物车',
    loading: false,
    total: 0,  //默认初始数量
    products: [],
  }

  /**
   * 显示商品详情页面
   * @param product
   */
  showDetail = (product) => {
    //使用缓存product对象给detail使用
    memoryUtil.product = product
    this.props.history.push('/product/detail')
  }

  /***
   * 删除指定商品
   */
  deleteCartProduct = async (product) => {
    const username=memoryUtil.user.username
    // console.log(username);
    // console.log(product);
    Modal.confirm({
      title: `确认删除${product.name}吗?`,
      onOk: async () => {
        const result=await reqDeleteCartProduct(product._id,username)
        if(result.status===0){
          message.success("商品删除成功")
          this.getCartProducts(1)
        }
      }
    })
  }

  /**
   * 结账
   */


  initColumns = () => {
    this.columns = [
      {
        title: '商品名称',
        dataIndex: 'name',
      },
      {
        title: '商品描述',
        dataIndex: 'desc',
      },
      {
        title: '价格',
        dataIndex: 'price',
        render: (price) => '￥' + price  //指定显示的值的样式
      },
      {
        title: '结算',
        width: 100,
        // dataIndex: 'status',
        render: (product) => {
          // const {status, _id} = product
          return (
            <span>
              <Button
                type='primary' onClick={() => this.props.history.push({pathname:'/cart/pay',query:{product}})} >
                结算
              </Button>
            </span>
          )
        }
      },
      {
        title: '操作',
        width: 100,
        render: (product) => {
          return (
            <span>
              <LinkButton onClick={() => this.showDetail(product)}>详情</LinkButton>
                <LinkButton onClick={() => this.deleteCartProduct(product)}>删除</LinkButton>
              </span>
          )
        }
      },
    ];
  }


  //清空购物车
  clearCart = async (userId) => {

    Modal.confirm({
      title:`确认清空购物车吗？`,
      onOk:async ()=>{
        const result=await reqClearCart(userId)
        if(result.status===0){
          message.success('购物车清空成功')
          this.getCartProducts(1)
        }
      }
    })
  }


  getCartProducts = async (pageNum) => {
    // const {products}=this.state
    this.pageNum = pageNum
    //发送请求 loading
    this.setState({
      loading: true
    })
    // console.log('获取购物车商品');
    const username = memoryUtil.user.username
    let result = await reqCartProduct(pageNum, PAGE_SIZE, username)
    if (result.status === 0) {
      // message.success("获取购物车商品成功")
      const {total, list} = result.data
      //将返回的数据渲染到数组上   loading状态结束
      this.setState({
        total,
        products: list,
        loading: false
      })
    }
  }

  componentWillMount() {
    this.initColumns()
  }

  componentDidMount() {
    this.getCartProducts(1)
  }

  render() {

    const {loading, products, total} = this.state
    // console.log(products);
    const username=memoryUtil.user.username
    const extra = (
      <Button type='primary' onClick={() => this.clearCart(username)}>
        <Icon type="delete"/>
        清空
      </Button>
    )


    // console.log(dataSource);
    return (
      <Card extra={extra}>
        <Table
          // rowKey={`123`+Date.now}
          bordered
          loading={loading}
          columns={this.columns}
          dataSource={products}
          pagination={{
            current: this.pageNum,
            defaultPageSize: PAGE_SIZE,
            showQuickJumper: true,
            total,
            onChange: this.getCartProducts
          }}
          // rowSelection
        />
      </Card>
    )
  }
}
