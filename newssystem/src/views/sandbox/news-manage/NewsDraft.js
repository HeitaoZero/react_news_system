import React, { useEffect, useState } from 'react'
import { Table, Flex, Button, Popconfirm, notification } from 'antd'
import axios from 'axios';
import { useNavigate } from 'react-router-dom'
import { DeleteOutlined, EditOutlined, UploadOutlined } from '@ant-design/icons'

export default function NewsDraft() {
  const [dataSource, setDataSource] = useState([])
  const [user, setUser] = useState()
  const navigate = useNavigate()
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '新闻标题',
      dataIndex: 'title',
      key: 'title',
      render: (title, item) => {
        return <a href={`#/news-manage/preview/${item.id}`}>{title}</a>
      }
    },
    {
      title: '作者',
      dataIndex: 'author',
      key: 'author',
    },
    {
      title: '分类',
      dataIndex: 'category',
      key: 'category',
      render: (category) => {
        return category.title
      }
    },
    {
      title: '操作',
      render: (item) => {
        return <Flex gap="medium">
          <Popconfirm
            title="Delete the task"
            description="Are you sure to delete this task?"
            okText="DELETE"
            cancelText="CANCEL"
            placement="topRight"
            cancelButtonProps={{ type: "primary" }}
            okButtonProps={{ danger: true }}
            onConfirm={() => handleDeleteNewsDraft(item)}
          >
            <Button danger icon={<DeleteOutlined />} shape="circle"></Button>
          </Popconfirm>
          <Button icon={<EditOutlined />} shape="circle" onClick={() => {
            navigate(`/news-manage/update/${item.id}`)
          }}></Button>
          <Button type="primary" icon={<UploadOutlined />} shape="circle" onClick={() => handleCheck(item.id)} ></Button>
        </Flex >
      }
    },
  ];
  const handleDeleteNewsDraft = (item) => {
    console.log(item.id)
    try {
      axios.delete(`/api/news/${item.id}`).then(res => {
        const list = dataSource.filter(data => data.id !== item.id)
        setDataSource(list)
      })
    } catch (error) {
      console.log(error)
    }
  }
  const handleCheck = (id) => {
    axios.patch(`/news/${id}`, {
      auditState: 1
    }).then(res => {
      navigate('/audit-manage/list')

      notification.info({
        message: `通知`,
        description:
          `您可以到'审核列表'中查看您的新闻`,
        placement: "bottomRight"
      });
    })
  }
  useEffect(() => {
    try {
      setUser(JSON.parse(localStorage.getItem("token")))
    } catch (error) {
      console.log(error)
    }
  }, [])
  useEffect(() => {
    if (user)
      try {
        axios.get(`/api/news?author=${user.username}&auditState=0&_expand=category`).then(res => {
          setDataSource(res.data)
        })
      } catch (error) {
        console.log(error)
      }
  }, [user])

  return (
    <div>
      <Table dataSource={dataSource} columns={columns} rowKey={item => item.id} pagination={{ pageSize: 5 }}></Table>
    </div>
  )
}
