import React from 'react'
import { Layout, Button, theme, Dropdown, Space, Avatar } from 'antd'
import { useState } from 'react';
import { MenuFoldOutlined, MenuUnfoldOutlined, DownOutlined, UserOutlined } from '@ant-design/icons';
import styles from './TopHeaders.module.css'
import { useNavigate } from 'react-router-dom'


const { Header } = Layout;

export default function TopHeader() {
    const [collapsed, setCollapsed] = useState(true);
    const {
        token: { colorBgContainer },
    } = theme.useToken();
    const GetToken = () => {
        return JSON.parse(localStorage.getItem('token'))
    }
    const { username, role: { roleName } } = GetToken()
    const navigate = useNavigate()
    const items = [
        {
            key: '1',
            label: (
                <span>{roleName}</span>
            ),
        },
        {
            key: '2',
            danger: true,
            label: '退出',
            onClick: () => {
                localStorage.removeItem('token')
                navigate('/login')
            }
        },
    ];

    return (
        <Header style={{ padding: 0, background: colorBgContainer }}>
            <Button
                type="text"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => setCollapsed(!collapsed)}
                style={{
                    fontSize: '16px',
                    width: 64,
                    height: 64,
                }}
            />
            <div className={styles['float-right']}  >
                <span className={styles['margin-20']}>欢迎<span style={{ color: "#1677ff" }}>{username}</span>回来</span>
                <Dropdown menu={{ items }} >
                    <Space className={styles['margin-20']}>
                        <Avatar size={32} icon={<UserOutlined />} />
                        <DownOutlined />
                    </Space>
                </Dropdown>
            </div>
        </Header >
    )
}
