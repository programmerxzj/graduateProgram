import React, {PureComponent} from 'react'
import {
  Card,
  Icon,
  Form,
  Input,
  List,
  Cascader,
  Button,
  message,
  Modal,
  version
} from 'antd'
import moment from "moment";

import LinkButton from "../../components/link-button/link-button";
import memoryUtil from "../../utils/memoryUtil";
import {reqDeleteCartProduct} from "../../api";
import provinces from "china-division/dist/provinces.json";
import cities from "china-division/dist/cities.json";
import areas from "china-division/dist/areas.json";
import {BASE_IMG_URL} from "../../utils/constants";

import './cartPay.less'

const {Item} = Form

console.log(provinces, cities, areas);
/*
Product的默认子路由组件
 */

areas.forEach((area) => {
  const matchCity = cities.filter((city) => city.code === area.cityCode)[0];
  if (matchCity) {
    matchCity.children = matchCity.children || [];
    matchCity.children.push({
      label: area.name,
      value: area.code
    });
  }
});

cities.forEach((city) => {
  const matchProvince = provinces.filter(
    (province) => province.code === city.provinceCode
  )[0];
  if (matchProvince) {
    matchProvince.children = matchProvince.children || [];
    matchProvince.children.push({
      label: city.name,
      value: city.code,
      children: city.children
    });
  }
});

//省级名称
const options = provinces.map(province => ({
  label: province.name,
  value: province.code,
  children: province.children
}));

class cartPay extends PureComponent {

  submit = () => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        //获取商品
        const {product} = this.props.location.query
        //获取用户信息
        const username = memoryUtil.user.username
        Modal.confirm({
          title: `确认支付${product.name}吗?`,
          onOk: async () => {
            const result = await reqDeleteCartProduct(product._id, username)
            if (result.status === 0) {
              message.success('商品支付成功')
              this.props.history.replace('/cart')
            }
          }
        })
      }
    })

  }

  render() {
    //设置返回
    const title = (
      <span>
        <LinkButton onClick={() => this.props.history.goBack()}>
          <Icon type='arrow-left' style={{fontSize: 20, marginRight: 10}}></Icon>
        </LinkButton>
        <span>商品支付</span>
      </span>
    )

    //定义Item宽度
    const formItemLayout = {
      labelCol: {span: 2},  //左侧宽度
      wrapperCol: {span: 8},  //右侧宽度
    }

    //获取用户信息
    const user = memoryUtil.user

    //定义Form格式
    const {getFieldDecorator} = this.props.form

    //接受传过来的商品
    const {product} = this.props.location.query
    const {name, price, desc, imgs} = product

    return (
      <Card title={title}>
        <Form {...formItemLayout}>
          <Item label='用户名'>
            {
              getFieldDecorator('username', {
                initialValue: user.username,
                rules: [
                  {required: true, message: '必须输入用户名称'}
                ]
              })(<Input placeholder='请输入用户名称'/>)
            }
          </Item>
          <Item label='联系电话'>
            {
              getFieldDecorator('phone', {
                initialValue: user.phone,
                rules: [
                  {required: true, message: '必须输入联系方式'}
                ]
              })(<Input placeholder='请输入联系方式'/>)
            }
          </Item>
          <Item label='送货地址'>
            {
              getFieldDecorator('address', {
                rules: [
                  {required: true, message: '必须选择交易地址'}
                ]
              })(<Cascader
                options={options}
                showSearch
                placeholder="请选择地址"
                style={{width: 400}}
              />)
            }
          </Item>
          <Item label='详细地址'>
            {
              getFieldDecorator('detailAddress', {
                rules: [
                  {required: true, message: '必须输入详细地址'}
                ]
              })(<Input placeholder='请输入详细地址'/>)
            }
          </Item>
        </Form>
        <List>
          <Item style={{marginLeft:'30px'}}>{name}&nbsp;&nbsp;&nbsp;&nbsp;{desc}&nbsp;&nbsp;&nbsp;&nbsp;<span style={{color: "red", fontSize: '20px'}}>{price}</span></Item>
          <Item style={{width:'200px',marginLeft:'30px'}} >
              {
                imgs.map(img => (
                  <img
                    key={img}
                    src={BASE_IMG_URL + img}
                    className="product-img"
                    alt="img"
                  />
                ))
              }
          </Item>
        </List>
        <Item>
          <Button type='primary' onClick={this.submit}>确认支付</Button>
        </Item>
      </Card>
    )
  }
}

export default Form.create()(cartPay)


/*
1. 子组件调用父组件的方法: 将父组件的方法以函数属性的形式传递给子组件, 子组件就可以调用
2. 父组件调用子组件的方法: 在父组件中通过ref得到子组件标签对象(也就是组件对象), 调用其方法
 */

/*
使用ref
1. 创建ref容器: thi.pw = React.createRef()
2. 将ref容器交给需要获取的标签元素: <PictureWall ref={this.pw} />
3. 通过ref容器读取标签元素: this.pw.current
 */
