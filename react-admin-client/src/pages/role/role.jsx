import React, {Component} from 'react'
import {
  Card,
  Button,
  Table,
  Modal,
  message
} from 'antd'
import {connect} from 'react-redux'

import {PAGE_SIZE} from '../../utils/constants'
import {reqRoles, reqAddRole, reqUpdateRole} from '../../api'
import AddForm from "./add-form";
import AuthForm from './auth-form'
import {formateDate} from '../../utils/dataUtils'
import storageUtils from "../../utils/storageUtils";
import {logout} from "../../redux/actions";

class Role extends Component {
  state = {
    roles: [],  //所有角色列表
    role: {},  //选中的role
    isShowAdd: false,//是否显示添加界面
    isShowAuth: false,//是否显示更新界面
  }

  constructor(props) {
    super(props)

    this.auth = React.createRef()
  }

  /**
   * 初始化列
   */
  initColumn = () => {
    this.columns = [
      {
        title: '角色名称',
        dataIndex: 'name'
      },
      {
        title: '创建时间',
        dataIndex: 'create_time',
        render: formateDate
      },
      {
        title: '授权时间',
        dataIndex: 'auth_time',
        render: (auth_time) => formateDate(auth_time)
      },
      {
        title: '授权人',
        dataIndex: 'auth_name'
      },
    ]
    // console.log(this.state.roles[0].name, this.state.roles[0].create_time);
    // console.log(this.state.roles[0].auth_name, this.state.roles[0].auth_time);
  }

  onRow = (role) => {
    return {
      onClick: event => {
        // alert('点击行')
        // console.log(role);
        this.setState({
          role
        })
      }
    }
  }

  /**
   * 获取前台列表roles
   */
  getRoles = async () => {
    const result = await reqRoles()
    if (result.status === 0) {
      const roles = result.data
      this.setState({
        roles
      })
    }
  }

  /**
   * 添加角色
   */
  addRole = () => {
    //表单验证
    this.form.validateFields(async (err, values) => {
      if (!err) {
        //隐藏确认框
        this.setState({
          isShowAdd: false
        })

        //  收集数据
        const {roleName} = values
        this.form.resetFields()
        //  添加角色
        const result = await reqAddRole(roleName)
        //  更新列表
        if (result.status === 0) {
          message.success('角色添加成功')
          const role = result.data

          //  更新role状态：基于原本数据
          this.setState(state => ({
            roles: [...state.roles, role]
          }))

        } else {
          message.error('角色添加失败')
        }
      }
    })
  }

  /**
   * 更新角色
   */
  updateRole = async () => {
    // 隐藏确认框
    this.setState({
      isShowAuth: false
    })
    const role = this.state.role
    //  得到menus
    const menus = this.auth.current.getMenus()
    role.menus = menus
    role.auth_time = Date.now()
    role.auth_name = this.props.user.username

    //  请求更新
    const result = await reqUpdateRole(role)
    if (result.status === 0) {
      if (role._id === this.props.user.role_id) {
        this.props.logout()
        message.success('强制退出重新登录')
      } else {
        message.success('角色权限更新成功')
        this.setState({
          roles: [...this.state.roles]
        })
      }
    } else {
      message.error('添加角色失败')
    }
  }

  componentWillMount() {
    this.initColumn()
  }

  componentDidMount() {
    this.getRoles()
  }

  render() {
    const {roles, role, isShowAdd, isShowAuth} = this.state

    const title = (
      <span>
        <Button
          type='primary'
          style={{marginRight: '10px'}}
          onClick={() => this.setState({isShowAdd: true})}
        >
          创建角色
        </Button>
        <Button
          type='primary'
          disabled={!role._id}
          onClick={() => this.setState({isShowAuth: true})}
        >
          设置角色权限
        </Button>
      </span>
    )
    return (
      <Card title={title}>
        <Table
          bordered
          rowKey='_id'
          dataSource={roles}
          columns={this.columns}
          pagination={{defaultPageSize: PAGE_SIZE}}
          rowSelection={{
            type: 'radio',
            selectedRowKeys: [role._id],
            onSelect: (role) => {
              this.setState({role})
            }
          }}
          onRow={this.onRow}
        />

        <Modal
          title="添加角色"
          visible={isShowAdd}
          onOk={this.addRole}
          onCancel={() => {
            this.setState({isShowAdd: false})
          }}
        >

          <AddForm
            setForm={(form) => {
              this.form = form
            }}
          />
        </Modal>

        <Modal
          title="设置角色权限"
          visible={isShowAuth}
          onOk={this.updateRole}
          onCancel={() => {
            this.setState({isShowAuth: false})
          }}
        >

          <AuthForm ref={this.auth} role={role}/>
        </Modal>
      </Card>
    )
  }
}

export default connect(
  state => ({user: state.user}),
  {logout}
)(Role)
