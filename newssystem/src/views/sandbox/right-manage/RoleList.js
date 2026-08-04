import React from 'react'
import { useState, useEffect } from 'react'
import { Table, Popconfirm, Modal, Tree } from 'antd';
import axios from 'axios'
import { Button } from 'antd'
import { DeleteOutlined, UnorderedListOutlined } from '@ant-design/icons'
import styles from "./RoleList.module.css"

export default function RoleList() {
  const [dataSource, setDataSource] = useState([]);
  const [treeData, setTreeData] = useState([]);
  const [checkedKeys, setCheckedKeys] = useState([])
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [currentId, setCurrentId] = useState(null)
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '角色名称',
      dataIndex: 'roleName',
      key: 'roleName',
    },
    {
      title: '操作',
      render: (item) => (
        <div className={styles.operate}>
          <Popconfirm
            title="Delete the task"
            description="Are you sure to delete this task?"
            cancelText="CANCEL"
            cancelButtonProps={{ type: 'primary' }}
            okButtonProps={{ type: 'primary' }}
            okText="DELETE"
            okType="danger"
            placement="topRight"
            onConfirm={() => deleteRole(item.id)}
          >
            <Button danger icon={<DeleteOutlined />} shape="circle" ></Button>
          </Popconfirm>
          <Button type="primary" icon={<UnorderedListOutlined />} shape="circle" onClick={() => showRolePermissions(item.id)}></Button>
        </div>
      ),
      key: 'operation',
    },
  ]



  const showRolePermissions = (id) => {
    setIsModalVisible(true)
    setCurrentId(id)
    setCheckedKeys(dataSource.filter(item => item.id === id)[0].rights)
  }
  const handleCancel = () => {
    setIsModalVisible(false)
  }
  const deleteRole = async (id) => {
    setDataSource(dataSource.filter(item => item.id !== id))
  }

  useEffect(() => {
    const getRolelist = async () => {
      const res = await axios.get('/api/roles')
      res.data.forEach(item => item.key = item.id)
      setDataSource(res.data)
    }
    const getTreeData = async () => {
      const res = await axios.get('/api/rights?_embed=children')
      setTreeData(res.data)
    }
    getRolelist()
    getTreeData()
  }, [])
  const saveRights = async () => {
    if (checkedKeys.checked) {
      dataSource.filter(item => item.id === currentId)[0].rights = checkedKeys.checked
      await axios.patch(`/api/roles/${currentId}`, {
        rights: checkedKeys.checked
      })
    }
    setDataSource([...dataSource])
    setIsModalVisible(false)
  }
  return (
    <div className={`${styles.roleList} ${styles.menuContainer}`}>
      <Table columns={columns} dataSource={dataSource} />
      <Modal
        title="权限分配"
        open={isModalVisible}
        onOk={() => { saveRights() }
        }
        onCancel={() => { handleCancel() }}>
        <Tree
          checkable
          treeData={treeData}
          checkedKeys={checkedKeys}
          checkStrictly
          onCheck={(checkedKeys) => {
            setCheckedKeys(checkedKeys)
          }}
        />
      </Modal >
    </div>
  )
}
