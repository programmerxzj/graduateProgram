import React, {PureComponent} from 'react'
import PropTypes from 'prop-types'
import {
  Form,
  Input,
  Tree
} from 'antd'
import menuList from "../../config/menuConfig";

const {TreeNode} = Tree

const Item = Form.Item

export default class AuthForm extends PureComponent {
  static propTypes = {
    role: PropTypes.object
  }

  constructor(props) {
    super(props)

    const {menus} = this.props.role
    console.log('123', this.props.role.menus);
    this.state = {
      checkedKeys: menus
    }
  }

  /**
   * 为父组件提供最新的menus
   * @returns {Object.menus|*|Array}
   */
  getMenus = () => this.state.checkedKeys

  getTreeNodes = (menuList) => {
    return menuList.reduce((pre, item) => {
      pre.push(
        <TreeNode title={item.title} key={item.key}>
          {item.children ? this.getTreeNodes(item.children) : null}
        </TreeNode>
      )
      return pre
    }, [])
  }

  onCheck = checkedKeys => {
    // console.log('onClick', checkedKeys);

    this.setState({
      checkedKeys
    })
  }

  componentWillMount() {
    this.treeNodes = this.getTreeNodes(menuList)
  }

  componentWillReceiveProps(nextProps) {
    console.log('componentWillReceiveProps()', nextProps)
    const menus = nextProps.role.menus
    this.setState({
      checkedKeys: menus
    })
  }

  render() {
    console.log('AuthForm');
    const {role} = this.props
    const {checkedKeys} = this.state

    //定义Item宽度
    const formItemLayout = {
      labelCol: {span: 4},  //左侧宽度
      wrapperCol: {span: 15},  //右侧宽度
    }
    return (
      <div>
        <Item label='角色名称' {...formItemLayout}>
          <Input value={role.name} disabled/>
        </Item>
        <Tree
          checkable
          defaultExpandAll={true}
          checkedKeys={checkedKeys}
          onCheck={this.onCheck}
        >
          <TreeNode title="平台权限" key="all">
            {this.treeNodes}
          </TreeNode>
        </Tree>
      </div>
    )
  }
}

