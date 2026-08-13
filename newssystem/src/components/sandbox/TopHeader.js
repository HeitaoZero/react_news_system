import React from 'react'
import { Layout, Button, theme, Dropdown, Space, Avatar } from 'antd'
import { useState } from 'react';
import { MenuFoldOutlined, MenuUnfoldOutlined, DownOutlined, UserOutlined } from '@ant-design/icons';
import styles from './TopHeaders.module.css'
import { useNavigate } from 'react-router-dom'
import { connect } from 'react-redux'
import { useEffect } from 'react';


const { Header } = Layout;

function TopHeader(props) {
    const {
        token: { colorBgContainer },
    } = theme.useToken();
    const [username, setUsername] = useState()
    const [roleName, setRoleName] = useState()
    useEffect(() => {
        try {
            const token = JSON.parse(localStorage.getItem('token'));
            if (token?.role?.roleName) {
                setRoleName(token.role.roleName);
            }
            if (token?.username) {
                setUsername(token.username);
            }
        } catch (error) {
            console.warn(error);
        }
    }, [])
    // const GetToken = () => {
    //     return JSON.parse(localStorage.getItem('token'))
    // }
    // const { username, role: { roleName } } = GetToken()
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
                icon={props.isCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => { props.changeCollapsed() }}
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

const mapStateToProps = ({ CollapsedReducer: { isCollapsed } }) => {
    return {
        isCollapsed
    }
}
const mapDispatchToProps = {
    changeCollapsed() {
        return {
            type: "change_collapsed"
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(TopHeader)
