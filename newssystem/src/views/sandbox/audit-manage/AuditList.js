import React from 'react'
import { Table, Tag, Button, notification } from 'antd';
import { useEffect, useState } from 'react';
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

export default function AuditList() {
  const [dataSource, setDataSource] = useState([])
  const [username, setUsername] = useState()
  const navigate = useNavigate()
  const columns = [
    {
      title: '新闻标题',
      dataIndex: 'title',
      render: (title, item) => {
        return <a href={`#/news-manage/preview/${item.id}`}>{title}</a>
      }
    },
    {
      title: '作者',
      dataIndex: 'author',
    },
    {
      title: '新闻分类',
      dataIndex: 'category',
      render: (category) => {
        return <div>{category.title}</div>
      }
    },
    {
      title: '审核状态',
      dataIndex: 'auditState',
      render: (auditState) => {
        const colorList = ["", 'orange', 'green', 'red']
        const auditList = ["草稿箱", "审核中", "已通过", "未通过"]
        return <Tag color={colorList[auditState]}>{auditList[auditState]}</Tag>
      }
    },
    {
      title: '操作',
      render: (item) => {
        return <div>
          {
            item.auditState === 1 && <Button onClick={() => handleRervert(item)} >撤销</Button>
          }
          {
            item.auditState === 2 && <Button danger onClick={() => handlePublish(item)}>发布</Button>
          }
          {
            item.auditState === 3 && <Button type="primary" onClick={() => handleUpdate(item)}>更新</Button>
          }
        </div>
      }
    },
  ];
  useEffect(() => {
    try {
      setUsername(JSON.parse(localStorage.getItem('token')).username)
    } catch (error) {
      console.log(error)
    }
  }, [])
  useEffect(() => {
    axios.get(`/api/news?author=${username}&auditState_ne=0&publishState_lte=1&_expand=category`).then(res => {
      setDataSource(res.data)
    })
  }, [username])
  const handleRervert = (item) => {

    try {
      axios.patch(`/api/news/${item.id}`, {
        auditState: 0
      }).then(res => {
        notification.info({
          title: `通知`,
          description:
            `您可以到草稿箱中查看您的新闻`,
          placement: "bottomRight"
        });
        setDataSource(dataSource.filter(data => data.id !== item.id))
      })
    } catch (error) {
      console.log(error)
    }

  }
  const handlePublish = (item) => {
    axios.patch(`/api/news/${item.id}`, {
      "publishState": 2,
      "publishTime": Date.now()
    }).then(res => {
      navigate('/publish-manage/published')

      notification.info({
        title: `通知`,
        description:
          `您可以到【发布管理/已经发布】中查看您的新闻`,
        placement: "bottomRight"
      });
    })
  }
  const handleUpdate = (item) => {
    navigate(`/news-manage/update/${item.id}`)
  }
  return (
    <>
      <Table columns={columns} dataSource={dataSource} rowKey={item => item.id} pagination={{ pageSize: 5 }} />
    </>
  )
}
