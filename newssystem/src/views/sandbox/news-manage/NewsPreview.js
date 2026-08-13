import { Button, Descriptions } from 'antd'
import React, { useEffect, useState } from 'react'
import { LeftOutlined } from '@ant-design/icons'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import moment from 'moment'

export default function NewsPreview() {
  const [newsInfo, setNewsInfo] = useState({})
  const params = useParams()

  const auditList = ["未审核", '审核中', '已通过', '未通过']
  const publishList = ["未发布", '待发布', '已上线', '已下线']
  const colorList = ["black", "orange", "green", "red"]
  const items = [
    {
      key: '1',
      label: '创建者',
      children: newsInfo.author,
    },
    {
      key: '2',
      label: '创建时间',
      children: moment(newsInfo.createTime).format("YYYY-MM-DD HH:mm:ss"),
    },
    {
      key: '3',
      label: '发布时间',
      children: newsInfo.publishTime ? moment(newsInfo.publishTime).format("YYYY/MM/DD HH:mm:ss") : "-",
    },
    {
      key: '4',
      label: '区域',
      children: newsInfo.region,
    },
    {
      key: '5',
      label: '审核状态',
      children: <span style={{ color: colorList[newsInfo.auditState] }}>{auditList[newsInfo.auditState]}</span>,
    },
    {
      key: '6',
      label: '发布状态',
      children: <span style={{ color: colorList[newsInfo.publishState] }}>{publishList[newsInfo.publishState]}</span>,
    },
    {
      key: '7',
      label: '访问数量',
      children: newsInfo.view,
    },
    {
      key: '8',
      label: '点赞数量',
      children: newsInfo.star,
    },
    {
      key: '9',
      label: '评论数量',
      children: 0,
    },
  ];
  useEffect(() => {
    try {
      axios.get(`/api/news/${params.id}?_expand=category`).then(res => {
        setNewsInfo(res.data)
      })
    } catch (e) {
      console.log(e)
    }
  }, [params.id])
  function Title() {
    const navigate = useNavigate()
    return (
      <>
        {
          newsInfo ? (<><Button size={"large"} color="default" type='text' icon={<LeftOutlined />} onClick={() => { navigate(-1) }}></Button >
            <span style={{ fontSize: "20px", fontWeight: "bolder", margin: "0 10px" }}>{newsInfo.title}</span>
            <span style={{ fontSize: "14px", margin: "0 10px", color: "gray" }}>{newsInfo.category?.title}</span>
          </>) : null
        }
      </>
    )
  }
  return (
    <>
      <Descriptions title={<Title />} items={items} />
      <div dangerouslySetInnerHTML={{
        __html: newsInfo.content
      }} style={{
        border: "1px solid gray"
      }}>
      </div>
    </>
  )
}
