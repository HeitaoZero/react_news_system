import React from 'react'
import { Button, Table, Tag, Modal, Popover, Switch } from 'antd';
import axios from 'axios'
import { useEffect, useState } from 'react'
import styles from './RightList.module.css'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { ExclamationCircleFilled } from '@ant-design/icons';
const { confirm } = Modal;
export default function RightList() {
    const [dataSource, setDataSource] = useState([])
    const handleChangeSwitch = (item) => {
        item.pagepermisson = item.pagepermisson === 1 ? 0 : 1
        setDataSource([...dataSource])
        if (item.grade === 1) {
            axios.patch(`/api/rights/${item.id}`, { pagepermisson: item.pagepermisson })
        }
        else if (item.grade === 2) {
            axios.patch(`/api/children/${item.id}`, { pagepermisson: item.pagepermisson })
        }
    }
    const content = (item) => {
        return (<Switch defaultChecked onChange={() => handleChangeSwitch(item)} checked={item.pagepermisson} />)
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            render: (id) => <b>{id}</b>,
        },
        {
            title: '权限名称',
            dataIndex: 'title',
            render: (title) => <span style={{ textAlign: "center" }}>{title}</span>,
        },
        {
            title: '权限路径',
            dataIndex: 'key',
            render: (key) => <Tag color="green">{key}</Tag>
        },
        {
            title: '操作',
            render: (item) => (
                <div className={styles.operate}>
                    <Button danger icon={<DeleteOutlined />} shape="circle" onClick={() => { showDeleteConfirm(item) }}></Button>
                    <Popover content={() => content(item)} title="Title" trigger="click" >
                        {item.pagepermisson !== undefined ? <Button type="primary" icon={<EditOutlined />} shape="circle"></Button> : <Button type="primary" icon={<EditOutlined />} shape="circle" disabled></Button>}
                    </Popover>
                </div>
            ),
        },
    ];
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get('/api/rights?_embed=children')

                const tableData = res.data.map(item => {
                    return {
                        ...item,
                        id: item.id,
                        title: item.title,
                        key: item.key,
                        children: item.children.length > 0 ? item.children : null,
                    }
                })
                setDataSource(tableData)
            }
            catch (error) {
                console.log("获取权限列表失败", error)
            }
        }
        fetchData()
    }, [])

    const showDeleteConfirm = (item) => {
        confirm({
            title: 'Are you sure delete this task?',
            icon: <ExclamationCircleFilled />,
            content: 'Some descriptions',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                if (item.grade === 1) {
                    const list = dataSource.filter(data => data.id !== item.id)
                    setDataSource([...list])
                    axios.delete(`/api/rights/${item.id}`)
                }
                else if (item.grade === 2) {
                    const newDataSource = dataSource.map(data => {
                        data.children = data.children?.filter(child => child.id !== item.id)
                        return data
                    })
                    setDataSource([...newDataSource])
                    axios.delete(`/api/children/${item.id}`)
                }
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    };

    return (
        <div className={`${styles.rightList} ${styles.menuContainer}`}>
            <Table
                dataSource={dataSource}
                columns={columns}
                pagination={{ pageSize: 5 }}
                className={`${styles.rightList} ${styles.menuContainer}`}
            />
        </div>
    )



}
