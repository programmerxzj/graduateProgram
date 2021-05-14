import React, {Component} from 'react'
import {Card, Button} from 'antd'
import ReactEcharts from 'echarts-for-react'

export default class Bar extends Component {

  state = {
    Nov: [ 1207, 1682, 1960, 2684, 3723], // 双十一
    Up: [ 0.1, 0.16, 0.36, 0.38, 0.31], // 双十二
  }

  //数据更新
  update = () => {
    this.setState(state => ({
      sales: state.sales.map(sale => sale + 1),
      stores: state.stores.reduce((pre, store) => {
        pre.push(store-1)
        return pre
      }, []),
    }))
  }

  /*
  返回柱状图的配置对象
   */
  getOption = (Nov, Up) => {
    return {
      title: {
        text: '2021年前五月数据'
      },
      tooltip: {},
      legend: {
        data:['总销量', '增长率']
      },
      xAxis: {
        data: ['1月','2月','3月','4月','5月']
      },
      yAxis: {},
      series: [{
        name: '总销量',
        type: 'bar',
        data: Nov
      }, {
        name: '增长率',
        type: 'line',
        data: Up
      }]
    }
  }


  /**
   * 饼图数据
   * @returns {*}
   */
  getOption2 = () => {
    return {
      title : {
        text:'交易量',
        x:'center'
      },
      tooltip : {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c} ({d}%)"
      },
      legend: {
        orient: 'vertical',
        left: 'left',
        data: ['书籍','文具','服饰','食物','生活用品']
      },
      series : [
        {
          name: '访问来源',
          type: 'pie',
          radius : '55%',
          center: ['50%', '60%'],
          data:[
            {value:3176, name:'书籍'},
            {value:1444, name:'文具'},
            {value:3198, name:'服饰'},
            {value:890, name:'食物'},
            {value:2548, name:'生活用品'}
          ],
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };

  }
  render() {
    const {Nov, Up} = this.state
    return (
      <div>
        <Card>
          <Button type='primary' onClick={this.update} disabled>更新</Button>
        </Card>

        <Card>
          <ReactEcharts option={this.getOption(Nov, Up)} />
        </Card>

        <Card title='2021年前五月销售物品分类'>
          <ReactEcharts option={this.getOption2()} style={{height: 300}}/>
        </Card>

      </div>
    )
  }
}
