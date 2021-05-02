import React, {Component} from 'react'

import {
  Card,
  Select,
  Input,
  Button,
  Icon,
  Table,
  message,
  Modal
} from 'antd'
import LinkButton from "../../components/link-button/link-button";
import {reqProducts, reqSearchProducts, reqAddCartProduct, reqDeleteProduct, reqDeleteUser} from "../../api";
import {PAGE_SIZE} from "../../utils/constants";
import memoryUtil from "../../utils/memoryUtil";

const Option = Select.Option

/*
Product的添加和更新的子路由组件
 */
export default class ProductHome extends Component {
  state = {
    total: 0,  //默认初始数量
    products: [],
    loading: false, //加载中
    searchType: 'productName',//搜索的类型
    searchName: '',  //搜索的名称
    flag: true  //判断权限
  }

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
        title: '添加',
        width: 100,
        // dataIndex: 'status',
        render: (product) => {
          // const {status, _id} = product
          return (
            <span>
              <Button
                type='primary'
                onClick={() => this.addCart(product)}
              >
                购物车
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
              {
                this.state.flag ? <LinkButton onClick={() => this.showUpdate(product)}>修改</LinkButton> : null

              }
              {
                this.state.flag ? <LinkButton onClick={() => this.deleteProduct(product)}>删除</LinkButton> : null

              }
            </span>
          )
        }
      },
    ];
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
  /**
   * 显示修改产品界面
   * @param product
   */
  showUpdate = (product) => {
    //使用缓存product对象给detail使用
    memoryUtil.product = product
    this.props.history.push('/product/addupdate')
  }

  /**
   * 删除指定商品
   */
  deleteProduct=async (product)=>{
    Modal.confirm({
      title: `确认删除${product.name}吗?`,
      onOk: async () => {
        const result=await reqDeleteProduct(product._id)
        if(result.status===0){
          message.success("商品删除成功")
          this.getProducts(this.pageNum)
        }
      }
    })
  }

  /**
   * 获取指定页码的列表数据
   */
  getProducts = async (pageNum) => {
    this.pageNum = pageNum  //保存页面让其他方法可以使用

    //发请求  中
    this.setState({
      loading: true
    })

    const {searchName, searchType} = this.state

    let result
    //关键字搜索  搜索分页
    if (searchName) {
      result = await reqSearchProducts({pageNum, pageSize: PAGE_SIZE, searchName, searchType})
    } else {//一般分页
      result = await reqProducts(pageNum, PAGE_SIZE)
    }
    //请求结束
    this.setState({
      loading: false
    })
    if (result.status === 0) {
      const {total, list} = result.data
      this.setState({
        total,
        products: list
      })
    }
  }

  //更新商品状态
  addCart = async (product) => {
    // memoryUtil.user.shoppingCart.push(product)
    const username = memoryUtil.user.username

    const result = await reqAddCartProduct(product, username)

    if (result.status === 0) {
      message.success('添加购物车成功')
      // console.log(result.data);
    }
    // console.log("添加购物车", product)
    // console.log(memoryUtil.user.shoppingCart);
  }

  componentWillMount() {
    this.initColumns()
    const user = memoryUtil.user
    const flag = user.role.menus.includes('/role')
    this.setState({
      flag
    })
  }

  componentDidMount() {
    this.getProducts(1)
  }

  render() {

    const {products, total, loading, searchName, searchType} = this.state

    // console.log(products);

    const title = (
      <span>
        <Select
          value={searchType}
          style={{width: 150}}
          onChange={value => this.setState({searchType: value})}
        >
          <Option value='productName'>按名称搜索</Option>
          <Option value='productDesc'>按描述搜索</Option>
        </Select>
        <Input
          placeholder='关键字'
          style={{width: 150, margin: '0 15px'}}
          value={searchName}
          onChange={e => this.setState({searchName: e.target.value})}
        />
        <Button type='primary' onClick={() => this.getProducts(1)}>搜索</Button>
      </span>
    )

    const extra = (
      <Button type='primary' onClick={() => this.props.history.push('/product/addupdate')}>
        <Icon type='plus'></Icon>
        添加商品
      </Button>
    )

    return (
      <Card title={title} extra={extra}>
        <Table
          rowKey='_id'
          bordered
          loading={loading}
          dataSource={products}
          columns={this.columns}
          pagination={{
            current: this.pageNum,
            defaultPageSize: PAGE_SIZE,
            showQuickJumper: true,
            total,
            onChange: this.getProducts
          }}
        />
      </Card>
    )
  }
}
