import React, { useState, useEffect, useRef } from 'react'
import { Card, Col, Row, List, Avatar, Drawer } from 'antd';
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';
import axios from 'axios'
import _ from 'lodash'

import * as Echarts from 'echarts';
const { Meta } = Card;

export default function Home() {
  const [allList, setAllList] = useState([])
  const [viewList, setViewList] = useState([])
  const [starList, setStarList] = useState([])
  const [visible, setVisible] = useState(false)
  const [pieChart, setPieChart] = useState(null)
  const barRef = useRef()
  const pieRef = useRef()
  const [user, setUser] = useState([])

  useEffect(() => {
    try {
      setUser(JSON.parse(localStorage.getItem('token')))
    } catch (err) {
      console.log(err)
    }
  }, [])
  useEffect(() => {
    axios.get("/api/news?publishState=2&_expand=category&_sort=view&_order=desc&_limit=6").then(res => {
      console.log(res.data)
      setViewList(res.data)
    })
  }, [])
  useEffect(() => {
    axios.get("/api/news?publishState=2&_expand=category&_sort=star&_order=desc&_limit=6").then(res => {
      setStarList(res.data)
    })
  }, [])
  useEffect(() => {
    axios.get('/api/news?publishState=2&_expand=category').then(res => {
      renderBarView(_.groupBy(res.data, item => item.category.title))
      setAllList(res.data)
    })
    return () => {
      window.onresize = null
    }
  }, [])

  const renderBarView = (obj) => {
    console.log(obj)
    console.log(Object.keys(obj))
    var myChart = Echarts.init(barRef.current);
    var option;

    // 指定图表的配置项和数据
    option = {
      title: {
        text: '新闻分类图示'
      },
      legend: {
        data: ['数量']
      },
      xAxis: {
        type: 'category',
        data: Object.keys(obj),
        axisLabel: {
          rotate: "45",
          interval: 0
        }
      },
      yAxis: {
        type: 'value',
        minInterval: 1
      },
      series: [
        {
          name: '数量',
          data: Object.values(obj).map(item => item.length),
          type: 'bar'
        }
      ]
    };

    option && myChart.setOption(option);

    window.onresize = () => {
      console.log('resize');
      myChart.resize()
    }
  }
  const renderPieView = () => {
    var currentList = allList.filter(item => item.author = user.username)
    var groupObj = _.groupBy(currentList, item => item.category.title)
    console.log(groupObj);
    var list = []
    for (var i in groupObj) {
      list.push({
        name: i,
        value: groupObj[i].length
      })
    }
    var myChart;
    if (!pieChart) {
      myChart = Echarts.init(pieRef.current);
      setPieChart(myChart)
    } else {
      myChart = pieChart
    }
    var option;
    option = {
      title: {
        text: '当前用户新闻分类图示',
        left: 'center'
      },
      tooltip: {
        trigger: 'item'
      },
      legend: {
        orient: 'vertical',
        left: 'left'
      },
      series: [
        {
          name: '发布数量',
          type: 'pie',
          radius: '50%',
          data: list,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };

    option && myChart.setOption(option);
  }
  return (
    <>
      <Row gutter={16}>
        <Col span={8}>
          <Card title="用户最常浏览" variant="borderless">
            <List
              itemLayout="horizontal"
              dataSource={viewList}
              renderItem={(item, index) => (
                <List.Item>
                  <a href={`#/news-manage/preview/${item.id}`}>
                    {item.title}
                  </a>
                </List.Item>
              )}
            />
          </Card>

        </Col>
        <Col span={8}>
          <Card title="用户点赞最多" variant="borderless">
            <List
              itemLayout="horizontal"
              dataSource={starList}
              renderItem={(item, index) => (
                <List.Item>
                  <a href={`#/news-manage/preview/${item.id}`}>
                    {item.title}
                  </a>
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card
            style={{ width: 300 }}
            cover={
              <img
                draggable={false}
                alt="example"
                src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
              />
            }
            actions={[
              <SettingOutlined key="setting" onClick={() => {
                setVisible(true)
                setTimeout(() => {
                  renderPieView()
                }, 0)
              }} />,
              <EditOutlined key="edit" />,
              <EllipsisOutlined key="ellipsis" />,
            ]}
          >
            <Meta
              avatar={<Avatar src="https://api.dicebear.com/10.x/lorelei/svg?seed=8" />}
              title={user.username}
              description={
                <div>
                  <b>{user.region ? user.region : "全球"}</b>
                  <span style={{
                    paddingLeft: "30px"
                  }}>{user.role?.roleName}</span>
                </div>
              }
            />
          </Card>
        </Col>
      </Row >
      <Drawer
        size="large"
        title="个人新闻分类"
        placement="right"
        closable={true}
        onClose={() => {
          setVisible(false)
        }}
        open={visible}
      >
        <div ref={pieRef} style={{
          width: '100%',
          height: "400px",
          marginTop: "30px"
        }}></div>
      </Drawer>
      <div ref={barRef} style={{
        width: '100%',
        height: "350px",
        marginTop: "30px"
      }}></div>
    </>
  )
}
