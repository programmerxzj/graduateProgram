import React, {Component} from 'react'
import {Card,Table,Button} from 'antd'

/*
后台管理的饼图路由组件
 */





export default class Test extends Component {

  state = {
    selectedRowKeys: [], // Check here to configure the default column
  };

  onSelectChange = selectedRowKeys => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    this.setState({ selectedRowKeys });
  };

  deleteOne=()=>{
    console.log("删除");
    console.log(this.state.selectedRowKeys);
  }


  render() {
    const columns = [
      {
        title: 'Name',
        dataIndex: 'name',
      },
      {
        title: 'Age',
        dataIndex: 'age',
      },
      {
        title: 'Address',
        dataIndex: 'address',
      },
      {
        title: '操作',
        dataIndex: 'did',
      },
    ];
    const data = [];
    for (let i = 0; i < 10; i++) {
      data.push({
        key: i,
        name: `Edward King ${i}`,
        age: i,
        address: `London, Park Lane no. ${i}`,
        did:(<Button type='danger' onClick={()=>this.deleteOne()}>删除</Button>)
      });
    }
    const { selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
      hideDefaultSelections: false,

    };
    return (
      <Table rowSelection={rowSelection} columns={columns} dataSource={data} />
    )
  }
}
