import React from 'react'
import { Table, Button, notification, Flex } from 'antd';
import { useEffect, useState } from 'react';
import axios from 'axios'

export default function Audit() {
  const [dataSource, setDataSource] = useState([])
  const [user, setUser] = useState([])
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
      title: '操作',
      render: (item) => {
        return <Flex gap="medium" >
          <Button type='primary' onClick={() => handleAudit(item, 2, 1)}>通过</Button>
          <Button type='primary' danger onClick={() => handleAudit(item, 3, 0)}>驳回</Button>
        </Flex>
      }
    },
  ];
  const handleAudit = (item, auditState, publishState) => {
    try {
      axios.patch(`/api/news/${item.id}`, {
        auditState,
        publishState
      }).then(res => {
        setDataSource(dataSource.filter(data => data.id !== item.id))
        notification.info({
          title: `通知`,
          description:
            `您可以到[审核管理/审核列表]中查看您的新闻的审核状态`,
          placement: "bottomRight"
        });
      })
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    try {
      setUser(JSON.parse(localStorage.getItem('token')));
    } catch (error) { console.log(error) }
  }, [])
  useEffect(() => {
    const roleObj = {
      "1": "superadmin",
      "2": "admin",
      "3": "editor"
    }
    const { roleId, region, username } = user
    axios.get(`/api/news?auditState=1&_expand=category`).then(res => {
      const list = res.data
      setDataSource(roleObj[roleId] === "superadmin" ? list : [
        ...list.filter(item => item.author === username),
        ...list.filter(item => item.region === region && roleObj[item.roleId] === "editor")
      ])
    })
  }, [user])
  return (
    <><Table columns={columns} dataSource={dataSource} rowKey={item => item.id} pagination={{ pageSize: 5 }} /></>
  )
}
