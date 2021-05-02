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
import {reqCategorys, reqUpdateCategory, reqAddCategory} from '../../api'
import AddForm from './add-form'
import UpdateForm from './update-form'
import memoryUtil from "../../utils/memoryUtil"

export default class Category extends Component {

  state = {
    categorys: [],  //一级分类列表
    subCategorys: [],  //二级分类列表
    loading: false, //是否正在加载中
    parentId: '0', //当前需要显示的分类列表的父类ID
    parentName: '',  //当前显示分类列表的父类名称
    showStatus: 0, // 标识添加/更新的确认框是否显示, 0: 都不显示, 1: 显示添加, 2: 显示更新
    flag: true,//默认拥有权限
  }

  //初始化所有列数
  initColumns = () => {
    this.columns = [
      {
        title: '分类的名称',
        dataIndex: 'name'//显示数据对应的名称
      },
      {
        title: '操作',
        width: 300,
        render: (category) => (
          <span>
            {
              this.state.flag ? <LinkButton onClick={() => this.showUpdate(category)}>修改分类</LinkButton> : null
            }
            {
              this.state.parentId === '0' ?
                <LinkButton onClick={() => this.showSubCategorys(category)}>查看子分类</LinkButton> : null
            }
          </span>
        )
      }
    ]
  }
  //异步获取分类列表
  getCategorys = async (parentId) => {
    //  请求前
    this.setState({loading: true})
    parentId = parentId || this.state.parentId
    //  发送ajax请求
    const result = await reqCategorys(parentId)

    //  请求后
    this.setState({loading: false})

    if (result.status === 0) {
      const categorys = result.data
      // console.log(result.data);
      if (parentId === '0') {
        this.setState({categorys})
      } else {
        this.setState({subCategorys: categorys})
      }
    } else {
      message.error('获取列表失败。。')
    }
  }

  //显示指定对象二级列表
  showSubCategorys = (category) => {
    //更新状态
    this.setState({
      parentId: category._id,
      parentName: category.name
    }, () => {
      this.getCategorys()
      console.log('parentId', this.state.parentId);
    })

    // console.log('parentId',this.state.parentId);
    //获取二级分类列表
    // this.getCategorys()
  }

  //显示一级列表
  showCategorys = () => {
    this.setState({
      parentId: '0',
      parentName: '',
      subCategorys: []
    })
  }

  //点击取消
  handleCancel = () => {
    //清空数据
    this.form.resetFields()

    this.setState({
      showStatus: 0
    })
  }

  //显示添加
  showAdd = () => {
    this.setState({
      showStatus: 1
    })
  }

  //添加分类
  addCategory = () => {
    console.log('addCategory()');

    this.form.validateFields(async (err, values) => {
      if (!err) {
        //  隐藏确定框
        this.setState({
          showStatus: 0
        })

        //搜集数据
        const {parentId, categoryName} = this.form.getFieldsValue()
        //清空数据
        this.form.resetFields()

        const result = await reqAddCategory(categoryName, parentId)
        if (result.status === 0) {

          //  添加的分类就是当前分类列表
          if (parentId === this.state.parentId) {
            //  重新获取列表
            this.getCategorys()
          } else if (parentId === '0') {
            this.getCategorys('0')
          }
        }
      }
    })
  }

  //显示更新
  showUpdate = (category) => {
    this.category = category

    this.setState({
      showStatus: 2
    })
  }

  //更新分类
  updateCategory = () => {
    console.log('updateCategory()');

    //进行表但验证
    this.form.validateFields(async (err, values) => {
      if (!err) {
        //  隐藏确定框
        this.setState({
          showStatus: 0
        })
        //  准备数据
        const categoryId = this.category._id
        const {categoryName} = values

        //清空数据
        this.form.resetFields()

        //  发请求更新
        const result = await reqUpdateCategory({categoryId, categoryName})
        if (result.status === 0) {
          //  重新显示列表
          this.getCategorys()
        }
      }
    })
  }

  //第一次记载前初始化
  componentWillMount() {
    this.initColumns()
    const user = memoryUtil.user
    const flag = user.role.menus.includes('/role')
    this.setState({
      flag
    })
  }

  //加载完成后获取数据
  componentDidMount() {
    this.getCategorys()
  }

  render() {

    //读取状态
    const {loading, categorys, subCategorys, parentId, parentName, showStatus, flag} = this.state



    // console.log(user.role.menus.indexOf('/123'));


    // const flag1 = user.role.menus.includes('/role')




    //读取状态
    const category = this.category || {}

    const title = parentId === '0' ? '一级分类列表' : (
      <span>
        <LinkButton onClick={this.showCategorys}>一级分类列表</LinkButton>
        <Icon type='arrow-right' style={{marginRight: 5}}/>
        <span>{parentName}</span>
      </span>
    )

    const extra = (
      <Button type='primary' onClick={this.showAdd}>
        <Icon type='plus'/>
        添加
      </Button>
    )

    return (
      <Card title={title} extra={extra}>
        <Table
          rowKey='_id'
          bordered
          loading={loading}
          columns={this.columns}
          dataSource={parentId === '0' ? categorys : subCategorys}
          pagination={{defaultPageSize: 5, showQuickJumper: true}}
        />

        <Modal
          title="添加分类"
          visible={showStatus === 1}
          onOk={this.addCategory}
          onCancel={this.handleCancel}
        >

          <AddForm
            categorys={categorys}
            parentId={parentId}
            setForm={(form) => {
              this.form = form
            }}
          />
        </Modal>

        <Modal
          title="更新分类"
          visible={showStatus === 2}
          onOk={this.updateCategory}
          onCancel={this.handleCancel}
        >

          <UpdateForm
            categoryName={category.name}
            setForm={(form) => {
              this.form = form
            }}
          />
        </Modal>
      </Card>
    )
  }
}
