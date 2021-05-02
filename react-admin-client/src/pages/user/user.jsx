import React, {Component} from 'react'
import {
  Card,
  Button,
  Table,
  Modal,
  message
} from 'antd'

import {PAGE_SIZE} from "../../utils/constants";
import {formateDate} from "../../utils/dataUtils";
import LinkButton from "../../components/link-button/link-button";
import {reqUsers, reqDeleteUser, reqAddOrUpdateUser} from "../../api";
import UserForm from './user-form'

export default class User extends Component {
  state = {
    users: [], //所有用户集合
    roles: [], //所有角色集合
    isShow: false, //是否显示添加/更新界面
  }

  initColumns = () => {
    this.columns = [
      {
        title: '用户名',
        dataIndex: 'username'//显示数据对应的名称
      },
      {
        title: '邮箱',
        dataIndex: 'email'//显示数据对应的名称
      },
      {
        title: '电话',
        dataIndex: 'phone'//显示数据对应的名称
      },
      {
        title: '注册时间',
        dataIndex: 'create_time',//显示数据对应的名称
        render: formateDate
      },
      {
        title: '所属角色',
        dataIndex: 'role_id',//显示数据对应的名称
        render: (role_id) => this.roleNames[role_id]
      },
      {
        title: '操作',
        render: (user) => (
          <span>
            <LinkButton onClick={() => this.showUpdate(user)}>修改</LinkButton>
            <LinkButton onClick={() => this.deleteUser(user)}>删除</LinkButton>
          </span>
        )
      },
    ]
  }

  /**
   * 初始化获取角色
   */
  initRoleNames = (roles) => {
    const roleNames = roles.reduce((pre, role) => {
      pre[role._id] = role.name
      return pre
    }, {})
    //  保存
    this.roleNames = roleNames
  }

  /**
   * 添加或更新界面
   */
  addOrUpdateUser = async () => {
    //隐藏状态框
    this.setState({isShow: false})

    //  收集数据
    const user = this.form.getFieldsValue()
    this.form.resetFields()
    // console.log(user);
    // 如果是更新, 需要给user指定_id属性
    if (this.user) {
      user._id = this.user._id
    }
    //  发送请求
    const result = await reqAddOrUpdateUser(user)
    //  添加用户，更新列表
    if (result.status === 0) {
      message.success(`${this.user ? '修改' : '添加'}用户成功`)
      this.getUsers()
    }
  }

  //获取用户角色
  getUsers = async () => {
    const result = await reqUsers()
    if (result.status === 0) {
      const {users, roles} = result.data
      // console.log('用户',users,'角色',roles);
      this.initRoleNames(roles)
      this.setState({
        users, roles
      })
    }
  }

  /**
   * 修改角色
   */
  showUpdate = (user) => {
    this.user = user//保存user
    this.setState({
      isShow: true
    })
  }

  /**
   * 删除角色
   */
  deleteUser = (user) => {
    Modal.confirm({
      title: `确认删除${user.username}吗?`,
      onOk: async () => {
        const result = await reqDeleteUser(user._id)
        if (result.status === 0) {
          message.success('删除用户成功!')
          this.getUsers()
        }
      }
    })
  }

  /**
   * 创建角色
   */
  showAdd = () => {
    this.user = null
    this.setState({
      isShow: true
    })

  }

  componentWillMount() {
    this.initColumns()
  }

  componentDidMount() {
    this.getUsers()
  }

  render() {
    const {users, isShow, roles} = this.state

    const user = this.user || {}
    const title = <Button type='primary' onClick={this.showAdd}>创建用户</Button>
    return (
      <Card title={title}>
        <Table
          rowKey='_id'
          bordered
          columns={this.columns}
          dataSource={users}
          pagination={{defaultPageSize: PAGE_SIZE}}
        />

        <Modal
          title={user._id ? '修改用户' : '添加用户'}
          visible={isShow}
          onOk={this.addOrUpdateUser}
          onCancel={() => {
            this.form.resetFields()
            this.setState({isShow: false})
          }}
        >
          <UserForm
            setForm={form => this.form = form}
            roles={roles}
            user={user}
          />
        </Modal>
      </Card>
    )
  }
}
