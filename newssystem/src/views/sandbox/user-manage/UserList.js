import React from 'react'
import { Table, Switch, Button, Popconfirm } from 'antd';
import { useEffect, useState } from 'react'
import axios from 'axios'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import UserForm from "../../../components/user-manage/UserForm"
import styles from '../user-manage/UserList.module.css'
export default function UserList() {
  const [dataSource, setDataSource] = useState([]);
  const [isAddVisible, setIsAddVisible] = useState(false);
  const [isUpdateVisible, setIsUpdateVisible] = useState(false);
  const [chooseId, setChooseId] = useState(null);
  const columns = [
    {
      title: '区域',
      dataIndex: 'region',
      key: 'region',
      render: (region) => {
        return <b>{region}</b>
      },
    },
    {
      title: '角色名称',
      dataIndex: 'roleName',
      key: 'roleName',
    },
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: '状态',
      dataIndex: 'roleState',
      key: 'roleState',
      render: (roleState, item) => {
        return (
          <Switch
            checked={roleState}
            onChange={() => { changeRoleState(item, roleState) }}
          ></Switch>
        )
      },
    },
    {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      render: (operation, item) => {
        return (<div className={styles.operate}>
          <Popconfirm
            title="Delete the task"
            description="Are you sure to delete this task?"
            cancelText="CANCEL"
            cancelButtonProps={{ type: 'primary' }}
            okButtonProps={{ type: 'primary' }}
            okText="DELETE"
            okType="danger"
            placement="topRight"
            onConfirm={() => { handleDeleteUser(item.id) }}
          >
            <Button danger icon={<DeleteOutlined />} shape="circle" ></Button>
          </Popconfirm>
          <Button type="primary" icon={<EditOutlined />} shape="circle" onClick={() => {
            setIsUpdateVisible(true)
            setChooseId(item.id)
          }}></Button>
        </div>
        )
      },
    },
  ];


  const changeRoleState = async (item, roleState) => {
    try {
      dataSource.find(data => data.id === item.id).roleState = !roleState
      setDataSource([...dataSource])
      await axios.patch(`/api/users/${item.id}`, { roleState: !roleState })
    } catch (err) {
      console.log(err)
    }
  }
  useEffect(() => {
    const getUserList = async () => {
      try {
        const res = await axios.get('/api/users?_expand=role')
        const dataSource = res.data.map(item => {
          if (item.region === "") item.region = '全球'
          return { ...item, roleName: item.role?.roleName || '暂无' }
        })
        setDataSource(dataSource)
      } catch (error) {
        console.log('获取用户列表失败', error)
      }
    };
    getUserList();
  }, [])

  const handleDeleteUser = async (id) => {
    try {
      await axios.delete(`/api/users/${id}`).then(res => {
        setDataSource(dataSource.filter(item => item.id !== id))
      })
    } catch (error) {
      console.log('删除用户失败', error)
    }
  };
  return (
    <div>
      <Button type="primary" onClick={() => { setIsAddVisible(true) }}>添加用户</Button>
      <Table dataSource={dataSource} columns={columns} rowKey="id" pagination={{ pageSize: 8 }} />;
      <UserForm title={'添加用户'} isVisible={isAddVisible} setIsVisible={setIsAddVisible} setDataSource={setDataSource} dataSource={dataSource} />
      <UserForm setChooseId={setChooseId} chooseId={chooseId} title={'修改用户'} isVisible={isUpdateVisible} setIsVisible={setIsUpdateVisible} setDataSource={setDataSource} dataSource={dataSource} />
    </div>
  )
}
